// Utilidades generales
window.Utils = (function() {
  const loadComponent = (selector, path) => {
    return new Promise((resolve, reject) => {
      $(selector).load(path, function(response, status) {
        if (status === 'error') reject(new Error('No se pudo cargar ' + path));
        else resolve();
      });
    });
  };

  const formatCurrency = (value, currency = 'PEN') => {
    const n = Number(value || 0);
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(n);
  };

  const debounce = (fn, delay = 250) => {
    let t = null;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const paginate = (items, page = 1, perPage = 10) => {
    const total = items.length;
    const pages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return { page, perPage, pages, total, data: items.slice(start, end) };
  };

  return { loadComponent, formatCurrency, debounce, paginate };
})();