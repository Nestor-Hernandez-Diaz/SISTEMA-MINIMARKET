// Módulo de operaciones de almacén: listado de movimientos y kardex
window.Almacen = (function() {
  let movimientos = [];
  let kardex = [];

  const state = {
    page: 1,
    perPage: 10,
    search: ''
  };

  const loadMovimientos = async () => {
    try {
      movimientos = await API.get('/api/almacen/movimientos');
      return true;
    } catch (e) {
      Notifications.show('Error al cargar movimientos de almacén', 'danger');
      movimientos = [];
      return false;
    } finally {
      if (!Array.isArray(movimientos) || movimientos.length === 0) {
        movimientos = buildMockMovimientos();
      }
    }
  };

  const loadKardex = async () => {
    try {
      kardex = await API.get('/api/almacen/kardex');
      return true;
    } catch (e) {
      Notifications.show('Error al cargar kardex', 'danger');
      kardex = [];
      return false;
    } finally {
      if (!Array.isArray(kardex) || kardex.length === 0) {
        kardex = buildMockKardex();
      }
    }
  };

  const getFiltered = (data) => {
    if (!state.search) return data;
    const s = state.search.toLowerCase();
    return data.filter(m =>
      (m.producto?.toLowerCase().includes(s)) ||
      (m.tipo?.toLowerCase().includes(s)) ||
      (m.usuario?.toLowerCase().includes(s))
    );
  };

  const renderPagination = (totalPages) => {
    const $pagination = $('#tablePagination');
    if (totalPages <= 1) { $pagination.html(''); return; }
    const buttons = [];
    buttons.push(`<button class="btn btn-sm" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>Anterior</button>`);
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= state.page - 1 && i <= state.page + 1)) {
        buttons.push(`<button class="btn btn-sm ${i === state.page ? 'btn-primary' : ''}" data-page="${i}">${i}</button>`);
      } else if (i === state.page - 2 || i === state.page + 2) {
        buttons.push('<span>...</span>');
      }
    }
    buttons.push(`<button class="btn btn-sm" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''}>Siguiente</button>`);
    $pagination.html(buttons.join(''));
  };

  const renderMovimientosTable = () => {
    const filtered = getFiltered(movimientos);
    const paginated = Utils.paginate(filtered, state.page, state.perPage);

    $('#tableTitle').text('Movimientos de Almacén');
    $('#tableInfo').text(`${paginated.total} registros encontrados`);

    const $thead = $('#dataTable thead');
    $thead.html(`
      <tr>
        <th>Fecha</th>
        <th>Tipo</th>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Usuario</th>
        <th>Observaciones</th>
      </tr>
    `);

    const $tbody = $('#dataTable tbody');
    if (paginated.data.length === 0) {
      $tbody.html('<tr><td colspan="6" class="text-center text-muted">No hay movimientos</td></tr>');
    } else {
      $tbody.html(paginated.data.map(m => `
        <tr>
          <td>${m.fecha || '-'}</td>
          <td>${m.tipo || '-'}</td>
          <td>${m.producto || '-'}</td>
          <td>${m.cantidad ?? '-'}</td>
          <td>${m.usuario || '-'}</td>
          <td>${m.observaciones || '-'}</td>
        </tr>
      `).join(''));
    }

    renderPagination(paginated.pages);
  };

  const renderKardexTable = () => {
    const filtered = getFiltered(kardex);
    const paginated = Utils.paginate(filtered, state.page, state.perPage);

    $('#tableTitle').text('Kardex');
    $('#tableInfo').text(`${paginated.total} registros encontrados`);

    const $thead = $('#dataTable thead');
    $thead.html(`
      <tr>
        <th>Producto</th>
        <th>Fecha</th>
        <th>Tipo</th>
        <th>Entrada</th>
        <th>Salida</th>
        <th>Saldo</th>
      </tr>
    `);

    const $tbody = $('#dataTable tbody');
    if (paginated.data.length === 0) {
      $tbody.html('<tr><td colspan="6" class="text-center text-muted">No hay registros de kardex</td></tr>');
    } else {
      $tbody.html(paginated.data.map(k => `
        <tr>
          <td>${k.producto || '-'}</td>
          <td>${k.fecha || '-'}</td>
          <td>${k.tipo || '-'}</td>
          <td>${k.entrada ?? '-'}</td>
          <td>${k.salida ?? '-'}</td>
          <td>${k.saldo ?? '-'}</td>
        </tr>
      `).join(''));
    }

    renderPagination(paginated.pages);
  };

  // Helper: cargar formulario desde una página completa y extraer el form
  const loadFormFromPage = async (pageUrl, formSelector) => {
    const html = await $.get(pageUrl);
    const $temp = $('<div>').html(html);
    const $form = $temp.find(formSelector);
    $('#modalBody').html($form);
    // Interceptar enlace de cancelar
    $('#modalBody a[href$="almacen.html"]').on('click', function(e){
      e.preventDefault();
      Modales.close();
    });
  };

  // Datos mock para pruebas (productos, proveedores, clientes, usuarios)
  const sampleProductos = [
    { codigo: 'ARZ-001', nombre: 'Arroz Premium 1kg', categoria: 'Granos' },
    { codigo: 'ACE-200', nombre: 'Aceite Canola 1L', categoria: 'Aceites' },
    { codigo: 'GAL-315', nombre: 'Galletas Integrales 300g', categoria: 'Snacks' },
    { codigo: 'LEC-120', nombre: 'Leche Deslactosada 1L', categoria: 'Lácteos' }
  ];
  const sampleProveedores = [
    { nombre: 'Distribuidora Andina' },
    { nombre: 'Proveedora del Pacífico' }
  ];
  const sampleClientes = [
    { nombre: 'Juan Pérez' },
    { nombre: 'María López' }
  ];
  const sampleUsuarios = ['nperez', 'mlopez', 'admin', 'operador'];

  const buildMockMovimientos = () => [
    { fecha: '2025-10-28 09:15', tipo: 'entrada', producto: sampleProductos[0].nombre, cantidad: 50, usuario: sampleUsuarios[0], observaciones: `Proveedor: ${sampleProveedores[0].nombre}` },
    { fecha: '2025-10-28 10:40', tipo: 'salida', producto: sampleProductos[0].nombre, cantidad: 5, usuario: sampleUsuarios[1], observaciones: `Cliente: ${sampleClientes[0].nombre}` },
    { fecha: '2025-10-28 11:05', tipo: 'entrada', producto: sampleProductos[1].nombre, cantidad: 30, usuario: sampleUsuarios[2], observaciones: `Proveedor: ${sampleProveedores[1].nombre}` },
    { fecha: '2025-10-28 12:30', tipo: 'salida', producto: sampleProductos[1].nombre, cantidad: 8, usuario: sampleUsuarios[0], observaciones: `Cliente: ${sampleClientes[1].nombre}` },
    { fecha: '2025-10-28 13:10', tipo: 'ajuste', producto: sampleProductos[2].nombre, cantidad: -2, usuario: sampleUsuarios[3], observaciones: 'Ajuste por merma' },
    { fecha: '2025-10-28 14:55', tipo: 'entrada', producto: sampleProductos[2].nombre, cantidad: 40, usuario: sampleUsuarios[2], observaciones: `Proveedor: ${sampleProveedores[0].nombre}` },
    { fecha: '2025-10-28 15:20', tipo: 'salida', producto: sampleProductos[2].nombre, cantidad: 6, usuario: sampleUsuarios[1], observaciones: `Cliente: ${sampleClientes[0].nombre}` },
    { fecha: '2025-10-28 16:00', tipo: 'entrada', producto: sampleProductos[3].nombre, cantidad: 25, usuario: sampleUsuarios[0], observaciones: `Proveedor: ${sampleProveedores[1].nombre}` },
    { fecha: '2025-10-28 17:35', tipo: 'salida', producto: sampleProductos[3].nombre, cantidad: 10, usuario: sampleUsuarios[3], observaciones: `Cliente: ${sampleClientes[1].nombre}` },
    { fecha: '2025-10-29 09:05', tipo: 'ajuste', producto: sampleProductos[0].nombre, cantidad: 3, usuario: sampleUsuarios[2], observaciones: 'Ajuste por conteo' },
    { fecha: '2025-10-29 09:45', tipo: 'salida', producto: sampleProductos[1].nombre, cantidad: 4, usuario: sampleUsuarios[1], observaciones: `Cliente: ${sampleClientes[0].nombre}` },
    { fecha: '2025-10-29 10:20', tipo: 'entrada', producto: sampleProductos[0].nombre, cantidad: 20, usuario: sampleUsuarios[0], observaciones: `Proveedor: ${sampleProveedores[0].nombre}` }
  ];

  const buildMockKardex = () => [
    { producto: sampleProductos[0].nombre, fecha: '2025-10-29', tipo: 'saldo', entrada: 73, salida: 9, saldo: 64 },
    { producto: sampleProductos[1].nombre, fecha: '2025-10-29', tipo: 'saldo', entrada: 30, salida: 12, saldo: 18 },
    { producto: sampleProductos[2].nombre, fecha: '2025-10-29', tipo: 'saldo', entrada: 40, salida: 6, saldo: 34 },
    { producto: sampleProductos[3].nombre, fecha: '2025-10-29', tipo: 'saldo', entrada: 25, salida: 10, saldo: 15 }
  ];

  // --- Modales de creación de movimientos ---
  const bindEntradaForm = () => {
    $('#formEntrada').on('submit', async function(e) {
      e.preventDefault();
      const $form = $(this);
      const $btn = $form.find('[type="submit"]');
      Forms.setLoading($btn, 'Registrando...');
      const errors = Forms.validateAndNotify($form);
      if (errors.length) { Forms.clearLoading($btn); return; }
      try {
        const data = Forms.serialize($form);
        const res = await API.post('/api/almacen/entradas', data);
        if (res.ok) {
          Notifications.show('Entrada registrada', 'success');
          Modales.close();
          await loadMovimientos();
          renderMovimientosTable();
        } else {
          Notifications.show(res.message || 'Error al registrar entrada', 'danger');
        }
      } catch(err) {
        console.error(err);
        Notifications.show('Error de red o del servidor', 'danger');
      } finally {
        Forms.clearLoading($btn);
      }
    });
    $('#btnCancelEntrada').on('click', Modales.close);
  };

  const bindSalidaForm = () => {
    $('#formSalida').on('submit', async function(e) {
      e.preventDefault();
      const $form = $(this);
      const $btn = $form.find('[type="submit"]');
      Forms.setLoading($btn, 'Registrando...');
      const errors = Forms.validateAndNotify($form);
      if (errors.length) { Forms.clearLoading($btn); return; }
      try {
        const data = Forms.serialize($form);
        const res = await API.post('/api/almacen/salidas', data);
        if (res.ok) {
          Notifications.show('Salida registrada', 'success');
          Modales.close();
          await loadMovimientos();
          renderMovimientosTable();
        } else {
          Notifications.show(res.message || 'Error al registrar salida', 'danger');
        }
      } catch(err) {
        console.error(err);
        Notifications.show('Error de red o del servidor', 'danger');
      } finally {
        Forms.clearLoading($btn);
      }
    });
    $('#btnCancelSalida').on('click', Modales.close);
  };

  const bindAjusteForm = () => {
    $('#formAjuste').on('submit', async function(e) {
      e.preventDefault();
      const $form = $(this);
      const $btn = $form.find('[type="submit"]');
      Forms.setLoading($btn, 'Registrando...');
      const errors = Forms.validateAndNotify($form);
      if (errors.length) { Forms.clearLoading($btn); return; }
      try {
        const data = Forms.serialize($form);
        const res = await API.post('/api/almacen/ajustes', data);
        if (res.ok) {
          Notifications.show('Ajuste registrado', 'success');
          Modales.close();
          await loadMovimientos();
          renderMovimientosTable();
        } else {
          Notifications.show(res.message || 'Error al registrar ajuste', 'danger');
        }
      } catch(err) {
        console.error(err);
        Notifications.show('Error de red o del servidor', 'danger');
      } finally {
        Forms.clearLoading($btn);
      }
    });
    $('#btnCancelAjuste').on('click', Modales.close);
  };

  const openEntradaModal = async () => {
    Modales.open('Nueva Entrada', '<div id="modalEntradaBody"></div>', {
      confirmText: 'Registrar',
      onConfirm: () => { $('#formEntrada').trigger('submit'); }
    });
    await loadFormFromPage('/minimarket-system/sucursal/almacen/entradas.html', '#formEntrada');
    bindEntradaForm();
  };

  const openSalidaModal = async () => {
    Modales.open('Nueva Salida', '<div id="modalSalidaBody"></div>', {
      confirmText: 'Registrar',
      onConfirm: () => { $('#formSalida').trigger('submit'); }
    });
    await loadFormFromPage('/minimarket-system/sucursal/almacen/salidas.html', '#formSalida');
    bindSalidaForm();
  };

  const openAjusteModal = async () => {
    Modales.open('Nuevo Ajuste', '<div id="modalAjusteBody"></div>', {
      confirmText: 'Registrar',
      onConfirm: () => { $('#formAjuste').trigger('submit'); }
    });
    await loadFormFromPage('/minimarket-system/sucursal/almacen/ajustes.html', '#formAjuste');
    bindAjusteForm();
  };

  const bindListado = async () => {
    await loadMovimientos();

    $('#tableSearch').on('input', Utils.debounce(function() {
      state.search = $(this).val();
      state.page = 1;
      renderMovimientosTable();
    }, 300));

    $(document).on('click', '#tablePagination button[data-page]', function() {
      const page = Number($(this).data('page'));
      if (page > 0 && !$(this).prop('disabled')) {
        state.page = page;
        renderMovimientosTable();
      }
    });

    renderMovimientosTable();

    // Acciones de barra superior
    $(document).on('click', '[data-action="new-entrada"]', openEntradaModal);
    $(document).on('click', '[data-action="new-salida"]', openSalidaModal);
    $(document).on('click', '[data-action="new-ajuste"]', openAjusteModal);
  };

  const bindKardex = async () => {
    await loadKardex();

    $('#tableSearch').on('input', Utils.debounce(function() {
      state.search = $(this).val();
      state.page = 1;
      renderKardexTable();
    }, 300));

    $(document).on('click', '#tablePagination button[data-page]', function() {
      const page = Number($(this).data('page'));
      if (page > 0 && !$(this).prop('disabled')) {
        state.page = page;
        renderKardexTable();
      }
    });

    renderKardexTable();
  };

  return {
    bindListado,
    bindKardex,
    openEntradaModal,
    openSalidaModal,
    openAjusteModal
  };
})();