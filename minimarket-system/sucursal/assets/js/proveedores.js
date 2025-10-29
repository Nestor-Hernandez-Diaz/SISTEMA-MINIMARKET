// Módulo de gestión de proveedores
window.Proveedores = (function() {
  let proveedores = [];
  let currentId = null;

  let state = {
    page: 1,
    perPage: 10,
    search: ''
  };

  const loadData = async () => {
    try {
      proveedores = await API.get('/api/proveedores');
      return true;
    } catch (e) {
      Notifications.show('Error al cargar proveedores', 'danger');
      return false;
    }
  };

  const getFiltered = () => {
    let filtered = [...proveedores];

    if (state.search) {
      const s = state.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(s) ||
        p.ruc?.includes(s) ||
        p.email?.toLowerCase().includes(s)
      );
    }

    return filtered;
  };

  const renderTable = () => {
    const filtered = getFiltered();
    const paginated = Utils.paginate(filtered, state.page, state.perPage);

    $('#tableTitle').text('Proveedores');
    $('#tableInfo').text(`${paginated.total} registros encontrados`);

    const $thead = $('#dataTable thead');
    $thead.html(`
      <tr>
        <th>Nombre</th>
        <th>RUC</th>
        <th>Teléfono</th>
        <th>Email</th>
        <th>Acciones</th>
      </tr>
    `);

    const $tbody = $('#dataTable tbody');
    if (paginated.data.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center text-muted">No hay proveedores para mostrar</td></tr>');
    } else {
      $tbody.html(paginated.data.map(p => `
        <tr data-id="${p.id}">
          <td><strong>${p.nombre}</strong></td>
          <td>${p.ruc || '-'}</td>
          <td>${p.telefono || '-'}</td>
          <td>${p.email || '-'}</td>
          <td>
            <button class="btn btn-sm btn-primary" data-action="edit" data-id="${p.id}">Editar</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${p.id}">Eliminar</button>
          </td>
        </tr>
      `).join(''));
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

  const openModal = (id = null) => {
    currentId = id;
    const proveedor = id ? proveedores.find(p => p.id === id) : null;

    const modalHtml = `
      <div class="modal-backdrop active" id="modalProveedor">
        <div class="modal">
          <div class="modal-header">
            <h3>${id ? 'Editar' : 'Nuevo'} Proveedor</h3>
            <button class="btn-close" data-action="close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form id="formProveedor">
              <div class="mb-3">
                <label class="label" for="nombre">Nombre / Razón Social *</label>
                <input type="text" class="input" id="nombre" required value="${proveedor?.nombre || ''}" />
              </div>
              <div class="mb-3">
                <label class="label" for="ruc">RUC</label>
                <input type="text" class="input" id="ruc" maxlength="11" value="${proveedor?.ruc || ''}" />
              </div>
              <div class="mb-3">
                <label class="label" for="telefono">Teléfono</label>
                <input type="text" class="input" id="telefono" value="${proveedor?.telefono || ''}" />
              </div>
              <div class="mb-3">
                <label class="label" for="email">Email</label>
                <input type="email" class="input" id="email" value="${proveedor?.email || ''}" />
              </div>
              <div class="mb-3">
                <label class="label" for="direccion">Dirección</label>
                <textarea class="input" id="direccion" rows="2">${proveedor?.direccion || ''}</textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn" data-action="close-modal">Cancelar</button>
            <button class="btn btn-primary" data-action="save-proveedor">Guardar</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(modalHtml);
    $('#nombre').focus();
  };

  const closeModal = () => {
    $('#modalProveedor').remove();
    currentId = null;
  };

  const guardar = async () => {
    const nombre = $('#nombre').val().trim();
    const ruc = $('#ruc').val().trim();
    const telefono = $('#telefono').val().trim();
    const email = $('#email').val().trim();
    const direccion = $('#direccion').val().trim();

    if (!nombre) {
      Notifications.show('El nombre es requerido', 'warning');
      return;
    }

    const data = { nombre, ruc, telefono, email, direccion };

    let success;
    if (currentId) {
      success = await API.put(`/api/proveedores/${currentId}`, data);
      if (success.ok) {
        const index = proveedores.findIndex(p => p.id === currentId);
        if (index !== -1) proveedores[index] = { ...proveedores[index], ...data };
        Notifications.show('Proveedor actualizado', 'success');
      }
    } else {
      success = await API.post('/api/proveedores', data);
      if (success.ok) {
        const newId = Math.max(...proveedores.map(p => p.id), 0) + 1;
        proveedores.push({ ...data, id: newId });
        Notifications.show('Proveedor creado', 'success');
      }
    }

    if (success.ok) {
      closeModal();
      renderTable();
    } else {
      Notifications.show('Error al guardar proveedor', 'danger');
    }
  };

  const eliminar = async (id) => {
    const proveedor = proveedores.find(p => p.id === id);
    if (!confirm(`¿Eliminar el proveedor "${proveedor.nombre}"?`)) return;

    const result = await API.del(`/api/proveedores/${id}`);
    if (result.ok) {
      proveedores = proveedores.filter(p => p.id !== id);
      Notifications.show('Proveedor eliminado', 'success');
      renderTable();
    } else {
      Notifications.show('Error al eliminar proveedor', 'danger');
    }
  };

  const bind = async () => {
    await loadData();

    $('#tableSearch').on('input', Utils.debounce(function() {
      state.search = $(this).val();
      state.page = 1;
      renderTable();
    }, 300));

    $(document).on('click', '#tablePagination button[data-page]', function() {
      const page = Number($(this).data('page'));
      if (page > 0 && !$(this).prop('disabled')) {
        state.page = page;
        renderTable();
      }
    });

    $(document).on('click', '[data-action="new-proveedor"]', () => openModal());
    $(document).on('click', '[data-action="edit"]', function() {
      openModal(Number($(this).data('id')));
    });
    $(document).on('click', '[data-action="delete"]', function() {
      eliminar(Number($(this).data('id')));
    });
    $(document).on('click', '[data-action="close-modal"]', closeModal);
    $(document).on('click', '[data-action="save-proveedor"]', guardar);

    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $('#modalProveedor').length) closeModal();
    });

    renderTable();
  };

  return { bind };
})();
