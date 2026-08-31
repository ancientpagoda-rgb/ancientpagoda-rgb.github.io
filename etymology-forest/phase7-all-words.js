(function(){'use strict';
const corpus=window.__bulkCorpus;
if(!corpus)return;
const q=document.querySelector('#q'),go=document.querySelector('#go'),status=document.querySelector('.status');
const btn=document.querySelector('#bulkBtn');
if(btn){btn.textContent='All Words';btn.title='Open the complete Wiktionary-derived etymology corpus';}
if(q)q.placeholder='Search any word, language, or script…';
let falling=false;
const originalToast=typeof window.toast==='function'?window.toast.bind(window):null;
async function fullCorpusFallback(term){
  term=String(term||'').trim();
  if(!term||falling)return;
  falling=true;
  try{
    if(status)status.textContent='searching the full etymology corpus · '+term;
    corpus.activate(true);
    const ok=await corpus.load();
    if(!ok){if(originalToast)originalToast('Full corpus could not be loaded');return;}
    if(q)q.value=term;
    // The bulk layer owns the normal search controls while active. Triggering the
    // existing button keeps one canonical search/result implementation.
    setTimeout(()=>{try{go?.click()}catch(_){}},0);
  }finally{
    setTimeout(()=>{falling=false},120);
  }
}
window.toast=function(msg){
  const s=String(msg||'');
  if((s==='Not loaded yet'||s==='Not loaded'||s.includes('not loaded yet'))&&q?.value.trim()){
    fullCorpusFallback(q.value);
    return;
  }
  if(originalToast)originalToast(msg);
};
// Make the full corpus available in the background on capable desktop browsers.
// Mobile waits for the first corpus search to avoid an unnecessary ~20 MB download
// and large decode on startup.
const mobile=!!window.__etymMobileProfile?.enabled;
if(!mobile){
  const warm=()=>corpus.load().catch(()=>{});
  if('requestIdleCallback'in window)requestIdleCallback(warm,{timeout:5000});
  else setTimeout(warm,2400);
}
// Small visual contract: corpus records are part of the forest, but only a local
// ancestry neighborhood is materialized at once. This keeps millions of lexemes
// addressable without making performance incorrect.
const note=document.createElement('div');
note.id='allWordsBadge';
note.textContent='ALL WORDS · full corpus fallback';
note.style.cssText='position:fixed;z-index:7;right:14px;bottom:14px;padding:6px 8px;border-radius:9px;background:#071019cf;border:1px solid #8fb7d420;color:#86a4b7;font:8px system-ui;pointer-events:none';
document.body.appendChild(note);
if(mobile)note.style.display='none';
})();