// catálogo único para cliente y admin
(() => {
  const KEY = 'lotuz:catalog';

  // guardamos siempre rutas '../img/...'
  const toRelImg = (p = '') =>
    String(p)
      .replace(/^\.?\/img\//, '../img/')
      .replace(/^img\//, '../img/')
      .replace(/^\.\.\/img\//, '../img/'); 

  // Seeds
  const SEED = [
    { id:'artisan_rojo1',  nombre:'Artisan Rojo', categoria:'mousepad',  precio:74990,  foto:'../img/productos/artisan_rojo1.png',  descripcion:'Mousepad con superficie control y base antideslizante.' },
    { id:'raypad_azul1',   nombre:'X-Raypad Azul',categoria:'mousepad',  precio:39990,  foto:'../img/productos/raypad_azul1.png',   descripcion:'Mousepad speed azul; bordes cosidos premium.' },
    { id:'raypad_rosado1', nombre:'X-Raypad Rosado',categoria:'mousepad',precio:40990,  foto:'../img/productos/raypad_rosado1.png',  descripcion:'Mousepad speed rosado; base de goma de alta densidad.' },

    { id:'mouse_logi_rosa1', nombre:'Logitech Superlight', categoria:'mouse', precio:115990, foto:'../img/productos/mouse_logi_rosa1.png', descripcion:'Edición rosa; ligero y ergonómico.' },
    { id:'mouse_mitsuri',    nombre:'Mouse Pulsar Mitsuri', categoria:'mouse', precio:132990, foto:'../img/productos/mouse_mitsuri.png',    descripcion:'Precisión y estabilidad.' },
    { id:'razer_mouse1',     nombre:'Razer Deathadder v3',  categoria:'mouse', precio:145990, foto:'../img/productos/razer_mouse1.png',     descripcion:'Switches ópticos.' },

    { id:'audifonos_logi1',  nombre:'Audífonos Logitech Aurora', categoria:'audifonos', precio:215990, foto:'../img/productos/audifonos_logi1.png', descripcion:'Sonido envolvente.' },
    { id:'hyperx_cloud1',    nombre:'HyperX Cloud Flight',      categoria:'audifonos', precio:105990, foto:'../img/productos/hyperx_cloud1.png',     descripcion:'Comodidad legendaria.' },
    { id:'razer_kittynegros',nombre:'Razer Kitty Negros',       categoria:'audifonos', precio:99990,  foto:'../img/productos/razer_kittynegros.png', descripcion:'Orejas iluminadas.' },

    { id:'logitech_teclado_rosa', nombre:'Teclado Logitech Pro', categoria:'teclado', precio:179990, foto:'../img/productos/logitech_teclado_rosa.png', descripcion:'Compacto, RGB.' },
    { id:'teclado_aurora',        nombre:'Teclado Aurora',       categoria:'teclado', precio:189990, foto:'../img/productos/teclado_aurora.png',        descripcion:'TKL y keycaps premium.' },
    { id:'tecladoatk_rosado1',    nombre:'Teclado ATK Rosado',   categoria:'teclado', precio:75990,  foto:'../img/productos/tecladoatk_rosado1.png',    descripcion:'Layout cómodo.' }
  ].map(p => ({ ...p, foto: toRelImg(p.foto) }));

  // normaliza rutas y repone la seed si faltan ids
  function load() {
    let arr;
    try { arr = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
    if (!Array.isArray(arr)) arr = [];

    // normaliza lo que hubiera en foto
    arr = arr.map(p => ({ ...p, foto: toRelImg(p.foto) }));

    // repone lo faltante sin borrar lo que ya tengo
    const ids = new Set(arr.map(p => p.id));
    SEED.forEach(s => { if (!ids.has(s.id)) arr.push({ ...s }); });

    localStorage.setItem(KEY, JSON.stringify(arr));
    return arr;
  }

  function getAll() { return load(); }

  function saveAll(list) {
    const clean = (list || []).map(p => ({ ...p, foto: toRelImg(p.foto) }));
    localStorage.setItem(KEY, JSON.stringify(clean));
  }

  function upsert(p) {
    const all = getAll();
    const i = all.findIndex(x => x.id === p.id);
    const next = { ...(i >= 0 ? all[i] : {}), ...p, foto: toRelImg(p.foto) };
    if (i >= 0) all[i] = next; else all.push(next);
    saveAll(all);
    return next;
  }

  function remove(id) {
    saveAll(getAll().filter(p => p.id !== id));
  }

  // (Opcional) restablecer con merge sin perder lo que tengo
  function repair() { load(); }

  window.Catalog = { KEY, getAll, saveAll, upsert, remove, repair };
})();
