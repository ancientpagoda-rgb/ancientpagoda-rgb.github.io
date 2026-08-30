(function(){'use strict';
const css=document.createElement('style');css.textContent=`
body.all-layers #c{opacity:.82!important;filter:saturate(1.05) brightness(.9)}
body.all-layers #worldLangLayer{display:block!important;opacity:.9!important;mix-blend-mode:screen!important;filter:saturate(1.06)}
body.all-layers #ipa-layer,body.all-layers #sound-layer{display:block!important;visibility:visible!important;opacity:.96!important;mix-blend-mode:screen}
body.all-layers.lexicon-open #lexiconLayer{display:block!important;opacity:.94!important;mix-blend-mode:screen!important}
body.all-layers .world-chip{display:block!important;opacity:.78}
body.all-layers .status{background:#06110bdc}
#allLayersBtn.on{background:#31553a!important;box-shadow:0 0 18px #70c9822b inset}
.layer-rail{position:fixed;z-index:6;left:14px;bottom:14px;display:flex;gap:5px;align-items:center;padding:6px 8px;border-radius:11px;background:#06110bdc;border:1px solid #bcefc020;backdrop-filter:blur(10px);pointer-events:none;color:#8da694;font:8px/1 system-ui;letter-spacing:.08em;text-transform:uppercase}
.layer-rail span{padding:4px 6px;border-radius:6px;border:1px solid #bcefc014;background:#0a1810aa}.layer-rail span.on{color:#dfffe3;border-color:#bcefc037;box-shadow:0 0 10px #8fd39b17 inset}.layer-rail .word.on{color:#d6eaff}.layer-rail .ipa.on{color:#c8f4d0}.layer-rail .change.on{color:#eadba8}
.composite-note{position:fixed;z-index:6;left:14px;bottom:50px;padding:6px 9px;border-radius:9px;background:#06110bc7;border:1px solid #bcefc018;color:#91a898;font:9px system-ui;pointer-events:none;opacity:0;transition:.25s}.composite-note.show{opacity:1}
@media(max-width:760px){.layer-rail{left:10px;bottom:10px;max-width:calc(100vw - 20px);gap:3px;padding:5px}.layer-rail span{padding:4px}.composite-note{left:10px;bottom:45px;max-width:calc(100vw - 20px)}}
`;document.head.appendChild(css);
const btn=document.createElement('button');btn.id='allLayersBtn';btn.className='on';btn.textContent='ALL';btn.title='Composite all visible historical layers';const bar=document.querySelector('.btns');if(bar)bar.insertBefore(btn,bar.firstChild);
const rail=document.createElement('div');rail.className='layer-rail';rail.innerHTML='<span class="family on">family</span><span class="language on">language</span><span class="word on">word</span><span class="ipa on">IPA</span><span class="change on">change</span>';document.body.appendChild(rail);
const note=document.createElement('div');note.className='composite-note';note.textContent='ALL LAYERS · family + language + word + phonetics + sound change';document.body.appendChild(note);
let all=true;
function apply(){document.body.classList.toggle('all-layers',all);btn.classList.toggle('on',all);btn.textContent=all?'ALL':'SOLO';const ipa=document.querySelector('#ipa-toggle'),chg=document.querySelector('.sound-toggle');if(all){if(ipa&&!ipa.classList.contains('on'))ipa.click();if(chg&&!chg.classList.contains('on'))chg.click();note.classList.add('show');clearTimeout(apply.t);apply.t=setTimeout(()=>note.classList.remove('show'),1800)}updateRail()}
function updateRail(){const lex=document.body.classList.contains('lexicon-open');rail.querySelector('.word')?.classList.toggle('on',true);rail.querySelector('.ipa')?.classList.toggle('on',all||!!document.querySelector('#ipa-toggle.on'));rail.querySelector('.change')?.classList.toggle('on',all||!!document.querySelector('.sound-toggle.on'));rail.querySelector('.family')?.classList.toggle('on',all||document.body.classList.contains('world-mode'));rail.querySelector('.language')?.classList.toggle('on',all||document.body.classList.contains('world-mode'));rail.title=lex?'Active word forest over world/family layers':'All historical scales visible simultaneously'}
btn.onclick=()=>{all=!all;apply()};
// Keep the deep English canvas visible when World mode would normally fade it almost away.
const obs=new MutationObserver(()=>{if(all){const ipa=document.querySelector('#ipa-layer'),snd=document.querySelector('#sound-layer');if(ipa)ipa.style.removeProperty('visibility');if(snd)snd.style.removeProperty('visibility')}updateRail()});obs.observe(document.body,{attributes:true,attributeFilter:['class']});
setInterval(updateRail,500);
const sm=document.querySelector('.brand small');if(sm)sm.textContent='Phase 5.2 · simultaneous linguistic layers';
apply();
})();