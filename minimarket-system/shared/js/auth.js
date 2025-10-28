// Autenticación y autorización (UI)
window.Auth = (function() {
  const KEY = 'mm_session';

  const login = async ({ usuario, password, rol }) => {
    // Validación simple (simulada)
    if (!usuario || !password) return { ok: false, error: 'Credenciales requeridas' };
    const session = { usuario, rol: rol || 'sucursal', ts: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(session));
    return { ok: true, session };
  };

  const logout = () => { localStorage.removeItem(KEY); };
  const getSession = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
    catch { return null; }
  };

  const requireRole = (roles = []) => {
    const s = getSession();
    if (!s) return false;
    if (!roles.length) return true;
    return roles.includes(s.rol);
  };

  return { login, logout, getSession, requireRole };
})();