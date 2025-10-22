(function () {
  const $ = (s, r = document) => r.querySelector(s);

  // Carrito
  function getCart() { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } }
  function updateCartCount() {
    const total = getCart().reduce((a, it) => a + Number(it.cantidad || 0), 0);
    const el = $('#cartCount');
    if (el) el.textContent = total > 0 ? `(${total})` : '';
  }

  // Usuario (actual o null)
  function getUser() {
    if (window.Auth?.getUser) return window.Auth.getUser();
    try {
      return JSON.parse(localStorage.getItem('current_user') ||
                        localStorage.getItem('lotuz:session:user') || 'null');
    } catch { return null; }
  }
  const displayName = (u) => (u?.nombre || u?.name || u?.correo || u?.email || 'usuario').split(' ')[0];

  function logout() {
    if (window.Auth?.logout) window.Auth.logout();
    else {
      localStorage.removeItem('current_user');
      localStorage.removeItem('lotuz:session:user');
    }
    renderAuthUI();
    location.href = 'inicio.html';
  }

  function ensureLogoutLink(navUl) {
    let out = $('#navLogout');
    if (!out) {
      const li = document.createElement('li');
      out = document.createElement('a');
      out.id = 'navLogout';
      out.href = '#';
      out.textContent = 'Salir';
      li.appendChild(out);
      navUl.appendChild(li);
    }
    out.onclick = (e) => { e.preventDefault(); logout(); };
    out.style.display = 'inline';
  }

  function renderAuthUI() {
    const user = getUser();
    const navUl = document.querySelector('.nav-menu ul');
    if (!navUl) return;

    // localiza <a> de perfil (login.html o perfil.html)
    let li = [...navUl.children].find(x =>
      x.querySelector('a[href$="login.html"]') || x.querySelector('a[href$="perfil.html"]')
    );
    if (!li) { li = document.createElement('li'); navUl.appendChild(li); }

    let a = li.querySelector('a');
    if (!a) { a = document.createElement('a'); li.appendChild(a); }

    const logoutA = $('#navLogout');

    if (user) {
      a.textContent = `Hola, ${displayName(user)}`;
      a.href = 'perfil.html';
      a.classList.add('active-user');
      ensureLogoutLink(navUl);
    } else {
      a.textContent = 'Perfil';
      a.href = 'login.html';
      a.classList.remove('active-user');
      if (logoutA) logoutA.closest('li')?.remove();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderAuthUI();

    window.addEventListener('storage', (e) => {
      if (e.key === 'current_user' || e.key === 'lotuz:session:user') renderAuthUI();
      if (e.key === 'cart') updateCartCount();
    });
  });
})();
