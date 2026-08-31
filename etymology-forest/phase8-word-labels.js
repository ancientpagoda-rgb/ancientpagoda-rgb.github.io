(function(){'use strict';
// Visible word labels for the resolving corpus grove.  The clean world still hides
// interface text, but word nodes themselves are linguistic data and stay readable.
const css=document.createElement('style');css.textContent=`#wordLabels{position:fixed;inset:0;z-index:8;width:100%;height:100%;pointer-events:none!important;background:transparent!important}`;document.head.appendChild(css);
const U=document.createElement('canvas');U.id='wordLabels';document.body.appendChild(U);const G=U.getContext('2d',{alpha:true});
let W=0,H=0,D=1,lastKey='',lastBuild=0,labels=[];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),fade=(z,a,b)=>clamp((z-a)/(b-a),0,1);
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
function rebuild(api,c){const lim=limits(c.z);if(!lim.nodes){labels=[];return}const rx=(W/2+120)/c.z,ry=(H/2+120)/c.z,raw=api.query(c.x-rx,c.y-ry,c.x+rx,c.y+ry,lim.candidates);for(const q of raw){const s=point(q,c),dx=s.x-W/2,dy=s.y-H/2;q.sx=s.x;q.sy=s.y;q.score=dx*dx+dy*dy+(q.id%997)*1e-7}raw.sort((a,b)=>a.score-b.score);const candidates=raw.slice(0,lim.nodes),font=Math.round(clamp(9.5+(c.z-8)*.28,10,13)),boxes=[],out=[];G.font=`600 ${font}px system-ui,-apple-system,sans-serif`;G.textAlign='center';G.textBaseline='middle';for(const q of candidates){const word=api.wordAt(q.id);if(!word||word.length>28)continue;const width=Math.ceil(G.measureText(word).width)+10,height=font+7,b={l:q.sx-width/2,r:q.sx+width/2,t:q.sy-font-18,b:q.sy-3};if(boxes.some(x=>overlaps(b,x)))continue;boxes.push(b);out.push({id:q.id,word,x:q.x,y:q.y,font})}labels=out}
function draw(){requestAnimationFrame(draw);G.clearRect(0,0,W,H);const api=window.__allWordsField;if(!api?.ready||!RAW_FILL)return;const c=api.camera,z=c.z;if(z<8){labels=[];lastKey='';return}const key=[Math.round(c.x*2),Math.round(c.y*2),Math.round(z*12),W,H].join('|'),now=performance.now();if((key!==lastKey&&now-lastBuild>70)||!labels.length){lastKey=key;lastBuild=now;rebuild(api,c)}const takeover=1-fade(z,15.15,16.1);if(takeover<=0)return;G.textAlign='center';G.textBaseline='middle';G.lineJoin='round';for(const q of labels){const s=point(q,c);if(s.x<-100||s.x>W+100||s.y<-40||s.y>H+40)continue;const alpha=(.38+.58*fade(z,8,10.5))*takeover;G.globalAlpha=alpha;G.font=`600 ${q.font}px system-ui,-apple-system,sans-serif`;G.lineWidth=3.5;G.strokeStyle='rgba(4,8,6,.94)';RAW_STROKE.call(G,q.word,s.x,s.y-10);G.fillStyle='rgba(241,249,242,.98)';RAW_FILL.call(G,q.word,s.x,s.y-10);G.globalAlpha=alpha*.92;G.strokeStyle='rgba(190,229,197,.75)';G.lineWidth=1;G.beginPath();G.moveTo(s.x,s.y-4);G.lineTo(s.x,s.y-1);G.stroke()}G.globalAlpha=1}
draw();
})();