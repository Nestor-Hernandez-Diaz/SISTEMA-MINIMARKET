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

  const openProveedorModal = async (id = null) => {
    currentId = id || null;
    const proveedor = currentId ? proveedores.find(p => p.id === currentId) : null;

    Modales.open(`${currentId ? 'Editar' : 'Nuevo'} Proveedor`, '<div id="modalProveedorBody"></div>', {
      confirmText: 'Guardar',
      onConfirm: () => { $('#formProveedor').trigger('submit'); }
    });

    await Utils.loadComponent('#modalBody', '/minimarket-system/sucursal/compras/proveedores-crear.html');

    if (proveedor) {
      $('#nombre').val(proveedor.nombre || '');
      $('#ruc').val(proveedor.ruc || '');
      $('#telefono').val(proveedor.telefono || '');
      $('#email').val(proveedor.email || '');
      $('#direccion').val(proveedor.direccion || '');
    }

    $('#formProveedor').on('submit', async function(e) {
      e.preventDefault();
      const errs = Validation.validateForm($(this));
      if (errs.length) { Notifications.show('Revisa los campos del formulario', 'warning'); return; }
      const data = Object.fromEntries(new FormData(this).entries());

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
        Modales.close();
        renderTable();
      } else {
        Notifications.show('Error al guardar proveedor', 'danger');
      }
    });
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

    $(document).on('click', '[data-action="new-proveedor"]', () => openProveedorModal());
    $(document).on('click', '[data-action="edit"]', function() {
      openProveedorModal(Number($(this).data('id')));
    });
    $(document).on('click', '[data-action="delete"]', function() {
      eliminar(Number($(this).data('id')));
    });
    // Modal-template maneja cierre y accesibilidad por sí mismo

    renderTable();
  };

  return { bind, openProveedorModal };
})();
