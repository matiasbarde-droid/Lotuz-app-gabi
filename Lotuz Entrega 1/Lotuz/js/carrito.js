const $ = (s, r=document) => r.querySelector(s);
const money = v => Number(v||0).toLocaleString('es-CL',{style:'currency',currency:'CLP'});

function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch { return []; } }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function updateCartCount(){
  const c = getCart().reduce((a,it)=>a+Number(it.cantidad||0),0);
  const el = $('#cartCount'); if(el) el.textContent = c>0 ? `(${c})` : '';
}

function getCurrentUser() {
  try {
    const a = localStorage.getItem('current_user');
    const b = localStorage.getItem('lotuz:session:user'); // alias por compatibilidad
    return a ? JSON.parse(a) : (b ? JSON.parse(b) : null);
  } catch { return null; }
}

let T_BODY, T_TABLE, T_EMPTY, T_TOTAL, BTN_CLEAR, BTN_CHECK, SECTION_CHECKOUT;
let BTN_GUEST, INP_GUEST, ERR_GUEST; // render

function renderCart(){
  const cart = getCart();
  updateCartCount();

  const hasItems = cart.length > 0;

  if(!hasItems){
    if(T_TABLE) T_TABLE.style.display = 'none';
    if(T_EMPTY) T_EMPTY.style.display = 'block';
    if(BTN_CLEAR) BTN_CLEAR.disabled = true;
    if(BTN_CHECK) BTN_CHECK.disabled = true;
    if(SECTION_CHECKOUT) SECTION_CHECKOUT.style.display = 'none';
    if(T_TOTAL)  T_TOTAL.textContent = money(0);
    if(T_BODY)   T_BODY.innerHTML = '';
    return;
  }

  if(T_TABLE) T_TABLE.style.display = '';
  if(T_EMPTY) T_EMPTY.style.display = 'none';
  if(BTN_CLEAR) BTN_CLEAR.disabled = false;
  if(BTN_CHECK) BTN_CHECK.disabled = false;

  const rows = cart.map(item => {
    const subtotal = Number(item.precio) * Number(item.cantidad||1);
    const foto = item.foto || '../img/productos/placeholder.png';
    return `
      <tr data-id="${item.id}">
        <td style="display:flex; gap:10px; align-items:center;">
          <img src="${foto}" alt="${item.nombre}" 
               style="width:64px;height:64px;object-fit:contain;background:#111;border-radius:8px;"
               onerror="this.onerror=null;this.src='../img/productos/placeholder.png';">
          <div>
            <div style="font-weight:700;">${item.nombre}</div>
          </div>
        </td>
        <td>${money(item.precio)}</td>
        <td>
          <div style="display:inline-flex; align-items:center; gap:6px;">
            <button class="btn btn-ghost qty" data-act="dec" aria-label="Disminuir">−</button>
            <span class="qty-val" style="min-width:22px; text-align:center;">${item.cantidad}</span>
            <button class="btn btn-ghost qty" data-act="inc" aria-label="Aumentar">+</button>
          </div>
        </td>
        <td class="row-sub">${money(subtotal)}</td>
        <td><button class="btn btn-ghost remove">Eliminar</button></td>
      </tr>
    `;
  }).join('');

  if(T_BODY) T_BODY.innerHTML = rows;

  const total = cart.reduce((acc,it)=>acc + Number(it.precio)*Number(it.cantidad||1), 0);
  if(T_TOTAL) T_TOTAL.textContent = money(total);

  const user = getCurrentUser();
  if (SECTION_CHECKOUT) SECTION_CHECKOUT.style.display = user ? 'none' : 'none';
}

function onTableClick(e){
  const tr = e.target.closest('tr[data-id]');
  if(!tr) return;
  const id = tr.dataset.id;
  let cart = getCart();
  const idx = cart.findIndex(x=>x.id===id);
  if(idx<0) return;

  if(e.target.classList.contains('remove')){
    cart.splice(idx,1);
    saveCart(cart); renderCart();
    return;
  }

  if(e.target.classList.contains('qty')){
    const act = e.target.dataset.act;
    if(act==='inc') cart[idx].cantidad = Number(cart[idx].cantidad||1) + 1;
    if(act==='dec') cart[idx].cantidad = Math.max(0, Number(cart[idx].cantidad||1) - 1);
    if(cart[idx].cantidad===0) cart.splice(idx,1);
    saveCart(cart); renderCart();
  }
}

function showCheckout(){
  if(!getCart().length) return;

  const user = getCurrentUser();

  if (user) {
    location.href = 'pago.html';
    return;
  }

  if(SECTION_CHECKOUT){
    SECTION_CHECKOUT.style.display = 'block';
    SECTION_CHECKOUT.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

function isValidEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function continueAsGuest(){
  const email = (INP_GUEST?.value || '').trim();
  if(!isValidEmail(email)){
    if(ERR_GUEST){ ERR_GUEST.style.display = 'block'; }
    return;
  }
  if(ERR_GUEST){ ERR_GUEST.style.display = 'none'; }

  localStorage.setItem('checkout_email', email);
  location.href = 'pago.html?guest=1';
}

/* Reacción a cambios de sesión*/
function toggleCheckoutBlockBySession(){
  const user = getCurrentUser();
  if (SECTION_CHECKOUT) {
    SECTION_CHECKOUT.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  T_BODY   = $('#cartBody');
  T_TABLE  = $('#cartTable');
  T_EMPTY  = $('#emptyCart');
  T_TOTAL  = $('#cartTotal');
  BTN_CLEAR= $('#btnClear');
  BTN_CHECK= $('#btnCheckout');

  SECTION_CHECKOUT = $('#checkoutOptions');
  BTN_GUEST  = $('#btnGuestContinue');
  INP_GUEST  = $('#guestEmail');
  ERR_GUEST  = $('#guestEmailError');

  T_BODY && T_BODY.addEventListener('click', onTableClick);
  BTN_CLEAR && BTN_CLEAR.addEventListener('click', ()=>{
    if(confirm('¿Vaciar carrito?')){
      saveCart([]); renderCart();
    }
  });
  BTN_CHECK && BTN_CHECK.addEventListener('click', showCheckout);
  BTN_GUEST && BTN_GUEST.addEventListener('click', continueAsGuest);
  INP_GUEST && INP_GUEST.addEventListener('input', ()=>{ if(ERR_GUEST) ERR_GUEST.style.display='none'; });

  renderCart();
  toggleCheckoutBlockBySession();
});

window.addEventListener('storage', (e)=>{
  if (e.key === 'current_user' || e.key === 'lotuz:session:user') {
    toggleCheckoutBlockBySession();
  }
  if (e.key === 'cart') renderCart();
});