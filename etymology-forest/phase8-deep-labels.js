(function(){'use strict';
// Deep semantic LOD: the corpus remains a point field at normal scale, then real
// nearby corpus words resolve into readable labels. No controls or info overlays.
const css=document.createElement('style');css.textContent=`#deepWordLabels{position:fixed;inset:0;z-index:6;width:100%;height:100%;pointer-events:none!important;background:transparent!important}`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='deepWordLabels';document.body.appendChild(U),G=U.getContext('2d',{alpha:true});
let W=0,H=0,D=1,lastKey='',lastBuild=0,placed=[];
function resize(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,1.8);U.width=Math.floor(W*D);U.height=Math.floor(H*D);G.setTransform(D,0,0,D,0,0);lastKey=''}resize();addEventListener('resize',resize);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),fade=(z,a,b)=>clamp((z-a)/(b-a),0,1);
function overlaps(a,b,p=3){return!(a.r+p<b.l||a.l-p>b.r||a.b+p<b.t||a.t-p>b.b)}
function originalText(){const p=window.CanvasRenderingContext2D?.prototype;return{fill:p?.__etymOriginalFillText||p?.fillText,stroke:p?.__etymOriginalStrokeText||p?.strokeText}}
function limits(z){if(z<8)return{labels:0,candidates:0};if(z<12)return{labels:30,candidates:700};if(z<18)return{labels:80,candidates:1500};return{labels:180,candidates:3200}}
function rebuild(api,c){const z=c.z,lim=limits(z);if(!lim.labels){placed=[];return}const pad=90/z,x0=c.x-(W/2+90)/z,x1=c.x+(W/2+90)/z,y0=c.y-(H/2+90)/z,y1=c.y+(H/2+90)/z,raw=api.query(x0-pad,y0-pad,x1+pad,y1+pad,lim.candidates),cx=W/2,cy=H/2;
 for(const q of raw){q.sx=(q.x-c.x)*z+cx;q.sy=(q.y-c.y)*z+cy;const dx=(q.sx-cx)/Math.max(1,W),dy=(q.sy-cy)/Math.max(1,H);q.score=dx*dx+dy*dy+(q.id%997)*1e-9}
 raw.sort((a,b)=>a.score-b.score);const target=Math.min(raw.length,lim.labels*5),font=Math.round(clamp(9.5+(z-8)*.27,10,14)),boxes=[],out=[];G.font=`600 ${font}px system-ui,-apple-system,sans-serif`;G.textAlign='center';G.textBaseline='middle';
 for(let i=0;i<target&&out.length<lim.labels;i++){const q=raw[i],word=api.wordAt(q.id);if(!word||word.length>28)continue;const width=Math.ceil(G.measureText(word).width)+8,height=font+6,b={l:q.sx-width/2,r:q.sx+width/2,t:q.sy-height/2,b:q.sy+height/2};let hit=false;for(const x of boxes)if(overlaps(b,x)){hit=true;break}if(hit)continue;boxes.push(b);out.push({id:q.id,x:q.x,y:q.y,word,font})}
 placed=out}
function draw(){requestAnimationFrame(draw);G.clearRect(0,0,W,H);const api=window.__allWordsField;if(!api?.ready)return;const c=api.camera,z=c.z;if(z<8){placed=[];lastKey='';return}const key=[Math.round(c.x*2),Math.round(c.y*2),Math.round(z*12),W,H].join('|'),now=performance.now();if((key!==lastKey&&now-lastBuild>85)||!placed.length){lastKey=key;lastBuild=now;rebuild(api,c)}const t=originalText();if(!t.fill)return;const alpha=.18+.82*fade(z,8,10.5),fontBoost=z>18?1:0;G.textAlign='center';G.textBaseline='middle';G.lineJoin='round';for(const p of placed){const x=(p.x-c.x)*z+W/2,y=(p.y-c.y)*z+H/2;if(x<-80||x>W+80||y<-30||y>H+30)continue;const f=p.font+fontBoost;G.font=`600 ${f}px system-ui,-apple-system,sans-serif`;G.globalAlpha=alpha;G.lineWidth=3.5;G.strokeStyle='rgba(4,8,6,.9)';if(t.stroke)t.stroke.call(G,p.word,x,y);G.fillStyle='rgba(238,248,240,.96)';t.fill.call(G,p.word,x,y)}G.globalAlpha=1}
draw();
})();