# PROMPT AJUSTADO - FRONTEND MINIMARKET SYSTEM

## I. CONTEXTO GENERAL DEL PROYECTO

### 1.1 Descripción del Sistema

**Nombre del Proyecto:** Sistema de Gestión para Minimarkets Multi-sucursal

**Objetivo:** Desarrollar un sistema web completo que permita gestionar una red de minimarkets desde dos entornos diferenciados:

- **ENTORNO SUPERADMIN:** Panel de control centralizado para supervisión global, gestión de sucursales y reportería consolidada
- **ENTORNO SUCURSAL:** Sistema operativo completo para la gestión diaria de cada minimarket (ventas, inventario, compras, caja)

### 1.2 Modelo de Negocio

**Arquitectura Multi-tenant:**
- Un superadministrador gestiona múltiples minimarkets
- Cada minimarket opera de forma independiente
- Datos centralizados pero segmentados por sucursal
- Reportería consolidada a nivel central

**Roles del Sistema:**

**SUPERADMIN:**
- Control total sobre la red de minimarkets
- Gestión de administradores de sucursal
- Acceso a reportes consolidados
- Activación/desactivación de sucursales
- Auditoría de accesos

**ADMINISTRADOR DE SUCURSAL:**
- Acceso total a módulos operativos de su sucursal
- Gestión de usuarios de su minimarket
- Reportes de su sucursal
- Configuración de parámetros locales

**CAJERO/VENDEDOR:**
- Acceso a Ventas (POS)
- Acceso a Caja
- Consulta de inventario
- Gestión de cotizaciones
- Registro de clientes

**ALMACENERO:**
- Gestión de almacén
- Control de inventario
- Recepción de compras
- Registro de movimientos

### 1.3 Alcance del Desarrollo Frontend

**Este proyecto cubre:**
- Diseño y maquetación HTML5/CSS3 de todas las pantallas
- Estructura responsive (Desktop, Tablet, Mobile)
- Componentes reutilizables con HTML/CSS
- Validaciones básicas de formularios con jQuery
- Interactividad jQuery (mostrar/ocultar, eventos, efectos)
- Preparación para integración con API REST
- Sistema de autenticación y autorización (UI)
- Estados visuales de carga, errores y éxitos
- Manejo básico de datos con jQuery

## II. ESTRUCTURA DE CARPETAS

```
minimarket-system/
│
├── 📂 superadmin/
│   ├── index.html
│   ├── dashboard.html
│   ├── minimarkets.html
│   ├── minimarkets-crear.html
│   ├── minimarkets-editar.html
│   ├── administradores.html
│   ├── administradores-crear.html
│   ├── administradores-editar.html
│   ├── reportes-globales.html
│   ├── auditoria.html
│   ├── configuracion.html
│   └── assets/
│       ├── css/
│       │   ├── variables.css
│       │   ├── components.css
│       │   ├── layout.css
│       │   └── pages.css
│       ├── js/
│       │   ├── main.js
│       │   ├── dashboard.js
│       │   ├── forms.js
│       │   └── tables.js
│       └── img/
│
├── 📂 sucursal/
│   ├── index.html
│   ├── dashboard.html
│   │
│   ├── 📁 productos/
│   │   ├── productos.html
│   │   ├── productos-crear.html
│   │   ├── productos-editar.html
│   │   └── categorias.html
│   │
│   ├── 📁 compras/
│   │   ├── compras.html
│   │   ├── compras-crear.html
│   │   ├── compras-detalle.html
│   │   └── recepcion.html
│   │   └── proveedores.html
│   │
│   ├── 📁 almacen/
│   │   ├── almacen.html
│   │   ├── entradas.html
│   │   ├── salidas.html
│   │   ├── ajustes.html
│   │   └── kardex.html
│   │
│   ├── 📁 inventario/
│   │   ├── inventario.html
│   │   ├── alertas.html
│   │   └── valorizacion.html
│   │
│   ├── 📁 ventas/
│   │   ├── pos.html
│   │   ├── historial.html
│   │   ├── detalle-venta.html
│   │   └── devoluciones.html
│   │
│   ├── 📁 caja/
│   │   ├── caja.html
│   │   ├── apertura.html
│   │   ├── cierre.html
│   │   ├── arqueo.html
│   │   └── movimientos.html
│   │
│   ├── 📁 clientes/
│   │   ├── clientes.html
│   │   ├── clientes-crear.html
│   │   ├── clientes-editar.html
│   │   └── creditos.html
│   │
│   ├── 📁 cotizaciones/
│   │   ├── cotizaciones.html
│   │   ├── cotizaciones-crear.html
│   │   └── cotizaciones-detalle.html
│   │
│   ├── 📁 transferencias/
│   │   ├── transferencias.html
│   │   ├── solicitar.html
│   │   ├── aprobar.html
│   │   └── historial.html
│   │
│   ├── 📁 reportes/
│   │   ├── reportes.html
│   │   ├── reporte-ventas.html
│   │   ├── reporte-compras.html
│   │   ├── reporte-inventario.html
│   │   └── reporte-caja.html
│   │
│   ├── usuarios.html
│   ├── usuarios-crear.html
│   ├── usuarios-editar.html
│   ├── parametros.html
│   │
│   └── assets/
│       ├── css/
│       │   ├── variables.css
│       │   ├── components.css
│       │   ├── layout.css
│       │   ├── pages.css
│       │   └── pos-custom.css
│       ├── js/
│       │   ├── main.js
│       │   ├── dashboard.js
│       │   ├── forms.js
│       │   ├── tables.js
│       │   ├── pos.js
│       │   └── modales.js
│       └── img/
│
├── 📂 shared/
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── utilities.css
│   │   ├── components.css
│   │   └── print.css
│   │
│   ├── js/
│   │   ├── jquery-3.6.0.min.js
│   │   ├── auth.js
│   │   ├── api.js
│   │   ├── utils.js
│   │   ├── validation.js
│   │   └── notifications.js
│   │
│   ├── components/
│   │   ├── navbar.html
│   │   ├── sidebar.html
│   │   ├── modal-template.html
│   │   ├── table-template.html
│   │   ├── form-inputs.html
│   │   ├── alerts.html
│   │   └── pagination.html
│   │
│   └── img/
│       ├── logo.svg
│       └── placeholder.png
│
└── 📂 docs/
    ├── README.md
    ├── guia-html-css.md
    ├── guia-jquery-basico.md
    └── componentes.md
```

## III. ENFOQUE DE DESARROLLO

### 3.1 HTML

- Uso de HTML5 semántico
- Estructura clara y bien organizada
- Data attributes para facilitar jQuery `(data-action, data-id, data-tipo)`
- Formularios accesibles con labels y atributos adecuados
- Componentes reutilizables (modales, tablas, alertas)
- Sin frameworks CSS, solo CSS puro
- IDs y clases descriptivas

### 3.2 CSS

- CSS puro sin preprocesadores
- Sistema de variables CSS para colores, espacios, tipografía
- Mobile-first responsivo
- Flexbox para layouts
- Grid para dashboard/tablas
- BEM para nomenclatura de clases (opcional, pero recomendado)
- Archivos CSS organizados por categorías:
  - `variables.css` - Colores, espacios, fuentes
  - `components.css` - Botones, inputs, cards, modales, tablas
  - `layout.css` - Navbar, sidebar, grid principal
  - `pages.css` - Estilos específicos de páginas
  - `utilities.css` - Clases helper (margin, padding, display)

### 3.3 JavaScript con jQuery

- jQuery 3.6.0 o superior
- Funcionalidad básica:
  - Mostrar/ocultar elementos: `show()`, `hide()`, `toggle()`
  - Manejo de eventos: `click()`, `submit()`, `change()`
  - Manipulación del DOM: `append()`, `remove()`, `html()`, `text()`
  - Validaciones de formulario simples
  - Efectos básicos: `fadeIn()`, `slideUp()`, `animate()`
  - AJAX básico para conectar con API
  - Manejo de datos con `data()` attributes

- Archivos JS organizados:
  - `main.js` - Inicialización general
  - `forms.js` - Validación y manejo de formularios
  - `tables.js` - Interactividad de tablas (filtros, paginación)
  - `modales.js` - Abrir/cerrar modales
  - `pos.js` - Lógica específica del POS

## IV. CRITERIOS DE DISEÑO

### 4.1 Componentes Principales

Cada componente debe incluir:
- HTML limpio y semántico
- Estilos CSS autocontenidos (no importar estilos de otros componentes)
- Clases reutilizables
- Estados visuales (hover, active, disabled, loading)
- Data attributes para jQuery

**Componentes Core:**
- Botones (primario, secundario, peligro, deshabilitado)
- Input fields (texto, email, password, número, select)
- Tablas con acciones
- Modales (confirmación, formulario)
- Alertas (éxito, error, advertencia, info)
- Cards (contenedores)
- Navbar y Sidebar
- Paginación
- Formularios

### 4.2 Colores y Tipografía

Definir en `variables.css`:
- Paleta de colores corporativa
- Colores de estado (éxito, error, advertencia, info)
- Tipografía (fuente principal, tamaños, pesos)
- Espaciado (padding, margin)
- Sombras y bordes

### 4.3 Responsividad

- Desktop: Layout completo con sidebar
- Tablet: Sidebar colapsable
- Mobile: Sidebar como drawer/hamburguesa
- Breakpoints recomendados: 768px, 1024px, 1440px

## V. FUNCIONALIDADES INTERACTIVAS CON jQuery

### 5.1 Formularios

```javascript
// Validación básica
$('#formCrear').on('submit', function(e) {
  e.preventDefault();
  // Validar campos
  // Enviar datos
});

// Mostrar/ocultar campos
$('[name="tipo"]').on('change', function() {
  const valor = $(this).val();
  if(valor === 'especial') {
    $('.campos-especiales').show();
  } else {
    $('.campos-especiales').hide();
  }
});
```

### 5.2 Tablas

- Filtro por búsqueda
- Ordenamiento de columnas (visual)
- Acciones (editar, eliminar)
- Paginación básica
- Selección múltiple con checkboxes

### 5.3 Modales

- Abrir/cerrar con animación
- Cerrar al hacer click fuera
- Guardar/cancelar acciones
- Confirmaciones antes de eliminar

### 5.4 Navegación

- Navbar con usuario/logout
- Sidebar colapsable
- Indicadores de página activa
- Menú responsivo en mobile

### 5.5 Notificaciones

- Alertas de éxito, error, info
- Desaparición automática
- Posicionamiento fijo

## VI. PREPARACIÓN PARA API

Todos los formularios y tablas deben estar preparados para:
- Envío de datos con AJAX jQuery
- Recepción de respuestas JSON
- Estados de carga (spinner, botón deshabilitado)
- Manejo de errores
- Refresh de datos sin recargar página

## VII. REQUISITOS TÉCNICOS

- HTML5 válido
- CSS sin frameworks externos (solo CSS puro)
- jQuery 3.6.0 mínimo
- Compatibilidad con navegadores modernos
- Sin dependencias externas innecesarias
- Código organizado y comentado
- Nombres de clases e IDs descriptivos