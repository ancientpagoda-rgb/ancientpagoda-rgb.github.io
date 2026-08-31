(function(){'use strict';
// Every corpus lexeme contributes to this unlabeled density field.  We deliberately
// do not create 2.4M DOM/canvas objects; the corpus is rasterized once, then the
// resulting field follows the same pan/zoom camera as the ancestry universe.
const CORE_URL='https://raw.githubusercontent.com/jewoo-suh/etymology-tree/master/graph-core-a360efd3e4.json.gz';
const L=window.langs||[],F=window.families||[];
const LBY=Object.fromEntries(L.map(x=>[x.name,x]));
const FBY=Object.fromEntries(F.map(x=>[x.id,x]));
const CODE_ANCHOR={en:'English',es:'Spanish',fr:'French',pt:'Portuguese',it:'Italian',de:'German',nl:'Dutch',ru:'Russian',uk:'Ukrainian',pl:'Polish',hi:'Hindi',ur:'Urdu',bn:'Bengali',mr:'Marathi',pa:'Punjabi',gu:'Gujarati',fa:'Persian',zh:'Mandarin Chinese',yue:'Cantonese',my:'Burmese',ar:'Arabic',ha:'Hausa',am:'Amharic',id:'Indonesian',ms:'Malay',jv:'Javanese',tl:'Filipino / Tagalog',fil:'Filipino / Tagalog',sw:'Swahili',ta:'Tamil',te:'Telugu',kn:'Kannada',ml:'Malayalam',tr:'Turkish',ja:'Japanese',ko:'Korean',vi:'Vietnamese',th:'Thai',hu:'Hungarian'};
const HIST_ANCHOR={ang:'English',enm:'English',fro:'French',frm:'French',osp:'Spanish',gmh:'German',goh:'German',orv:'Russian',sa:'Hindi',pi:'Hindi',la:'Italian',grc:'Italian'};
const css=document.createElement('style');css.textContent=`#allWordsField{position:fixed;inset:0;z-index:5;width:100%;height:100%;pointer-events:none!important;background:transparent!important;opacity:0;transition:opacity 1.4s ease}body.clean-world #allWordsField.ready{opacity:.82}`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='allWordsField';document.body.appendChild(U);const G=U.getContext('2d',{alpha:true});
let W=0,H=0,D=1,field=null,ready=false;
let cam={x:430,y:100,z:.33},tar={x:430,y:100,z:.33},pts=new Map(),pinch=0;
const WORLD={x0:-2800,y0:-1900,x1:3600,y1:2100};
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
function buildField(codes,names,runs,total){const mobile=!!window.__etymMobileProfile?.enabled||innerWidth<760;const bw=mobile?1792:3072,bh=mobile?1120:1920,cv=document.createElement('canvas');cv.width=bw;cv.height=bh;const cg=cv.getContext('2d',{alpha:true}),im=cg.createImageData(bw,bh),d=im.data,ww=WORLD.x1-WORLD.x0,wh=WORLD.y1-WORLD.y0;
 const X=x=>(x-WORLD.x0)/ww*(bw-1),Y=y=>(y-WORLD.y0)/wh*(bh-1);
 let done=0;
 for(let ri=0;ri<runs.length;ri++){
  const run=runs[ri],code=codes[run.li]||'',name=names[run.li]||code,known=findAnchor(name,code),a=known||fallbackAnchor(name,code),col=colorFor(known),seed=hash(code+'|'+name+'|'+ri),R=(known?20:8)+Math.min(known?235:88,Math.sqrt(run.n)*(known?.5:.18)),ry=known?.72:.58,phase=mix(seed^run.start);
  for(let j=0;j<run.n;j++){
   let h=mix((j+phase)>>>0),h2=mix(h^seed),h3=mix(h2^0x85ebca6b);
   // Three uniform components make a cheap bell-shaped scatter without per-word trig.
   let ux=(((h&1023)/1023)+(((h>>>10)&1023)/1023)+(((h>>>20)&1023)/1023))/3-.5;
   let uy=(((h2&1023)/1023)+(((h2>>>10)&1023)/1023)+(((h3>>>20)&1023)/1023))/3-.5;
   const px=X(a.x+ux*R*2),py=Y(a.y+uy*R*2*ry);put(d,bw,bh,px,py,col,known?18:12);done++;
  }
 }
 cg.putImageData(im,0,0);field=cv;ready=true;U.classList.add('ready');window.__allWordsField={count:total,runs:runs.length};
 }
async function load(){try{if(!('DecompressionStream'in window))return;const r=await fetch(CORE_URL,{cache:'force-cache'});if(!r.ok)return;const ds=r.body.pipeThrough(new DecompressionStream('gzip'));let text=await new Response(ds).text();const codes=extract(text,'codes'),names=extract(text,'names'),wrle=extract(text,'wrle');text=null;const parsed=parseRuns(wrle);setTimeout(()=>buildField(codes,names,parsed.out,parsed.total),20)}catch(e){console.error('all-word field',e)}}
function draw(){requestAnimationFrame(draw);cam.x+=(tar.x-cam.x)*.1;cam.y+=(tar.y-cam.y)*.1;cam.z+=(tar.z-cam.z)*.1;G.clearRect(0,0,W,H);if(!ready||!field)return;const x=sx(WORLD.x0),y=sy(WORLD.y0),w=(WORLD.x1-WORLD.x0)*cam.z,h=(WORLD.y1-WORLD.y0)*cam.z;G.save();G.globalCompositeOperation='lighter';G.globalAlpha=.62;G.imageSmoothingEnabled=true;G.drawImage(field,x,y,w,h);G.globalAlpha=.26;G.filter='blur(1.1px)';G.drawImage(field,x,y,w,h);G.filter='none';G.restore()}draw();
// Mirror the active ancestry camera. The overlay itself never receives pointer events.
addEventListener('pointerdown',e=>{if(!(e.target instanceof HTMLCanvasElement)||e.target===U)return;pts.set(e.pointerId,[e.clientX,e.clientY])},true);
addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const old=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===1){const dx=e.clientX-old[0],dy=e.clientY-old[1];cam.x=tar.x-=dx/cam.z;cam.y=tar.y-=dy/cam.z}else{const p=[...pts.values()],dist=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]),mx=(p[0][0]+p[1][0])/2,my=(p[0][1]+p[1][1])/2;if(pinch){const bx=wx(mx),by=wy(my),z=Math.max(.18,Math.min(3.4,cam.z*dist/pinch));cam.z=tar.z=z;cam.x=tar.x=bx-(mx-W/2)/z;cam.y=tar.y=by-(my-H/2)/z}pinch=dist}},true);
function up(e){pts.delete(e.pointerId);if(pts.size<2)pinch=0}addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);
addEventListener('wheel',e=>{if(!(e.target instanceof HTMLCanvasElement)||e.target===U)return;const bx=wx(e.clientX),by=wy(e.clientY),z=Math.max(.18,Math.min(3.4,cam.z*Math.exp(-e.deltaY*.0012)));cam.z=tar.z=z;cam.x=tar.x=bx-(e.clientX-W/2)/z;cam.y=tar.y=by-(e.clientY-H/2)/z},{capture:true,passive:true});
// Selection used to trigger hidden auto-focus after a click. Pure visual mode keeps
// navigation strictly pan/zoom so the point field and ancestry geometry stay locked.
for(const c of document.querySelectorAll('canvas'))if(c!==U)c.onclick=null;
setTimeout(load,250);
})();