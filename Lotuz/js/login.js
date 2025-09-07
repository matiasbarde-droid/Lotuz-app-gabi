/* login/registro con Auth + regiones de Chile + validadores RUT/celular */
(function () {
  const $ = (s, r=document) => r.querySelector(s);
  const getParam = (k) => new URLSearchParams(location.search).get(k);
  const go = (url) => location.href = url;

  function show(view) {
    const vLogin = $('#viewLogin'), vReg = $('#viewRegister');
    if (!vLogin || !vReg) return;
    if (view === 'reg') { vLogin.style.display='none'; vReg.style.display=''; }
    else                { vLogin.style.display='';    vReg.style.display='none'; }
  }

  function toast(msg){ alert(msg); }

  // validadores rut
  const onlyDigits = (v) => String(v || '').replace(/\D+/g, '');

  function sanitizeRutAllowLastK(v) {
    let s = String(v || '').toUpperCase().replace(/[.\-]/g, '').replace(/[^0-9K]/g, '');
    const hadK = s.includes('K');
    s = s.replace(/K/g, '');       // remueve Ks
    if (hadK) s = s + 'K';         // si había K, agrega una al final
    return s;
  }

  // Valida rut 7–9 dígitos + opcional K solo al final
  function isValidRutAllowLastK(v) {
    const s = sanitizeRutAllowLastK(v);
    if (/K/.test(s) && !/K$/.test(s)) return false; // K solo al final
    const body = s.replace(/K$/, '');
    return /^\d{7,9}$/.test(body);
  }

  // Teléfono exactamente 9 dígitos
  function isValidPhoneCL(v) {
    return /^\d{9}$/.test(onlyDigits(v));
  }

  function showErr(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
    el.style.display = msg ? 'inline' : 'none';
  }

  const REGIONES = [
    'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo',
    'Valparaíso','Metropolitana de Santiago','O’Higgins','Maule','Ñuble',
    'Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes'
  ];
  const COMUNAS = {
    'Metropolitana de Santiago': ['Santiago','Maipú','Puente Alto','Las Condes','Ñuñoa','Otra'],
    'Valparaíso': ['Valparaíso','Viña del Mar','Quilpué','Villa Alemana','Otra'],
    'Biobío': ['Concepción','Talcahuano','San Pedro de la Paz','Otra'],
    'La Araucanía': ['Temuco','Padre Las Casas','Otra'],
    'Los Lagos': ['Puerto Montt','Puerto Varas','Osorno','Otra']
  };
  function fillRegiones(sel){
    sel.innerHTML = '<option value="">Selecciona región</option>' +
      REGIONES.map(r=>`<option>${r}</option>`).join('');
  }
  function fillComunas(sel, region){
    const arr = COMUNAS[region] || ['Otra'];
    sel.innerHTML = arr.map(c=>`<option>${c}</option>`).join('');
  }

  function wireRegisterLocation() {
    const country = $('#regCountry'), reg = $('#regRegion'), com = $('#regComuna');
    const wrapRegTxt = $('#wrapRegionText'), wrapComTxt = $('#wrapComunaText');
    const regTxt = $('#regRegionText'), comTxt = $('#regComunaText');
    if (!country) return;

    function toggle() {
      const isCL = country.value === 'Chile';
      $('#wrapRegion').style.display = isCL ? '' : 'none';
      $('#wrapComuna').style.display = isCL ? '' : 'none';
      wrapRegTxt.style.display = isCL ? 'none' : '';
      wrapComTxt.style.display = isCL ? 'none' : '';

      reg.required = isCL; com.required = isCL;
      regTxt.required = !isCL; comTxt.required = !isCL;

      if (isCL) {
        fillRegiones(reg);
        reg.onchange = () => fillComunas(com, reg.value);
        reg.dispatchEvent(new Event('change'));
      } else {
        reg.value = com.value = '';
        regTxt.value = comTxt.value = '';
      }
    }

    country.addEventListener('change', toggle);
    toggle();
  }

  function goNext() {
    const ret = getParam('return');
    go(ret || 'perfil.html');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Si ya hay sesión redirige
    if (window.Auth?.isLoggedIn()) return go(getParam('return') || 'perfil.html');

    const fLogin = $('#loginForm');
    fLogin?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#loginEmail')?.value || '';
      const pass  = $('#loginPass')?.value || '';
      const res = window.Auth.signIn(email, pass);
      if (!res.ok) return toast(res.msg);
      goNext();
    });

    /* Registro con validación de RUT y teléfono */
    wireRegisterLocation();

    const fReg      = $('#registerForm');
    const inRut     = $('#regRut');
    const inPhone   = $('#regPhone');
    const errRut    = $('#errRegRut');
    const errPhone  = $('#errRegPhone');

    // validación RUT
    inRut && inRut.addEventListener('input', () => {
      const san = sanitizeRutAllowLastK(inRut.value);
      if (san !== inRut.value) inRut.value = san;
      const ok = isValidRutAllowLastK(inRut.value);
      showErr(errRut, ok ? '' : 'RUN/RUT inválido. Solo números y “K” al final (7–9 dígitos + DV).');
    });

    // validación teléfono (solo dígitos, 9)
    inPhone && inPhone.addEventListener('input', () => {
      const san = onlyDigits(inPhone.value);
      if (san !== inPhone.value) inPhone.value = san;
      const ok = isValidPhoneCL(inPhone.value);
      showErr(errPhone, ok ? '' : 'Teléfono inválido. Debe tener 9 dígitos (ej: 912345678).');
    });

    fReg?.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validar RUT y teléfono antes de armar payload
      let ok = true;

      if (inRut) {
        inRut.value = sanitizeRutAllowLastK(inRut.value);
        const v = isValidRutAllowLastK(inRut.value);
        showErr(errRut, v ? '' : 'RUN/RUT inválido. Solo números y “K” al final (7–9 dígitos + DV).');
        ok = ok && v;
      }

      if (inPhone) {
        inPhone.value = onlyDigits(inPhone.value);
        const v = isValidPhoneCL(inPhone.value);
        showErr(errPhone, v ? '' : 'Teléfono inválido. Debe tener 9 dígitos (ej: 912345678).');
        ok = ok && v;
      }

      if (!ok) {
        (inRut && errRut?.textContent) ? inRut.focus() :
        (inPhone && errPhone?.textContent) ? inPhone.focus() : null;
        return; // no seguimos si hay error
      }

      const isCL = ($('#regCountry')?.value || 'Chile') === 'Chile';
      const payload = {
        nombre:    $('#regName')?.value || '',
        correo:    $('#regEmail')?.value || '',
        password:  $('#regPass')?.value || '',
        rut:       inRut?.value || '',
        telefono:  inPhone?.value || '',
        pais:      $('#regCountry')?.value || 'Chile',
        region:    isCL ? ($('#regRegion')?.value || '') : ($('#regRegionText')?.value || ''),
        comuna:    isCL ? ($('#regComuna')?.value || '') : ($('#regComunaText')?.value || ''),
        direccion: $('#regAddress')?.value || ''
      };

      const res = window.Auth.signUp(payload);
      if (!res.ok) return toast(res.msg);
      goNext();
    });

    $('#goRegister')?.addEventListener('click', (e)=>{ e.preventDefault(); show('reg'); });
    $('#goLogin')?.addEventListener('click', (e)=>{ e.preventDefault(); show('login'); });

    show('login');
  });
})();
