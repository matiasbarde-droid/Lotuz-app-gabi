const $ = (s,r=document)=>r.querySelector(s);
const money = v=>Number(v||0).toLocaleString('es-CL',{style:'currency',currency:'CLP'});

const grid = $('#gridProductos'), q=$('#q'), cat=$('#cat'), sort=$('#sort');

// Etiquetas legibles
const LABEL = { mousepad:'Mousepads', mouse:'Mouse', audifonos:'Audífonos', teclado:'Teclados' };
// Orden preferente para las categorías “clásicas”
const DEFAULT_ORDER = ['mousepad','mouse','audifonos','teclado'];

function addToCart(id){
  const p = Catalog.getAll().find(x=>x.id===id); if(!p) return;
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const i = cart.findIndex(x=>x.id===id);
  if (i>=0) cart[i].cantidad+=1;
  else cart.push({id:p.id,nombre:p.nombre,precio:p.precio,foto:p.foto,cantidad:1});
  localStorage.setItem('cart', JSON.stringify(cart));
  const el = document.querySelector('#cartCount'); if(el){ const c=cart.reduce((a,t)=>a+t.cantidad,0); el.textContent=c?`(${c})`:''; }
  alert('Producto agregado');
}
window.addToCart = addToCart;

const buildDetailUrl = (p)=>
  `detalleProducto.html?id=${encodeURIComponent(p.id)}&nombre=${encodeURIComponent(p.nombre)}&precio=${encodeURIComponent(p.precio)}&descripcion=${encodeURIComponent(p.descripcion||'')}&foto=${encodeURIComponent(p.foto)}`;

function card(p){
  const href = buildDetailUrl(p);
  return `
  <div class="card product-card">
    <a class="prod-link" href="${href}">
      <div class="thumb"><img src="${p.foto}" alt="${p.nombre}"></div>
    </a>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
        <a class="prod-link title" href="${href}"><h3 style="margin:0;font-size:1.05rem;">${p.nombre}</h3></a>
        <span class="price">${money(p.precio)}</span>
      </div>
      <p class="desc">${p.descripcion||''}</p>
      <div class="actions"><button class="btn btn-primary" onclick="addToCart('${p.id}')">Agregar</button></div>
    </div>
  </div>`;
}

function currentList(){
  const t=(q?.value||'').toLowerCase().trim();
  const c=(cat?.value||'all');
  let list = Catalog.getAll();
  if (c!=='all') list = list.filter(p=>p.categoria===c);
  if (t) list = list.filter(p =>
    p.nombre.toLowerCase().includes(t) ||
    (p.descripcion||'').toLowerCase().includes(t) ||
    p.id.toLowerCase().includes(t)
  );
  const s=(sort?.value||'relevancia');
  if (s==='precio-asc')  list.sort((a,b)=>a.precio-b.precio);
  if (s==='precio-desc') list.sort((a,b)=>b.precio-a.precio);
  return list;
}

// categorías en vista agrupada 
function groupedCats(list){
  const dataCats = Array.from(new Set(list.map(p=>p.categoria)));
  const ordered  = DEFAULT_ORDER.filter(c=>dataCats.includes(c));
  const extras   = dataCats.filter(c=>!DEFAULT_ORDER.includes(c));
  return [...ordered, ...extras];
}

function render(){
  const list = currentList();
  if (!list.length){
    grid.innerHTML = `<div class="card" style="padding:16px;">No hay productos.</div>`;
    return;
  }

  const allCats = (cat?.value||'all') === 'all' && !(q && q.value.trim());
  if (allCats){
    const cats = groupedCats(list);
    grid.innerHTML = cats.map(k=>{
      const items = list.filter(p=>p.categoria===k); // <- sin slice
      if(!items.length) return '';
      const label = LABEL[k] || (k?.[0]?.toUpperCase()+k?.slice(1) || 'Otros');
      return `
        <h2 class="titulo-seccion" style="margin:18px 0 10px;">
          ${label} <small style="color:#9aa">${items.length}</small>
        </h2>
        <div class="product-grid product-grid--three">
          ${items.map(card).join('')}
        </div>
      `;
    }).join('');
  } else {
    grid.innerHTML = `<div class="product-grid">${list.map(card).join('')}</div>`;
  }
}

// Obtener productos desde localStorage
function obtenerProductos() {
  return JSON.parse(localStorage.getItem("lotuz:productos") || "[]");
}

// Renderizar productos en la página
function renderizarProductos() {
  const productos = obtenerProductos();
  const grid = document.getElementById("gridProductos");
  if (!grid) return;
  if (!productos.length) {
    grid.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }
  grid.innerHTML = productos.map(p => `
    <div class="product-card">
      <img src="${p.foto}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion || ""}</p>
      <span>${Number(p.precio).toLocaleString('es-CL',{style:'currency',currency:'CLP'})}</span>
    </div>
  `).join("");
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", renderizarProductos);

document.addEventListener('DOMContentLoaded', ()=>{
  q?.addEventListener('input', render);
  cat?.addEventListener('change', render);
  sort?.addEventListener('change', render);
  render();
});
