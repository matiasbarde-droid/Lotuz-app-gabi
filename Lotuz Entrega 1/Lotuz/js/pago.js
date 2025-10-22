// Simulación de pago + creación de orden + limpieza de carrito
(function () {
  const CART_KEY = 'cart';
  const ORDERS_KEY = 'lotuz:orders';
  const SESSION_KEY = 'current_user';
  const CHECKOUT_EMAIL_KEY = 'checkout_email';

  // Helpers genéricos
  const $ = (s, r = document) => r.querySelector(s);
  const money = v => Number(v || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } };
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c || []));
  const getUser = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
  const getOrders = () => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; } };
  const saveOrders = (arr) => localStorage.setItem(ORDERS_KEY, JSON.stringify(arr || []));

  const updateCartCount = () => {
    const c = getCart().reduce((a, it) => a + Number(it.cantidad || 0), 0);
    const el = $('#cartCount'); if (el) el.textContent = c > 0 ? `(${c})` : '';
  };

  const genOrderId = () => {
    // ORD-YYYYMMDD-HHMMSS-XXXX
    const pad = (n) => String(n).padStart(2, '0');
    const d = new Date();
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const s = pad(d.getSeconds());
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `ORD-${y}${m}${day}-${h}${mi}${s}-${rnd}`;
  };

  function render() {
    updateCartCount();

    // Volver
    const btnBack = $('#btnBack');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (document.referrer && document.referrer !== location.href) history.back();
        else location.href = 'carrito.html';
      });
    }

    // Quién paga (usuario o invitado)
    const user = getUser();
    const guestParam = new URLSearchParams(location.search).get('guest') === '1';
    const checkoutEmail = localStorage.getItem(CHECKOUT_EMAIL_KEY) || '';

    const who = $('#who');
    if (who) {
      if (user) {
        const nombre = user.nombre || user.name || '';
        const correo = user.correo || user.email || '';
        const show = nombre ? `${nombre} (${correo || 'sin correo'})` : (correo || 'Cuenta iniciada');
        who.textContent = `Vas a pagar con tu cuenta: ${show}`;
      } else if (guestParam && checkoutEmail) {
        who.textContent = `Vas a pagar como invitado: ${checkoutEmail}`;
      } else {
        who.textContent = 'No se reconoció un método de pago. Vuelve al carrito y elige cómo continuar.';
      }
    }

    // Resumen del carrito
    const cart = getCart();
    const resume = $('#resume');
    const totalEl = $('#total');

    if (!cart.length) {
      resume && (resume.innerHTML = '<p>No hay ítems en el carrito.</p>');
      totalEl && (totalEl.textContent = money(0));
      return;
    }

    const rows = cart.map(it => `
      <div style="display:flex;justify-content:space-between;gap:12px;">
        <span>${it.nombre} × ${it.cantidad}</span>
        <span>${money(Number(it.precio) * Number(it.cantidad))}</span>
      </div>
    `).join('');
    resume && (resume.innerHTML = rows);

    const total = cart.reduce((a, it) => a + Number(it.precio || 0) * Number(it.cantidad || 0), 0);
    totalEl && (totalEl.textContent = money(total));

    // Pagar
    const btnPay = $('#btnPay');
    if (btnPay) {
      btnPay.addEventListener('click', () => {
        const currentCart = getCart();
        if (!currentCart.length) {
          alert('Tu carrito está vacío.');
          location.href = 'carrito.html';
          return;
        }

        // Determinar email vinculante de la orden
        const u = getUser();
        const email = (u?.correo || u?.email || '').trim() || (guestParam ? (checkoutEmail || '').trim() : '');

        if (!email) {
          alert('No se encontró un correo para asociar la compra. Inicia sesión o ingresa tu correo como invitado desde el carrito.');
          location.href = 'carrito.html';
          return;
        }

        const order = {
          id: genOrderId(),
          email,
          userId: u?.id || null,
          items: currentCart.map(it => ({
            id: it.id, nombre: it.nombre, precio: Number(it.precio), cantidad: Number(it.cantidad || 1), foto: it.foto || ''
          })),
          total,
          status: 'Pagado',
          createdAt: new Date().toISOString()
        };

        const orders = getOrders();
        orders.push(order);
        saveOrders(orders);

        // Limpiar carrito y correo de invitado
        saveCart([]);
        localStorage.removeItem(CHECKOUT_EMAIL_KEY);
        updateCartCount();

        alert(`Pago simulado con éxito ✅\nID de compra: ${order.id}`);

        // redirección si hay sesión y mostrar historial; si no a inicio
        if (u) location.href = 'perfil.html';
        else location.href = 'inicio.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();
