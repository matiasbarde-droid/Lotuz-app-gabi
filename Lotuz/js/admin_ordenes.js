(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const money = v=>Number(v||0).toLocaleString('es-CL',{style:'currency',currency:'CLP'});
  const KEY = 'lotuz:orders';
  const ESTADOS = ['Pagado','Preparando','Despachado','Entregado','Anulado','Reembolsado'];

  let TBODY, Q, FILT, DLG, DTL, BTN_ANU, BTN_REEM, BTN_CERRAR;
  let CURRENT_ID = null;

  const getOrders = ()=>{ try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch{return[];} };
  const saveOrders = (a)=>localStorage.setItem(KEY, JSON.stringify(a||[]));

  function filtered(){
    const q = (Q?.value||'').trim().toLowerCase();
    const f = (FILT?.value||'all');
    let arr = getOrders();
    if (f!=='all') arr = arr.filter(o=>(o.status||'Pagado')===f);
    if (q) arr = arr.filter(o =>
      (o.id||'').toLowerCase().includes(q) ||
      (o.email||'').toLowerCase().includes(q)
    );
    return arr.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  }

  function render(){
    const list = filtered();
    if(!list.length){ TBODY.innerHTML = `<tr><td colspan="7" style="color:#b6b6b6">No hay órdenes.</td></tr>`; return; }
    TBODY.innerHTML = list.map(o=>{
      const d = new Date(o.createdAt||Date.now());
      const when = `${d.toLocaleDateString('es-CL')} ${d.toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})}`;
      const items = (o.items||[]).reduce((a,it)=>a+Number(it.cantidad||0),0);
      const sel = `<select class="ord-status">${ESTADOS.map(s=>`<option ${s===(o.status||'Pagado')?'selected':''}>${s}</option>`).join('')}</select>`;
      return `
        <tr data-id="${o.id}">
          <td>#${o.id}</td>
          <td>${when}</td>
          <td>${(o.email||'').toLowerCase()}</td>
          <td>${items}</td>
          <td>${money(o.total||0)}</td>
          <td>${sel}</td>
          <td>
            <button class="btn btn-ghost act-ver">Ver</button>
            <button class="btn btn-ghost act-del">Eliminar</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openDetail(o){
    CURRENT_ID = o.id;
    const lines = (o.items||[]).map(it=>`<li>${it.nombre} × ${it.cantidad} — ${money(it.precio*it.cantidad)}</li>`).join('');
    DTL.innerHTML = `
      <p><strong>Orden:</strong> #${o.id}</p>
      <p><strong>Cliente:</strong> ${(o.email||'').toLowerCase()}</p>
      <p><strong>Total:</strong> ${money(o.total||0)}</p>
      <p><strong>Estado:</strong> ${o.status||'Pagado'}</p>
      <ul style="margin:8px 0 0 18px;color:#d8d8d8;line-height:1.5;">${lines}</ul>
    `;
    DLG.showModal();
  }

  function onTableClick(e){
    const tr = e.target.closest('tr[data-id]'); if(!tr) return;
    const id = tr.dataset.id;
    if (e.target.classList.contains('act-ver')){
      const o = getOrders().find(x=>x.id===id); if(o) openDetail(o);
    }
    if (e.target.classList.contains('act-del')){
      if(!confirm('¿Eliminar esta orden?')) return;
      saveOrders(getOrders().filter(x=>x.id!==id)); render();
    }
  }

  function onChange(e){
    if (!e.target.classList.contains('ord-status')) return;
    const tr = e.target.closest('tr[data-id]'); if(!tr) return;
    const id = tr.dataset.id, val = e.target.value;
    const arr = getOrders(); const i = arr.findIndex(x=>x.id===id);
    if (i>=0){ arr[i].status = val; saveOrders(arr); }
  }

  function wire(){
    TBODY = $('#tbOrdenes');
    Q     = $('#oSearch');
    FILT  = $('#oEstado');
    DLG   = $('#dlgOrden');
    DTL   = $('#ordenDetalle');
    BTN_ANU  = $('#btnMarcarAnulado');
    BTN_REEM = $('#btnMarcarReembolsado');
    BTN_CERRAR = $('#btnCerrarOrden');

    TBODY?.addEventListener('click', onTableClick);
    TBODY?.addEventListener('change', onChange);
    Q?.addEventListener('input', render);
    FILT?.addEventListener('change', render);

    BTN_ANU?.addEventListener('click', ()=>{
      const arr = getOrders(); const i = arr.findIndex(o=>o.id===CURRENT_ID);
      if(i>=0){ arr[i].status='Anulado'; saveOrders(arr); render(); }
      DLG.close();
    });
    BTN_REEM?.addEventListener('click', ()=>{
      const arr = getOrders(); const i = arr.findIndex(o=>o.id===CURRENT_ID);
      if(i>=0){ arr[i].status='Reembolsado'; saveOrders(arr); render(); }
      DLG.close();
    });
    BTN_CERRAR?.addEventListener('click', ()=>DLG.close());
  }

  document.addEventListener('DOMContentLoaded', ()=>{ wire(); render(); });
})();
