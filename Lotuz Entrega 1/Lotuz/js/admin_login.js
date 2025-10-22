// Admin login simple
(() => {
  const $ = (s, r = document) => r.querySelector(s);

  function saveAdmin(session) {
    localStorage.setItem("lotuz:admin", JSON.stringify(session));
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim());
  }

  document.addEventListener("DOMContentLoaded", () => {
    const f = $("#adminLoginForm");
    if (!f) return;

    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#adminEmail")?.value.trim().toLowerCase();
      const pass = $("#adminPass")?.value;

      if (!isValidEmail(email) || !pass) {
        alert("Ingresa correo válido y contraseña.");
        return;
      }

      saveAdmin({ email, logged: true, name: "Admin" });
      location.href = "admin.html";
    });
  });
})();
