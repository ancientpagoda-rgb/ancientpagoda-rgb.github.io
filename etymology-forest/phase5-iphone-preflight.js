(function(){'use strict';
const nav=navigator||{};
const iphone=/iPhone|iPod/i.test(nav.userAgent||'')||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1&&Math.min(screen.width,screen.height)<500);
const compact=iphone||matchMedia('(max-width:760px) and (pointer:coarse)').matches;
if(!compact)return;
const originalDPR=window.devicePixelRatio||1;
const dprCap=iphone?1.35:1.5;
let dprPatched=false;
try{Object.defineProperty(window,'devicePixelRatio',{configurable:true,get:()=>Math.min(originalDPR,dprCap)});dprPatched=true}catch(_){ }
const nativeRAF=window.requestAnimationFrame.bind(window);
const nativeCAF=window.cancelAnimationFrame.bind(window);
const frameMS=1000/(iphone?45:50);
const lastByCallback=new WeakMap();
const pending=new Map();let seq=1;
window.requestAnimationFrame=function(cb){
  const id=seq++;
  const run=t=>{
    if(!pending.has(id))return;
    const last=lastByCallback.get(cb)||0;
    if(t-last>=frameMS-1){lastByCallback.set(cb,t);pending.delete(id);cb(t)}
    else pending.set(id,nativeRAF(run));
  };
  pending.set(id,nativeRAF(run));return id;
};
window.cancelAnimationFrame=function(id){const real=pending.get(id);if(real!=null){pending.delete(id);nativeCAF(real)}};
window.__etymMobileProfile={enabled:true,iphone,originalDPR,dprCap,dprPatched,targetFPS:iphone?45:50};
document.documentElement.classList.add('etym-mobile-preflight');
const style=document.createElement('style');style.textContent=`
html.etym-mobile-preflight,html.etym-mobile-preflight body{height:100dvh;overscroll-behavior:none;-webkit-text-size-adjust:100%}
html.etym-mobile-preflight body{position:fixed;inset:0;width:100%;touch-action:none}
html.etym-mobile-preflight canvas{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html.etym-mobile-preflight input,html.etym-mobile-preflight button{touch-action:manipulation}
html.etym-mobile-preflight .g{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:0 8px 22px #0007!important}
`;
document.head.appendChild(style);
try{document.addEventListener('gesturestart',e=>{if(!e.target.closest('input'))e.preventDefault()},{passive:false})}catch(_){ }
})();