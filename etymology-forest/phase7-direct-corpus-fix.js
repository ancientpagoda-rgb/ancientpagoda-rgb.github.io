(function(){'use strict';
const hint=document.querySelector('#hint'),status=document.querySelector('.status'),panel=document.querySelector('.panel');
function ready(){return !!window.__bulkCorpus?.ready || /^full corpus ready/i.test(status?.textContent||'') || !!panel?.querySelector('h2')}
function sync(){if(!hint)return;if(ready()){hint.style.display='none';hint.setAttribute('aria-hidden','true')}else{hint.style.display='block'}}
if(panel)new MutationObserver(sync).observe(panel,{childList:true,subtree:true});
if(status)new MutationObserver(sync).observe(status,{childList:true,subtree:true,characterData:true});
const q=document.querySelector('#q');q?.addEventListener('input',()=>{if(q.value.trim())hint&&(hint.style.display='none')});
let n=0,t=setInterval(()=>{sync();if(++n>120||ready())clearInterval(t)},250);
sync();
})();