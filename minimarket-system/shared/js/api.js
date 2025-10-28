// Capa de API (simulada con AJAX)
window.API = (function() {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const get = async (url) => {
    await delay(200);
    // Simulación: devolver datos según recurso
    if (url.includes('minimarkets')) {
      return [
        { id: 1, nombre: 'Sucursal Centro', estado: 'Activa' },
        { id: 2, nombre: 'Sucursal Norte', estado: 'Activa' },
        { id: 3, nombre: 'Sucursal Sur', estado: 'Inactiva' }
      ];
    }
    if (url.includes('productos')) {
      return [
        { id: 101, nombre: 'Leche', precio: 4.5, stock: 30 },
        { id: 102, nombre: 'Pan', precio: 1.2, stock: 100 },
        { id: 103, nombre: 'Arroz', precio: 3.8, stock: 60 }
      ];
    }
    return [];
  };

  const post = async (url, data) => {
    await delay(200);
    return { ok: true, data };
  };

  const put = async (url, data) => {
    await delay(200);
    return { ok: true, data };
  };

  const del = async (url) => {
    await delay(200);
    return { ok: true };
  };

  return { get, post, put, del };
})();