(function(){'use strict';
const corpus=window.__bulkCorpus;
if(!corpus)return;
const q=document.querySelector('#q'),go=document.querySelector('#go'),status=document.querySelector('.status');
const btn=document.querySelector('#bulkBtn');
if(btn){btn.textContent='All Words';btn.title='Open the complete Wiktionary-derived etymology corpus';}
if(q)q.placeholder='Search any word, language, or script…';
let falling=false;
const originalToast=typeof window.toast==='function'?window.toast.bind(window):null;
function fullCorpusFallback(term){
  term=String(term||'').trim();
  if(!term||falling)return;
  falling=true;
  if(q)q.value=term;
  if(status)status.textContent='searching the full etymology corpus · '+term;
  const alreadyReady=corpus.ready;
  // activate(true) is the canonical loader. When loading is needed, the bulk
  // layer itself searches the current query as soon as decoding finishes.
  corpus.activate(true);
  if(alreadyReady)setTimeout(()=>{try{go?.click()}catch(_){}},0);
  setTimeout(()=>{falling=false},500);
}
window.toast=function(msg){
  const s=String(msg||'');
  if((s==='Not loaded yet'||s==='Not loaded'||s.includes('not loaded yet'))&&q?.value.trim()){
    fullCorpusFallback(q.value);
    return;
  }
  if(originalToast)originalToast(msg);
};
// Keep startup light: the ~20 MB compressed corpus is loaded on first use rather
// than automatically. Every corpus word is still addressable through normal search.
const mobile=!!window.__etymMobileProfile?.enabled;
const note=document.createElement('div');
note.id='allWordsBadge';
note.textContent='ALL WORDS · full corpus fallback';
note.style.cssText='position:fixed;z-index:7;right:14px;bottom:14px;padding:6px 8px;border-radius:9px;background:#071019cf;border:1px solid #8fb7d420;color:#86a4b7;font:8px system-ui;pointer-events:none';
document.body.appendChild(note);
if(mobile)note.style.display='none';
})();