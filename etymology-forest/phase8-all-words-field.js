(function(){'use strict';
// Every corpus lexeme contributes to the density field. Language anchors define
// the large-scale geography; inside each language, source-backed primary ancestry
// defines groves and branches. Small within-branch offsets are deterministic visual
// layout only and are not themselves evidence of a relationship.
const CORE_URL='https://raw.githubusercontent.com/jewoo-suh/etymology-tree/master/graph-core-a360efd3e4.json.gz';
const L=window.langs||[],F=window.families||[];
const LBY=Object.fromEntries(L.map(x=>[x.name,x]));
const FBY=Object.fromEntries(F.map(x=>[x.id,x]));
const CODE_ANCHOR={en:'English',es:'Spanish',fr:'French',pt:'Portuguese',it:'Italian',de:'German',nl:'Dutch',ru:'Russian',uk:'Ukrainian',pl:'Polish',hi:'Hindi',ur:'Urdu',bn:'Bengali',mr:'Marathi',pa:'Punjabi',gu:'Gujarati',fa:'Persian',zh:'Mandarin Chinese',yue:'Cantonese',my:'Burmese',ar:'Arabic',ha:'Hausa',am:'Amharic',id:'Indonesian',ms:'Malay',jv:'Javanese',tl:'Filipino / Tagalog',fil:'Filipino / Tagalog',sw:'Swahili',ta:'Tamil',te:'Telugu',kn:'Kannada',ml:'Malayalam',tr:'Turkish',ja:'Japanese',ko:'Korean',vi:'Vietnamese',th:'Thai',hu:'Hungarian'};
const HIST_ANCHOR={ang:'English',enm:'English',fro:'French',frm:'French',osp:'Spanish',gmh:'German',goh:'German',orv:'Russian',sa:'Hindi',pi:'Hindi',la:'Italian',grc:'Italian'};
const WORLD={x0:-2800,y0:-1900,x1:3600,y1:2100},TILE=32,LINEAGE_STEPS=5;
const NX=Math.ceil((WORLD.x1-WORLD.x0)/TILE),NY=Math.ceil((WORLD.y1-WORLD.y0)/TILE),NC=NX*NY;
const css=document.createElement('style');css.textContent=`#allWordsField{position:fixed;inset:0;z-index:5;width:100%;height:100%;pointer-events:none!important;background:transparent!important;opacity:0;transition:opacity 1.4s ease}body.clean-world #allWordsField.ready{opacity:.82}`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='allWordsField';document.body.appendChild(U);const G=U.getContext('2d',{alpha:true});
let W=0,H=0,D=1,field=null,ready=false;
let cam={x:430,y:100,z:.33},tar={x:430,y:100,z:.33},pts=new Map(),pinch=0;
let CODES=[],NAMES=[],RUNS=[],RMETA=[],CELL_OFF=null,CELL_IDS=null,WORDS_BLOB='',CP_OFF=null,CP_PREV=null;
let PRIMARY_PARENT=null,PARENT_STATUS=null,LINEAGE_ROOT=null,LINEAGE_BRANCH=null,LINEAGE_DEPTH=null;
const WORD_STEP=256,WORD_CACHE=new Map(),DIG='0123456789abcdefghijklmnopqrstuvwxyz';
function resize(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,1.6);U.width=Math.floor(W*D);U.height=Math.floor(H*D);G.setTransform(D,0,0,D,0,0)}resize();addEventListener('resize',resize);
const sx=x=>(x-cam.x)*cam.z+W/2,sy=y=>(y-cam.y)*cam.z+H/2,wx=x=>(x-W/2)/cam.z+cam.x,wy=y=>(y-H/2)/cam.z+cam.y;
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);h^=h>>>16;h=Math.imul(h,2246822519);h^=h>>>13;return h>>>0}
function mix(x){x=(x^61)^(x>>>16);x=Math.imul(x,9);x=x^(x>>>4);x=Math.imul(x,0x27d4eb2d);x=x^(x>>>15);return x>>>0}
function rgb(hex){hex=String(hex||'#6f9a7d').replace('#','');if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');const n=parseInt(hex.slice(0,6),16)||0x6f9a7d;return[(n>>16)&255,(n>>8)&255,n&255]}
function colorFor(anchor){if(!anchor)return rgb('#648a78');const f=FBY[anchor.family];return rgb(f?.c||'#79a888')}
function findAnchor(name,code){if(LBY[name])return LBY[name];let c=String(code||'').toLowerCase();if(CODE_ANCHOR[c]&&LBY[CODE_ANCHOR[c]])return LBY[CODE_ANCHOR[c]];if(HIST_ANCHOR[c]&&LBY[HIST_ANCHOR[c]])return LBY[HIST_ANCHOR[c]];let base=c.split('-')[0];if(CODE_ANCHOR[base]&&LBY[CODE_ANCHOR[base]])return LBY[CODE_ANCHOR[base]];return null}
function fallbackAnchor(name,code){const h=hash(String(code||'')+'|'+String(name||'')),h2=mix(h^0x9e3779b9);const a=(h/4294967296)*Math.PI*2,r=1120+Math.sqrt(h2/4294967296)*1260;return{x:430+Math.cos(a)*r,y:100+Math.sin(a)*r*.68,family:null}}
function extract(text,key){const tag='"'+key+'"';let p=text.indexOf(tag);if(p<0)throw new Error('missing '+key);p=text.indexOf(':',p+tag.length)+1;while(/\s/.test(text[p]))p++;const start=p,ch=text[p];if(ch==='"'){p++;let esc=false;for(;p<text.length;p++){const c=text[p];if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c==='"')return JSON.parse(text.slice(start,p+1))}}if(ch==='['||ch==='{'){let depth=0,str=false,esc=false;for(;p<text.length;p++){const c=text[p];if(str){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')str=false;continue}if(c==='"'){str=true;continue}if(c===ch)depth++;else if((ch==='['&&c===']')||(ch==='{'&&c==='}')){depth--;if(depth===0)return JSON.parse(text.slice(start,p+1))}}}throw new Error('bad '+key)}
function parseRuns(blob){const out=[];let total=0;for(const s of String(blob||'').split(',')){if(!s)continue;const c=s.indexOf(':');if(c<0)continue;const li=parseInt(s.slice(0,c),36),n=parseInt(s.slice(c+1),36);if(Number.isFinite(li)&&Number.isFinite(n)&&n>0){out.push({li,n,start:total});total+=n}}return{out,total}}
function put(data,w,h,x,y,col,boost){if(x<0||y<0||x>=w||y>=h)return;const k=((y|0)*w+(x|0))*4,a=data[k+3];if(!a){data[k]=col[0];data[k+1]=col[1];data[k+2]=col[2];data[k+3]=boost;return}data[k+3]=Math.min(238,a+boost)}
const yieldFrame=()=>new Promise(r=>requestAnimationFrame(()=>r()));
async function buildPrimaryLineage(adj,prim,total){
 PRIMARY_PARENT=new Int32Array(total);PRIMARY_PARENT.fill(-1);PARENT_STATUS=new Uint8Array(total);
 const pb=prim?atob(prim):'';let flat=0,pos=0,chunks=0;
 while(pos<adj.length){let semi=adj.indexOf(';',pos);if(semi<0)semi=adj.length;const chunk=adj.slice(pos,semi),gt=chunk.indexOf('>');if(gt>0){const par=parseInt(chunk.slice(0,gt),36),kids=chunk.slice(gt+1);let st=0;while(st<=kids.length){let comma=kids.indexOf(',',st);if(comma<0)comma=kids.length;const tok=kids.slice(st,comma);if(tok){const child=parseInt(tok,36),isPrimary=!!(pb&&((pb.charCodeAt(flat>>3)>>(flat&7))&1));if(child>=0&&child<total&&par>=0&&par<total&&child!==par){const status=PARENT_STATUS[child];if(status===0||(isPrimary&&status<2)){PRIMARY_PARENT[child]=par;PARENT_STATUS[child]=isPrimary?2:1}}flat++}if(comma===kids.length)break;st=comma+1}}pos=semi+1;if((++chunks%7000)===0)await yieldFrame()}
 LINEAGE_ROOT=new Uint32Array(total);LINEAGE_BRANCH=new Uint32Array(total);LINEAGE_DEPTH=new Uint8Array(total);
 for(let id=0;id<total;id++){let x=id,prev=id,d=0;while(d<LINEAGE_STEPS){const p=PRIMARY_PARENT[x];if(p<0||p===x)break;prev=x;x=p;d++}LINEAGE_ROOT[id]=x;LINEAGE_BRANCH[id]=d?prev:id;LINEAGE_DEPTH[id]=d;if(id&&id%250000===0)await yieldFrame()}
}
function metaFor(run,ri){const code=CODES[run.li]||'',name=NAMES[run.li]||code,known=findAnchor(name,code),a=known||fallbackAnchor(name,code),seed=hash(code+'|'+name+'|'+ri),R=(known?20:8)+Math.min(known?235:88,Math.sqrt(run.n)*(known?.5:.18));return{run,ri,code,name,known,a,col:colorFor(known),seed,R,ry:known?.72:.58,phase:mix(seed^run.start)}}
function pointFrom(m,j){
 const id=m.run.start+j;
 if(!LINEAGE_ROOT){const h=mix((j+m.phase)>>>0),h2=mix(h^m.seed),h3=mix(h2^0x85ebca6b);const ux=(((h&1023)/1023)+(((h>>>10)&1023)/1023)+(((h>>>20)&1023)/1023))/3-.5,uy=(((h2&1023)/1023)+(((h2>>>10)&1023)/1023)+(((h3>>>20)&1023)/1023))/3-.5;return{x:m.a.x+ux*m.R*2,y:m.a.y+uy*m.R*2*m.ry}}
 const root=LINEAGE_ROOT[id],branch=LINEAGE_BRANCH[id],depth=LINEAGE_DEPTH[id];
 const rh=mix((root^m.seed^0x9e3779b9)>>>0),rh2=mix(rh^0x85ebca6b),ra=(rh/4294967296)*Math.PI*2,rr=Math.sqrt(rh2/4294967296)*m.R;
 const cx=m.a.x+Math.cos(ra)*rr,cy=m.a.y+Math.sin(ra)*rr*m.ry;
 if(depth===0)return{x:cx,y:cy};
 const bh=mix((branch^root^m.seed^0xc2b2ae35)>>>0),ih=mix((id^branch^0x27d4eb2d)>>>0),baseA=(bh/4294967296)*Math.PI*2,jitter=((ih/4294967296)-.5)*.42,a=baseA+jitter;
 const ring=.48+depth*.46+((mix(ih^0x165667b1)&1023)/1023)*.32;
 return{x:cx+Math.cos(a)*ring,y:cy+Math.sin(a)*ring*.72};
}
function cellOf(x,y){const tx=Math.floor((x-WORLD.x0)/TILE),ty=Math.floor((y-WORLD.y0)/TILE);return tx<0||ty<0||tx>=NX||ty>=NY?-1:ty*NX+tx}
function buildWordCheckpoints(total){const cps=Math.ceil(total/WORD_STEP);CP_OFF=new Uint32Array(cps);CP_PREV=new Array(cps);let idx=0,pos=0,prev='',cp=0;while(idx<total&&pos<=WORDS_BLOB.length){if((idx%WORD_STEP)===0){CP_OFF[cp]=pos;CP_PREV[cp]=prev;cp++}let end=WORDS_BLOB.indexOf('\n',pos);if(end<0)end=WORDS_BLOB.length;const s=WORDS_BLOB.slice(pos,end),k=DIG.indexOf(s.charAt(0));prev=prev.slice(0,Math.max(0,k))+s.slice(1);idx++;pos=end+1}}
function wordAt(id){id=id|0;if(id<0)return'';if(WORD_CACHE.has(id))return WORD_CACHE.get(id);const cp=Math.floor(id/WORD_STEP);if(!CP_OFF||cp>=CP_OFF.length)return'';let idx=cp*WORD_STEP,pos=CP_OFF[cp],prev=CP_PREV[cp]||'',word='';while(idx<=id&&pos<=WORDS_BLOB.length){let end=WORDS_BLOB.indexOf('\n',pos);if(end<0)end=WORDS_BLOB.length;const s=WORDS_BLOB.slice(pos,end),k=DIG.indexOf(s.charAt(0));word=prev.slice(0,Math.max(0,k))+s.slice(1);prev=word;idx++;pos=end+1}if(WORD_CACHE.size>4096)WORD_CACHE.clear();WORD_CACHE.set(id,word);return word}
function runIndexOf(id){let lo=0,hi=RUNS.length-1;while(lo<=hi){const m=(lo+hi)>>1,r=RUNS[m];if(id<r.start)hi=m-1;else if(id>=r.start+r.n)lo=m+1;else return m}return-1}
function positionOf(id){const ri=runIndexOf(id);if(ri<0)return null;const r=RUNS[ri];return pointFrom(RMETA[ri],id-r.start)}
function languageOf(id){const ri=runIndexOf(id);if(ri<0)return'';const r=RUNS[ri];return NAMES[r.li]||CODES[r.li]||''}
function parentOf(id){return PRIMARY_PARENT&&id>=0&&id<PRIMARY_PARENT.length?PRIMARY_PARENT[id]:-1}
function rootOf(id){return LINEAGE_ROOT&&id>=0&&id<LINEAGE_ROOT.length?LINEAGE_ROOT[id]:id}
function branchOf(id){return LINEAGE_BRANCH&&id>=0&&id<LINEAGE_BRANCH.length?LINEAGE_BRANCH[id]:id}
function lineageOf(id,max=LINEAGE_STEPS){const out=[];if(!PRIMARY_PARENT||id<0||id>=PRIMARY_PARENT.length)return out;let x=id;for(let d=0;d<max;d++){const p=PRIMARY_PARENT[x];if(p<0||p===x)break;out.push(p);x=p}return out}
function query(x0,y0,x1,y1,limit=2400){if(!ready||!CELL_OFF||!CELL_IDS)return[];const tx0=Math.max(0,Math.floor((x0-WORLD.x0)/TILE)),ty0=Math.max(0,Math.floor((y0-WORLD.y0)/TILE)),tx1=Math.min(NX-1,Math.floor((x1-WORLD.x0)/TILE)),ty1=Math.min(NY-1,Math.floor((y1-WORLD.y0)/TILE));if(tx1<tx0||ty1<ty0)return[];let total=0;for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const c=ty*NX+tx;total+=CELL_OFF[c+1]-CELL_OFF[c]}const stride=Math.max(1,Math.floor(total/Math.max(1,limit))),phase=total>limit?mix((tx0*73856093)^(ty0*19349663)^(tx1*83492791)^(ty1*2654435761))%stride:0,out=[];let seen=0;for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const c=ty*NX+tx,a=CELL_OFF[c],b=CELL_OFF[c+1];for(let k=a;k<b;k++){if(stride>1&&((seen++ + phase)%stride))continue;const id=CELL_IDS[k],p=positionOf(id);if(p&&p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1)out.push({id,x:p.x,y:p.y});if(out.length>=limit)return out}}return out}
function buildField(total){const mobile=!!window.__etymMobileProfile?.enabled||innerWidth<760,bw=mobile?1792:3072,bh=mobile?1120:1920,cv=document.createElement('canvas');cv.width=bw;cv.height=bh;const cg=cv.getContext('2d',{alpha:true}),im=cg.createImageData(bw,bh),d=im.data,ww=WORLD.x1-WORLD.x0,wh=WORLD.y1-WORLD.y0,X=x=>(x-WORLD.x0)/ww*(bw-1),Y=y=>(y-WORLD.y0)/wh*(bh-1),counts=new Uint32Array(NC);
 RMETA=RUNS.map(metaFor);
 for(let ri=0;ri<RUNS.length;ri++){const r=RUNS[ri],m=RMETA[ri];for(let j=0;j<r.n;j++){const p=pointFrom(m,j);put(d,bw,bh,X(p.x),Y(p.y),m.col,m.known?18:12);const c=cellOf(p.x,p.y);if(c>=0)counts[c]++}}
 CELL_OFF=new Uint32Array(NC+1);for(let i=0;i<NC;i++)CELL_OFF[i+1]=CELL_OFF[i]+counts[i];CELL_IDS=new Uint32Array(CELL_OFF[NC]);const cur=CELL_OFF.slice(0,NC);
 for(let ri=0;ri<RUNS.length;ri++){const r=RUNS[ri],m=RMETA[ri];for(let j=0;j<r.n;j++){const p=pointFrom(m,j),c=cellOf(p.x,p.y);if(c>=0)CELL_IDS[cur[c]++]=r.start+j}}
 cg.putImageData(im,0,0);field=cv;buildWordCheckpoints(total);ready=true;U.classList.add('ready');window.__allWordsField={count:total,runs:RUNS.length,source:CORE_URL,layout:'language → source-backed primary lineage grove → deterministic branch offsets',lineageSteps:LINEAGE_STEPS,get ready(){return ready},get camera(){return{x:cam.x,y:cam.y,z:cam.z,w:W,h:H}},query,wordAt,positionOf,languageOf,parentOf,rootOf,branchOf,lineageOf};
 }
async function load(){try{if(!('DecompressionStream'in window))return;const r=await fetch(CORE_URL,{cache:'force-cache'});if(!r.ok)return;const ds=r.body.pipeThrough(new DecompressionStream('gzip'));let text=await new Response(ds).text();CODES=extract(text,'codes');NAMES=extract(text,'names');WORDS_BLOB=extract(text,'words');const parsed=parseRuns(extract(text,'wrle'));RUNS=parsed.out;const adj=extract(text,'adj')||'',prim=extract(text,'prim')||'';await buildPrimaryLineage(adj,prim,parsed.total);text=null;setTimeout(()=>buildField(parsed.total),20)}catch(e){console.error('all-word field',e)}}
function draw(){requestAnimationFrame(draw);cam.x+=(tar.x-cam.x)*.1;cam.y+=(tar.y-cam.y)*.1;cam.z+=(tar.z-cam.z)*.1;G.clearRect(0,0,W,H);if(!ready||!field)return;const x=sx(WORLD.x0),y=sy(WORLD.y0),w=(WORLD.x1-WORLD.x0)*cam.z,h=(WORLD.y1-WORLD.y0)*cam.z;G.save();G.globalCompositeOperation='lighter';G.globalAlpha=.62;G.imageSmoothingEnabled=true;G.drawImage(field,x,y,w,h);G.globalAlpha=.26;G.filter='blur(1.1px)';G.drawImage(field,x,y,w,h);G.filter='none';G.restore()}draw();
// Mirror the active ancestry camera. The overlay itself never receives pointer events.
addEventListener('pointerdown',e=>{if(!(e.target instanceof HTMLCanvasElement)||e.target===U)return;pts.set(e.pointerId,[e.clientX,e.clientY])},true);
addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const old=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===1){const dx=e.clientX-old[0],dy=e.clientY-old[1];cam.x=tar.x-=dx/cam.z;cam.y=tar.y-=dy/cam.z}else{const p=[...pts.values()],dist=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]),mx=(p[0][0]+p[1][0])/2,my=(p[0][1]+p[1][1])/2;if(pinch){const bx=wx(mx),by=wy(my),z=Math.max(.18,Math.min(3.4,cam.z*dist/pinch));cam.z=tar.z=z;cam.x=tar.x=bx-(mx-W/2)/z;cam.y=tar.y=by-(my-H/2)/z}pinch=dist}},true);
function up(e){pts.delete(e.pointerId);if(pts.size<2)pinch=0}addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);
addEventListener('wheel',e=>{if(!(e.target instanceof HTMLCanvasElement)||e.target===U)return;const bx=wx(e.clientX),by=wy(e.clientY),z=Math.max(.18,Math.min(3.4,cam.z*Math.exp(-e.deltaY*.0012)));cam.z=tar.z=z;cam.x=tar.x=bx-(e.clientX-W/2)/z;cam.y=tar.y=by-(e.clientY-H/2)/z},{capture:true,passive:true});
for(const c of document.querySelectorAll('canvas'))if(c!==U)c.onclick=null;
setTimeout(load,250);
})();