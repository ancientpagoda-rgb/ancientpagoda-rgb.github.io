(function(){'use strict';
// Pure visual mode: keep the interactive canvases, remove every textual/control UI layer.
document.body.classList.add('clean-world');
const css=document.createElement('style');css.textContent=`
body.clean-world{background:#040806!important;overflow:hidden!important}
body.clean-world .top,
body.clean-world .brand,
body.clean-world .btns,
body.clean-world .search,
body.clean-world .status,
body.clean-world .panel,
body.clean-world .legend,
body.clean-world .writing-chip,
body.clean-world .writing-key,
body.clean-world .world-chip,
body.clean-world .unified-chip,
body.clean-world .semantic-chip,
body.clean-world .geo-chip,
body.clean-world .geo-events,
body.clean-world .contact-chip,
body.clean-world .contact-side,
body.clean-world .bulk-chip,
body.clean-world .bulk-progress,
body.clean-world .bulk-results,
body.clean-world .bulk-key,
body.clean-world .script-direction-card,
body.clean-world .script-evo-card,
body.clean-world .phon-card,
body.clean-world .sound-card,
body.clean-world .toast,
body.clean-world .layer-rail,
body.clean-world .world-legend,
body.clean-world .geo-legend,
body.clean-world .contact-legend,
body.clean-world #mobilePanelToggle,
body.clean-world #mobilePerfBadge,
body.clean-world #bulkMobileBtn,
body.clean-world #bulkMobileSearch,
body.clean-world #allWordsBadge,
body.clean-world button,
body.clean-world input,
body.clean-world select,
body.clean-world textarea,
body.clean-world [role="button"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
body.clean-world canvas{pointer-events:auto!important}
`;
document.head.appendChild(css);

// Renderers draw their labels directly into Canvas. Suppress only text operations;
// geometry, colors, branches, nodes, geography and pointer interaction are untouched.
const proto=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
if(proto&&!proto.__etymCleanTextPatched){
  proto.__etymCleanTextPatched=true;
  proto.__etymOriginalFillText=proto.fillText;
  proto.__etymOriginalStrokeText=proto.strokeText;
  proto.fillText=function(){};
  proto.strokeText=function(){};
}

// Some modules may append UI after this script. The stylesheet handles known classes;
// this observer removes late generic controls without touching canvases.
const sweep=()=>{
  document.querySelectorAll('button,input,select,textarea,[role="button"]').forEach(el=>{
    el.style.setProperty('display','none','important');
    el.style.setProperty('pointer-events','none','important');
  });
};
sweep();
new MutationObserver(sweep).observe(document.body,{childList:true,subtree:true});

// Close any mobile information sheet state left by earlier modules.
document.body.classList.remove('mobile-panel-open');
document.body.dataset.mobileAutoPanel='0';
})();