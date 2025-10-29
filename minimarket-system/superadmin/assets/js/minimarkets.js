(function(){
  // Simple in-memory store for minimarkets (sucursales)
  const subscribers = [];
  // load minimarkets from sessionStorage if available, otherwise use defaults
  const _storedMarkets = (function(){ try { return JSON.parse(sessionStorage.getItem('mm_minimarkets') || 'null'); } catch(e){ return null; } })();
  let minimarkets = _storedMarkets && Array.isArray(_storedMarkets) ? _storedMarkets : [
  { id: 'm-1', nombre: 'Central', descripcion: 'Av. Principal 123 — Sede central con caja y logística', estado: 'Activa', telefono: '01-6123456', adminId: 101, createdAt: Date.now() - 86400000*40 },
  { id: 'm-2', nombre: 'Norte', descripcion: 'Jr. Norte 45 — Punto en zona norte', estado: 'Activa', telefono: '01-6120000', adminId: 102, createdAt: Date.now() - 86400000*32 },
  { id: 'm-3', nombre: 'Sur', descripcion: 'Av. Sur 78 — Sucursal sur, horario extendido', estado: 'Inactiva', telefono: '01-6121111', adminId: 103, createdAt: Date.now() - 86400000*28 },
  { id: 'm-4', nombre: 'Este', descripcion: 'Calle Este 10 — Cerca al mercado local', estado: 'Activa', telefono: '01-6122222', adminId: 104, createdAt: Date.now() - 86400000*24 },
  { id: 'm-5', nombre: 'Oeste', descripcion: 'Av. Oeste 55 — Tienda pequeña', estado: 'Activa', telefono: '01-6123333', adminId: 105, createdAt: Date.now() - 86400000*20 },
  { id: 'm-6', nombre: 'Centro Comercial', descripcion: 'Local en mall principal, alto tráfico', estado: 'Activa', telefono: '01-6124444', adminId: 106, createdAt: Date.now() - 86400000*18 },
  { id: 'm-7', nombre: 'Plaza Norte', descripcion: 'Kiosko dentro de Plaza Norte', estado: 'Inactiva', telefono: '01-6125555', adminId: 107, createdAt: Date.now() - 86400000*16 },
  { id: 'm-8', nombre: 'La Marina', descripcion: 'Sucursal cerca al puerto', estado: 'Activa', telefono: '01-6126666', adminId: 108, createdAt: Date.now() - 86400000*12 },
  { id: 'm-9', nombre: 'San Martín', descripcion: 'Zona residencial, buen volumen', estado: 'Activa', telefono: '01-6127777', adminId: 109, createdAt: Date.now() - 86400000*10 },
  { id: 'm-10', nombre: 'Rímac', descripcion: 'Sucursal histórica de la cadena', estado: 'Activa', telefono: '01-6128888', adminId: 110, createdAt: Date.now() - 86400000*8 },
  { id: 'm-11', nombre: 'Chorrillos', descripcion: 'Sucursal costera, horario reducido', estado: 'Inactiva', telefono: '01-6129999', adminId: 111, createdAt: Date.now() - 86400000*6 },
  { id: 'm-12', nombre: 'Miraflores', descripcion: 'Zona comercial y turística', estado: 'Activa', telefono: '01-6130000', adminId: 112, createdAt: Date.now() - 86400000*4 }
  ];

  function saveMinimarkets(){ try { sessionStorage.setItem('mm_minimarkets', JSON.stringify(minimarkets)); } catch(e){} }

  function notify(){ subscribers.forEach(fn => fn(minimarkets.slice())); }

  window.MinimarketStore = {
    getAll: () => minimarkets.slice(),
    add: (m) => { minimarkets.push(m); saveMinimarkets(); notify(); },
    update: (id, data) => { minimarkets = minimarkets.map(x => x.id===id ? Object.assign({}, x, data) : x); saveMinimarkets(); notify(); },
    remove: (id) => { minimarkets = minimarkets.filter(x=>x.id!==id); saveMinimarkets(); notify(); },
    subscribe: (fn) => { subscribers.push(fn); fn(minimarkets.slice()); }
  };

  // Render UI for minimarkets page
  $(function(){
    const $grid = $('#gridContainer');
    if(!$grid.length) return;

    // Build and append modal for markets with admin select
    const $marketModal = $(
      `<div class="modal-backdrop" id="marketModalBackdrop" style="display:none">
         <div class="modal" role="dialog" aria-modal="true">
           <div class="modal-header"><h3 id="marketModalTitle">Nueva Sucursal</h3></div>
           <div class="modal-body">
             <form id="formMarket">
               <input type="hidden" id="marketId" />
               <label class="label">Sede (nombre)</label>
               <input id="marketNombre" class="input" required />
               <label class="label mt-4">Descripción</label>
               <textarea id="marketDescripcion" class="input" rows="3"></textarea>
               <label class="label mt-4">Administrador asignado</label>
               <div style="display:flex; gap:8px; align-items:center;">
                 <select id="marketAdmin" class="input" style="flex:1"></select>
                 <button type="button" class="btn" id="btnToggleCreateAdmin">Crear administrador</button>
               </div>
               <div id="createAdminPanel" style="display:none; margin-top:10px; border:1px solid rgba(0,0,0,0.04); padding:8px; border-radius:6px; background:rgba(255,255,255,0.02)">
                 <div style="display:flex; gap:8px;">
                   <input id="newAdminNombre" class="input" placeholder="Nombre del admin" style="flex:1" />
                   <input id="newAdminEmail" class="input" placeholder="Email" style="width:220px" />
                 </div>
                 <div style="margin-top:8px; display:flex; gap:8px; align-items:center;">
                   <input id="newAdminTelefono" class="input" placeholder="Teléfono" style="width:180px" />
                   <button type="button" class="btn btn-primary" id="btnCreateAdmin">Crear y asignar</button>
                   <button type="button" class="btn" id="btnCancelCreateAdmin">Cancelar</button>
                 </div>
               </div>
               <label class="label mt-4">Estado</label>
               <select id="marketEstado" class="input"><option value="Activa">Activa</option><option value="Inactiva">Inactiva</option></select>
             </form>
           </div>
           <div class="modal-footer"><button class="btn" id="btnCancelMarket">Cancelar</button><button class="btn btn-primary" id="btnSaveMarket">Guardar</button></div>
         </div>
       </div>`);
    $('body').append($marketModal);

    // Helper: render grid of cards
    function renderGrid(list){
      const adminsMap = {};
      if(window.AdminStore) (AdminStore.getAll() || []).forEach(a => { adminsMap[a.id] = a.nombre; });
      const html = [];
      list.forEach((m, idx) => {
        const adminName = m.adminId ? (adminsMap[m.adminId] || '(asignado)') : '';
        const desc = (m.descripcion||m.direccion||'');
        const short = desc.length > 80 ? desc.slice(0,77) + '...' : desc;
        // add state class to the card (open / closed) so we can color the whole card
        const stateClass = m.estado === 'Activa' ? 'open' : 'closed';
        html.push(`<div class="market-card ${stateClass}" data-id="${m.id}">
          <div class="market-status ${stateClass}">${m.estado==='Activa'?'OPEN':'CLOSED'}</div>
          <div class="market-index">${idx+1}</div>
          <div class="market-name">${m.nombre}</div>
          <div class="market-desc">${short}</div>
          ${ adminName ? `<div class="market-admin">Admin: <strong>${adminName}</strong></div>` : '' }
          <div class="market-actions">
            <button class="btn btn-sm btn-edit">Editar</button>
            <button class="btn btn-sm btn-danger btn-delete">Eliminar</button>
            <button class="btn btn-sm btn-secondary btn-toggle">${m.estado==='Activa'?'Desactivar':'Activar'}</button>
          </div>
        </div>`);
      });
      $grid.html(html.join(''));
    }

    // Maintain current filters
    let currentFilter = '';
    let currentEstado = '';

    function applyFilters(list){
      return list.filter(m => {
        if(currentEstado && m.estado !== currentEstado) return false;
        if(currentFilter){
          const q = currentFilter.toLowerCase();
          if(!(String(m.nombre||'').toLowerCase().includes(q) || String(m.descripcion||'').toLowerCase().includes(q))) return false;
        }
        return true;
      });
    }

    // Subscribe to minimarket store
    MinimarketStore.subscribe(function(list){
      const visible = applyFilters(list);
      renderGrid(visible);
    });

    // Fill admin select with available admins (only those not assigned OR assigned to this market when editing)
    function populateAdminOptions(selectedId){
      const $sel = $('#marketAdmin');
      $sel.empty();
      const admins = (window.AdminStore && AdminStore.getAll()) || [];
      $sel.append('<option value="">-- Sin administrador --</option>');
      admins.forEach(a => {
        // show only admins not assigned or the selected one
        if(!a.sucursalId || String(a.sucursalId) === String(selectedId) || String(a.id) === String(selectedId)){
          const isSelected = String(a.sucursalId)===String(selectedId) || String(a.id)===String(selectedId);
          $sel.append(`<option value="${a.id}" ${isSelected? 'selected':''}>${a.nombre} (${a.email})</option>`);
        }
      });
    }

    // Open/close modal
    function openModal(mode, data){
      if(mode==='new'){
        $('#marketModalTitle').text('Nueva Sucursal');
        $('#marketId').val('');
        $('#marketNombre').val('');
        $('#marketDescripcion').val('');
        $('#marketEstado').val('Activa');
        populateAdminOptions('');
        // hide create-admin panel when opening new
        $('#createAdminPanel').hide();
      } else {
        $('#marketModalTitle').text('Editar Sucursal');
        $('#marketId').val(data.id);
        $('#marketNombre').val(data.nombre);
        $('#marketDescripcion').val(data.descripcion || data.direccion || '');
        $('#marketEstado').val(data.estado);
        populateAdminOptions(data.id);
        // preselect admin if assigned
        if(data.adminId) $('#marketAdmin').val(data.adminId);
      }
      $('#marketModalBackdrop').show().addClass('show');
    }

    function closeModal(){ $('#marketModalBackdrop').hide().removeClass('show'); }
    $(document).on('click', '#btnCancelMarket', function(e){ e.preventDefault(); closeModal(); });

    // Click handlers: new top button
    $(document).on('click', '#btnNewMarketTop', function(){ openModal('new'); });

    // Delegated actions on grid
    $grid.on('click', '.btn-edit', function(){
      const id = $(this).closest('.market-card').data('id');
      const m = MinimarketStore.getAll().find(x=>x.id===id);
      openModal('edit', m);
    });

    $grid.on('click', '.btn-delete', function(){
      const id = $(this).closest('.market-card').data('id');
      if(!confirm('Eliminar sucursal?')) return;
      // before removing, unassign admin if any
      const m = MinimarketStore.getAll().find(x=>x.id===id);
      if(m && m.adminId && window.AdminStore){ AdminStore.update(m.adminId, { sucursalId: null, sucursal: '' }); }
      MinimarketStore.remove(id);
    });

    $grid.on('click', '.btn-toggle', function(){
      const id = $(this).closest('.market-card').data('id');
      const m = MinimarketStore.getAll().find(x=>x.id===id);
      if(m) MinimarketStore.update(id, { estado: m.estado==='Activa' ? 'Inactiva' : 'Activa' });
    });

    // Save market from modal
    $(document).on('click', '#btnSaveMarket', function(e){
      e.preventDefault();
      const id = $('#marketId').val() || ('m-' + Date.now());
      const nombre = $('#marketNombre').val().trim();
      const descripcion = $('#marketDescripcion').val().trim();
      const estado = $('#marketEstado').val();
      const adminId = $('#marketAdmin').val() || null;
      if(!nombre){ alert('La sede (nombre) es requerida'); return; }
      // ensure admin uniqueness: if adminId selected and assigned elsewhere (not this id), block
      if(adminId){
        const admins = AdminStore ? AdminStore.getAll() : [];
        const other = admins.find(a=>String(a.id)===String(adminId) && a.sucursalId && String(a.sucursalId)!==String(id));
        if(other){ alert('El administrador ya está asignado a otra sucursal'); return; }
      }
      const m = { id, nombre, descripcion, estado, adminId, createdAt: Date.now() };
      if($('#marketId').val()){ MinimarketStore.update(id, m); }
      else { MinimarketStore.add(m); }
      // update admin assignment
      if(window.AdminStore){
        // clear this admin from other markets (shouldn't be any if check passed)
        const admins = AdminStore.getAll();
        admins.forEach(a => { if(String(a.id)===String(adminId)) AdminStore.update(a.id, { sucursalId: id, sucursal: nombre }); });
      }
      closeModal();
    });

    // Toggle and create admin inline
    $(document).on('click', '#btnToggleCreateAdmin', function(){
      $('#createAdminPanel').toggle();
    });
    $(document).on('click', '#btnCancelCreateAdmin', function(){ $('#createAdminPanel').hide(); });
    $(document).on('click', '#btnCreateAdmin', function(){
      const nombre = $('#newAdminNombre').val().trim();
      const email = $('#newAdminEmail').val().trim();
      const telefono = $('#newAdminTelefono').val().trim();
      if(!nombre || !email){ alert('Nombre y email son requeridos'); return; }
      if(!window.AdminStore || typeof AdminStore.add !== 'function'){ alert('AdminStore no disponible'); return; }
      const newId = Date.now();
      const newAdmin = { id: newId, nombre, email, telefono, sucursalId: null, sucursal: '', estado: 'activo', rol: 'administrador', createdAt: Date.now() };
      AdminStore.add(newAdmin);
      // refresh options and preselect the newly created admin
      populateAdminOptions(newId);
      $('#marketAdmin').val(newId);
      // hide panel and clear inputs
      $('#createAdminPanel').hide();
      $('#newAdminNombre').val(''); $('#newAdminEmail').val(''); $('#newAdminTelefono').val('');
      // notify user
      if(window.alert) alert('Administrador creado y preseleccionado');
    });

  // Filters: only search when the user clicks the Buscar button
  $(document).on('click', '#btnSearch', function(){
    currentFilter = $('#filterSearch').val();
    currentEstado = $('#filterEstado').val();
    const list = applyFilters(MinimarketStore.getAll());
    renderGrid(list);
  });
  // Prevent Enter in the search input from triggering a search (user requested search only on click)
  $(document).on('keypress', '#filterSearch', function(e){ if(e.key === 'Enter'){ e.preventDefault(); } });
  // Keep filter value but don't auto-apply on change; user must press Buscar
  $(document).on('change', '#filterEstado', function(){ currentEstado = $(this).val(); });

    // Subscribe admins changes to refresh options when admin list changes
    if(window.AdminStore && typeof AdminStore.subscribe === 'function'){
      AdminStore.subscribe(function(){ /* re-render grid to reflect admin names */ const list = applyFilters(MinimarketStore.getAll()); renderGrid(list); });
    }

  });
})();
