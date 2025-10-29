// Módulo de gestión de categorías
window.Categorias = (function() {
  let categorias = [];
  let productos = [];
  let currentId = null;

  // Estado de paginación y filtros
  let state = {
    page: 1,
    perPage: 10,
    search: ''
  };

  // Cargar datos
  const loadData = async () => {
    try {
      categorias = await API.get('/api/categorias');
      // Cargar productos para poder mostrar conteo por categoría
      productos = await API.get('/api/productos');
      return true;
    } catch (e) {
      Notifications.show('Error al cargar categorías', 'danger');
      return false;
    }
  };

  // Obtener categorías filtradas
  const getFiltered = () => {
    let filtered = [...categorias];

    if (state.search) {
      const s = state.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.nombre.toLowerCase().includes(s) ||
        c.descripcion?.toLowerCase().includes(s)
      );
    }

    return filtered;
  };

  // Renderizar tabla
  const renderTable = () => {
    const filtered = getFiltered();
    const paginated = Utils.paginate(filtered, state.page, state.perPage);

    $('#tableTitle').text('Categorías');
    $('#tableInfo').text(`${paginated.total} registros encontrados`);

    const $thead = $('#dataTable thead');
    $thead.html(`
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Productos</th>
        <th>Acciones</th>
      </tr>
    `);

    const $tbody = $('#dataTable tbody');
    if (paginated.data.length === 0) {
      $tbody.html('<tr><td colspan="4" class="text-center text-muted">No hay categorías para mostrar</td></tr>');
    } else {
      $tbody.html(paginated.data.map(c => {
        const count = productos.filter(p => p.categoria_id === c.id).length;
        return `
        <tr data-id="${c.id}">
          <td><strong>${c.nombre}</strong></td>
          <td>${c.descripcion || '-'}</td>
          <td>${count}</td>
          <td>
            <button class="btn btn-sm btn-primary" data-action="edit" data-id="${c.id}">Editar</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${c.id}">Eliminar</button>
          </td>
        </tr>
        `;
      }).join(''));
    }

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

  // Abrir modal para crear/editar usando modal-template
  const openModal = (id = null) => {
    currentId = id;
    const categoria = id ? categorias.find(c => c.id === id) : null;
    const title = id ? 'Editar Categoría' : 'Nueva Categoría';
    const bodyHtml = `
      <form id="formCategoria">
        <div class="mb-3">
          <label class="label" for="nombre">Nombre *</label>
          <input type="text" class="input" id="nombre" required value="${categoria?.nombre || ''}" />
        </div>
        <div class="mb-3">
          <label class="label" for="descripcion">Descripción</label>
          <textarea class="input" id="descripcion" rows="3">${categoria?.descripcion || ''}</textarea>
        </div>
      </form>
    `;
    Modales.open(title, bodyHtml, {
      confirmText: 'Guardar',
      onConfirm: guardar
    });
    $('#nombre').focus();
  };

  // Guardar categoría
  const guardar = async () => {
    const nombre = $('#nombre').val().trim();
    const descripcion = $('#descripcion').val().trim();

    if (!nombre) {
      Notifications.show('El nombre es requerido', 'warning');
      return;
    }

    const data = { nombre, descripcion };

    let success;
    if (currentId) {
      success = await API.put(`/api/categorias/${currentId}`, data);
      if (success.ok) {
        const index = categorias.findIndex(c => c.id === currentId);
        if (index !== -1) categorias[index] = { ...categorias[index], ...data };
        Notifications.show('Categoría actualizada', 'success');
      }
    } else {
      success = await API.post('/api/categorias', data);
      if (success.ok) {
        const newId = Math.max(...categorias.map(c => c.id), 0) + 1;
        categorias.push({ ...data, id: newId });
        Notifications.show('Categoría creada', 'success');
      }
    }

    if (success.ok) {
      Modales.close();
      currentId = null;
      renderTable();
    } else {
      Notifications.show('Error al guardar categoría', 'danger');
    }
  };

  // Eliminar categoría
  const eliminar = async (id) => {
    const categoria = categorias.find(c => c.id === id);
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

    const result = await API.del(`/api/categorias/${id}`);
    if (result.ok) {
      categorias = categorias.filter(c => c.id !== id);
      Notifications.show('Categoría eliminada', 'success');
      renderTable();
    } else {
      Notifications.show('Error al eliminar categoría', 'danger');
    }
  };

  // Bind eventos
  const bind = async () => {
    await loadData();

    // Búsqueda
    $('#tableSearch').on('input', Utils.debounce(function() {
      state.search = $(this).val();
      state.page = 1;
      renderTable();
    }, 300));

    // Paginación
    $(document).on('click', '#tablePagination button[data-page]', function() {
      const page = Number($(this).data('page'));
      if (page > 0 && !$(this).prop('disabled')) {
        state.page = page;
        renderTable();
      }
    });

    // Botones de acción
    $(document).on('click', '[data-action="new-categoria"]', () => openModal());
    $(document).on('click', '[data-action="edit"]', function() {
      openModal(Number($(this).data('id')));
    });
    $(document).on('click', '[data-action="delete"]', function() {
      eliminar(Number($(this).data('id')));
    });
    // El modal genérico maneja cancelar/confirmar; sólo añadimos ESC para cerrar
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $('#modalBackdrop').length && $('#modalBackdrop').hasClass('show')) {
        Modales.close();
      }
    });
    renderTable();
  };

  return { bind };
})();
