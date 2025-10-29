# Módulo Inventario – Optimización y Decisiones de UI

Este documento detalla las mejoras aplicadas al módulo Inventario (Listado, Alertas y Valorización), así como el análisis para decidir si convertir páginas en modales o mantenerlas como vistas dedicadas.

## Decisión: Mantener páginas dedicadas (no modales)

- Consistencia UI: En el módulo Almacén se decidió mantener la página de listado como vista principal y mover operaciones de creación/edición a modales. Inventario es principalmente consultivo (listados, indicadores, valorizaciones), por lo que la interacción es de lectura y filtros, sin flujos de registro; se alinea con mantener páginas.
- Funcionalidad requerida: Las vistas de Inventario muestran tablas extensas, filtros, paginación y métricas. Modales no agregan valor al consumo de información ni mejoran el flujo.
- Experiencia de usuario: Navegación clara por sidebar y carga de tablas completa mejora la lectura y escaneo. Modales serían restrictivos para visualizar grandes tablas.
- Rendimiento: Un modal con tablas grandes puede impactar rendimiento y accesibilidad; páginas dedicadas permiten carga incremental y paginación controlada.

## Cambios realizados

- `sucursal/assets/js/inventario.js`:
  - Agregados fallbacks con datos mock para `loadInventario`, `loadAlertas` y `loadValorizacion` si el API falla o devuelve vacío.
  - Incluidos generadores de datos `buildMockInventario`, `buildMockAlertas`, `buildMockValorizacion` con productos, categorías, unidades, ubicación, umbrales y métodos de valorización.
- Limpieza de enlaces internos en páginas:
  - `sucursal/inventario/inventario.html`: se removieron botones que enlazaban a Alertas y Valorización.
  - `sucursal/inventario/alertas.html`: se removieron enlaces a Inventario y Valorización.
  - `sucursal/inventario/valorizacion.html`: se removieron enlaces a Inventario y Alertas.
  - La navegación queda centralizada vía `sidebar-sucursal.html`.

## Verificaciones específicas

- Estructura y diseño: Las páginas usan `table-template.html` y se renderizan con `Inventario.bindListado|bindAlertas|bindValorizacion`; cabeceras y columnas coherentes.
- Validación de formularios: Inventario es consultivo; no hay formularios de registro. Filtros usan debounce y estado `search`. Si se agregan formularios de umbrales, se recomienda `forms.js` y `data-validate`.
- Manejo de errores: En cargas de datos se muestra `Notifications.show(...)` y se usan mocks en fallback, evitando UI vacía.
- Integración: Uso de `Utils.paginate`, estados de búsqueda y paginación; coherencia con componentes compartidos (`table-template`, `notifications`).
- Requisitos de negocio: Alertas con umbral, estado y acción sugerida; valorización con métodos (Promedio, PEPS, UEPS) y costos.

## Siguientes mejoras sugeridas

- Añadir edición de umbrales de alerta vía modal ligero por fila.
- Exportar valorización a CSV/PDF con parámetros de fecha y método.
- Filtros avanzados: por categoría, rango de stock y ubicación.
- Integración con Almacén: enlazar a Kardex del producto desde Inventario.

## Pruebas

- Verificar que, sin API, las tablas muestran datos mock y la paginación funciona.
- Confirmar que el filtro (`#tableSearch`) actualiza los resultados con debounce y resetea a página 1.
- Asegurar ausencia de enlaces internos en UI; navegación solo por sidebar.