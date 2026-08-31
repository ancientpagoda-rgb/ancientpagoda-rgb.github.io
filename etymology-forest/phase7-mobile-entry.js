(function(){'use strict';
if(!window.__etymMobileProfile?.enabled)return;
const existing=document.querySelector('#bulkMobileBtn');if(existing)return;
const css=document.createElement('style');css.textContent=`
body.iphone-optimized #bulkBtn{display:none!important}
#bulkMobileBtn{position:fixed;z-index:30;right:max(10px,env(safe-area-inset-right));bottom:calc(max(10px,env(safe-area-inset-bottom)) + 138px);height:46px;min-width:88px;padding:0 14px;border-radius:14px;border:1px solid #8fb7d44a;background:#173246f5;color:#e9f5ff;font:700 11px system-ui;box-shadow:0 10px 28px #0009;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
body.bulk-world #bulkMobileBtn{background:#2d5b78f7;border-color:#a7d1ed66}
body.mobile-panel-open #bulkMobileBtn{opacity:.45}
@media(orientation:landscape) and (max-height:500px){#bulkMobileBtn{right:10px;bottom:78px;height:42px;min-width:82px}}
`;document.head.appendChild(css);
const b=document.createElement('button');b.id='bulkMobileBtn';b.textContent='Words · 2M';b.setAttribute('aria-label','Open full two million word corpus');document.body.appendChild(b);
function sync(){const src=document.querySelector('#bulkBtn');const active=document.body.classList.contains('bulk-world');b.textContent=active?'Words ✓':'Words · 2M';b.setAttribute('aria-pressed',String(active));b.disabled=!src&&!window.__bulkCorpus;b.style.opacity=b.disabled?'.45':''}
b.onclick=()=>{const src=document.querySelector('#bulkBtn');if(src)src.click();else if(window.__bulkCorpus)window.__bulkCorpus.activate(!document.body.classList.contains('bulk-world'));setTimeout(sync,60)};
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});setTimeout(sync,0);setTimeout(sync,500);
})();