$(function(){
  // Simple CRUD en memoria para administradores (UI only)
  const $tbody = $('.card .table tbody');
  const $modalBackdrop = $('#adminModalBackdrop');
  const $form = $('#formAdmin');
  const $modalTitle = $('#modalTitle');
  const $adminId = $('#adminId');
  const $adminNombre = $('#adminNombre');
  const $adminEmail = $('#adminEmail');
  const $adminRol = $('#adminRol');
  const $adminTelefono = $('#adminTelefono');
  const $adminSucursal = $('#adminSucursal');
  const $adminEstado = $('#adminEstado');
  const $adminCreatedAt = $('#adminCreatedAt');

  // Mock data: load from sessionStorage if available, otherwise use default 12 administradores
  const _storedAdmins = (function(){ try { return JSON.parse(sessionStorage.getItem('mm_admins') || 'null'); } catch(e){ return null; } })();
  let admins = _storedAdmins && Array.isArray(_storedAdmins) ? _storedAdmins : [
    { id: 101, nombre: 'María López', email: 'maria.lopez@mini.com', telefono: '987654321', sucursalId: 'm-1', sucursal: 'Central', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 40 },
    { id: 102, nombre: 'Carlos Rivera', email: 'c.rivera@mini.com', telefono: '976543210', sucursalId: 'm-2', sucursal: 'Norte', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 32 },
    { id: 103, nombre: 'Ana Torres', email: 'ana.torres@mini.com', telefono: '995551234', sucursalId: 'm-3', sucursal: 'Sur', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 28 },
    { id: 104, nombre: 'Luis Gómez', email: 'luis.gomez@mini.com', telefono: '987001122', sucursalId: 'm-4', sucursal: 'Este', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 24 },
    { id: 105, nombre: 'Sofía Mejía', email: 'sofia.mejia@mini.com', telefono: '987002233', sucursalId: 'm-5', sucursal: 'Oeste', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 20 },
    { id: 106, nombre: 'Diego Fernández', email: 'diego.fernandez@mini.com', telefono: '987003344', sucursalId: 'm-6', sucursal: 'Centro Comercial', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 18 },
    { id: 107, nombre: 'Lucía Rojas', email: 'lucia.rojas@mini.com', telefono: '987004455', sucursalId: 'm-7', sucursal: 'Plaza Norte', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 16 },
    { id: 108, nombre: 'Fernando Cruz', email: 'fernando.cruz@mini.com', telefono: '987005566', sucursalId: 'm-8', sucursal: 'La Marina', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 12 },
    { id: 109, nombre: 'Patricia Vega', email: 'patricia.vega@mini.com', telefono: '987006677', sucursalId: 'm-9', sucursal: 'San Martín', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 10 },
    { id: 110, nombre: 'Jorge Salazar', email: 'jorge.salazar@mini.com', telefono: '987007788', sucursalId: 'm-10', sucursal: 'Rímac', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 8 },
    { id: 111, nombre: 'Ariana Paredes', email: 'ariana.paredes@mini.com', telefono: '987008899', sucursalId: 'm-11', sucursal: 'Chorrillos', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 6 },
    { id: 112, nombre: 'Marco Díaz', email: 'marco.diaz@mini.com', telefono: '987009900', sucursalId: 'm-12', sucursal: 'Miraflores', estado: 'activo', rol: 'administrador', createdAt: Date.now() - 86400000 * 4 }
  ];

  function saveAdmins(){ try { sessionStorage.setItem('mm_admins', JSON.stringify(admins)); } catch(e){} }

  // AdminStore: expose simple in-memory store so other pages can query admins
  (function(){
    const subs = [];
    window.AdminStore = {
      getAll: () => admins.slice(),
      add: (a) => {
        admins.push(a);
        // if this admin has a sucursalId assigned, ensure the minimarket references this admin
        try{ if(a && a.sucursalId && window.MinimarketStore && typeof MinimarketStore.update === 'function'){ MinimarketStore.update(a.sucursalId, { adminId: a.id }); } }catch(e){}
        saveAdmins(); subs.forEach(fn=>fn(admins.slice()));
      },
      update: (id, data) => {
        for(let i=0;i<admins.length;i++) if(String(admins[i].id)===String(id)){
          const old = Object.assign({}, admins[i]);
          const updated = Object.assign({}, admins[i], data);
          admins[i] = updated;
          // if sucursal change, sync minimarkets: clear old sucursal adminId and set new sucursal adminId
          try{
            if(window.MinimarketStore && typeof MinimarketStore.update === 'function'){
              if(old.sucursalId && String(old.sucursalId) !== String(updated.sucursalId)){
                MinimarketStore.update(old.sucursalId, { adminId: null });
              }
              if(updated.sucursalId){
                MinimarketStore.update(updated.sucursalId, { adminId: updated.id });
              }
            }
          }catch(e){}
          break;
        }
        saveAdmins(); subs.forEach(fn=>fn(admins.slice()));
      },
      remove: (id) => {
        for(let i=admins.length-1;i>=0;i--) if(String(admins[i].id)===String(id)){
          const removed = admins.splice(i,1)[0];
          // clear assignment on minimarket if needed
          try{ if(removed && removed.sucursalId && window.MinimarketStore && typeof MinimarketStore.update === 'function'){ MinimarketStore.update(removed.sucursalId, { adminId: null }); } }catch(e){}
        }
        saveAdmins(); subs.forEach(fn=>fn(admins.slice()));
      },
      subscribe: (fn) => { subs.push(fn); fn(admins.slice()); }
    };
  })();

  function formatDate(ts){
    const d = new Date(Number(ts));
    return d.toLocaleString();
  }

  function populateSucursalOptions(list){
    $adminSucursal.empty();
    if(!list || !list.length){
      $adminSucursal.append('<option value="">-- Sin sucursales --</option>');
      return;
    }
    $adminSucursal.append('<option value="">-- Selecciona una sucursal --</option>');
    list.forEach(m => {
      $adminSucursal.append(`<option value="${m.id}">${m.nombre}</option>`);
    });
  }

  function openModal(mode='new', data){
    if(mode === 'new'){
      $modalTitle.text('Nuevo Administrador');
      $adminId.val('');
      $adminNombre.val('');
      $adminEmail.val('');
      $adminTelefono.val('');
      $adminSucursal.val('');
      $adminRol.val('administrador');
      $adminEstado.val('activo');
      $adminCreatedAt.text('--');
    } else if(mode === 'edit' && data){
      $modalTitle.text('Editar Administrador');
      $adminId.val(data.id);
      $adminNombre.val(data.nombre);
      $adminEmail.val(data.email);
      $adminTelefono.val(data.telefono || '');
      // set by id if possible
      if(data.sucursalId){ $adminSucursal.val(data.sucursalId); }
      else {
        // try to find by name
        const opt = $adminSucursal.find('option').filter(function(){ return $(this).text() === (data.sucursal||''); }).first();
        if(opt.length) $adminSucursal.val(opt.val());
      }
      $adminRol.val(data.rol || 'administrador');
      $adminEstado.val(data.estado || 'activo');
      $adminCreatedAt.text(data.createdAt ? formatDate(data.createdAt) : '--');
    }
    $modalBackdrop.show().addClass('show');
  }

  function closeModal(){
    $modalBackdrop.hide().removeClass('show');
  }

  function addRow(admin){
    const sucursalText = admin.sucursal && admin.sucursal.trim() ? admin.sucursal : '-- Sin sucursal --';
    return $(`<tr data-id="${admin.id}"><td>${admin.id}</td><td>${admin.nombre}</td><td>${admin.email}</td><td>${admin.telefono||''}</td><td>${sucursalText}</td><td>${admin.estado||''}</td><td class="table-actions"><button class="btn btn-sm btn-edit">Editar</button><button class="btn btn-sm btn-danger btn-delete">Eliminar</button></td></tr>`);
  }

  function renderAdmins(list){
    $tbody.empty();
    (list || admins).forEach(a => { $tbody.append(addRow(a)); });
  }

  // Events
  $('#btnNewAdmin').on('click', () => openModal('new'));
  $('#btnCancelModal').on('click', (e) => { e.preventDefault(); closeModal(); });
  $('#btnSaveAdmin').on('click', (e) => {
    e.preventDefault();
    // simple validation
    if(!$adminNombre.val().trim() || !$adminEmail.val().trim()){
      alert('Completa los campos requeridos');
      return;
    }
  const id = $adminId.val() || Date.now();
  const createdAt = $adminId.val() ? (admins.find(a=>String(a.id)===String($adminId.val()))||{}).createdAt || Date.now() : Date.now();
    // allow creating admin without assigning a sucursal (can be unassigned)
    const sucursalId = $adminSucursal.val() || null;
    const sucursalName = (()=>{ if(!sucursalId) return ''; const m = (window.MinimarketStore && MinimarketStore.getAll().find(x=>x.id===sucursalId)); return m ? m.nombre : $adminSucursal.find('option:selected').text() || ''; })();
  const admin = { id, nombre: $adminNombre.val().trim(), email: $adminEmail.val().trim(), telefono: $adminTelefono.val().trim(), sucursalId, sucursal: sucursalName, estado: $adminEstado.val(), rol: $adminRol.val(), createdAt };

    // If editing, update admins array; otherwise push new
    const idx = admins.findIndex(a=>String(a.id)===String(id));
    if(idx > -1){
      admins[idx] = admin;
    } else {
      admins.push(admin);
    }
    saveAdmins();
    renderAdmins(admins);
    closeModal();
  });

  // Delegated events for edit/delete
  $tbody.on('click', '.btn-edit', function(){
    const $tr = $(this).closest('tr');
    const id = $tr.data('id');
    const data = admins.find(a=>String(a.id) === String(id)) || {
      id,
      nombre: $tr.children().eq(1).text(),
      email: $tr.children().eq(2).text(),
      telefono: $tr.children().eq(3).text(),
      sucursal: $tr.children().eq(4).text()
    };
    openModal('edit', data);
  });

  $tbody.on('click', '.btn-delete', function(){
    if(!confirm('¿Eliminar administrador?')) return;
    const id = $(this).closest('tr').data('id');
    // remove from admins array
    for(let i=admins.length-1;i>=0;i--) if(String(admins[i].id)===String(id)) admins.splice(i,1);
    saveAdmins();
    renderAdmins(admins);
  });

  // Close modal when clicking backdrop
  $modalBackdrop.on('click', function(e){ if(e.target === this) closeModal(); });
  
  // Initial render of mock data
  renderAdmins(admins);

  // Search / filters for administrators: only apply when user clicks Buscar
  let currentAdminFilter = '';
  let currentAdminEstado = '';

  function applyAdminFilters(list){
    return (list || admins).filter(a => {
      if(currentAdminEstado && String(a.estado||'').toLowerCase() !== String(currentAdminEstado||'').toLowerCase()) return false;
      if(currentAdminFilter){
        const q = String(currentAdminFilter).toLowerCase();
        if(!(String(a.nombre||'').toLowerCase().includes(q) || String(a.email||'').toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }

  $('#btnAdminSearch').on('click', function(){
    currentAdminFilter = $('#adminFilterSearch').val() || '';
    currentAdminEstado = $('#adminFilterEstado').val() || '';
    const visible = applyAdminFilters(admins);
    renderAdmins(visible);
  });

  // prevent Enter from submitting the form / auto-search (user prefers click)
  $(document).on('keypress', '#adminFilterSearch', function(e){ if(e.key === 'Enter'){ e.preventDefault(); } });

  // Subscribe to minimarkets store (if available) to populate sucursal select
  if(window.MinimarketStore && typeof MinimarketStore.subscribe === 'function'){
    MinimarketStore.subscribe(function(list){
      populateSucursalOptions(list);
    });
  } else {
    // fallback: static options already present in HTML
    // ensure at least one option exists
    populateSucursalOptions([]);
  }
});
