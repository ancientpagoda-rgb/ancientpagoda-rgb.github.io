#!/usr/bin/env python3
"""Join the 2.4M etymology corpus to English Wiktionary gloss/IPA data.

Streams the Kaikki/Wiktextract English-Wiktionary dump and emits 256 compressed
hash shards. The browser loads one shard on demand, so full coverage never means
downloading the multi-gigabyte source dump on the client.
"""
import argparse,gzip,io,json,re,shutil,tempfile,time,unicodedata,urllib.request
from collections import defaultdict
from datetime import datetime,timezone
from pathlib import Path
try:
 import orjson
 loads=orjson.loads
except Exception:
 loads=json.loads

CORE='https://raw.githubusercontent.com/jewoo-suh/etymology-tree/master/graph-core-a360efd3e4.json.gz'
WIKT='https://kaikki.org/dictionary/raw-wiktextract-data.jsonl.gz'
DIG='0123456789abcdefghijklmnopqrstuvwxyz'; WS=re.compile(r'\s+')

def norm(x): return unicodedata.normalize('NFC',str(x or '')).strip()
def clean(x,n=900):
 s=WS.sub(' ',str(x or '')).strip()
 return s if len(s)<=n else s[:n-1].rstrip()+'…'
def h32(s):
 h=2166136261
 for c in s: h=((h^ord(c))*16777619)&0xffffffff
 h^=h>>16; h=(h*2246822519)&0xffffffff; h^=h>>13
 return h&0xffffffff
def key(lang,word): return norm(lang)+'\0'+norm(word)
def shard(k): return h32(k)&255

def core_data():
 print('downloading etymology corpus…',flush=True)
 with urllib.request.urlopen(CORE,timeout=120) as r,gzip.GzipFile(fileobj=r) as z:
  return json.load(io.TextIOWrapper(z,encoding='utf-8'))

def runs(blob):
 out=[]; p=0
 for s in str(blob).split(','):
  if ':' not in s: continue
  a,b=s.split(':',1); n=int(b,36)
  if n>0: out.append((int(a,36),p,p+n)); p+=n
 return out

def corpus_targets(c):
 names=list(map(str,c['names'])); codes=list(map(str,c['codes'])); rr=runs(c['wrle'])
 code_names=defaultdict(set)
 for co,na in zip(codes,names): code_names[co].add(na)
 code_name={co:next(iter(ns)) for co,ns in code_names.items() if len(ns)==1}
 target=set(); prev=''; ri=0; r=rr[0]
 for i,s in enumerate(str(c['words']).splitlines()):
  while i>=r[2] and ri+1<len(rr): ri+=1; r=rr[ri]
  k=DIG.find(s[:1].lower()); k=max(0,k); w=prev[:k]+s[1:]; prev=w
  li=r[0]; na=names[li] if 0<=li<len(names) else ''
  target.add(key(na,w))
  if i and i%500000==0: print('indexed',f'{i:,}','corpus words',flush=True)
 print('unique corpus lexemes:',f'{len(target):,}',flush=True)
 return target,code_name

def gloss(o):
 fallback=''
 for s in o.get('senses') or []:
  if not isinstance(s,dict): continue
  gs=s.get('glosses') or s.get('raw_glosses') or []
  if isinstance(gs,str): gs=[gs]
  for g in gs:
   g=clean(g)
   if not g: continue
   if not fallback: fallback=g
   tags=set(map(str,s.get('tags') or []))
   if 'form-of' not in tags and 'alt-of' not in tags: return g
 return fallback

def ipa(o):
 fallback=''
 for s in o.get('sounds') or []:
  if not isinstance(s,dict): continue
  v=clean(s.get('ipa'),180)
  if not v: continue
  if not fallback: fallback=v
  if not {'obsolete','historical'}&set(map(str,s.get('tags') or [])): return v
 return fallback

def roman(o):
 for k in ('romanization','roman','transliteration'):
  v=clean(o.get(k),240)
  if v:return v
 for f in o.get('forms') or []:
  if isinstance(f,dict) and 'romanization' in set(map(str,f.get('tags') or [])):
   v=clean(f.get('form'),240)
   if v:return v
 return ''

def rec(o): return [gloss(o),ipa(o),roman(o),clean(o.get('pos'),80)]
def score(a): return (4 if a[0] else 0)+(4 if a[1] else 0)+(1 if a[2] else 0)+(1 if a[3] else 0)
def merge(a,b):
 if a is None:return b
 base,other=(b[:],a) if score(b)>score(a) else (a[:],b)
 for i in range(4):
  if not base[i] and other[i]:base[i]=other[i]
 return base

def stream(target,code_name,tmp):
 handles={}; lines=hits=0; t=time.time()
 def write(lang,word,r):
  sid=shard(key(lang,word)); f=handles.get(sid)
  if f is None:
   f=(tmp/f'{sid:02x}.tmp').open('a',encoding='utf-8'); handles[sid]=f
  f.write(json.dumps([lang,word,*r],ensure_ascii=False,separators=(',',':'))+'\n')
 print('streaming 2.6 GB compressed English-Wiktionary Wiktextract dump…',flush=True)
 req=urllib.request.Request(WIKT,headers={'User-Agent':'EtymologyForestSidecar/1.0'})
 try:
  with urllib.request.urlopen(req,timeout=180) as x,gzip.GzipFile(fileobj=x) as z:
   for raw in z:
    lines+=1
    try:o=loads(raw)
    except Exception:continue
    if not isinstance(o,dict):continue
    word=norm(o.get('word')); lang=norm(o.get('lang'))
    if not word or not lang:continue
    k=key(lang,word)
    if k not in target:
     alt=code_name.get(norm(o.get('lang_code')))
     if not alt or key(alt,word) not in target:continue
     lang=alt;k=key(lang,word)
    r=rec(o)
    if not (r[0] or r[1]):continue
    write(lang,word,r);hits+=1
    if lines%500000==0:
     dt=max(1,time.time()-t);print(f'{lines:,} rows · {hits:,} matching lexical rows · {lines/dt:,.0f}/s',flush=True)
 finally:
  for f in handles.values():f.close()
 print('stream complete:',f'{lines:,}','rows',f'{hits:,}','matched rows',flush=True)

def finish(target,tmp,out):
 out.mkdir(parents=True,exist_ok=True); anyc=gc=ic=bc=0; sizes=[]
 for sid in range(256):
  src=tmp/f'{sid:02x}.tmp'; merged={}
  if src.exists():
   for line in src.open(encoding='utf-8'):
    try:
     a=json.loads(line); k=key(a[0],a[1]); merged[k]=[a[0],a[1],*merge(merged.get(k,[None,None,None,None]) [2:] if k in merged else None,[a[2],a[3],a[4],a[5]])]
    except Exception:continue
  dst=out/f'{sid:02x}.jsonl.gz'
  with gzip.GzipFile(filename=str(dst),mode='wb',compresslevel=9,mtime=0) as raw:
   with io.TextIOWrapper(raw,encoding='utf-8') as z:
    for k in sorted(merged):
     a=merged[k]; z.write(json.dumps(a,ensure_ascii=False,separators=(',',':'))+'\n')
     anyc+=1; gc+=bool(a[2]); ic+=bool(a[3]); bc+=bool(a[2] and a[3])
  sizes.append(dst.stat().st_size)
 total=len(target); cov=lambda n:round(n/total,6) if total else 0
 m={'version':1,'generated_at':datetime.now(timezone.utc).isoformat(),'source':WIKT,'source_note':'English Wiktionary extracted with Wiktextract/Kaikki; glosses are English.','core_source':CORE,'shards':256,'corpus_unique_lexemes':total,'records':anyc,'with_gloss':gc,'with_ipa':ic,'with_both':bc,'coverage':{'any':cov(anyc),'gloss':cov(gc),'ipa':cov(ic),'both':cov(bc)},'compressed_bytes':sum(sizes)}
 (out/'manifest.json').write_text(json.dumps(m,indent=2)+'\n',encoding='utf-8')
 (out/'NOTICE.txt').write_text('Gloss/IPA data: English Wiktionary via Wiktextract and Kaikki.org. Wiktionary content is CC BY-SA/GFDL; see https://en.wiktionary.org/wiki/Wiktionary:Copyrights\nEtymology corpus identity: jewoo-suh/etymology-tree.\n',encoding='utf-8')
 print(json.dumps(m,indent=2),flush=True)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',required=True,type=Path);a=ap.parse_args()
 if a.out.exists():shutil.rmtree(a.out)
 c=core_data(); target,code_name=corpus_targets(c);c.clear()
 with tempfile.TemporaryDirectory(prefix='lexical-sidecar-') as td:
  tmp=Path(td);stream(target,code_name,tmp);finish(target,tmp,a.out)
if __name__=='__main__':main()
