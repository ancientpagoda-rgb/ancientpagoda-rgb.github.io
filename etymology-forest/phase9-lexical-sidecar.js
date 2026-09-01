(function(){'use strict';
// Precomputed English gloss/IPA sidecar. It transparently satisfies the existing
// Kaikki per-word lookup from small compressed shards, then falls back to Kaikki
// live when the sidecar has no record. The data branch is replaceable/shallow.
const BASE='https://raw.githubusercontent.com/ancientpagoda-rgb/ancientpagoda-rgb.github.io/lexical-data/etymology-forest/data/lexical/';
const REAL_FETCH=window.fetch.bind(window),SHARDS=256,CACHE=new Map();
let manifestPromise=null,manifest=null,available=null;
const nfc=s=>String(s||'').normalize('NFC');
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);h^=h>>>16;h=Math.imul(h,2246822519);h^=h>>>13;return h>>>0}
function key(lang,word){return nfc(lang)+'\u0000'+nfc(word)}
function shardFor(k){return (hash(k)&(SHARDS-1)).toString(16).padStart(2,'0')}
async function getManifest(){if(available===false)return null;if(manifest)return manifest;if(manifestPromise)return manifestPromise;manifestPromise=(async()=>{try{const r=await REAL_FETCH(BASE+'manifest.json',{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));manifest=await r.json();available=true;return manifest}catch(_){available=false;return null}finally{manifestPromise=null}})();return manifestPromise}
async function ungzip(r){if(!r.body)return'';if('DecompressionStream'in window){return await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text()}const b=await r.arrayBuffer();return new TextDecoder().decode(b)}
async function loadShard(id){if(CACHE.has(id))return CACHE.get(id);const p=(async()=>{const r=await REAL_FETCH(BASE+id+'.jsonl.gz',{cache:'force-cache'});if(!r.ok)return new Map();const text=await ungzip(r),m=new Map();for(const line of text.split(/\r?\n/)){if(!line)continue;try{const a=JSON.parse(line);if(a&&a.length>=6)m.set(key(a[0],a[1]),{meaning:a[2]||'',ipa:a[3]||'',roman:a[4]||'',pos:a[5]||''})}catch(_){}}return m})();CACHE.set(id,p);return p}
async function lookup(lang,word){const mf=await getManifest();if(!mf)return null;const k=key(lang,word),m=await loadShard(shardFor(k));return m.get(k)||null}
function parseKaikki(u){try{const x=new URL(typeof u==='string'?u:u.url);if(x.hostname!=='kaikki.org')return null;const p=x.pathname.split('/').filter(Boolean);if(p[0]!=='dictionary'||p[2]!=='meaning'||!p.at(-1)?.endsWith('.jsonl'))return null;const lang=decodeURIComponent(p[1]),word=decodeURIComponent(p.at(-1).slice(0,-6));return{lang,word}}catch(_){return null}}
window.fetch=async function(input,init){const q=parseKaikki(input);if(!q)return REAL_FETCH(input,init);try{const d=await lookup(q.lang,q.word);if(d){const o={lang:q.lang,word:q.word,pos:d.pos||'',romanization:d.roman||'',sounds:d.ipa?[{ipa:d.ipa}]:[],senses:d.meaning?[{glosses:[d.meaning]}]:[]};return new Response(JSON.stringify(o)+'\n',{status:200,headers:{'content-type':'application/x-ndjson','x-etymology-sidecar':'1'}})}}catch(e){console.warn('lexical sidecar',e)}return REAL_FETCH(input,init)};
window.__lexicalSidecar={base:BASE,get available(){return available},get manifest(){return manifest},lookup,refresh(){available=null;manifest=null;manifestPromise=null;CACHE.clear();return getManifest()}};
setTimeout(getManifest,1200);
})();