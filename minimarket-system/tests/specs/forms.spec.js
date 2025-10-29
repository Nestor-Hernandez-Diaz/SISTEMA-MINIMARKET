describe('Forms module', function() {
  beforeEach(function() {
    // Crear un formulario en el DOM
    const formHtml = `
      <form id="testForm" data-auto data-endpoint="/api/test">
        <input type="text" name="nombre" data-validate="required|min:3" value="" />
        <button type="submit">Guardar</button>
      </form>
    `;
    const container = document.createElement('div');
    container.id = 'fixture';
    container.innerHTML = formHtml;
    document.body.appendChild(container);

    // Stub de API.post
    spyOn(window.API, 'post').and.callFake(async function(url, data) {
      return { ok: true, data: { id: 1 } };
    });

    // Stub de Notifications.show
    spyOn(window.Notifications, 'show').and.callThrough();
  });

  afterEach(function() {
    const fixture = document.getElementById('fixture');
    if (fixture) fixture.remove();
  });

  it('bloquea envío cuando hay errores de validación y notifica', function(done) {
    const $form = $('#testForm');
    // Submit con nombre vacío (inválido)
    $form.trigger('submit');

    setTimeout(function() {
      expect(window.Notifications.show).toHaveBeenCalled();
      const args = window.Notifications.show.calls.mostRecent().args;
      expect(args[1]).toBe('warning');
      expect(window.API.post).not.toHaveBeenCalled();
      done();
    }, 100);
  });

  it('envía datos cuando la validación pasa y muestra éxito', function(done) {
    const $form = $('#testForm');
    // Corregir el campo
    $form.find('[name="nombre"]').val('Producto válido');

    $form.trigger('submit');

    setTimeout(function() {
      expect(window.API.post).toHaveBeenCalled();
      expect(window.Notifications.show).toHaveBeenCalled();
      const args = window.Notifications.show.calls.mostRecent().args;
      expect(args[1]).toBe('success');
      done();
    }, 150);
  });
});