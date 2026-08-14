const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
const glow=q('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('visible');
  if(entry.target.classList.contains('metrics')){
    qa('[data-count]',entry.target).forEach(el=>{
      const end=+el.dataset.count,start=performance.now();
      const tick=now=>{const p=Math.min((now-start)/1100,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};
      requestAnimationFrame(tick);
    });
  }
  observer.unobserve(entry.target);
}),{threshold:.18});
qa('.reveal').forEach(el=>observer.observe(el));

const layouts={
 focus:{deep:['15%','25%','160px','185px'],lunch:['43%','12%','370px'],meet:['57%','15%','260px'],create:['73%','20%','130px']},
 balance:{deep:['13%','19%','155px','150px'],lunch:['38%','12%','330px'],meet:['53%','17%','190px'],create:['73%','18%','295px']},
 recover:{deep:['17%','17%','230px','125px'],lunch:['40%','17%','160px'],meet:['63%','13%','320px'],create:['78%','14%','190px']}
};
qa('.mode').forEach(btn=>btn.addEventListener('click',()=>{
  qa('.mode').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const l=layouts[btn.dataset.mode];
  Object.entries(l).forEach(([name,v])=>{const el=q('.event.'+name);el.style.left=v[0];el.style.width=v[1];el.style.top=v[2];if(v[3])el.style.height=v[3]});
  q('.protected').innerHTML=btn.dataset.mode==='recover'?'<i></i> 2H 10M RESTORED':btn.dataset.mode==='balance'?'<i></i> 3H 30M ALIGNED':'<i></i> 4H 20M PROTECTED';
}));

const orb=q('.time-orb');
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(orb)orb.style.transform=`translateY(${y*.11}px) rotate(${y*.018}deg)`;
  qa('.ping').forEach((el,i)=>{const r=q('.chaos').getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.style.translate=`0 ${Math.max(0,(innerHeight-r.top)*(.018+i*.006))}px`});
});

q('.signup').addEventListener('submit',e=>{e.preventDefault();e.currentTarget.classList.add('success');q('.signup button').firstChild.textContent='Вы в списке '});
