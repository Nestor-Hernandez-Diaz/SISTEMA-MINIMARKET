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
    if (url.includes('categorias')) {
      return [
        { id: 1, nombre: 'Lácteos', descripcion: 'Productos lácteos' },
        { id: 2, nombre: 'Panadería', descripcion: 'Pan y productos horneados' },
        { id: 3, nombre: 'Abarrotes', descripcion: 'Granos, arroz, fideos' },
        { id: 4, nombre: 'Bebidas', descripcion: 'Refrescos y bebidas' },
        { id: 5, nombre: 'Limpieza', descripcion: 'Productos de limpieza' }
      ];
    }
    if (url.includes('proveedores')) {
      return [
        { id: 1, nombre: 'Distribuidora Gloria S.A.', ruc: '20100190797', telefono: '01-3152000', email: 'ventas@gloria.com.pe' },
        { id: 2, nombre: 'Bimbo del Perú S.A.', ruc: '20100064514', telefono: '01-5117000', email: 'contacto@bimbo.com.pe' },
        { id: 3, nombre: 'Alicorp S.A.A.', ruc: '20100055237', telefono: '01-3153000', email: 'ventas@alicorp.com.pe' }
      ];
    }
    if (url.includes('productos')) {
      return [
        { id: 101, codigo: 'PROD-001', nombre: 'Leche Gloria Entera 1L', descripcion: 'Leche entera UHT', categoria_id: 1, proveedor_id: 1, precio: 4.50, costo: 3.20, stock: 30, stock_minimo: 10, activo: true },
        { id: 102, codigo: 'PROD-002', nombre: 'Pan Bimbo Integral', descripcion: 'Pan de molde integral', categoria_id: 2, proveedor_id: 2, precio: 6.80, costo: 4.50, stock: 25, stock_minimo: 15, activo: true },
        { id: 103, codigo: 'PROD-003', nombre: 'Arroz Paisana 1kg', descripcion: 'Arroz superior', categoria_id: 3, proveedor_id: 3, precio: 3.80, costo: 2.50, stock: 60, stock_minimo: 20, activo: true },
        { id: 104, codigo: 'PROD-004', nombre: 'Inca Kola 1.5L', descripcion: 'Gaseosa sabor única', categoria_id: 4, proveedor_id: 3, precio: 5.50, costo: 3.80, stock: 8, stock_minimo: 12, activo: true },
        { id: 105, codigo: 'PROD-005', nombre: 'Detergente Ariel 500g', descripcion: 'Detergente en polvo', categoria_id: 5, proveedor_id: 3, precio: 12.50, costo: 8.90, stock: 15, stock_minimo: 10, activo: true }
      ];
    }
    if (url.includes('compras')) {
      return [
        {
          id: 1,
          numero: 'OC-2025-001',
          fecha: '2025-01-15',
          proveedor_id: 1,
          proveedor_nombre: 'Distribuidora Gloria S.A.',
          subtotal: 320.00,
          igv: 57.60,
          total: 377.60,
          estado: 'recibida',
          items: [
            { producto_id: 101, nombre: 'Leche Gloria Entera 1L', cantidad: 100, precio_costo: 3.20, subtotal: 320.00 }
          ]
        },
        {
          id: 2,
          numero: 'OC-2025-002',
          fecha: '2025-01-20',
          proveedor_id: 3,
          proveedor_nombre: 'Alicorp S.A.A.',
          subtotal: 250.00,
          igv: 45.00,
          total: 295.00,
          estado: 'pendiente',
          items: [
            { producto_id: 103, nombre: 'Arroz Paisana 1kg', cantidad: 100, precio_costo: 2.50, subtotal: 250.00 }
          ]
        }
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