(function(){'use strict';
const lex=window.__worldLexicons||{};
const css=document.createElement('style');css.textContent=`
body.unified-coords #c,body.unified-coords #worldLangLayer,body.unified-coords #lexiconLayer{opacity:0!important;pointer-events:none!important}
body.unified-coords #ipa-layer,body.unified-coords #sound-layer{display:none!important}
body.unified-coords .phon-card,body.unified-coords .sound-card,body.unified-coords .enter-lex,body.unified-coords .lex-back,body.unified-coords .lex-chip{display:none!important}
#unifiedUniverse{position:fixed;inset:0;z-index:3;display:none;width:100%;height:100%;touch-action:none;background:#040806}
body.unified-coords #unifiedUniverse{display:block}
.unified-chip{position:fixed;z-index:6;left:14px;top:112px;display:none;padding:7px 10px;border-radius:10px;background:#06110bdc;border:1px solid #bcefc020;color:#9bb1a0;font:9px system-ui;letter-spacing:.04em}
body.unified-coords .unified-chip{display:block}
body.unified-coords .world-chip{display:none!important}
body.unified-coords .layer-rail:after{content:' · SHARED SPACE';color:#e9f7ec}
#allLayersBtn.unified-on{background:#31553a!important;box-shadow:0 0 18px #70c9822b inset}
@media(max-width:760px){.unified-chip{left:10px;top:142px;max-width:calc(100vw - 20px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='unifiedUniverse';document.body.insertBefore(U,document.querySelector('.top'));const G=U.getContext('2d');
const chip=document.createElement('div');chip.className='unified-chip';chip.textContent='UNIFIED WORLD · every forest grows from its language node';document.body.appendChild(chip);
let W=0,H=0,D=1,enabled=true,ucam={x:430,y:100,z:.33},utar={x:430,y:100,z:.33},pts=new Map(),pinch=0,moved=0,hit=null;
function resize(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,2);U.width=W*D;U.height=H*D;G.setTransform(D,0,0,D,0,0)}resize();addEventListener('resize',resize);
const sx=x=>(x-ucam.x)*ucam.z+W/2,sy=y=>(y-ucam.y)*ucam.z+H/2,wx=x=>(x-W/2)/ucam.z+ucam.x,wy=y=>(y-H/2)/ucam.z+ucam.y;
const LBY=Object.fromEntries(langs.map(l=>[l.name,l]));const ABY=Object.fromEntries(ancestors.map(a=>[a.id,a]));
const EN=LBY.English||langs.find(l=>l.name==='English');
let exMin=Math.min(...ns.map(n=>n.x)),exMax=Math.max(...ns.map(n=>n.x)),eyMin=Math.min(...ns.map(n=>n.y)),eyMax=Math.max(...ns.map(n=>n.y));
const exCx=(exMin+exMax)/2,exCy=(eyMin+eyMax)/2,ES=.155;
function exPos(n){return{x:EN.x+(n.x-exCx)*ES,y:EN.y+(n.y-exCy)*ES}}
function hash32(s){let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0}
function microPos(lang,w,i,total){const h=hash32(lang.name+'|'+w.f),a=((h%100000)/100000)*Math.PI*2,r=(78+((h>>>9)%100)/100*92)*(total>16?1.08:1);return{x:lang.x+Math.cos(a)*r,y:lang.y+Math.sin(a)*r}}
function npos(id){return ABY[id]||ancestors.find(a=>a.name===id)||LBY[id]||langs.find(l=>l.name===id)}
function edge(x1,y1,x2,y2,color,width=1,dash=null,curve=0){G.beginPath();G.moveTo(sx(x1),sy(y1));if(curve){const X1=sx(x1),Y1=sy(y1),X2=sx(x2),Y2=sy(y2),mx=(X1+X2)/2,my=(Y1+Y2)/2,dx=X2-X1,dy=Y2-Y1;G.quadraticCurveTo(mx-dy*curve,my+dx*curve,X2,Y2)}else G.lineTo(sx(x2),sy(y2));G.strokeStyle=color;G.lineWidth=width;G.setLineDash(dash||[]);G.stroke();G.setLineDash([])}
function drawWorld(){
 for(const f of families){const ls=langs.filter(l=>l.family===f.id),x=sx(f.x),y=sy(f.y),r=(210+ls.length*16)*ucam.z,g=G.createRadialGradient(x,y,0,x,y,r*1.9);g.addColorStop(0,f.c+'32');g.addColorStop(1,f.c+'00');G.fillStyle=g;G.beginPath();G.arc(x,y,r*1.9,0,7);G.fill();if(ucam.z<.72){G.fillStyle='#c6d5c9a0';G.font='700 '+Math.max(10,15*ucam.z)+'px system-ui';G.textAlign='center';G.fillText(f.name,x,y-r*.8)}}
 for(const [a,b] of lineage){const A=npos(a),B=npos(b);if(A&&B)edge(A.x,A.y,B.x,B.y,'#9fc3a45a',Math.max(1,1.4*ucam.z))}
 for(const [a,b] of borrow){const A=npos(a),B=npos(b);if(A&&B)edge(A.x,A.y,B.x,B.y,'#e2a46e88',1.15,[5,5],.11)}
 for(const a of ancestors){G.fillStyle='#d7bd7b';G.globalAlpha=.72;G.beginPath();G.arc(sx(a.x),sy(a.y),Math.max(2.5,4*ucam.z),0,7);G.fill();if(ucam.z>.55){G.fillStyle='#d8e6db';G.font='500 10px system-ui';G.textAlign='center';G.fillText(a.name,sx(a.x),sy(a.y)-8)}}G.globalAlpha=1;
 for(const l of langs){const f=familyBy[l.family],is=hit&&hit.kind==='language'&&hit.obj===l;G.fillStyle=is?'#fff':f.c;G.beginPath();G.arc(sx(l.x),sy(l.y),(is?8:5)*Math.max(.8,ucam.z),0,7);G.fill();if(ucam.z>.43||is){G.fillStyle='#eef8f0';G.font=(is?'700 ':'600 ')+Math.max(9,11*ucam.z)+'px system-ui';G.textAlign='center';G.fillText(l.name,sx(l.x),sy(l.y)-9);if(ucam.z>1.1){G.fillStyle='#91a898';G.font='9px system-ui';G.fillText(l.native,sx(l.x),sy(l.y)+13)}}}
}
function drawLexicons(){
 const threshold=.46;
 for(const l of langs){const d=lex[l.name];if(!d)continue;const n=d.words.length;for(let i=0;i<n;i++){const w=d.words[i],p=microPos(l,w,i,n),col={inherited:'#8bc59a',borrowed:'#e2a46e',compound:'#77b6d1',derived:'#b698dc',learned:'#d7bd7b'}[w.t]||'#9fc3a4';edge(l.x,l.y,p.x,p.y,col+'42',.8);const is=hit&&hit.kind==='word'&&hit.lang===l&&hit.obj===w;G.fillStyle=is?'#fff':col;G.globalAlpha=ucam.z<threshold?.32:.82;G.beginPath();G.arc(sx(p.x),sy(p.y),(is?6:3.3)*Math.max(.75,ucam.z),0,7);G.fill();if(ucam.z>.82||is){G.globalAlpha=1;G.fillStyle='#eaf5ec';G.font=(is?'700 ':'500 ')+'9px system-ui';G.textAlign='center';G.fillText(w.f,sx(p.x),sy(p.y)-7);if((ucam.z>1.35||is)&&w.ipa){G.fillStyle='#bdebc6';G.font='8px ui-monospace,monospace';G.fillText(w.ipa,sx(p.x),sy(p.y)+9)}}G.globalAlpha=1}}
}
function drawEnglish(){
 const engColor='#79b889';
 const zoom=ucam.z;
 for(const e of es){const a=by[e.a],b=by[e.b];if(!a||!b)continue;const A=exPos(a),B=exPos(b),col=EC[e.t]||engColor;edge(A.x,A.y,B.x,B.y,col+(zoom>.75?'75':'35'),zoom>1.1?1.4:.75,e.t==='b'?[4,4]:e.t==='l'?[2,4]:null,.08)}
 let shown=0;for(const n of ns){const p=exPos(n),is=hit&&hit.kind==='english'&&hit.obj===n;G.fillStyle=is?'#fff':(LC[n.l]||engColor);G.globalAlpha=zoom<.48?.38:.83;G.beginPath();G.arc(sx(p.x),sy(p.y),(is?6:3.2)*Math.max(.72,zoom),0,7);G.fill();if(zoom>.88||is){G.globalAlpha=1;G.fillStyle='#eef8f0';G.font=(is?'700 ':'500 ')+'9px Georgia';G.textAlign='center';G.fillText(n.w,sx(p.x),sy(p.y)-7);if((zoom>1.45||is)&&n.phon&&shown++<80){G.fillStyle='#bdebc6';G.font='8px ui-monospace,monospace';G.fillText(n.phon.text,sx(p.x),sy(p.y)+9)}}G.globalAlpha=1}
 // Root the English grove visibly at the English language node.
 const center={x:EN.x,y:EN.y};edge(center.x,center.y,EN.x-70,EN.y+30,'#9fc3a46a',1.5);
 // Source-language gateways make borrowing visibly cross the global atlas.
 const gateway={Arabic:'Arabic',Persian:'Persian',Japanese:'Japanese',Sanskrit:'Hindi',Latin:null,Greek:null,'Old French':'French'};
 const histGate={Latin:'latin',Greek:null};
 for(const n of ns){let target=null;if(gateway[n.l])target=LBY[gateway[n.l]];else if(n.l==='Latin')target=ABY.latin;else if(n.l==='Greek')target=ancestors.find(a=>a.name.includes('Greek'));if(!target)continue;const p=exPos(n);if(Math.hypot(p.x-EN.x,p.y-EN.y)>420)continue;edge(target.x,target.y,p.x,p.y,'#e2a46e22',.65,[3,6],.05)}
}
function draw(){requestAnimationFrame(draw);if(!enabled)return;ucam.x+=(utar.x-ucam.x)*.1;ucam.y+=(utar.y-ucam.y)*.1;ucam.z+=(utar.z-ucam.z)*.1;G.fillStyle='#040806';G.fillRect(0,0,W,H);drawWorld();drawLexicons();drawEnglish()}
draw();
function clearPanelArtifacts(){P.dataset.phonKey='unified';P.dataset.soundKey='unified';P.querySelectorAll('.phon-card,.sound-card').forEach(e=>e.remove())}
function panelLanguage(l){clearPanelArtifacts();const d=lex[l.name];const f=familyBy[l.family];P.innerHTML=`<div class="eye">unified language node</div><h2>${l.name}</h2><p>${l.native}<br>${f.name} · ${l.branch}<br>${l.script}</p><div class="meta">${d?d.words.length+' starter lexemes are growing directly around this node.':'Word forest not expanded yet.'}<br>Historical path: ${l.history}</div>`}
function panelWord(l,w){clearPanelArtifacts();P.innerHTML=`<div class="eye">${l.name} · unified lexeme</div><h2>${w.f}</h2><p>${w.r&&w.r!==w.f?w.r+' · ':''}${w.ipa||''}<br><b>${w.g}</b></p><div class="meta">${String(w.t||'').toUpperCase()} · ${w.src||''}<br>This lexeme occupies the same world coordinate system as its language family and borrowing routes.</div>`}
function panelEnglish(n){clearPanelArtifacts();const a=anc(n),d=des(n);let phon=n.phon?`<div style="margin:8px 0;font:600 15px ui-monospace,monospace;color:#bdebc6">${n.phon.text}</div>`:'';let changes=es.filter(e=>(e.a===n.id||e.b===n.id)&&e.sound&&e.sound.specific).slice(0,4);P.innerHTML=`<div class="eye">English etymology · unified coordinates</div><h2>${n.w}</h2><p>${n.l} · ${n.era}<br>${n.m}</p>${phon}${changes.length?'<div class="meta">'+changes.map(e=>`${by[e.a].w} → ${by[e.b].w}: ${e.sound.title}`).join('<br>')+'</div>':''}<div class="meta">ANCESTORS ${a.size} · DESCENDANTS ${d.size}<br>The English graph now grows spatially from the English language node.</div>`}
function panelAncestor(a){clearPanelArtifacts();P.innerHTML=`<div class="eye">historical language stage</div><h2>${a.name}</h2><p>${familyBy[a.family]?.name||''}</p><div class="meta">This historical node and all descendant language/word forests share one coordinate system.</div>`}
function focus(x,y,z=.95){utar.x=x;utar.y=y;utar.z=Math.max(utar.z,z)}
function chooseAt(px,py){let best=null,dist=24;
 for(const l of langs){let q=Math.hypot(sx(l.x)-px,sy(l.y)-py);if(q<dist){dist=q;best={kind:'language',obj:l}}}
 for(const a of ancestors){let q=Math.hypot(sx(a.x)-px,sy(a.y)-py);if(q<dist){dist=q;best={kind:'ancestor',obj:a}}}
 if(ucam.z>.5)for(const l of langs){const d=lex[l.name];if(!d)continue;for(let i=0;i<d.words.length;i++){const w=d.words[i],p=microPos(l,w,i,d.words.length),q=Math.hypot(sx(p.x)-px,sy(p.y)-py);if(q<dist){dist=q;best={kind:'word',lang:l,obj:w,p}}}}
 if(ucam.z>.55)for(const n of ns){const p=exPos(n),q=Math.hypot(sx(p.x)-px,sy(p.y)-py);if(q<dist){dist=q;best={kind:'english',obj:n,p}}}
 return best}
function select(h){if(!h)return;hit=h;if(h.kind==='language'){panelLanguage(h.obj);focus(h.obj.x,h.obj.y,.8)}else if(h.kind==='ancestor'){panelAncestor(h.obj);focus(h.obj.x,h.obj.y,.8)}else if(h.kind==='word'){panelWord(h.lang,h.obj);focus(h.p.x,h.p.y,1.15)}else if(h.kind==='english'){panelEnglish(h.obj);focus(h.p.x,h.p.y,1.15)}}
function searchUnified(q){q=q.trim().toLowerCase();if(!q)return false;let l=langs.find(x=>x.name.toLowerCase()===q||x.native.toLowerCase()===q)||langs.find(x=>x.name.toLowerCase().startsWith(q));if(l){select({kind:'language',obj:l});return true}let a=ancestors.find(x=>x.name.toLowerCase().includes(q));if(a){select({kind:'ancestor',obj:a});return true}let en=ns.find(n=>n.w.toLowerCase()===q);if(en){select({kind:'english',obj:en,p:exPos(en)});return true}for(const ll of langs){const d=lex[ll.name];if(!d)continue;const w=d.words.find(w=>[w.f,w.r,w.g].some(s=>(s||'').toLowerCase()===q));if(w){const p=microPos(ll,w,d.words.indexOf(w),d.words.length);select({kind:'word',lang:ll,obj:w,p});return true}}return false}
U.onpointerdown=e=>{if(!enabled)return;pts.set(e.pointerId,[e.clientX,e.clientY]);U.setPointerCapture(e.pointerId);moved=0};
U.onpointermove=e=>{if(!pts.has(e.pointerId))return;const old=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===1){const dx=e.clientX-old[0],dy=e.clientY-old[1];if(Math.hypot(dx,dy)>2)moved=1;ucam.x=utar.x-=dx/ucam.z;ucam.y=utar.y-=dy/ucam.z}else{const p=[...pts.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]),mx=(p[0][0]+p[1][0])/2,my=(p[0][1]+p[1][1])/2;if(pinch){const bx=wx(mx),by=wy(my),z=Math.max(.14,Math.min(3.4,ucam.z*d/pinch));ucam.z=utar.z=z;ucam.x=utar.x=bx-(mx-W/2)/z;ucam.y=utar.y=by-(my-H/2)/z}pinch=d;moved=1}};
function up(e){pts.delete(e.pointerId);if(pts.size<2)pinch=0}U.onpointerup=up;U.onpointercancel=up;U.onclick=e=>{if(!enabled||moved)return;select(chooseAt(e.clientX,e.clientY))};
U.addEventListener('wheel',e=>{if(!enabled)return;e.preventDefault();const bx=wx(e.clientX),by=wy(e.clientY),z=Math.max(.14,Math.min(3.4,ucam.z*Math.exp(-e.deltaY*.0012)));ucam.z=utar.z=z;ucam.x=utar.x=bx-(e.clientX-W/2)/z;ucam.y=utar.y=by-(e.clientY-H/2)/z},{passive:false});
const go=document.querySelector('#go'),qin=document.querySelector('#q');go.addEventListener('click',e=>{if(!enabled)return;e.preventDefault();e.stopImmediatePropagation();if(!searchUnified(qin.value))toast('Not found in unified atlas yet')},true);qin.addEventListener('keydown',e=>{if(!enabled||e.key!=='Enter')return;e.preventDefault();e.stopImmediatePropagation();if(!searchUnified(qin.value))toast('Not found in unified atlas yet')},true);
const oldStatus=status;status=function(){if(enabled){S.textContent='unified · '+Math.round(ucam.z*100)+'% · '+families.length+' families · '+langs.length+' languages · '+ns.length+' English graph nodes · '+Object.values(lex).reduce((s,d)=>s+d.words.length,0)+' world lexemes';return}return oldStatus()};
function setEnabled(v){enabled=v;document.body.classList.toggle('unified-coords',v);try{world=false}catch(_){}const b=document.querySelector('#allLayersBtn');if(b){b.textContent=v?'UNIFIED':'LAYERS';b.classList.toggle('unified-on',v)}if(v){hit=null;utar={x:430,y:100,z:.33};clearPanelArtifacts();P.innerHTML='<div class="eye">unified world forest</div><h2>One linguistic universe</h2><p>Families, historical stages, modern languages, word forests, IPA and sound-change structure now share one coordinate system.</p><div class="meta">Zoom toward a language to reveal its words. English is a deeper graph growing directly from the English node; borrowing routes cross between language regions.</div>'}else{try{setWorld(true)}catch(_){}}try{status()}catch(_){}}
const all=document.querySelector('#allLayersBtn');if(all)all.onclick=()=>setEnabled(!enabled);
const wb=document.querySelector('#worldMode');if(wb)wb.onclick=()=>setEnabled(!enabled);
const sm=document.querySelector('.brand small');if(sm)sm.textContent='Phase 5.3 · unified world coordinates';
setEnabled(true);
})();