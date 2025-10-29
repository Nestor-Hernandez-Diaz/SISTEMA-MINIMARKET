# Guía de Módulos de Sucursal

Esta guía describe el enfoque y los patrones para desarrollar y mantener las páginas de los 11 módulos de Sucursales, alineados con `PROMT.MD`.

## Estructura y Consistencia

- HTML semántico, etiquetas `label` vinculadas a `input`.
- CSS puro usando variables y componentes en `sucursal/assets/css/*`.
- jQuery 3.6 para interactividad, validaciones y AJAX.
- Inclusión estándar de scripts: `utils.js`, `validation.js`, `notifications.js`, `api.js`, `auth.js`, `main.js`, `forms.js` y el JS específico del módulo.
- Navegación y acceso: `Auth.requireRole(['sucursal'])` al cargar cada página.

## Formularios (Crear/Editar)

- Utiliza `data-validate` para reglas (e.g., `required|min:3`, `number`).
- Usa el manejador común `forms.js` con `data-auto` y `data-endpoint` cuando aplique.
- Botones de envío manejan estados de carga usando `Forms.setLoading/clearLoading`.
- Notificaciones de éxito/error con `Notifications.show`.
- Para casos con lógica propia (e.g., dependencias de selects), integra `Validation.validateForm($form)` antes de enviar.

### Ejemplo de formulario estándar

```html
<form id="formRecurso" data-auto data-endpoint="/api/recurso" data-success-redirect="recurso.html">
  <input class="input" name="nombre" data-validate="required|min:3" />
  <button type="submit" class="btn btn-primary">Guardar</button>
  <!-- forms.js valida, envía y redirige en éxito -->
 </form>
```

## Tablas y Listados

- Usa `tables.js` y el JS del módulo con `Utils.paginate`, filtros y ordenamiento por columnas.
- Paginación accesible con botones `Anterior/Siguiente` y estado activo.
- Acciones por fila con `data-action="edit|delete"`.

## Notificaciones y Estados

- `Notifications.show(mensaje, tipo)` con tipos `success|danger|warning|info`.
- Estados de carga en botones y spinners donde aplique.

## Pruebas

- Página `tests/index.html` usa Jasmine.
- Se agregaron pruebas en `tests/specs/forms.spec.js` para validar el flujo de formularios.
- Agregar pruebas por módulo siguiendo el patrón de `utils.spec.js` y `validation.spec.js`.

## Flujo de Trabajo por Módulo

1. Cargar datos iniciales necesarios con `API.get` (categorías, proveedores, etc.).
2. Renderizar UI (tablas, selects, badges) con datos.
3. Validaciones antes de enviar (con `Validation` y/o reglas específicas).
4. Enviar datos con `API.post|put|del` según acción.
5. Mostrar notificaciones y redirigir en éxito.
6. Mantener consistencia con colores y tipografía definidos en `variables.css`.

## Navegación y Sidebar

- Sidebar jerárquico con estados activos, colapsables, e indents para subpáginas.
- Enlaces absolutos a cada página de módulo para coherencia.

## Responsividad

- Grids que se vuelven columnas en `<=768px`.
- Contenedores `.card` y `.form-section` con espaciado consistente.

## Recomendaciones

- Reutilizar `forms.js` para flujos de creación similares.
- Añadir `data-validate` a inputs clave para feedback inmediato.
- Documentar particularidades del módulo en su JS específico.