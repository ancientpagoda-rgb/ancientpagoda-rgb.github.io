(function(){'use strict';
const lex=window.__worldLexicons||{};
const css=document.createElement('style');css.textContent=`
body.semantic-world #unifiedUniverse{opacity:0!important;pointer-events:none!important}
body.semantic-world #c,body.semantic-world #worldLangLayer,body.semantic-world #lexiconLayer{opacity:0!important;pointer-events:none!important}
body.semantic-world #ipa-layer,body.semantic-world #sound-layer{display:none!important}
#semanticUniverse{position:fixed;inset:0;z-index:3;width:100%;height:100%;display:none;background:#040806;touch-action:none}
body.semantic-world #semanticUniverse{display:block}
.semantic-chip{position:fixed;z-index:6;left:14px;top:112px;padding:7px 10px;border-radius:10px;background:#06110bdd;border:1px solid #bcefc020;color:#a8bead;font:9px system-ui;letter-spacing:.05em;pointer-events:none}
#cognateBtn.on{background:#624f2d!important;box-shadow:0 0 15px #e2a46e25 inset}
@media(max-width:760px){.semantic-chip{left:10px;top:142px;max-width:calc(100vw - 20px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='semanticUniverse';document.body.insertBefore(U,document.querySelector('.top'));const G=U.getContext('2d');
const chip=document.createElement('div');chip.className='semantic-chip';document.body.appendChild(chip);
let W=0,H=0,D=1,cam={x:430,y:100,z:.33},tar={x:430,y:100,z:.33},pts=new Map(),pinch=0,moved=0,hit=null,cognates=true;
function resize(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,2);U.width=W*D;U.height=H*D;G.setTransform(D,0,0,D,0,0)}resize();addEventListener('resize',resize);
const sx=x=>(x-cam.x)*cam.z+W/2,sy=y=>(y-cam.y)*cam.z+H/2,wx=x=>(x-W/2)/cam.z+cam.x,wy=y=>(y-H/2)/cam.z+cam.y;
const LBY=Object.fromEntries(langs.map(l=>[l.name,l])),ABY=Object.fromEntries(ancestors.map(a=>[a.id,a])),EN=LBY.English;
const exMin=Math.min(...ns.map(n=>n.x)),exMax=Math.max(...ns.map(n=>n.x)),eyMin=Math.min(...ns.map(n=>n.y)),eyMax=Math.max(...ns.map(n=>n.y)),exCx=(exMin+exMax)/2,exCy=(eyMin+eyMax)/2,ES=.155;
function exPos(n){return{x:EN.x+(n.x-exCx)*ES,y:EN.y+(n.y-exCy)*ES}}
function hash32(s){let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0}
function microPos(l,w,i,total){const h=hash32(l.name+'|'+w.f),a=(h%100000)/100000*Math.PI*2,r=(78+((h>>>9)%100)/100*92)*(total>16?1.08:1);return{x:l.x+Math.cos(a)*r,y:l.y+Math.sin(a)*r}}
function npos(id){return ABY[id]||ancestors.find(a=>a.name===id)||LBY[id]}
function visible(x,y,p=70){const X=sx(x),Y=sy(y);return X>-p&&X<W+p&&Y>-p&&Y<H+p}
function line(a,b,color,w=1,dash=null,curve=0){if(!a||!b)return;const X1=sx(a.x),Y1=sy(a.y),X2=sx(b.x),Y2=sy(b.y);G.beginPath();G.moveTo(X1,Y1);if(curve){const mx=(X1+X2)/2,my=(Y1+Y2)/2,dx=X2-X1,dy=Y2-Y1;G.quadraticCurveTo(mx-dy*curve,my+dx*curve,X2,Y2)}else G.lineTo(X2,Y2);G.strokeStyle=color;G.lineWidth=w;G.setLineDash(dash||[]);G.stroke();G.setLineDash([])}
function stage(){return cam.z<.42?'FAMILY':cam.z<.72?'LANGUAGE':cam.z<1.12?'FOREST':cam.z<1.72?'WORD':'PHONETIC'}
const COL={inherited:'#8bc59a',borrowed:'#e2a46e',compound:'#77b6d1',derived:'#b698dc',learned:'#d7bd7b'};
const GROUPS=[
{id:'father',name:'PIE father cognates',kind:'cognate',anchor:'pie',refs:[['English','father'],['German','Vater'],['Dutch','vader'],['Spanish','padre'],['French','père'],['Portuguese','pai'],['Italian','padre'],['Hindi','पिता'],['Gujarati','પિતા'],['Persian','پدر']]},
{id:'mother',name:'PIE mother cognates',kind:'cognate',anchor:'pie',refs:[['English','mother'],['German','Mutter'],['Dutch','moeder'],['Spanish','madre'],['French','mère'],['Portuguese','mãe'],['Italian','madre'],['Russian','мать'],['Ukrainian','мати'],['Persian','مادر']]},
{id:'night',name:'PIE night cognates',kind:'cognate',anchor:'pie',refs:[['English','night'],['German','Nacht'],['Dutch','nacht'],['Spanish','noche'],['French','nuit'],['Portuguese','noite'],['Italian','notte'],['Russian','ночь'],['Ukrainian','ніч'],['Polish','noc']]},
{id:'water',name:'PIE water cognates',kind:'cognate',anchor:'pie',refs:[['English','water'],['German','Wasser'],['Dutch','water'],['Russian','вода'],['Ukrainian','вода'],['Polish','woda']]},
{id:'tea',name:'Tea borrowing diaspora',kind:'loan',refs:[['Mandarin Chinese','茶'],['Cantonese','茶'],['Russian','чай'],['Hindi','चाय'],['Bengali','চা'],['Persian','چای'],['Turkish','çay'],['Korean','차'],['Vietnamese','trà'],['Thai','ชา'],['Dutch','thee'],['Italian','tè']]},
{id:'kitab',name:'Arabic kitāb borrowing web',kind:'loan',refs:[['Arabic','كتاب'],['Hindi','किताब'],['Urdu','کتاب'],['Persian','کتاب'],['Punjabi','ਕਿਤਾਬ'],['Swahili','kitabu'],['Turkish','kitap']]},
{id:'coffee',name:'Coffee borrowing web',kind:'loan',refs:[['English','coffee'],['Spanish','café'],['French','café'],['Portuguese','café'],['German','Kaffee'],['Indonesian','kopi'],['Malay','kopi'],['Swahili','kahawa']]}
];
function resolveRef(r){const [ln,form]=r;if(ln==='English'){const n=ns.find(n=>n.w.toLowerCase()===String(form).toLowerCase());return n?{lang:ln,form:n.w,obj:n,p:exPos(n),kind:'english'}:null}const l=LBY[ln],d=lex[ln];if(!l||!d)return null;const w=d.words.find(w=>w.f===form);if(!w)return null;return{lang:ln,form:w.f,obj:w,p:microPos(l,w,d.words.indexOf(w),d.words.length),kind:'word',l}}
const groupKey=new Map();for(const g of GROUPS)for(const r of g.refs)groupKey.set(r[0]+'|'+String(r[1]).toLowerCase(),g);
function groupFor(h){if(!h)return null;if(h.kind==='english')return groupKey.get('English|'+h.obj.w.toLowerCase())||null;if(h.kind==='word')return groupKey.get(h.lang.name+'|'+h.obj.f.toLowerCase())||null;return null}
function drawFamilies(){const z=cam.z,alpha=z<.5?1:Math.max(.12,1-(z-.5)*.7);for(const f of families){if(!visible(f.x,f.y,600))continue;const ls=langs.filter(l=>l.family===f.id),x=sx(f.x),y=sy(f.y),r=(210+ls.length*16)*z,g=G.createRadialGradient(x,y,0,x,y,r*1.9);g.addColorStop(0,f.c+(z<.75?'38':'18'));g.addColorStop(1,f.c+'00');G.fillStyle=g;G.beginPath();G.arc(x,y,r*1.9,0,7);G.fill();if(z<.78){G.globalAlpha=alpha;G.fillStyle='#c9d8cca8';G.font='700 '+Math.max(10,16*z)+'px system-ui';G.textAlign='center';G.fillText(f.name,x,y-r*.82);G.globalAlpha=1}}
for(const [a,b] of lineage){const A=npos(a),B=npos(b);if(A&&B&&(visible(A.x,A.y,100)||visible(B.x,B.y,100)))line(A,B,'#9fc3a4'+(z<.8?'68':'35'),Math.max(.8,1.5*z))}
for(const [a,b] of borrow){const A=npos(a),B=npos(b);if(A&&B&&(visible(A.x,A.y,100)||visible(B.x,B.y,100)))line(A,B,'#e2a46e'+(z<.9?'90':'38'),1.1,[5,5],.11)}
}
function drawHistorical(){if(cam.z<.36)return;for(const a of ancestors){if(!visible(a.x,a.y))continue;const is=hit&&hit.kind==='ancestor'&&hit.obj===a;G.fillStyle=is?'#fff1bd':'#d7bd7b';G.globalAlpha=cam.z<.55?.55:.82;G.beginPath();G.arc(sx(a.x),sy(a.y),(is?7:4)*Math.max(.75,cam.z),0,7);G.fill();if(cam.z>.58||is){G.globalAlpha=1;G.fillStyle='#dce9df';G.font=(is?'700 ':'500 ')+'10px system-ui';G.textAlign='center';G.fillText(a.name,sx(a.x),sy(a.y)-8)}G.globalAlpha=1}}
function drawLanguages(){if(cam.z<.4)return;for(const l of langs){if(!visible(l.x,l.y,100))continue;const is=hit&&hit.kind==='language'&&hit.obj===l,f=familyBy[l.family],count=lex[l.name]?.words.length||0;G.fillStyle=is?'#fff':f.c;G.globalAlpha=cam.z<.55?.7:.95;G.beginPath();G.arc(sx(l.x),sy(l.y),(is?8:4.8+Math.sqrt(count)*.18)*Math.max(.8,cam.z),0,7);G.fill();if(cam.z>.5||is){G.globalAlpha=1;G.fillStyle='#eef8f0';G.font=(is?'700 ':'600 ')+Math.max(9,11*cam.z)+'px system-ui';G.textAlign='center';G.fillText(l.name,sx(l.x),sy(l.y)-9);if(cam.z>1.03){G.fillStyle='#8fa897';G.font='8px system-ui';G.fillText(l.native,sx(l.x),sy(l.y)+12)}}G.globalAlpha=1}}
function drawLexicons(){if(cam.z<.62)return;for(const l of langs){const d=lex[l.name];if(!d||!visible(l.x,l.y,250))continue;const n=d.words.length;for(let i=0;i<n;i++){const w=d.words[i],p=microPos(l,w,i,n);if(!visible(p.x,p.y,30))continue;const is=hit&&hit.kind==='word'&&hit.lang===l&&hit.obj===w,col=COL[w.t]||'#9fc3a4';if(cam.z>.72)line(l,p,col+(cam.z>1.1?'44':'25'),.7);G.fillStyle=is?'#fff':col;G.globalAlpha=cam.z<.82?.38:.84;G.beginPath();G.arc(sx(p.x),sy(p.y),(is?6:2.7)*Math.max(.75,cam.z),0,7);G.fill();if(cam.z>1.05||is){G.globalAlpha=1;G.fillStyle='#eaf6ec';G.font=(is?'700 ':'500 ')+'9px system-ui';G.textAlign='center';G.fillText(w.f,sx(p.x),sy(p.y)-6);if((cam.z>1.72||is)&&w.ipa){G.fillStyle='#bdebc6';G.font='8px ui-monospace,monospace';G.fillText(w.ipa,sx(p.x),sy(p.y)+9)}}G.globalAlpha=1}}}
function drawEnglish(){
 if(cam.z<.58||!visible(EN.x,EN.y,700))return;
 for(const e of es){
  const a=by[e.a],b=by[e.b];
  if(!a||!b)continue;
  const A=exPos(a),B=exPos(b);
  if(!visible(A.x,A.y,50)&&!visible(B.x,B.y,50))continue;
  line(A,B,(EC[e.t]||'#79b889')+(cam.z>1?'65':'30'),cam.z>1.2?1.25:.7,e.t==='b'?[4,4]:e.t==='l'?[2,4]:null,.08);
 }
 let ph=0;
 for(const n of ns){
  const p=exPos(n);
  if(!visible(p.x,p.y,30))continue;
  const is=hit&&hit.kind==='english'&&hit.obj===n;
  G.fillStyle=is?'#fff':(LC[n.l]||'#79b889');
  G.globalAlpha=cam.z<.8?.38:.82;
  G.beginPath();G.arc(sx(p.x),sy(p.y),(is?6:2.7)*Math.max(.72,cam.z),0,7);G.fill();
  if(cam.z>1.05||is){
   G.globalAlpha=1;G.fillStyle='#eef8f0';G.font=(is?'700 ':'500 ')+'9px Georgia';G.textAlign='center';G.fillText(n.w,sx(p.x),sy(p.y)-6);
   if((cam.z>1.72||is)&&n.phon&&ph++<100){G.fillStyle='#bdebc6';G.font='8px ui-monospace,monospace';G.fillText(n.phon.text,sx(p.x),sy(p.y)+9)}
  }
  G.globalAlpha=1;
 }
 if(typeof canopy!=='undefined'&&cam.z>.82){
  const step=cam.z<1.1?8:cam.z<1.5?4:2;G.fillStyle='#d7f7d635';
  for(let i=0;i<canopy.length;i+=step){
   const q=canopy[i],p={x:EN.x+(q.x-exCx)*ES,y:EN.y+(q.y-exCy)*ES};
   if(visible(p.x,p.y,5))G.fillRect(sx(p.x),sy(p.y),1,1);
  }
 }
}
function drawGroup(){if(!cognates)return;const g=groupFor(hit);if(!g)return;const refs=g.refs.map(resolveRef).filter(Boolean);if(refs.length<2)return;let anchor=null;if(g.anchor&&ABY[g.anchor])anchor={p:ABY[g.anchor],label:g.name};else anchor=refs[0];const col=g.kind==='cognate'?'#f2d58a':'#e2a46e';for(const r of refs){if(anchor===r)continue;line(anchor.p,r.p,col+'b8',1.7,g.kind==='loan'?[6,4]:null,.06);G.fillStyle=col;G.beginPath();G.arc(sx(r.p.x),sy(r.p.y),5,0,7);G.fill()}G.fillStyle=col;G.beginPath();G.arc(sx(anchor.p.x),sy(anchor.p.y),6.5,0,7);G.fill();G.fillStyle='#fff0c5';G.font='700 10px system-ui';G.textAlign='center';G.fillText(g.name,sx(anchor.p.x),sy(anchor.p.y)-11)}
function draw(){requestAnimationFrame(draw);cam.x+=(tar.x-cam.x)*.1;cam.y+=(tar.y-cam.y)*.1;cam.z+=(tar.z-cam.z)*.1;G.fillStyle='#040806';G.fillRect(0,0,W,H);drawFamilies();drawHistorical();drawLanguages();drawLexicons();drawEnglish();drawGroup();const st=stage(),count=Object.values(lex).reduce((s,d)=>s+(d.words?.length||0),0);chip.textContent=st+' · semantic zoom · '+Object.keys(lex).length+' language forests · '+count+' multilingual lexemes';if(S)S.textContent=st.toLowerCase()+' · '+Math.round(cam.z*100)+'% · '+langs.length+' major languages · '+count+' multilingual lexemes · '+ns.length+' English graph nodes'}draw();
function clearPanel(){if(!P)return;P.dataset.phonKey='semantic';P.dataset.soundKey='semantic';P.querySelectorAll('.phon-card,.sound-card').forEach(e=>e.remove())}
function relatives(g){return g.refs.map(resolveRef).filter(Boolean).map(r=>r.lang+': '+r.form).join(' · ')}
function panelLanguage(l){clearPanel();const d=lex[l.name],f=familyBy[l.family];P.innerHTML=`<div class="eye">semantic world · language</div><h2>${l.name}</h2><p>${l.native}<br>${f.name} · ${l.branch}<br>${l.script}</p><div class="meta">${d?d.words.length+' starter lexemes loaded around this node.':'Word forest not expanded yet.'}<br>${l.history}<br>Zoom closer to reveal words, then IPA.</div>`}
function panelAncestor(a){clearPanel();P.innerHTML=`<div class="eye">historical stage</div><h2>${a.name}</h2><p>${familyBy[a.family]?.name||''}</p><div class="meta">Family and historical structure remains visible at every zoom; lower-level detail fades in as you approach.</div>`}
function panelWord(l,w){clearPanel();const g=groupFor({kind:'word',lang:l,obj:w});P.innerHTML=`<div class="eye">${l.name} · lexeme</div><h2>${w.f}</h2><p>${w.r&&w.r!==w.f?w.r+' · ':''}${w.ipa||''}<br><b>${w.g}</b></p><div class="meta">${String(w.t||'').toUpperCase()} · ${w.src||''}${g?'<br><br><b>'+(g.kind==='cognate'?'COGNATE WEB':'BORROWING WEB')+'</b><br>'+relatives(g):''}</div>`}
function panelEnglish(n){clearPanel();const g=groupFor({kind:'english',obj:n}),A=anc(n),D=des(n),phon=n.phon?'<br><span style="font:600 15px ui-monospace,monospace;color:#bdebc6">'+n.phon.text+'</span>':'';P.innerHTML=`<div class="eye">English etymology</div><h2>${n.w}</h2><p>${n.l} · ${n.era}<br>${n.m}${phon}</p><div class="meta">ANCESTORS ${A.size} · DESCENDANTS ${D.size}${g?'<br><br><b>COGNATE / LOAN WEB</b><br>'+relatives(g):''}</div>`}
function focus(x,y,z=.9){tar.x=x;tar.y=y;tar.z=Math.max(tar.z,z)}
function chooseAt(px,py){let best=null,dist=25;for(const l of langs){const q=Math.hypot(sx(l.x)-px,sy(l.y)-py);if(q<dist){dist=q;best={kind:'language',obj:l}}}for(const a of ancestors){const q=Math.hypot(sx(a.x)-px,sy(a.y)-py);if(q<dist){dist=q;best={kind:'ancestor',obj:a}}}if(cam.z>.6)for(const l of langs){const d=lex[l.name];if(!d)continue;for(let i=0;i<d.words.length;i++){const w=d.words[i],p=microPos(l,w,i,d.words.length),q=Math.hypot(sx(p.x)-px,sy(p.y)-py);if(q<dist){dist=q;best={kind:'word',lang:l,obj:w,p}}}}if(cam.z>.62)for(const n of ns){const p=exPos(n),q=Math.hypot(sx(p.x)-px,sy(p.y)-py);if(q<dist){dist=q;best={kind:'english',obj:n,p}}}return best}
function select(h){if(!h)return;hit=h;if(h.kind==='language'){panelLanguage(h.obj);focus(h.obj.x,h.obj.y,.72)}else if(h.kind==='ancestor'){panelAncestor(h.obj);focus(h.obj.x,h.obj.y,.72)}else if(h.kind==='word'){panelWord(h.lang,h.obj);focus(h.p.x,h.p.y,1.15)}else if(h.kind==='english'){panelEnglish(h.obj);focus(h.p.x,h.p.y,1.15)}}
function search(q){q=q.trim().toLowerCase();if(!q)return false;let l=langs.find(x=>x.name.toLowerCase()===q||x.native.toLowerCase()===q)||langs.find(x=>x.name.toLowerCase().startsWith(q));if(l){select({kind:'language',obj:l});return true}let a=ancestors.find(x=>x.name.toLowerCase().includes(q));if(a){select({kind:'ancestor',obj:a});return true}let en=ns.find(n=>n.w.toLowerCase()===q);if(en){select({kind:'english',obj:en,p:exPos(en)});return true}for(const l of langs){const d=lex[l.name];if(!d)continue;const w=d.words.find(w=>[w.f,w.r,w.g].some(s=>String(s||'').toLowerCase()===q))||d.words.find(w=>[w.f,w.r,w.g].some(s=>String(s||'').toLowerCase().startsWith(q)));if(w){select({kind:'word',lang:l,obj:w,p:microPos(l,w,d.words.indexOf(w),d.words.length)});return true}}return false}
U.onpointerdown=e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);U.setPointerCapture(e.pointerId);moved=0};
U.onpointermove=e=>{if(!pts.has(e.pointerId))return;const old=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===1){const dx=e.clientX-old[0],dy=e.clientY-old[1];if(Math.hypot(dx,dy)>2)moved=1;cam.x=tar.x-=dx/cam.z;cam.y=tar.y-=dy/cam.z}else{const p=[...pts.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]),mx=(p[0][0]+p[1][0])/2,my=(p[0][1]+p[1][1])/2;if(pinch){const bx=wx(mx),by=wy(my),z=Math.max(.18,Math.min(3.4,cam.z*d/pinch));cam.z=tar.z=z;cam.x=tar.x=bx-(mx-W/2)/z;cam.y=tar.y=by-(my-H/2)/z}pinch=d;moved=1}};
function up(e){pts.delete(e.pointerId);if(pts.size<2)pinch=0}U.onpointerup=up;U.onpointercancel=up;
U.addEventListener('wheel',e=>{e.preventDefault();const bx=wx(e.clientX),by=wy(e.clientY),z=Math.max(.18,Math.min(3.4,cam.z*Math.exp(-e.deltaY*.0012)));cam.z=tar.z=z;cam.x=tar.x=bx-(e.clientX-W/2)/z;cam.y=tar.y=by-(e.clientY-H/2)/z},{passive:false});
U.onclick=e=>{if(moved)return;select(chooseAt(e.clientX,e.clientY))};
function replace(id,handler,label){const o=document.querySelector(id);if(!o)return null;const n=o.cloneNode(true);if(label)n.textContent=label;o.replaceWith(n);n.onclick=handler;return n}
const qOld=document.querySelector('#q'),q=qOld?.cloneNode(true);if(qOld&&q){qOld.replaceWith(q);q.onkeydown=e=>{if(e.key==='Enter'&&!search(q.value))toast('Not loaded yet')}}const go=replace('#go',()=>{if(!search(q?.value||''))toast('Not loaded yet')});
replace('#atlas',()=>{tar={x:430,y:100,z:.33};hit=null;clearPanel();P.innerHTML='<div class="eye">semantic world</div><h2>World Language Forest</h2><p>Zoom continuously from families into words and pronunciation.</p><div class="meta">Select a cognate-rich word such as father, mother, night, water, tea, كتاب, or coffee to light a cross-language web.</div>'},'Atlas');
replace('#home',()=>{tar={x:EN.x,y:EN.y,z:.78};hit={kind:'language',obj:EN};panelLanguage(EN)},'English');
const wb=replace('#worldMode',()=>{tar={x:430,y:100,z:.33};hit=null},'World');
const cog=document.createElement('button');cog.id='cognateBtn';cog.className='on';cog.textContent='Cognates';cog.title='Toggle cross-language cognate and borrowing webs';document.querySelector('.btns')?.insertBefore(cog,document.querySelector('#ipa-toggle'));cog.onclick=()=>{cognates=!cognates;cog.classList.toggle('on',cognates)};
document.body.classList.add('semantic-world');const sm=document.querySelector('.brand small');if(sm)sm.textContent='Phase 5.6 · semantic zoom + cognate webs + multilingual expansion';
P.innerHTML='<div class="eye">semantic world</div><h2>World Language Forest</h2><p>Families, languages, word forests, IPA, and sound history now reveal themselves by scale.</p><div class="meta">All major language nodes in this build now have multilingual starter data except English, which retains its deeper graph. Search a language or word.</div>';
})();