/* pagos simulado + creación de órdenes */
(function () {
  const ORDERS_KEY = 'lotuz:orders';

  // Helpers de almacenamiento 
  function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
    catch { return []; }
  }
  function setOrders(arr) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(arr || []));
  }

  // Helpers generales 
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  function orderId() {
    return 'LZ-' +
      Date.now().toString(36).toUpperCase() + '-' +
      Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  function paymentId() {
    return 'PAY_' +
      Math.random().toString(36).slice(2, 10).toUpperCase();
  }
  function authCode() {
    return 'AP' + Math.floor(100000 + Math.random() * 900000);
  }

  function getIdem(key) {
    if (!key) return null;
    try { return JSON.parse(localStorage.getItem('mock:idem:' + key) || 'null'); }
    catch { return null; }
  }
  function setIdem(key, value) {
    if (!key) return;
    localStorage.setItem('mock:idem:' + key, JSON.stringify(value));
  }

  // API pago
  async function charge({ amount, currency = 'CLP', email, idempotencyKey, forceStatus } = {}) {
    const cached = getIdem(idempotencyKey);
    if (cached) return cached;

    // Latencia simulada
    await delay(900 + Math.random() * 1200);

    let result;
    if (forceStatus === 'ok') {
      result = { ok: true, data: { paymentId: paymentId(), status: 'paid', authCode: authCode(), amount, currency, email } };
    } else if (forceStatus === 'declined') {
      result = { ok: false, error: 'DECLINED', message: 'Pago rechazado por el emisor.' };
    } else if (forceStatus === 'error') {
      result = { ok: false, error: 'NETWORK', message: 'Error de red/timeout.' };
    } else {

      const r = Math.random();
      if (r < 0.82) {
        result = { ok: true, data: { paymentId: paymentId(), status: 'paid', authCode: authCode(), amount, currency, email } };
      } else if (r < 0.94) {
        result = { ok: false, error: 'DECLINED', message: 'Fondos insuficientes o verificación fallida.' };
      } else {
        result = { ok: false, error: 'NETWORK', message: 'No se pudo contactar al procesador.' };
      }
    }

    // Guardar resultado 
    setIdem(idempotencyKey, result);
    return result;
  }

  // API orders
  async function createOrder({ email, userId, items, total, mode = 'user', payment }) {
    await delay(300 + Math.random() * 600); // latencia corta
    const order = {
      id: orderId(),
      email: (email || '').toLowerCase(),
      userId: userId || null,
      items: (items || []).map(i => ({
        id: i.id, nombre: i.nombre, precio: +i.precio || 0, cantidad: +i.cantidad || 0
      })),
      total: +total || 0,
      status: 'Pagado',
      createdAt: new Date().toISOString(),
      mode,
      payment 
    };
    const all = getOrders();
    all.push(order);
    setOrders(all);
    return { ok: true, order };
  }

  // API “checkout
  async function chargeAndCreateOrder({ cart, buyer, idempotencyKey, forceStatus } = {}) {
    const total = (cart || []).reduce((a, it) => a + (+it.precio || 0) * (+it.cantidad || 0), 0);
    if (!total) return { ok: false, message: 'Carrito vacío.' };

    const email = (buyer?.email || '').toLowerCase();

    //  Cobro
    const res = await charge({
      amount: total,
      currency: 'CLP',
      email,
      idempotencyKey,
      forceStatus
    });

    if (!res.ok) {
      return { ok: false, stage: 'payment', ...res };
    }

    // Crear orden
    const payment = res.data;
    const orderRes = await createOrder({
      email,
      userId: buyer?.userId || null,
      items: cart,
      total,
      mode: buyer?.mode || 'user',
      payment
    });

    return orderRes.ok
      ? { ok: true, order: orderRes.order }
      : { ok: false, stage: 'order', message: 'No se pudo registrar la orden.' };
  }

  // Exponer en ventana
  window.MockApi = {
    payments: { charge },
    orders: { create: createOrder },
    checkout: { chargeAndCreateOrder }
  };
})();
