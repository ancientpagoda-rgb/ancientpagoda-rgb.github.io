(function(){'use strict';
// Deep clean-view zoom. The ancestry renderer and the all-word field both use
// Math.min(3.4, nextZoom) as their interactive ceiling. In clean mode only,
// transparently raise that shared ceiling so their cameras remain synchronized.
// 160x is intentionally large: dense corpus groves need enough screen space for
// every local word to resolve into an individual readable/selectable node.
const MAX_Z=160;
const realMin=Math.min;
if(!Math.__etymDeepZoomPatched){
  const patched=function(){
    const a=Array.from(arguments);
    if(document.body?.classList.contains('clean-world')&&a.length===2&&a[0]===3.4)a[0]=MAX_Z;
    return realMin.apply(Math,a);
  };
  patched.__etymOriginal=realMin;
  Math.min=patched;
  Math.__etymDeepZoomPatched=true;
}
window.__etymMaxZoom=MAX_Z;

// Clean view is the language/word ancestry universe, not the historical map UI.
// This also guarantees the word-density camera is following the same pointer
// target as the ancestry camera at every zoom level.
document.body.classList.remove('geo-world','contact-world','bulk-world','world-mode');
document.body.classList.add('writing-world','clean-world','deep-zoom-world');
const css=document.createElement('style');css.textContent=`
body.deep-zoom-world #geoUniverse,
body.deep-zoom-world #contactUniverse,
body.deep-zoom-world #bulkUniverse,
body.deep-zoom-world #timeUniverse,
body.deep-zoom-world #worldLangLayer,
body.deep-zoom-world #lexiconLayer,
body.deep-zoom-world #unifiedUniverse,
body.deep-zoom-world #semanticUniverse,
body.deep-zoom-world #c{display:none!important;pointer-events:none!important}
body.deep-zoom-world #writingUniverse{display:block!important;opacity:1!important;pointer-events:auto!important}
body.deep-zoom-world #allWordsField{display:block!important;pointer-events:none!important}
`;
document.head.appendChild(css);

// The all-word layer is a pre-rasterized representation of millions of points.
// At neighborhood scale smoothing is useful; at deep scale it becomes foggy.
// Intercept only that canvas's draw calls and preserve hard point boundaries once
// its projected world image is large enough to represent individual corpus mass.
const proto=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
if(proto&&!proto.__etymDeepFieldPatched){
  proto.__etymDeepFieldPatched=true;
  const raw=proto.drawImage;
  proto.drawImage=function(){
    if(this.canvas?.id!=='allWordsField')return raw.apply(this,arguments);
    const a=arguments;
    const targetW=a.length>=5?Math.abs(+a[a.length-2]||0):0;
    if(targetW<14500)return raw.apply(this,a);
    const smooth=this.imageSmoothingEnabled,filter=this.filter;
    this.imageSmoothingEnabled=false;
    if(filter&&filter!=='none')this.filter='none';
    const out=raw.apply(this,a);
    this.imageSmoothingEnabled=smooth;
    this.filter=filter;
    return out;
  };
}
})();