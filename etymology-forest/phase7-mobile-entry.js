(function(){'use strict';
if(!window.__etymMobileProfile?.enabled)return;
const old=document.querySelector('#bulkMobileBtn');if(old)old.remove();document.querySelector('#bulkMobileSearch')?.remove();
const css=document.createElement('style');css.textContent=`
body.iphone-optimized #bulkBtn{display:none!important}
#bulkMobileBtn{position:fixed;z-index:40;right:max(10px,env(safe-area-inset-right));bottom:calc(max(10px,env(safe-area-inset-bottom)) + 138px);height:46px;min-width:98px;padding:0 14px;border-radius:14px;border:1px solid #8fb7d44a;background:#244f6bf6;color:#e9f5ff;font:700 11px system-ui;box-shadow:0 10px 28px #0009;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
body.mobile-panel-open #bulkMobileBtn{opacity:.55}
body.bulk-world #bulkMobileBtn{background:#315f79f6}
@media(orientation:landscape) and (max-height:500px){#bulkMobileBtn{right:10px;bottom:78px;height:42px;min-width:92px}}
`;document.head.appendChild(css);
const b=document.createElement('button');b.id='bulkMobileBtn';b.textContent='All Words';b.setAttribute('aria-label','Open the complete etymology corpus inside the forest');document.body.appendChild(b);
b.onclick=()=>{const c=window.__bulkCorpus;if(!c)return;c.activate(true);if(c.ready){b.textContent='All Words ✓';return}b.textContent='Loading…';const started=Date.now(),timer=setInterval(()=>{if(c.ready){clearInterval(timer);b.textContent='All Words ✓'}else if(Date.now()-started>90000){clearInterval(timer);b.textContent='All Words'}},350)};
})();