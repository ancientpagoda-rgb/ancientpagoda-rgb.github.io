(function(){'use strict';
// Semantic word-label scale. The corpus layout already spreads apart with zoom;
// this layer lets the readable word glyphs grow too without changing corpus identity.
const ALL_Z=52,MAX_Z=160;
function targetFont(z){
  if(z<18)return 0;
  if(z<ALL_Z)return 12+4*((z-18)/(ALL_Z-18));
  const t=Math.max(0,Math.min(1,(z-ALL_Z)/(MAX_Z-ALL_Z)));
  const max=innerWidth<760?40:48;
  return 16+(max-16)*Math.pow(t,.72);
}
function tick(){
  requestAnimationFrame(tick);
  const api=window.__allWordsField,layer=window.__wordLabelLayer;
  if(!api?.ready||!layer)return;
  const z=api.camera?.z||0,want=targetFont(z);if(!want)return;
  const all=!!layer.allMode;
  for(const q of layer.labels){
    if(!q.__zoomBase)q.__zoomBase={font:q.font||12,dx:q.dx||0,dy:q.dy??-10};
    const b=q.__zoomBase,font=Math.max(b.font,want),scale=font/Math.max(1,b.font);
    q.font=font;
    if(all){q.dx=b.dx*scale;q.dy=b.dy*scale;}
    else{q.dx=b.dx;q.dy=b.dy;}
  }
}
tick();
window.__wordZoomScale={allWordsZoom:ALL_Z,maxZoom:MAX_Z,targetFont};
})();