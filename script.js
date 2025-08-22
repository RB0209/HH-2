// MENU selection + keyboard/D-pad navigation + modals
const menu = document.getElementById('menu');
const tiles = Array.from(menu.querySelectorAll('.tile'));
let index = 0;
function renderSelection(){
  tiles.forEach((t,i)=>t.classList.toggle('selected', i===index));
}
renderSelection();
function move(delta){
  index = (index + delta + tiles.length) % tiles.length;
  renderSelection();
  tiles[index].focus({preventScroll:true});
}
function activate(){ tiles[index].click(); }

// Hover sound hooks (optional): add audio if desired
// const sHover = new Audio('assets/hover.wav'); const sClick = new Audio('assets/click.wav');

// D-pad events
document.querySelector('.d-up').addEventListener('click', ()=>move(-1));
document.querySelector('.d-down').addEventListener('click', ()=>move(1));
document.querySelector('.d-left').addEventListener('click', ()=>move(-1));
document.querySelector('.d-right').addEventListener('click', ()=>move(1));

document.getElementById('aBtn').addEventListener('click', activate);
document.getElementById('bBtn').addEventListener('click', ()=>closeAnyModal());
document.getElementById('startBtn').addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
let theme=1;
document.getElementById('selectBtn').addEventListener('click', ()=>{
  theme=((theme)%3)+1;
  document.body.classList.remove('theme-1','theme-2','theme-3'); 
  document.body.classList.add('theme-'+theme);
});

// Keyboard
window.addEventListener('keydown', (e)=>{
  if(e.key==='ArrowUp'||e.key==='ArrowLeft'){ move(-1); }
  if(e.key==='ArrowDown'||e.key==='ArrowRight'){ move(1); }
  if(e.key==='Enter'||e.key===' '){ e.preventDefault(); activate(); }
  if(e.key==='Escape'){ closeAnyModal(); }
  if(e.key.toLowerCase()==='a'){ activate(); }
  if(e.key.toLowerCase()==='b'){ closeAnyModal(); }
});

// Modals using <dialog>
const overlay = document.getElementById('overlay');
function openModal(id){
  const dlg = document.getElementById('modal-'+id);
  overlay.hidden=false;
  dlg.showModal();
  const close = ()=>{ dlg.close(); overlay.hidden=true; tiles[index].focus(); };
  dlg.querySelector('.close').addEventListener('click', close, {once:true});
  dlg.addEventListener('click', (e)=>{ if(e.target===dlg) close(); });
}
function closeAnyModal(){ document.querySelectorAll('dialog[open]').forEach(d=>d.close()); overlay.hidden=true; }

tiles.forEach(btn=>{
  btn.addEventListener('click', ()=> openModal(btn.dataset.modal));
  btn.addEventListener('mouseenter', ()=>{
    // sHover.currentTime=0; sHover.play().catch(()=>{});
  });
  btn.addEventListener('click', ()=>{
    // sClick.currentTime=0; sClick.play().catch(()=>{});
  });
});

// ARIA list semantics
tiles.forEach((t,i)=>t.setAttribute('aria-posinset', String(i+1)));
menu.setAttribute('aria-setsize', String(tiles.length));
