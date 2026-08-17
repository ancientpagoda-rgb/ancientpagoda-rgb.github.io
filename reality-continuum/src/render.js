function rand(i) { return (Math.sin(i * 999.91) * 43758.5453) % 1; }

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({length: 620}, (_,i)=>({x:Math.abs(rand(i*2+1)), y:Math.abs(rand(i*2+2)), z:Math.abs(rand(i*2+3)), s:.25+Math.abs(rand(i+88))*1.6}));

  function resize(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
    canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener('resize', resize); resize();

  function draw(state, scene) {
    const w=innerWidth,h=innerHeight;
    ctx.clearRect(0,0,w,h);
    const grad=ctx.createRadialGradient(w*.58,h*.5,0,w*.58,h*.5,Math.max(w,h)*.8);
    grad.addColorStop(0,'rgba(26,39,58,.55)'); grad.addColorStop(.42,'rgba(8,12,18,.86)'); grad.addColorStop(1,'rgba(2,3,5,1)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);

    const scale = state.sceneIndex;
    if (scale <= 1) drawCosmos(ctx,w,h,state,particles,scale);
    else if (scale <= 3) drawPlanet(ctx,w,h,state,scale);
    else if (scale <= 5) drawOrganism(ctx,w,h,state,scale);
    else if (scale <= 7) drawSettlement(ctx,w,h,state,scale);
    else drawLive(ctx,w,h,state);
  }
  return {draw};
}

function drawCosmos(ctx,w,h,state,particles,scale){
  ctx.save();
  for (let i=0;i<particles.length;i++){
    const p=particles[i], drift=state.phase*.002*(i%7+1);
    const x=(p.x*w + Math.sin(drift+p.y*8)*28)%w;
    const y=p.y*h;
    const a=.2+.7*p.z;
    ctx.fillStyle=`rgba(220,235,255,${a})`;
    ctx.beginPath(); ctx.arc(x,y,p.s*(scale?1.5:1),0,Math.PI*2); ctx.fill();
  }
  if(scale===1){
    ctx.strokeStyle='rgba(120,170,255,.18)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(w*.58,h*.52,Math.min(w,h)*.28,Math.min(w,h)*.1,state.phase*.01,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(245,225,160,.92)'; ctx.beginPath(); ctx.arc(w*.58,h*.52,12,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawPlanet(ctx,w,h,state,scale){
  const r=Math.min(w,h)*(scale===2?.29:.26), cx=w*.57, cy=h*.51;
  ctx.save();
  const g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.08,cx,cy,r);
  g.addColorStop(0,'rgba(130,195,185,.95)'); g.addColorStop(.45,'rgba(45,105,105,.94)'); g.addColorStop(1,'rgba(8,20,31,.98)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(220,245,255,.13)';
  for(let i=-3;i<=3;i++){ctx.beginPath();ctx.ellipse(cx,cy+i*r*.2,r*Math.cos(i*.18),r*.19,0,0,Math.PI*2);ctx.stroke();}
  const n= scale===3 ? 110 : 38;
  for(let i=0;i<n;i++){
    const a=i*2.399+state.phase*.03, rr=r*(.16+.78*Math.abs(Math.sin(i*4.1)));
    const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr*.68;
    ctx.fillStyle= scale===3 ? 'rgba(170,225,120,.48)' : 'rgba(220,245,255,.35)';
    ctx.fillRect(x,y,2,2);
  }
  ctx.restore();
}

function drawOrganism(ctx,w,h,state,scale){
  const cx=w*.58,cy=h*.51;
  ctx.save(); ctx.translate(cx,cy);
  if(scale===4){
    ctx.strokeStyle='rgba(175,215,230,.38)'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.ellipse(0,0,110,185,0,0,Math.PI*2); ctx.stroke();
    for(let i=0;i<18;i++){ const a=i/18*Math.PI*2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*95,Math.sin(a)*170); ctx.stroke(); }
  } else {
    ctx.strokeStyle='rgba(205,170,255,.5)'; ctx.lineWidth=1.2;
    const nodes=Array.from({length:56},(_,i)=>({x:Math.cos(i*2.3)*Math.sin(i*.37)*145,y:Math.sin(i*1.7)*Math.cos(i*.29)*125}));
    for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){if((i*13+j*7)%37<2){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}}}
    ctx.fillStyle='rgba(235,220,255,.9)'; for(const n of nodes){ctx.beginPath();ctx.arc(n.x,n.y,2.2,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
}

function drawSettlement(ctx,w,h,state,scale){
  const horizon=h*.62;
  ctx.fillStyle='rgba(35,48,42,.7)'; ctx.fillRect(0,horizon,w,h-horizon);
  const baseX=w*.48;
  for(let i=0;i<18;i++){
    const x=baseX+(i%6)*54-130, y=horizon-Math.floor(i/6)*34 + Math.sin(i)*8;
    ctx.fillStyle=`rgba(${90+i*2},${72+i},${52+i},.9)`; ctx.fillRect(x,y,34,28);
    ctx.fillStyle='rgba(45,35,28,.95)'; ctx.beginPath(); ctx.moveTo(x-5,y);ctx.lineTo(x+17,y-18);ctx.lineTo(x+39,y);ctx.fill();
  }
  ctx.strokeStyle='rgba(185,190,160,.22)'; ctx.beginPath();ctx.arc(baseX+5,horizon-12,190,Math.PI,Math.PI*2);ctx.stroke();
  if(scale===7){ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='12px ui-monospace';ctx.fillText('3000 BCE  →  2026 CE',baseX-85,horizon+54);}
}

function drawLive(ctx,w,h,state){
  const cx=w*.58,cy=h*.51,r=Math.min(w,h)*.25;
  ctx.strokeStyle='rgba(125,205,255,.32)';ctx.lineWidth=1;
  for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(cx,cy,r+i*5+Math.sin(state.phase+i)*3,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<90;i++){const a=i*.72+state.phase*.04, rr=(i%9)/9*r;ctx.fillStyle=`rgba(100,210,255,${.15+(i%7)/12})`;ctx.fillRect(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,2,2);}
}
