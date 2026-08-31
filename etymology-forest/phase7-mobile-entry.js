(function(){'use strict';
if(!window.__etymMobileProfile?.enabled)return;
if(document.querySelector('#bulkMobileBtn'))return;
const css=document.createElement('style');css.textContent=`
body.iphone-optimized #bulkBtn{display:none!important}
#bulkMobileBtn{position:fixed;z-index:30;right:max(10px,env(safe-area-inset-right));bottom:calc(max(10px,env(safe-area-inset-bottom)) + 138px);height:46px;min-width:88px;padding:0 14px;border-radius:14px;border:1px solid #8fb7d44a;background:#173246f5;color:#e9f5ff;font:700 11px system-ui;box-shadow:0 10px 28px #0009;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
body.bulk-world #bulkMobileBtn{background:#2d5b78f7;border-color:#a7d1ed66}
body.mobile-panel-open #bulkMobileBtn{opacity:.45}
#bulkMobileSearch{position:fixed;z-index:31;left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));top:calc(max(8px,env(safe-area-inset-top)) + 10px);display:none;gap:6px;padding:6px;border-radius:14px;border:1px solid #8fb7d43d;background:#071019f7;box-shadow:0 10px 30px #0009}
body.bulk-world #bulkMobileSearch{display:flex}
#bulkMobileSearch input{min-width:0;flex:1;height:44px;border:1px solid #8fb7d42e;border-radius:10px;background:#0b1721;color:#eef8ff;padding:0 12px;font:16px system-ui;outline:none;-webkit-user-select:text;user-select:text;touch-action:manipulation}
#bulkMobileSearch input::placeholder{color:#7891a3}
#bulkMobileSearch button{height:44px;min-width:54px;padding:0 12px;border-radius:10px;border:1px solid #8fb7d44d;background:#24485f;color:#eef8ff;font:700 11px system-ui;touch-action:manipulation}
body.iphone-optimized.bulk-world .top{display:none!important}
body.iphone-optimized.bulk-world .status{display:none!important}
body.iphone-optimized.bulk-world .script-dir-key{display:none!important}
body.iphone-optimized.bulk-world .bulk-chip{top:calc(max(8px,env(safe-area-inset-top)) + 72px)!important;left:max(10px,env(safe-area-inset-left))!important;right:max(10px,env(safe-area-inset-right))!important;font-size:8px!important;padding:6px 8px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.iphone-optimized.bulk-world .bulk-results{top:calc(max(8px,env(safe-area-inset-top)) + 105px)!important;max-height:48dvh!important}
body.iphone-optimized.bulk-world .panel{bottom:calc(env(safe-area-inset-bottom) + 62px)!important;max-height:min(44dvh,430px)!important}
@media(orientation:landscape) and (max-height:500px){#bulkMobileBtn{right:10px;bottom:78px;height:42px;min-width:82px}#bulkMobileSearch{left:10px;right:110px;top:8px}body.iphone-optimized.bulk-world .bulk-chip{display:none!important}}
`;document.head.appendChild(css);
const b=document.createElement('button');b.id='bulkMobileBtn';b.textContent='Words · 2M';b.setAttribute('aria-label','Open full two million word corpus');document.body.appendChild(b);
const form=document.createElement('div');form.id='bulkMobileSearch';form.innerHTML='<input id="bulkMobileInput" type="search" inputmode="search" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Search 2.4M words…"><button id="bulkMobileGo" type="button">Search</button>';document.body.appendChild(form);
const input=form.querySelector('#bulkMobileInput'),go=form.querySelector('#bulkMobileGo');
function submit(){const q=document.querySelector('#q');if(!q||!input.value.trim())return;q.value=input.value.trim();q.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true,cancelable:true}));input.blur()}
go.onclick=submit;input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}});
function sync(){const src=document.querySelector('#bulkBtn');const active=document.body.classList.contains('bulk-world');b.textContent=active?'Words ✓':'Words · 2M';b.setAttribute('aria-pressed',String(active));b.disabled=!src&&!window.__bulkCorpus;b.style.opacity=b.disabled?'.45':'';if(active&&!input.value){const q=document.querySelector('#q');if(q?.value)input.value=q.value}}
b.onclick=()=>{const src=document.querySelector('#bulkBtn');if(src)src.click();else if(window.__bulkCorpus)window.__bulkCorpus.activate(!document.body.classList.contains('bulk-world'));setTimeout(sync,60)};
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});setTimeout(sync,0);setTimeout(sync,500);
})();