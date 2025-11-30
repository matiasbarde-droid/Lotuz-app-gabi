// src/utils/validators.js

/**
 * Valida si un email tiene formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email || '');
};

/**
 * Valida si un email institucional de DuocUC es correcto
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validateInstitutionalEmail = (email) => {
  const re = /^[^\s@]+@(profesor\.duoc\.cl|duocuc\.cl)$/i;
  return re.test(email || '');
};

/**
 * Valida si un RUT chileno tiene formato correcto
 * Requiere guion y NO permite puntos. Ej: 12345678-9
 * @param {string} rut - RUT a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validateRut = (rut) => {
  if (!rut) return false;
  // Debe ser solo dígitos, guion y dígito verificador
  const reFormato = /^[0-9]{7,8}-[0-9kK]$/;
  if (!reFormato.test(rut)) return false;

  const [cuerpo, dvChar] = rut.split('-');
  const dv = dvChar.toLowerCase();

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'k' : dvEsperado.toString();

  return dv === dvCalculado;
};

/**
 * Valida si un número de teléfono tiene exactamente 9 dígitos
 * No requiere que comience con 9.
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const validatePhone = (phone) => {
  const re = /^\d{9}$/;
  return re.test((phone || '').replace(/\s+/g, ''));
};

export const validatePassword = (password, min = 8) => {
  return typeof password === 'string' && password.length >= min;
};

/**
 * Formatea un RUT chileno mientras se escribe
 * - Remueve puntos
 * - Inserta guion antes del dígito verificador
 * Ej: 12345678K -> 12345678-K
 */
export const formatRut = (value) => {
  if (!value) return '';
  const clean = String(value).replace(/\./g, '').replace(/[^0-9kK]/g, '');
  if (clean.length <= 1) return clean.toUpperCase();
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  return `${cuerpo}-${dv}`;
};
