// Módulo de gestión de productos
window.Productos = (function() {
  let productos = [];
  let categorias = [];
  let proveedores = [];

  // Estado de paginación y filtros
  let state = {
    page: 1,
    perPage: 10,
    search: '',
    categoria: '',
    sortBy: 'nombre',
    sortDir: 'asc'
  };

  // Cargar datos iniciales
  const loadData = async () => {
    try {
      productos = await API.get('/api/productos');
      categorias = await API.get('/api/categorias');
      proveedores = await API.get('/api/proveedores');
      return true;
    } catch (e) {
      Notifications.show('Error al cargar datos', 'danger');
      return false;
    }
  };

  // Obtener productos filtrados y ordenados
  const getFilteredProductos = () => {
    let filtered = [...productos];

    // Filtro por búsqueda
    if (state.search) {
      const s = state.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(s) ||
        p.codigo?.toLowerCase().includes(s) ||
        p.descripcion?.toLowerCase().includes(s)
      );
    }

    // Filtro por categoría
    if (state.categoria) {
      filtered = filtered.filter(p => p.categoria_id === Number(state.categoria));
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let valA = a[state.sortBy];
      let valB = b[state.sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (state.sortDir === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return filtered;
  };

  // Renderizar tabla de productos
  const renderTable = () => {
    const filtered = getFilteredProductos();
    const paginated = Utils.paginate(filtered, state.page, state.perPage);

    // Actualizar título y contador
    $('#tableTitle').text('Productos');
    $('#tableInfo').text(`${paginated.total} registros encontrados`);

    // Renderizar encabezados
    const $thead = $('#dataTable thead');
    $thead.html(`
      <tr>
        <th data-sort="codigo">Código</th>
        <th data-sort="nombre">Nombre</th>
        <th data-sort="categoria">Categoría</th>
        <th data-sort="precio">Precio</th>
        <th data-sort="stock">Stock</th>
        <th data-sort="estado">Estado</th>
        <th>Acciones</th>
      </tr>
    `);

    // Renderizar filas
    const $tbody = $('#dataTable tbody');
    if (paginated.data.length === 0) {
      $tbody.html('<tr><td colspan="7" class="text-center text-muted">No hay productos para mostrar</td></tr>');
    } else {
      $tbody.html(paginated.data.map(p => {
        const categoria = categorias.find(c => c.id === p.categoria_id);
        const stockClass = p.stock <= p.stock_minimo ? 'text-danger' : p.stock <= p.stock_minimo * 2 ? 'text-warning' : '';
        return `
          <tr data-id="${p.id}">
            <td>${p.codigo || '-'}</td>
            <td>${p.nombre}</td>
            <td>${categoria?.nombre || '-'}</td>
            <td>${Utils.formatCurrency(p.precio)}</td>
            <td class="${stockClass}">${p.stock || 0}</td>
            <td><span class="badge ${p.activo ? 'badge-success' : 'badge-danger'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>
              <button class="btn btn-sm btn-primary" data-action="edit" data-id="${p.id}">Editar</button>
              <button class="btn btn-sm btn-danger" data-action="delete" data-id="${p.id}">Eliminar</button>
            </td>
          </tr>
        `;
      }).join(''));
    }

    // Renderizar paginación
    renderPagination(paginated.pages);
  };

  // Renderizar paginación
  const renderPagination = (totalPages) => {
    const $pagination = $('#tablePagination');
    if (totalPages <= 1) {
      $pagination.html('');
      return;
    }

    const buttons = [];

    // Botón anterior
    buttons.push(`
      <button class="btn btn-sm" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>
        Anterior
      </button>
    `);

    // Botones de páginas
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= state.page - 1 && i <= state.page + 1)) {
        buttons.push(`
          <button class="btn btn-sm ${i === state.page ? 'btn-primary' : ''}" data-page="${i}">
            ${i}
          </button>
        `);
      } else if (i === state.page - 2 || i === state.page + 2) {
        buttons.push('<span>...</span>');
      }
    }

    // Botón siguiente
    buttons.push(`
      <button class="btn btn-sm" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''}>
        Siguiente
      </button>
    `);

    $pagination.html(buttons.join(''));
  };

  // Crear producto
  const crearProducto = async (data) => {
    try {
      const result = await API.post('/api/productos', data);
      if (result.ok) {
        // Agregar al array local
        const newId = Math.max(...productos.map(p => p.id), 0) + 1;
        productos.push({ ...data, id: newId });
        Notifications.show('Producto creado exitosamente', 'success');
        return true;
      }
      return false;
    } catch (e) {
      Notifications.show('Error al crear producto', 'danger');
      return false;
    }
  };

  // Actualizar producto
  const actualizarProducto = async (id, data) => {
    try {
      const result = await API.put(`/api/productos/${id}`, data);
      if (result.ok) {
        // Actualizar en array local
        const index = productos.findIndex(p => p.id === id);
        if (index !== -1) {
          productos[index] = { ...productos[index], ...data };
        }
        Notifications.show('Producto actualizado exitosamente', 'success');
        return true;
      }
      return false;
    } catch (e) {
      Notifications.show('Error al actualizar producto', 'danger');
      return false;
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      const result = await API.del(`/api/productos/${id}`);
      if (result.ok) {
        // Eliminar del array local
        productos = productos.filter(p => p.id !== id);
        Notifications.show('Producto eliminado exitosamente', 'success');
        return true;
      }
      return false;
    } catch (e) {
      Notifications.show('Error al eliminar producto', 'danger');
      return false;
    }
  };

  // Obtener producto por ID
  const getProductoById = (id) => {
    return productos.find(p => p.id === Number(id));
  };

  // Bind eventos de la página de listado
  const bindListado = async () => {
    await loadData();

    // Búsqueda con debounce
    $('#tableSearch').on('input', Utils.debounce(function() {
      state.search = $(this).val();
      state.page = 1;
      renderTable();
    }, 300));

    // Ordenamiento por columna
    $(document).on('click', '#dataTable thead th[data-sort]', function() {
      const sortBy = $(this).data('sort');
      if (state.sortBy === sortBy) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = sortBy;
        state.sortDir = 'asc';
      }
      renderTable();
    });

    // Paginación
    $(document).on('click', '#tablePagination button[data-page]', function() {
      const page = Number($(this).data('page'));
      if (page > 0 && !$(this).prop('disabled')) {
        state.page = page;
        renderTable();
      }
    });

    // Crear nuevo producto (abre modal)
    $(document).on('click', '[data-action="new-producto"]', function() {
      openProductoModal();
    });

    // Editar producto (abre modal)
    $(document).on('click', '[data-action="edit"]', function() {
      const id = Number($(this).data('id'));
      openProductoModal(id);
    });

    $(document).on('click', '[data-action="delete"]', function() {
      const id = $(this).data('id');
      const producto = getProductoById(id);

      if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
        eliminarProducto(id).then(success => {
          if (success) renderTable();
        });
      }
    });

    // Renderizar inicial
    renderTable();
  };

  // Bind eventos del formulario de crear/editar
  const bindFormulario = async (id = null) => {
    await loadData();

    // Poblar categorías
    const $categoria = $('#categoria');
    $categoria.html(`
      <option value="">Seleccione una categoría</option>
      ${categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
    `);

    // Poblar proveedores
    const $proveedor = $('#proveedor');
    $proveedor.html(`
      <option value="">Seleccione un proveedor</option>
      ${proveedores.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
    `);

    // Si es edición, cargar datos
    if (id) {
      const producto = getProductoById(id);
      if (producto) {
        $('#codigo').val(producto.codigo || '');
        $('#nombre').val(producto.nombre);
        $('#descripcion').val(producto.descripcion || '');
        $('#categoria').val(producto.categoria_id || '');
        $('#proveedor').val(producto.proveedor_id || '');
        $('#precio').val(producto.precio);
        $('#costo').val(producto.costo || '');
        $('#stock').val(producto.stock || 0);
        $('#stock_minimo').val(producto.stock_minimo || 0);
        $('#activo').prop('checked', producto.activo !== false);
      }
    }

    // Manejar envío del formulario con validación unificada
    $('#formProducto').on('submit', async function(e) {
      e.preventDefault();

      const $form = $(this);
      const $btn = $form.find('[type="submit"]');

      // Validación común
      const errors = Validation.validateForm($form);
      if (errors.length) {
        Notifications.show('Corrige los campos requeridos', 'warning');
        const first = errors[0];
        const $field = $form.find(`[name="${first.field}"]`);
        if ($field.length) $field.focus();
        return;
      }

      // Estado de carga
      Forms.setLoading($btn, id ? 'Actualizando...' : 'Guardando...');

      const data = {
        codigo: $('#codigo').val().trim(),
        nombre: $('#nombre').val().trim(),
        descripcion: $('#descripcion').val().trim(),
        categoria_id: Number($('#categoria').val()) || null,
        proveedor_id: Number($('#proveedor').val()) || null,
        precio: Number($('#precio').val()) || 0,
        costo: Number($('#costo').val()) || 0,
        stock: Number($('#stock').val()) || 0,
        stock_minimo: Number($('#stock_minimo').val()) || 0,
        activo: $('#activo').prop('checked')
      };

      // Validaciones
      if (!data.nombre) {
        Notifications.show('El nombre es requerido', 'warning');
        return;
      }

      if (data.precio <= 0) {
        Notifications.show('El precio debe ser mayor a 0', 'warning');
        return;
      }

      // Guardar
      let success;
      if (id) {
        success = await actualizarProducto(id, data);
      } else {
        success = await crearProducto(data);
      }

      if (success) {
        // Si está abierto el modal, cerrar y refrescar listado; si no, redirigir
        if ($('#modalBackdrop').length && $('#modalBackdrop').hasClass('show')) {
          Modales.close();
          // Volver a cargar datos y refrescar tabla
          await loadData();
          state.page = 1;
          renderTable();
        } else {
          setTimeout(() => { window.location.href = 'productos.html'; }, 500);
        }
      }

      Forms.clearLoading($btn);
    });
  };

  // Abrir modal de crear/editar producto e inyectar formulario
  const openProductoModal = async (id = null) => {
    const title = id ? 'Editar Producto' : 'Nuevo Producto';
    // Abrir modal con botón confirmar que envía el formulario
    Modales.open(title, '<div id="modalProductoBody"></div>', {
      confirmText: id ? 'Actualizar' : 'Guardar',
      onConfirm: () => { $('#formProducto').trigger('submit'); }
    });
    // Cargar formulario en el cuerpo del modal y bindear
    await Utils.loadComponent('#modalBody', '/minimarket-system/sucursal/productos/productos-crear.html');
    await bindFormulario(id);
  };

  return {
    bindListado,
    bindFormulario,
    getProductoById,
    getCategorias: () => categorias,
    getProveedores: () => proveedores,
    openProductoModal
  };
})();
