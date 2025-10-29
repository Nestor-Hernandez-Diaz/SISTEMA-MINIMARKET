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
      return false;
    }
  };

  const loadKardex = async () => {
    try {
      kardex = await API.get('/api/almacen/kardex');
      return true;
    } catch (e) {
      Notifications.show('Error al cargar kardex', 'danger');
      return false;
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
    bindKardex
  };
})();