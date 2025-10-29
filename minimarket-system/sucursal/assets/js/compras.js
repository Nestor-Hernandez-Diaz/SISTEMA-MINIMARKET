// Módulo de gestión de compras
window.Compras = (function() {
  let compras = [];
  let productos = [];
  let proveedores = [];

  // Carrito de compra temporal
  let carrito = [];

  let state = {
    page: 1,
    perPage: 10,
    search: '',
    estado: '', // pendiente, recibida, parcial, cancelada
    fechaInicio: '',
    fechaFin: ''
  };

  const loadData = async () => {
    try {
      [compras, productos, proveedores] = await Promise.all([
        API.get('/api/compras'),
        API.get('/api/productos'),
        API.get('/api/proveedores')
      ]);
      return true;
    } catch (e) {
      Notifications.show('Error al cargar datos', 'danger');
      return false;
    }
  };

  const getFiltered = () => {
    let filtered = [...compras];

    if (state.search) {
      const s = state.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.numero?.toLowerCase().includes(s) ||
        c.proveedor_nombre?.toLowerCase().includes(s)
      );
    }

    if (state.estado) {
      filtered = filtered.filter(c => c.estado === state.estado);
    }

    // Ordenar por fecha desc
    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return filtered;
  };

  const renderTable = () => {
    const filtered = getFiltered();
    const paginated = Utils.paginate(filtered, state.page, state.perPage);

    $('#tableTitle').text('Órdenes de Compra');
    $('#tableInfo').text(`${paginated.total} registros encontrados`);

    const $thead = $('#dataTable thead');
    $thead.html(`
      <tr>
        <th>N° Orden</th>
        <th>Fecha</th>
        <th>Proveedor</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    `);

    const $tbody = $('#dataTable tbody');
    if (paginated.data.length === 0) {
      $tbody.html('<tr><td colspan="6" class="text-center text-muted">No hay compras registradas</td></tr>');
    } else {
      $tbody.html(paginated.data.map(c => {
        let estadoBadge = 'badge-secondary';
        if (c.estado === 'recibida') estadoBadge = 'badge-success';
        else if (c.estado === 'parcial') estadoBadge = 'badge-warning';
        else if (c.estado === 'cancelada') estadoBadge = 'badge-danger';

        return `
          <tr data-id="${c.id}">
            <td><strong>${c.numero}</strong></td>
            <td>${c.fecha}</td>
            <td>${c.proveedor_nombre}</td>
            <td>${Utils.formatCurrency(c.total)}</td>
            <td><span class="badge ${estadoBadge}">${c.estado}</span></td>
            <td>
              <button class="btn btn-sm btn-primary" data-action="view" data-id="${c.id}">Ver</button>
              ${c.estado === 'pendiente' ? `<button class="btn btn-sm btn-success" data-action="receive" data-id="${c.id}">Recibir</button>` : ''}
            </td>
          </tr>
        `;
      }).join(''));
    }

    renderPagination(paginated.pages);
  };

  const renderPagination = (totalPages) => {
    const $pagination = $('#tablePagination');
    if (totalPages <= 1) {
      $pagination.html('');
      return;
    }

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

  // ===== CREAR COMPRA =====
  const bindCrear = async () => {
    await loadData();

    // Poblar select de proveedores
    const $proveedor = $('#proveedor_id');
    $proveedor.html(`
      <option value="">Seleccione un proveedor</option>
      ${proveedores.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
    `);

    // Buscar productos
    $('#buscarProducto').on('input', Utils.debounce(function() {
      const query = $(this).val().toLowerCase();
      if (!query) {
        $('#resultadosProductos').html('');
        return;
      }

      const matches = productos.filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        p.codigo?.toLowerCase().includes(query)
      ).slice(0, 10);

      if (matches.length === 0) {
        $('#resultadosProductos').html('<div class="text-muted p-2">No se encontraron productos</div>');
      } else {
        $('#resultadosProductos').html(matches.map(p => `
          <div class="search-result-item" data-id="${p.id}">
            <div>
              <strong>${p.nombre}</strong>
              <div class="text-muted text-sm">${p.codigo || ''} - Stock: ${p.stock}</div>
            </div>
            <div>${Utils.formatCurrency(p.precio)}</div>
          </div>
        `).join(''));
      }
    }, 300));

    // Agregar producto al carrito
    $(document).on('click', '.search-result-item', function() {
      const id = Number($(this).data('id'));
      const producto = productos.find(p => p.id === id);

      const existente = carrito.find(item => item.producto_id === id);
      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({
          producto_id: id,
          nombre: producto.nombre,
          codigo: producto.codigo,
          cantidad: 1,
          precio_costo: producto.costo || 0
        });
      }

      $('#buscarProducto').val('');
      $('#resultadosProductos').html('');
      renderCarrito();
    });

    // Actualizar cantidad
    $(document).on('change', '.item-cantidad', function() {
      const id = Number($(this).closest('tr').data('id'));
      const item = carrito.find(i => i.producto_id === id);
      if (item) {
        item.cantidad = Math.max(1, Number($(this).val()) || 1);
        renderCarrito();
      }
    });

    // Actualizar precio
    $(document).on('change', '.item-precio', function() {
      const id = Number($(this).closest('tr').data('id'));
      const item = carrito.find(i => i.producto_id === id);
      if (item) {
        item.precio_costo = Number($(this).val()) || 0;
        renderCarrito();
      }
    });

    // Quitar producto
    $(document).on('click', '[data-action="remove-item"]', function() {
      const id = Number($(this).closest('tr').data('id'));
      carrito = carrito.filter(i => i.producto_id !== id);
      renderCarrito();
    });

    // Guardar compra
    $('#formCompra').on('submit', async function(e) {
      e.preventDefault();

      const proveedor_id = Number($('#proveedor_id').val());
      const fecha = $('#fecha').val();
      const observaciones = $('#observaciones').val().trim();

      if (!proveedor_id) {
        Notifications.show('Seleccione un proveedor', 'warning');
        return;
      }

      if (carrito.length === 0) {
        Notifications.show('Agregue al menos un producto', 'warning');
        return;
      }

      const subtotal = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio_costo), 0);
      const igv = subtotal * 0.18;
      const total = subtotal + igv;

      const data = {
        proveedor_id,
        fecha,
        observaciones,
        items: carrito,
        subtotal,
        igv,
        total,
        estado: 'pendiente'
      };

      const result = await API.post('/api/compras', data);
      if (result.ok) {
        Notifications.show('Orden de compra creada exitosamente', 'success');
        setTimeout(() => { window.location.href = 'compras.html'; }, 1500);
      } else {
        Notifications.show('Error al crear orden de compra', 'danger');
      }
    });

    renderCarrito();
  };

  const renderCarrito = () => {
    const $tbody = $('#carritoTable tbody');

    if (carrito.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center text-muted">No hay productos agregados</td></tr>');
      $('#subtotal').text('S/ 0.00');
      $('#igv').text('S/ 0.00');
      $('#total').text('S/ 0.00');
      return;
    }

    $tbody.html(carrito.map(item => {
      const subtotal = item.cantidad * item.precio_costo;
      return `
        <tr data-id="${item.producto_id}">
          <td>${item.codigo || '-'}</td>
          <td>${item.nombre}</td>
          <td><input type="number" class="input item-cantidad" min="1" value="${item.cantidad}" style="width:80px" /></td>
          <td><input type="number" class="input item-precio" min="0" step="0.01" value="${item.precio_costo}" style="width:100px" /></td>
          <td>${Utils.formatCurrency(subtotal)}</td>
          <td><button class="btn btn-sm btn-danger" data-action="remove-item">X</button></td>
        </tr>
      `;
    }).join(''));

    const subtotal = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio_costo), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    $('#subtotal').text(Utils.formatCurrency(subtotal));
    $('#igv').text(Utils.formatCurrency(igv));
    $('#total').text(Utils.formatCurrency(total));
  };

  // Bind listado
  const bindListado = async () => {
    await loadData();

    $('#tableSearch').on('input', Utils.debounce(function() {
      state.search = $(this).val();
      state.page = 1;
      renderTable();
    }, 300));

    $('#filtroEstado').on('change', function() {
      state.estado = $(this).val();
      state.page = 1;
      renderTable();
    });

    $(document).on('click', '#tablePagination button[data-page]', function() {
      const page = Number($(this).data('page'));
      if (page > 0 && !$(this).prop('disabled')) {
        state.page = page;
        renderTable();
      }
    });

    $(document).on('click', '[data-action="view"]', function() {
      const id = $(this).data('id');
      window.location.href = `compras-detalle.html?id=${id}`;
    });

    $(document).on('click', '[data-action="receive"]', function() {
      const id = $(this).data('id');
      window.location.href = `recepcion.html?id=${id}`;
    });

    renderTable();
  };

  return {
    bindListado,
    bindCrear,
    getCompraById: (id) => compras.find(c => c.id === Number(id))
  };
})();
