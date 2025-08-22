// ===== Typewriter =====
const introEl = document.getElementById('intro');
const typeText = introEl.dataset.text;
function playTypewriter(){
  introEl.textContent = '';
  introEl.dataset.suffix = ' _';
  let i = 0;
  const t = setInterval(()=>{
    introEl.textContent += typeText[i];
    i++;
    if(i>=typeText.length){
      clearInterval(t);
      introEl.dataset.suffix = '';
    }
  }, 35);
}
playTypewriter();

// ===== Menu selection & keyboard nav =====
const menu = document.getElementById('menu');
const tiles = Array.from(menu.querySelectorAll('.tile'));
let index = 0;
function renderSelection(){
  tiles.forEach((t,i)=>{
    t.classList.toggle('selected', i===index);
  });
}
renderSelection();

function move(delta){
  index = (index + delta + tiles.length) % tiles.length;
  renderSelection();
  tiles[index].focus({preventScroll:true});
}
function activate(){
  tiles[index].click();
}

// Buttons mapping (A,B,Start,Select)
document.getElementById('aBtn').addEventListener('click', activate);
document.getElementById('bBtn').addEventListener('click', ()=> closeAnyModal());
document.getElementById('startBtn').addEventListener('click', playTypewriter);
let theme = 1;
document.getElementById('selectBtn').addEventListener('click', ()=>{
  theme = ((theme)%3)+1;
  document.body.classList.remove('theme-1','theme-2','theme-3');
  document.body.classList.add('theme-'+theme);
});

// D-pad buttons
document.querySelector('.d-up').addEventListener('click', ()=>move(-1));
document.querySelector('.d-down').addEventListener('click', ()=>move(1));
document.querySelector('.d-left').addEventListener('click', ()=>move(-1));
document.querySelector('.d-right').addEventListener('click', ()=>move(1));

// Keyboard
window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ move(-1); }
  if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){ move(1); }
  if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); }
  if(e.key === 'Escape'){ closeAnyModal(); }
  if(e.key.toLowerCase()==='b'){ closeAnyModal(); }
  if(e.key.toLowerCase()==='a'){ activate(); }
});

// ===== Modals (native <dialog>) with focus management =====
const overlay = document.getElementById('overlay');
function openModal(id){
  const dlg = document.getElementById('modal-'+id);
  overlay.hidden = false;
  dlg.showModal();
  // Focus trap: keep focus inside dialog
  const focusables = Array.from(dlg.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'));
  const first = focusables[0];
  const last = focusables[focusables.length-1];
  function trap(e){
    if(e.key !== 'Tab') return;
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  dlg.addEventListener('keydown', trap);
  dlg.dataset.trap = '1';
  first?.focus();
  dlg.querySelector('.close').addEventListener('click', ()=> closeDialog(dlg), {once:true});
  dlg.addEventListener('close', ()=> overlay.hidden = true, {once:true});
}
function closeDialog(dlg){
  dlg.close();
  overlay.hidden = true;
  tiles[index].focus();
}
function closeAnyModal(){
  document.querySelectorAll('dialog[open]').forEach(d=>closeDialog(d));
}

// Hook up tiles
tiles.forEach(btn=>{
  btn.addEventListener('click', ()=> openModal(btn.dataset.modal));
});

// Accessibility labels
tiles.forEach((t,i)=> t.setAttribute('aria-posinset', String(i+1)));
menu.setAttribute('aria-setsize', String(tiles.length));
