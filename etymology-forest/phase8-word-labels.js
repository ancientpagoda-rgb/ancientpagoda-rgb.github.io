(function(){'use strict';
// Visible word labels for the resolving corpus grove. The clean world still hides
// interface text, but word nodes themselves are linguistic data and stay readable.
// Tapping/clicking a visible word opens a contextual information panel.
const css=document.createElement('style');css.textContent=`
#wordLabels{position:fixed;inset:0;z-index:8;width:100%;height:100%;pointer-events:none!important;background:transparent!important}
#wordInfoPanel{position:fixed;z-index:40;left:50%;bottom:max(12px,env(safe-area-inset-bottom));width:min(440px,calc(100vw - 24px));max-height:min(58vh,520px);overflow:auto;transform:translate(-50%,calc(100% + 32px));opacity:0;pointer-events:none;padding:16px 17px 15px;border:1px solid rgba(143,183,212,.22);border-radius:18px;background:rgba(6,14,10,.94);box-shadow:0 18px 55px rgba(0,0,0,.55);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);transition:transform .24s ease,opacity .2s ease;color:#eaf4ec;font-family:system-ui,-apple-system,sans-serif}
#wordInfoPanel.open{transform:translate(-50%,0);opacity:1;pointer-events:auto}
#wordInfoPanel .wi-word{font:700 clamp(24px,7vw,36px) Georgia,serif;line-height:1.05;overflow-wrap:anywhere}
#wordInfoPanel .wi-lang{margin-top:5px;color:#a8c7ae;font:600 12px/1.35 system-ui;letter-spacing:.02em}
#wordInfoPanel .wi-grid{display:grid;grid-template-columns:1fr;gap:9px;margin-top:13px}
#wordInfoPanel .wi-section{padding:9px 10px;border:1px solid rgba(143,183,212,.13);border-radius:11px;background:rgba(16,31,23,.55)}
#wordInfoPanel .wi-label{color:#769182;font:700 8px/1.2 system-ui;letter-spacing:.11em;text-transform:uppercase}
#wordInfoPanel .wi-value{margin-top:4px;color:#e6f1e8;font:12px/1.42 system-ui;overflow-wrap:anywhere}
#wordInfoPanel .wi-ipa{font:500 15px/1.35 Georgia,serif;color:#f1f8f2}
#wordInfoPanel .wi-muted{color:#73877d}
#wordInfoPanel .wi-meta{margin-top:11px;padding-top:10px;border-top:1px solid rgba(143,183,212,.14);color:#8fa49a;font:10px/1.45 system-ui}
#wordInfoPanel .wi-hint{margin-top:8px;color:#667c70;font:9px/1.35 system-ui}
@media(max-height:520px){#wordInfoPanel{left:auto;right:12px;bottom:12px;width:min(380px,46vw);max-height:calc(100vh - 24px);transform:translateX(calc(100% + 32px))}#wordInfoPanel.open{transform:none}}
`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='wordLabels';document.body.appendChild(U);const G=U.getContext('2d',{alpha:true});
const INFO=document.createElement('div');INFO.id='wordInfoPanel';INFO.setAttribute('aria-live','polite');document.body.appendChild(INFO);
let W=0,H=0,D=1,lastKey='',lastBuild=0,labels=[],hitRegions=[],selectedId=-1,down=null,lookupSeq=0;
const LOOKUP_CACHE=new Map();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),fade=(z,a,b)=>clamp((z-a)/(b-a),0,1);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function resize(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,1.8);U.width=Math.floor(W*D);U.height=Math.floor(H*D);G.setTransform(D,0,0,D,0,0);lastKey=''}resize();addEventListener('resize',resize);
const proto=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
const RAW_FILL=proto&&proto.__etymOriginalFillText,RAW_STROKE=proto&&proto.__etymOriginalStrokeText;
// The structural deep renderer already had a sparse-label pass. Suppress only that
// pass before the ancestry-grove stage so this denser attached-label layer owns it.
if(proto&&RAW_FILL&&RAW_STROKE&&!proto.__etymWordLabelRedirect){
 proto.__etymWordLabelRedirect=true;
 proto.__etymOriginalFillText=function(){const z=window.__allWordsField?.camera?.z||0;if(this?.canvas?.id==='deepWordLabels'&&z<15.5)return;return RAW_FILL.apply(this,arguments)};
 proto.__etymOriginalStrokeText=function(){const z=window.__allWordsField?.camera?.z||0;if(this?.canvas?.id==='deepWordLabels'&&z<15.5)return;return RAW_STROKE.apply(this,arguments)};
}
function overlaps(a,b,p=3){return!(a.r+p<b.l||a.l-p>b.r||a.b+p<b.t||a.t-p>b.b)}
function limits(z){if(z<8)return{nodes:0,candidates:0};if(z<11)return{nodes:45,candidates:700};if(z<14)return{nodes:75,candidates:1200};if(z<17)return{nodes:105,candidates:1800};return{nodes:130,candidates:2400}}
function point(q,c){const spread=1+.34*fade(c.z,10,16),x0=(q.x-c.x)*c.z+W/2,y0=(q.y-c.y)*c.z+H/2;return{x:W/2+(x0-W/2)*spread,y:H/2+(y0-H/2)*spread}}
function rebuild(api,c){const lim=limits(c.z);if(!lim.nodes){labels=[];return}const rx=(W/2+120)/c.z,ry=(H/2+120)/c.z,raw=api.query(c.x-rx,c.y-ry,c.x+rx,c.y+ry,lim.candidates);for(const q of raw){const s=point(q,c),dx=s.x-W/2,dy=s.y-H/2;q.sx=s.x;q.sy=s.y;q.score=dx*dx+dy*dy+(q.id%997)*1e-7}raw.sort((a,b)=>a.score-b.score);const candidates=raw.slice(0,lim.nodes),font=Math.round(clamp(9.5+(c.z-8)*.28,10,13)),boxes=[],out=[];G.font=`600 ${font}px system-ui,-apple-system,sans-serif`;G.textAlign='center';G.textBaseline='middle';for(const q of candidates){const word=api.wordAt(q.id);if(!word||word.length>28)continue;const width=Math.ceil(G.measureText(word).width)+10,b={l:q.sx-width/2,r:q.sx+width/2,t:q.sy-font-18,b:q.sy-3};if(boxes.some(x=>overlaps(b,x)))continue;boxes.push(b);out.push({id:q.id,word,x:q.x,y:q.y,font})}labels=out}
function codepoints(s,n){return Array.from(String(s||'').normalize('NFC')).slice(0,n).join('')}
function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
function kaikkiURL(language,word){const w=word.trim().normalize('NFC'),a=codepoints(w,1),b=codepoints(w,2);return `https://kaikki.org/dictionary/${encodeURIComponent(language)}/meaning/${encodeURIComponent(a)}/${encodeURIComponent(b)}/${encodeURIComponent(w)}.jsonl`}
function firstIPA(o){for(const x of (o?.sounds||[]))if(x&&x.ipa)return clean(x.ipa);return''}
function firstRomanization(o){return clean(o?.romanization||o?.roman||'')}
function firstGloss(o){for(const s of (o?.senses||[])){const g=(s.glosses||[])[0]||(s.raw_glosses||[])[0];if(g)return clean(g)}return''}
function parseJSONL(text,language){const rows=[];for(const line of text.split(/\r?\n/)){if(!line.trim())continue;try{const o=JSON.parse(line);if(!o.lang||o.lang===language)rows.push(o)}catch(_){}}if(!rows.length)return null;rows.sort((a,b)=>{const sa=(firstIPA(a)?2:0)+(firstGloss(a)?1:0),sb=(firstIPA(b)?2:0)+(firstGloss(b)?1:0);return sb-sa});return rows[0]}
async function lookupLexical(language,word){const key=language+'\u0000'+word;if(LOOKUP_CACHE.has(key))return LOOKUP_CACHE.get(key);const p=(async()=>{try{const r=await fetch(kaikkiURL(language,word),{mode:'cors',cache:'force-cache'});if(!r.ok)throw new Error('Kaikki '+r.status);const o=parseJSONL(await r.text(),language);if(!o)throw new Error('no matching entry');return{meaning:firstGloss(o),ipa:firstIPA(o),roman:firstRomanization(o),pos:clean(o.pos||''),provider:'Kaikki/Wiktextract · English Wiktionary'}}catch(_){return{meaning:'',ipa:'',roman:'',pos:'',provider:'Wiktionary-derived corpus'}}})();LOOKUP_CACHE.set(key,p);return p}
function panelHTML(id,word,lang,data,loading=false){const meaning=loading?'Looking up English meaning…':(data?.meaning||'No English gloss available for this corpus entry.');const pron=loading?'Looking up pronunciation…':(data?.ipa||'No IPA pronunciation available for this entry.');const roman=!loading&&data?.roman&&data.roman!==word?`<div class="wi-value">Romanization: ${esc(data.roman)}</div>`:'';const pos=!loading&&data?.pos?` · ${esc(data.pos)}`:'';return `<div class="wi-word">${esc(word)}</div><div class="wi-lang">${esc(lang)}${pos}</div><div class="wi-grid"><div class="wi-section"><div class="wi-label">English meaning / translation</div><div class="wi-value${!loading&&!data?.meaning?' wi-muted':''}">${esc(meaning)}</div></div><div class="wi-section"><div class="wi-label">Pronunciation</div><div class="wi-value wi-ipa${!loading&&!data?.ipa?' wi-muted':''}">${esc(pron)}</div>${roman}</div></div><div class="wi-meta">${esc(data?.provider||'Full Wiktionary-derived etymology corpus')} · corpus node ${id.toLocaleString()}</div><div class="wi-hint">Tap another word to inspect it · tap empty space to close</div>`}
async function panelFor(id){const api=window.__allWordsField;if(!api?.ready||id<0)return;const word=api.wordAt(id),lang=api.languageOf(id)||'Unknown language';if(!word)return;selectedId=id;const seq=++lookupSeq;INFO.innerHTML=panelHTML(id,word,lang,null,true);INFO.classList.add('open');const data=await lookupLexical(lang,word);if(seq!==lookupSeq||selectedId!==id)return;INFO.innerHTML=panelHTML(id,word,lang,data,false)}
function closePanel(){selectedId=-1;lookupSeq++;INFO.classList.remove('open')}
function hitTest(x,y){let best=null,bd=Infinity;for(const h of hitRegions){if(x<h.l-8||x>h.r+8||y<h.t-10||y>h.b+10)continue;const dx=x-h.x,dy=y-h.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=h}}return best}
function draw(){requestAnimationFrame(draw);G.clearRect(0,0,W,H);hitRegions=[];const api=window.__allWordsField;if(!api?.ready||!RAW_FILL)return;const c=api.camera,z=c.z;if(z<8){labels=[];lastKey='';if(selectedId>=0)closePanel();return}const key=[Math.round(c.x*2),Math.round(c.y*2),Math.round(z*12),W,H].join('|'),now=performance.now();if((key!==lastKey&&now-lastBuild>70)||!labels.length){lastKey=key;lastBuild=now;rebuild(api,c)}const takeover=1-fade(z,15.15,16.1);if(takeover<=0)return;G.textAlign='center';G.textBaseline='middle';G.lineJoin='round';for(const q of labels){const s=point(q,c);if(s.x<-100||s.x>W+100||s.y<-40||s.y>H+40)continue;const alpha=(.38+.58*fade(z,8,10.5))*takeover;G.globalAlpha=alpha;G.font=`600 ${q.font}px system-ui,-apple-system,sans-serif`;const mw=Math.ceil(G.measureText(q.word).width),cx=s.x,cy=s.y-10;hitRegions.push({id:q.id,x:cx,y:cy,l:cx-mw/2,r:cx+mw/2,t:cy-q.font/2-4,b:cy+q.font/2+4});G.lineWidth=3.5;G.strokeStyle=selectedId===q.id?'rgba(211,247,218,.98)':'rgba(4,8,6,.94)';RAW_STROKE.call(G,q.word,cx,cy);G.fillStyle=selectedId===q.id?'rgba(255,255,255,1)':'rgba(241,249,242,.98)';RAW_FILL.call(G,q.word,cx,cy);G.globalAlpha=alpha*.92;G.strokeStyle='rgba(190,229,197,.75)';G.lineWidth=1;G.beginPath();G.moveTo(s.x,s.y-4);G.lineTo(s.x,s.y-1);G.stroke()}G.globalAlpha=1}
draw();
// Listen above the underlying pan/zoom canvases without intercepting their pointer events.
addEventListener('pointerdown',e=>{if(e.target===INFO||INFO.contains(e.target)){down=null;return}if(!(e.target instanceof HTMLCanvasElement)){down=null;return}down={x:e.clientX,y:e.clientY,id:e.pointerId}},true);
addEventListener('pointerup',e=>{if(!down||down.id!==e.pointerId)return;const d=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(d>9)return;const hit=hitTest(e.clientX,e.clientY);if(hit)panelFor(hit.id);else if(!INFO.contains(e.target))closePanel()},true);
addEventListener('pointercancel',()=>{down=null},true);
window.__wordLabelLayer={get labels(){return labels.slice()},get hits(){return hitRegions.slice()},open:panelFor,close:closePanel};
})();