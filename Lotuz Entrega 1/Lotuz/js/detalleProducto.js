// Utilidades de carrito
const dp_getCart = () => {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch { return []; }
};
const dp_saveCart = (c) => localStorage.setItem('cart', JSON.stringify(c));
const dp_updateCount = () => {
  const c = dp_getCart().reduce((a,it)=>a+(it.cantidad||0),0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = c > 0 ? `(${c})` : '';
};

// Carga y renderizado del producto 
function dp_loadFromURL(){
  const p = new URLSearchParams(location.search);
  return {
    id: p.get('id'),
    nombre: p.get('nombre') || 'Producto',
    foto: p.get('foto') || '',
    precio: Number(p.get('precio') || 0),
    descripcion: p.get('descripcion') || ''
  };
}

function dp_render(data){
  const $ = (id) => document.getElementById(id);
  $('nombre').textContent = data.nombre;
  $('foto').src = data.foto;
  $('foto').alt = data.nombre;
  $('foto').onerror = () => {
  $('foto').src = '../img/productos/artisan_rojo1.png';
  $('foto').style.opacity = '0.9';
  };
  $('precio').textContent = data.precio.toLocaleString('es-CL',{style:'currency',currency:'CLP'});
  $('descripcion').textContent = data.descripcion;

  $('btnAdd').addEventListener('click', () => {
    const cart = dp_getCart();
    const i = cart.findIndex(x => x.id === data.id);
    if (i >= 0) cart[i].cantidad += 1;
    else cart.push({ id: data.id, nombre: data.nombre, precio: data.precio, foto: data.foto, cantidad: 1 });
    dp_saveCart(cart);
    dp_updateCount();
    alert('Producto agregado');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const data = dp_loadFromURL();
  dp_render(data);
  dp_updateCount();
});
