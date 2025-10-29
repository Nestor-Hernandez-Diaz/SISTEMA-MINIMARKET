// Lógica del POS
window.POS = (function() {
  const state = { items: [] };
  const findItem = (id) => state.items.find(i => i.id === id);
  const addItem = (product, qty = 1) => {
    const existing = findItem(product.id);
    if (existing) existing.qty += qty; else state.items.push({ id: product.id, name: product.nombre, price: Number(product.precio), qty });
    render();
  };
  const removeItem = (id) => { state.items = state.items.filter(i => i.id !== id); render(); };
  const updateQty = (id, qty) => { const it = findItem(id); if (it) { it.qty = Math.max(1, Number(qty||1)); render(); } };
  const subtotal = () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const igv = () => subtotal() * 0.18;
  const total = () => subtotal() + igv();

  const render = () => {
    const $list = $('#cartList');
    $list.html(state.items.map(i => `
      <div class="cart-item" data-id="${i.id}">
        <div>${i.name}</div>
        <input class="input qty" type="number" min="1" value="${i.qty}" />
        <div class="price">${Utils.formatCurrency(i.price)}</div>
        <button class="btn btn-danger" data-action="remove">Quitar</button>
      </div>
    `).join(''));
    $('#subtotal').text(Utils.formatCurrency(subtotal()));
    $('#igv').text(Utils.formatCurrency(igv()));
    $('#total').text(Utils.formatCurrency(total()));
  };

  const bind = async () => {
    const productos = await API.get('/api/productos');
    const $plist = $('#productList');
    $plist.html(productos.map(p => `
      <div class="product" data-id="${p.id}">
        <div>
          <div class="name">${p.nombre}</div>
          <div class="price">${Utils.formatCurrency(p.precio)}</div>
        </div>
        <button class="btn btn-primary" data-action="add">Agregar</button>
      </div>
    `).join(''));

    $plist.on('click', '[data-action="add"]', function(){
      const id = Number($(this).closest('.product').data('id'));
      const product = productos.find(p => p.id === id);
      addItem(product, 1);
    });

    $('#cartList').on('click', '[data-action="remove"]', function(){
      const id = Number($(this).closest('.cart-item').data('id'));
      removeItem(id);
    });

    $('#cartList').on('change', '.qty', function(){
      const id = Number($(this).closest('.cart-item').data('id'));
      const qty = Number($(this).val());
      updateQty(id, qty);
    });

    $('#btnCobrar').on('click', function(){
      if (!state.items.length) return Notifications.show('No hay items en el carrito', 'warning');
      Modales.open('Confirmar Cobro', `<p>Total: <strong>${Utils.formatCurrency(total())}</strong></p>`, {
        confirmText: 'Cobrar',
        onConfirm: async () => {
          const res = await API.post('/api/ventas', { items: state.items, total: total() });
          if (res.ok) { Notifications.show('Venta registrada', 'success'); state.items = []; render(); }
          else Notifications.show('Error al registrar la venta', 'danger');
        }
      });
    });
  };

  return { bind, addItem, removeItem, updateQty, subtotal, igv, total };
})();