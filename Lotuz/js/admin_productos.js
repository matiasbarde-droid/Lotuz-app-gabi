(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const money = v=>Number(v||0).toLocaleString('es-CL',{style:'currency',currency:'CLP'});

  let TBODY, Q, CAT, BTN_NEW, DLG, FORM;
  let F = {};
  const CATS = ['mousepad','mouse','audifonos','teclado'];

  function render(list){
    if(!TBODY) return;
    if(!list.length){ TBODY.innerHTML = `<tr><td colspan="5" style="color:#b6b6b6">Sin productos.</td></tr>`; return; }
    TBODY.innerHTML = list.map(p => `
      <tr data-id="${p.id}">
        <td>#${p.id}</td>
        <td style="display:flex;gap:10px;align-items:center;">
          <img src="${p.foto}" alt="${p.nombre}" style="width:48px;height:48px;object-fit:contain;background:#111;border-radius:8px;">
          <div>${p.nombre}</div>
        </td>
        <td>${p.categoria}</td>
        <td>${money(p.precio)}</td>
        <td>
          <button class="btn btn-ghost act-edit">Editar</button>
          <button class="btn btn-ghost act-del">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function currentList(){
    let list = Catalog.getAll();
    const t = (Q?.value||'').trim().toLowerCase();
    const c = (CAT?.value||'all');
    if (c!=='all') list = list.filter(p=>p.categoria===c);
    if (t) list = list.filter(p =>
      p.id.toLowerCase().includes(t) ||
      p.nombre.toLowerCase().includes(t) ||
      (p.descripcion||'').toLowerCase().includes(t)
    );
    return list.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  }
  const refresh = ()=>render(currentList());

  function openNew(){
    DLG?.showModal();
    FORM.dataset.mode = 'new';
    F.pId.removeAttribute('readonly');
    F.pId.value=''; F.pNombre.value=''; F.pCategoria.value='mousepad';
    F.pPrecio.value=''; F.pFoto.value='/img/productos/placeholder.png'; F.pDesc.value='';
    $('#dlgTitle').textContent = 'Nuevo producto';
  }
  function openEdit(p){
    DLG?.showModal();
    FORM.dataset.mode = 'edit';
    F.pId.setAttribute('readonly','readonly');
    F.pId.value=p.id; F.pNombre.value=p.nombre; F.pCategoria.value=p.categoria;
    F.pPrecio.value=p.precio; F.pFoto.value=p.foto; F.pDesc.value=p.descripcion||'';
    $('#dlgTitle').textContent = `Editar · ${p.nombre}`;
  }

  function onTableClick(e){
    const tr = e.target.closest('tr[data-id]'); if(!tr) return;
    const id = tr.dataset.id;
    if(e.target.classList.contains('act-edit')){
      const p = Catalog.getAll().find(x=>x.id===id); if(p) openEdit(p);
    }
    if(e.target.classList.contains('act-del')){
      if(!confirm('¿Eliminar este producto?')) return;
      Catalog.remove(id); refresh();
    }
  }

  function onSubmit(ev){
    ev.preventDefault();
    const payload = {
      id: F.pId.value.trim(),
      nombre: F.pNombre.value.trim(),
      categoria: F.pCategoria.value,
      precio: Number(F.pPrecio.value||0),
      foto: F.pFoto.value.trim(),
      descripcion: F.pDesc.value.trim()
    };
    if(!payload.id || !payload.nombre || !CATS.includes(payload.categoria) || !(payload.precio>0)){
      alert('Revisa ID, nombre, categoría y precio.'); return;
    }
    if (FORM.dataset.mode !== 'edit' && Catalog.getAll().some(x=>x.id===payload.id)){
      alert('Ya existe un producto con ese ID.'); return;
    }
    Catalog.upsert(payload);
    refresh();
    DLG.close();
  }
  function fotoForAdmin(f){
  let s = String(f||'');
  s = s.replace(/^\/img\//,'../img/').replace(/^\.\/img\//,'../img/');
  if (!s.startsWith('../img/')) s = '../img/productos/placeholder.png';
  return s;
  }

  function wire(){
    TBODY = $('#tbProductos');
    Q     = $('#pSearch');
    CAT   = $('#pCat');
    BTN_NEW = $('#btnNewProduct');
    DLG   = $('#dlgProducto');
    FORM  = $('#productoForm');
    F = {
      pId: $('#pId'), pNombre: $('#pNombre'), pCategoria: $('#pCategoria'),
      pPrecio: $('#pPrecio'), pFoto: $('#pFoto'), pDesc: $('#pDesc')
    };

    TBODY?.addEventListener('click', onTableClick);
    Q?.addEventListener('input', refresh);
    CAT?.addEventListener('change', refresh);
    BTN_NEW?.addEventListener('click', openNew);
    FORM?.addEventListener('submit', onSubmit);
  }

  // Guardar productos en localStorage
  function guardarProductos(productos) {
    localStorage.setItem("lotuz:productos", JSON.stringify(productos));
  }

  // Leer productos de localStorage
  function obtenerProductos() {
    return JSON.parse(localStorage.getItem("lotuz:productos") || "[]");
  }

  // Al agregar un producto nuevo
  function agregarProducto(nuevoProducto) {
    let productos = obtenerProductos();
    productos.push(nuevoProducto);
    guardarProductos(productos);
  }

  document.addEventListener('DOMContentLoaded', ()=>{ wire(); refresh(); });
})();
