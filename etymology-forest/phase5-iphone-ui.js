(function(){'use strict';
const profile=window.__etymMobileProfile;
if(!profile?.enabled)return;
document.body.classList.add('iphone-optimized');
const css=document.createElement('style');css.textContent=`
body.iphone-optimized{height:100dvh;min-height:100dvh;overflow:hidden;background:#040806;padding:0}
body.iphone-optimized .top{top:max(8px,env(safe-area-inset-top));left:max(8px,env(safe-area-inset-left));right:max(8px,env(safe-area-inset-right));display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:start}
body.iphone-optimized .brand{min-width:0;padding:8px 10px;border-radius:12px;overflow:hidden}
body.iphone-optimized .brand b{font-size:10px;letter-spacing:.095em;white-space:nowrap}
body.iphone-optimized .brand small{display:none!important}
body.iphone-optimized .btns{grid-column:2;grid-row:1;display:flex;gap:4px;max-width:58vw;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 0 2px;margin:0;justify-content:flex-end}
body.iphone-optimized .btns::-webkit-scrollbar{display:none}
body.iphone-optimized .btns button,body.iphone-optimized .search button{min-width:44px;min-height:44px;padding:8px 10px;border-radius:11px;font-size:11px;white-space:nowrap}
body.iphone-optimized .search{grid-column:1 / -1;grid-row:2;max-width:none;width:100%;padding:4px 5px;border-radius:13px}
body.iphone-optimized .search input{height:42px;padding:8px 9px;font-size:16px;line-height:22px;user-select:text;-webkit-user-select:text;touch-action:manipulation}
body.iphone-optimized .status{top:calc(max(8px,env(safe-area-inset-top)) + 102px);left:max(9px,env(safe-area-inset-left));max-width:calc(100vw - 18px);padding:6px 8px;border-radius:9px;font-size:8px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.82}
body.iphone-optimized .writing-chip,body.iphone-optimized .semantic-chip,body.iphone-optimized .unified-chip,body.iphone-optimized .world-chip{top:calc(max(8px,env(safe-area-inset-top)) + 128px)!important;left:max(9px,env(safe-area-inset-left))!important;right:max(9px,env(safe-area-inset-right));max-width:none!important;font-size:8px!important;padding:5px 7px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.76}
body.iphone-optimized .writing-key,body.iphone-optimized .legend,body.iphone-optimized .layer-rail{display:none!important}
body.iphone-optimized .panel{left:max(8px,env(safe-area-inset-left));right:max(8px,env(safe-area-inset-right));bottom:calc(env(safe-area-inset-bottom) + 62px);width:auto;max-height:min(44dvh,430px);padding:14px;border-radius:18px;transform:translateY(calc(100% + 80px));opacity:0;pointer-events:none;transition:transform .22s ease,opacity .18s ease;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:#07120cf4!important}
body.iphone-optimized.mobile-panel-open .panel{transform:translateY(0);opacity:1;pointer-events:auto}
body.iphone-optimized .panel h2{font-size:25px;line-height:1.04;margin:4px 0 7px}
body.iphone-optimized .panel p{font-size:12px;line-height:1.42;margin:6px 0}
body.iphone-optimized .panel .meta{font-size:9.5px;line-height:1.45}
body.iphone-optimized #mobilePanelToggle{position:fixed;z-index:10;right:max(10px,env(safe-area-inset-right));bottom:calc(max(10px,env(safe-area-inset-bottom)) + 2px);min-width:58px;height:46px;padding:0 13px;border-radius:14px;border:1px solid #bcefc02d;background:#17331ff2;color:#eef8f0;font:600 11px system-ui;box-shadow:0 8px 24px #0008;touch-action:manipulation}
body.iphone-optimized.mobile-panel-open #mobilePanelToggle{background:#31553af2}
body.iphone-optimized #mobilePerfBadge{position:fixed;z-index:8;left:max(10px,env(safe-area-inset-left));bottom:calc(max(10px,env(safe-area-inset-bottom)) + 8px);padding:5px 7px;border-radius:8px;border:1px solid #bcefc018;background:#06110bcf;color:#7f9b86;font:8px system-ui;pointer-events:none}
body.iphone-optimized .toast{bottom:calc(env(safe-area-inset-bottom) + 70px);max-width:calc(100vw - 24px);font-size:11px;text-align:center}
body.iphone-optimized.mobile-panel-open .toast{bottom:calc(min(44dvh,430px) + env(safe-area-inset-bottom) + 76px)}
body.iphone-optimized button{-webkit-tap-highlight-color:transparent}
body.iphone-optimized canvas{cursor:default}
@media(max-width:390px){body.iphone-optimized .btns{max-width:54vw}body.iphone-optimized .btns button{padding:7px 8px;font-size:10px}body.iphone-optimized .brand b{font-size:9px}}
@media(orientation:landscape) and (max-height:500px){body.iphone-optimized .brand{display:none}body.iphone-optimized .top{grid-template-columns:1fr}.btns{grid-column:1!important;grid-row:1!important;max-width:100%!important;justify-content:flex-start!important}.search{grid-row:2!important}body.iphone-optimized .status,body.iphone-optimized .writing-chip,body.iphone-optimized .semantic-chip,body.iphone-optimized .unified-chip,body.iphone-optimized .world-chip{display:none!important}body.iphone-optimized .panel{max-height:58dvh}}
`;
document.head.appendChild(css);
const toggle=document.createElement('button');toggle.id='mobilePanelToggle';toggle.textContent='Info';toggle.setAttribute('aria-label','Show information panel');toggle.onclick=()=>{const on=document.body.classList.toggle('mobile-panel-open');toggle.textContent=on?'Close':'Info';toggle.setAttribute('aria-expanded',String(on))};document.body.appendChild(toggle);
const badge=document.createElement('div');badge.id='mobilePerfBadge';badge.textContent=`IPHONE · ${profile.targetFPS} FPS · ${profile.dprCap}×`;document.body.appendChild(badge);
const panel=document.querySelector('.panel');
let lastPanel='';
function meaningfulPanel(){if(!panel)return false;const h=panel.querySelector('h2');return !!(h&&h.textContent.trim())}
if(panel){
 const obs=new MutationObserver(()=>{const now=panel.textContent||'';if(now!==lastPanel){lastPanel=now;if(meaningfulPanel()&&document.body.dataset.mobileAutoPanel==='1'){document.body.classList.add('mobile-panel-open');toggle.textContent='Close'}}});
 obs.observe(panel,{childList:true,subtree:true,characterData:true});
}
// A deliberate tap on the active universe opens the bottom sheet; pans do not.
let down=null,moved=false;
function bindCanvas(c){if(!c||c.dataset.iphoneBound)return;c.dataset.iphoneBound='1';c.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];moved=false},{passive:true});c.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])>8)moved=true},{passive:true});c.addEventListener('pointerup',()=>{if(!moved){document.body.dataset.mobileAutoPanel='1';setTimeout(()=>{if(meaningfulPanel()){document.body.classList.add('mobile-panel-open');toggle.textContent='Close'}document.body.dataset.mobileAutoPanel='0'},80)}down=null},{passive:true})}
document.querySelectorAll('canvas').forEach(bindCanvas);
new MutationObserver(()=>document.querySelectorAll('canvas').forEach(bindCanvas)).observe(document.body,{childList:true,subtree:false});
// Keyboard: keep the search bar visible instead of letting iOS hide the focused input behind the bottom sheet.
const q=document.querySelector('#q');if(q){q.addEventListener('focus',()=>{document.body.classList.remove('mobile-panel-open');toggle.textContent='Info';if(window.visualViewport)setTimeout(()=>window.scrollTo(0,0),40)});q.addEventListener('blur',()=>setTimeout(()=>window.scrollTo(0,0),40))}
if(window.visualViewport){const sync=()=>{document.documentElement.style.setProperty('--vvh',window.visualViewport.height+'px')};sync();window.visualViewport.addEventListener('resize',sync);window.visualViewport.addEventListener('scroll',sync)}
// Re-run canvas sizing after the DPR cap has been installed.
setTimeout(()=>window.dispatchEvent(new Event('resize')),60);
})();