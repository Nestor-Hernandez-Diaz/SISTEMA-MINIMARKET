# Almacén: migración a modales para operaciones

Este documento describe los cambios realizados para optimizar el módulo de Almacén, aplicando el patrón de modales ya utilizado en otros módulos (Productos, Compras, Proveedores) y justificando la decisión de mantener la página principal como vista de listado con acciones rápidas.

## Cambios realizados

- Integración del componente `modal-template.html` en `almacen.html` y carga de scripts `modales.js` y `forms.js` para manejo genérico de modales y formularios.
- Añadidos botones de acciones rápidas en la barra superior: `Nueva Entrada`, `Nueva Salida`, `Nuevo Ajuste`.
- Creación de formularios parciales para uso dentro de modales:
  - `sucursal/almacen/entradas-form.html`
  - `sucursal/almacen/salidas-form.html`
  - `sucursal/almacen/ajustes-form.html`
- Extensión de `sucursal/assets/js/almacen.js` para:
  - Abrir modales de Entrada/Salida/Ajuste con `Modales.open`.
  - Validar formularios uniformemente con `Forms.validateAndNotify`.
  - Enviar datos a los endpoints: `/api/almacen/entradas`, `/api/almacen/salidas`, `/api/almacen/ajustes`.
  - Refrescar el listado de movimientos tras registro exitoso.
- Inclusión de contenedores `#notificationsContainer` y `#modalContainer` y carga de `table-template.html` y `modal-template.html` en `almacen.html`.

## Validación y manejo de errores

- Los inputs clave usan `data-validate` y se validan con `Validation.validateForm` a través de `Forms.validateAndNotify`.
- Notificaciones coherentes con el sistema: `Notifications.show('...', 'success|warning|danger')`.
- Estados de carga en botones de envío con `Forms.setLoading/clearLoading`.

## Integración con el sistema

- Consistencia con módulos existentes que usan `Modales.open` para crear/editar recursos.
- Reutilización de `forms.js` y `validation.js` como capa de uniformidad en envío y validación.
- Endpoints y rutas alineadas con las páginas completas previamente existentes.

## Decisión: página principal + modales

Se mantiene `almacen.html` como página principal para listado y búsqueda de movimientos y se incorporan modales para las operaciones (Entrada/Salida/Ajuste).

### Justificación

1. Consistencia UI: el patrón de “listado en página + creación/edición en modal” es estándar en otros módulos, favoreciendo uniformidad y menor curva de aprendizaje.
2. Funcionalidad: el listado requiere filtros, paginación y contexto visible; los modales encapsulan acciones unitarias sin interrumpir el flujo.
3. UX y flujo: modales permiten operaciones rápidas sobre el mismo contexto, mejorando la eficiencia; el cierre del modal devuelve al usuario al listado actualizado.
4. Rendimiento: cargar formularios parciales bajo demanda reduce el peso inicial de la página y evita navegar a páginas separadas para cada operación.
5. Requerimientos de negocio: entradas, salidas y ajustes son operaciones atómicas que no requieren navegación compleja; su ejecución en modal es suficiente y más ágil.

## Próximos pasos sugeridos

- Agregar selects y autocompletados reales para `producto` y `tipo` según catálogo y reglas específicas.
- Incorporar confirmaciones antes de registrar movimientos grandes o críticos.
- Añadir pruebas de integración del flujo de modales similares a `tests/specs/forms.spec.js`.