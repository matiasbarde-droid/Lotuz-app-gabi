/* modulo simple de auth basado en localStorage */
(function () {
  const USERS_KEY   = 'users';
  const CURRENT_KEY = 'current_user';

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch { return []; }
  }
  function saveUsers(arr) {
    localStorage.setItem(USERS_KEY, JSON.stringify(arr || []));
  }
  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'); }
    catch { return null; }
  }
  function setCurrentUser(u) {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(u));
    // notificar a otras pestañas y a session.js
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: CURRENT_KEY, newValue: JSON.stringify(u) }));
    } catch {} /* algunos navegadores no permiten construir StorageEvent */ 
  }
  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_KEY);
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: CURRENT_KEY, newValue: null }));
    } catch {}
  }

  // Helpers
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v||'').trim());
  const passOk  = (v) => String(v||'').length >= 6;   // coherente con el form

  function uniqueEmail(correo, exceptUserId=null){
    const users = loadUsers();
    const e = (correo||'').toLowerCase();
    return !users.some(u => (u.correo||u.email||'').toLowerCase() === e && u.id !== exceptUserId);
  }

  // API
  function signIn(email, password) {
    const e = (email || '').trim().toLowerCase();
    if (!emailOk(e))   return { ok:false, msg:'Correo inválido' };
    if (!passOk(password)) return { ok:false, msg:'Contraseña inválida' };

    const users = loadUsers();
    const user  = users.find(u => (u.correo || u.email || '').toLowerCase() === e);
    if (!user)           return { ok:false, msg:'Usuario no existe' };
    if (String(user.password || '') !== String(password)) {
      return { ok:false, msg:'Contraseña incorrecta' };
    }
    setCurrentUser(user);
    return { ok:true, user };
  }

  function signUp(data) {
    const correo = (data.correo || data.email || '').trim().toLowerCase();
    if (!data.nombre || !emailOk(correo) || !passOk(data.password)) {
      return { ok:false, msg:'Completa nombre, correo válido y contraseña (≥6)' };
    }
    if (!uniqueEmail(correo)) {
      return { ok:false, msg:'Ya existe una cuenta con ese correo' };
    }

    const user = {
      id: cryptoRandomId(),
      nombre: data.nombre.trim(),
      correo,
      password: String(data.password),
      rut: data.rut || '',
      telefono: data.telefono || '',
      pais: data.pais || 'Chile',
      region: data.region || '',
      comuna: data.comuna || '',
      direccion: data.direccion || '',
      createdAt: new Date().toISOString()
    };
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
    setCurrentUser(user);
    return { ok:true, user };
  }

  function updateProfile(patch) {
    const user = getCurrentUser();
    if (!user) return { ok:false, msg:'No hay sesión' };

    // Evitar duplicar correo si lo cambian
    if (patch.correo && !uniqueEmail(patch.correo, user.id)) {
      return { ok:false, msg:'Ese correo ya está en uso.' };
    }

    const users = loadUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return { ok:false, msg:'Usuario no encontrado' };

    const updated = { ...users[idx], ...patch };
    users[idx] = updated;
    saveUsers(users);
    setCurrentUser(updated);
    return { ok:true, user: updated };
  }

  function logout() { clearCurrentUser(); }

  function cryptoRandomId() {
    try {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11)
        .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    } catch {
      return 'u_' + Math.random().toString(36).slice(2);
    }
  }

  window.Auth = {
    getUser: getCurrentUser,
    isLoggedIn: () => !!getCurrentUser(),
    logout,
    signIn,
    signUp,
    updateProfile,
    _loadUsers: () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  };
})();
