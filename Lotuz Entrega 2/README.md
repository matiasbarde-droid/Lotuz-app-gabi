# Lotuz Entrega 2

Este folder contiene la entrega actual (frontend React + backend Spring Boot).

- Frontend: `index.html`, `src/`, `public/`, `package.json`, `vite.config.js`
- Backend: `proyecto_Lotuz/`

## Módulo de Gestión de Usuarios (Admin)

- Ruta: `/admin/usuarios` protegida por `AdminGuard`.
- Lista: búsqueda, filtros (rol/estado/fecha), ordenamiento y paginación. Por defecto, muestra solo CLIENTE y oculta el usuario admin actual.
- Exportación: CSV y Excel (`src/utils/export.js`).
- Formularios: creación y edición con validación en tiempo real y medidor de contraseña.
- Desactivación: reemplaza eliminación física marcando `activo=false`.
- API:
  - `GET /api/admin/usuarios` admite `q`, `rol`, `activo`, `from`, `to`, `page`, `size`, `sort`.
  - `POST /api/admin/usuarios` crea usuario.
  - `PUT /api/admin/usuarios/{id}` actualiza usuario.
  - `DELETE /api/admin/usuarios/{id}` desactiva usuario.
  - `POST /api/admin/audit` registra eventos administrativos.

Seguridad: verificación de rol en frontend, cabecera CSRF (`X-XSRF-TOKEN`) en cliente HTTP.

### Corrección de `formatRut`
- Causa raíz: `src/utils/validators.js` no exportaba `formatRut` consumido por `UserForm.jsx`.
- Solución: se incorporó `formatRut` que limpia puntos y añade guion antes del dígito verificador.
- Pruebas: verificación en dev sin errores de módulo y flujo de guardado exitoso.
