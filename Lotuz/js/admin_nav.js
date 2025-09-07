// Marca activo en el menú admin según la URL
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const path = location.pathname.split("/").pop();
    document.querySelectorAll(".nav-menu a").forEach(a => {
      const href = a.getAttribute("href");
      if (href && href.endsWith(path)) a.classList.add("active");
    });
  });
})();
