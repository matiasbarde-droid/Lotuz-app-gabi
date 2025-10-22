// Protege rutas /admin (excepto admin-login.html) y maneja logout
(() => {
  const isLogin = /admin-login\.html$/i.test(location.pathname);
  function getAdmin() {
    try { return JSON.parse(localStorage.getItem("lotuz:admin") || "null"); }
    catch { return null; }
  }
  function signOut() {
    localStorage.removeItem("lotuz:admin");
    location.href = "admin-login.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const admin = getAdmin();

    if (!isLogin && !admin?.logged) {
      location.href = "admin-login.html";
      return;
    }

    const out = document.getElementById("adminLogout");
    if (out) out.addEventListener("click", (e) => { e.preventDefault(); signOut(); });
  });
})();
