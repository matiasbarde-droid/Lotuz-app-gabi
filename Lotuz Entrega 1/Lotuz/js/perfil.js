(function () {
  const ORDERS_KEY = 'lotuz:orders';
  const SESSION_KEY = 'current_user';
  const USERS_KEYS = ['users', 'lotuz:users']; // compatibilidad

  const $ = (s, r = document) => r.querySelector(s);
  const money = v => Number(v || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  const getCart = () => { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } };
  const updateCartCount = () => {
    const c = getCart().reduce((a, it) => a + Number(it.cantidad || 0), 0);
    const el = $('#cartCount'); if (el) el.textContent = c > 0 ? `(${c})` : '';
  };

  const getUser = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
  const setUser = (u) => localStorage.setItem(SESSION_KEY, JSON.stringify(u));

  const getOrders = () => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; } };
  const saveOrders = (arr) => localStorage.setItem(ORDERS_KEY, JSON.stringify(arr || []));

  function loadUsers() {
    // Lee 'users' o 'lotuz:users' 
    for (const k of USERS_KEYS) {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(arr) && arr.length >= 0) return { key: k, list: arr };
      } catch { /* ignore */ }
    }
    return { key: USERS_KEYS[0], list: [] }; // por defecto 'users'
  }
  function saveUsers(key, list) {
    localStorage.setItem(key, JSON.stringify(list || []));
    const legacy = USERS_KEYS.find(k => k !== key);
    if (legacy) localStorage.setItem(legacy, JSON.stringify(list || []));
  }

  const getEmail = (u) => (u?.correo || u?.email || '').trim();
  const getName = (u) => (u?.nombre || u?.name || '').trim();
  const getPhone = (u) => (u?.telefono || u?.phone || '').trim();
  const getAddress = (u) => (u?.direccion || u?.address || '').trim();

  function requireAuth() {
    const u = getUser();
    if (!u) {
      location.href = 'login.html?return=perfil.html';
      return null;
    }
    return u;
  }

  // Render resumen
  function renderSummary(u, myOrders) {
    $('#hello').textContent = `Mi cuenta · ${getName(u) || getEmail(u) || 'Usuario'}`;
    $('#summaryLine').textContent = `Hola, ${getName(u) || getEmail(u) || 'usuario'}. Tienes ${myOrders.length} compra(s) registradas.`;
  }

  // Render historial
  function renderOrders(u) {
    const email = getEmail(u).toLowerCase();
    const all = getOrders();
    const mine = all.filter(o => (o.email || '').toLowerCase() === email);

    const empty = $('#ordersEmpty');
    const list = $('#ordersList');

    if (!mine.length) {
      if (empty) empty.style.display = 'block';
      if (list) list.innerHTML = '';
      return [];
    }
    if (empty) empty.style.display = 'none';

    const rows = mine
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(o => {
        const when = new Date(o.createdAt || Date.now());
        const fDate = when.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const fTime = when.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const itemsCount = (o.items || []).reduce((acc, it) => acc + Number(it.cantidad || 0), 0);
        const itemsHtml = (o.items || []).map(it =>
          `<li>${it.nombre} × ${it.cantidad} — ${money(Number(it.precio) * Number(it.cantidad))}</li>`
        ).join('');

        return `
          <tr>
            <td>#${o.id || '—'}</td>
            <td>${fDate} ${fTime}</td>
            <td>${itemsCount}</td>
            <td>${money(o.total || 0)}</td>
            <td>${o.status || 'Pagado'}</td>
            <td>
              <details>
                <summary class="btn btn-ghost" style="display:inline-block; padding:6px 10px;">Ver</summary>
                <ul style="margin:8px 0 0 16px; color:#b6b6b6;">${itemsHtml}</ul>
              </details>
            </td>
          </tr>
        `;
      }).join('');

    list.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Orden</th><th>Fecha</th><th>Ítems</th><th>Total</th><th>Estado</th><th>Detalle</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    return mine;
  }

  // Form cuenta
  function fillAccountForm(u) {
    $('#accName').value = getName(u);
    $('#accEmail').value = getEmail(u);
    $('#accPhone').value = getPhone(u);
    $('#accAddress').value = getAddress(u);
  }

  function handleAccountSave(u) {
    const form = $('#accountForm');
    if (!form) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();

      if (!confirm('¿Guardar cambios en tu cuenta?')) return;

      const name = $('#accName').value.trim();
      const email = $('#accEmail').value.trim().toLowerCase();
      const phone = $('#accPhone').value.trim();
      const address = $('#accAddress').value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        alert('Ingresa un correo válido.');
        return;
      }

      const { key, list } = loadUsers();
      const currentId = u.id || null;
      const oldEmail = getEmail(u).toLowerCase();

      // Evitar correos duplicados
      const clash = list.find(x =>
        (x.id ? x.id !== currentId : true) &&
        ((x.correo || x.email || '').toLowerCase() === email)
      );
      if (clash) {
        alert('Ese correo ya está en uso por otra cuenta.');
        return;
      }

      // Encontrar registro del usuario
      const idx = list.findIndex(x =>
        (currentId && x.id === currentId) ||
        (!currentId && (x.correo || x.email) === (u.correo || u.email))
      );

      const updated = {
        ...list[idx >= 0 ? idx : list.length], // si no esta tomamos uno nuevo
        id: currentId || (u.id ?? `u_${Math.random().toString(36).slice(2)}`),
        nombre: name || (u.nombre || u.name || ''),
        correo: email,
        password: u.password || '', // preserva si existia
        telefono: phone,
        direccion: address,
        region: u.region || '',
        comuna: u.comuna || '',
        rut: u.rut || ''
      };

      if (idx >= 0) list[idx] = updated;
      else list.push(updated);

      saveUsers(key, list);
      setUser(updated);

      // si el email cambio migrar órdenes a nueva casilla
      if (oldEmail && oldEmail !== email) {
        const orders = getOrders();
        let touched = 0;
        orders.forEach(o => {
          if ((o.email || '').toLowerCase() === oldEmail) { o.email = email; touched++; }
        });
        if (touched) saveOrders(orders);
      }

      // feedback
      const msg = $('#accountMsg');
      if (msg) { msg.style.display = 'inline'; setTimeout(() => msg.style.display = 'none', 1500); }

      // refrescar encabezado
      $('#hello').textContent = `Mi cuenta · ${name || email}`;
    });
  }

  function handleLogout() {
    const btn = $('#btnLogout');
    if (btn) {
      btn.addEventListener('click', () => {
        localStorage.removeItem(SESSION_KEY);
        location.href = 'inicio.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const u = requireAuth();
    if (!u) return;

    fillAccountForm(u);

    const mine = renderOrders(u);
    renderSummary(u, mine);

    handleAccountSave(u);
    handleLogout();
  });
})();
