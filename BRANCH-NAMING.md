# Convenciones de Nombres de Ramas - Sistema Minimarket

## 📝 Formato General
```
tipo/modulo-descripcion-breve
```

## 🏷️ Tipos de Ramas

### `feature/` - Nuevas Funcionalidades
Para desarrollar nuevas características o módulos.

**Ejemplos:**
```bash
feature/compras-modal-proveedores
feature/productos-filtro-categoria
feature/ventas-descuentos-automaticos
feature/dashboard-graficos-tiempo-real
feature/usuarios-roles-permisos
```

### `bugfix/` - Corrección de Errores
Para corregir errores no críticos encontrados en desarrollo.

**Ejemplos:**
```bash
bugfix/sidebar-enlaces-rotos
bugfix/productos-validacion-precio
bugfix/compras-calculo-total
bugfix/modal-cerrar-escape
```

### `hotfix/` - Correcciones Urgentes
Para errores críticos que necesitan solución inmediata en producción.

**Ejemplos:**
```bash
hotfix/login-error-autenticacion
hotfix/ventas-perdida-datos
hotfix/seguridad-sql-injection
```

### `refactor/` - Refactorización
Para mejorar código existente sin cambiar funcionalidad.

**Ejemplos:**
```bash
refactor/compras-optimizar-queries
refactor/productos-separar-componentes
refactor/shared-utils-consolidar
```

### `docs/` - Documentación
Para cambios únicamente en documentación.

**Ejemplos:**
```bash
docs/api-endpoints-compras
docs/guia-instalacion
docs/colaboracion-actualizar
```

### `style/` - Estilos y Formato
Para cambios de CSS, formato de código, etc.

**Ejemplos:**
```bash
style/productos-responsive-design
style/modal-animaciones-suaves
style/sidebar-colores-tema
```

### `test/` - Pruebas
Para agregar o modificar pruebas.

**Ejemplos:**
```bash
test/compras-validacion-formularios
test/productos-crud-operaciones
test/integration-api-endpoints
```

## 🎯 Módulos del Sistema

### Módulos Principales
- `compras` - Gestión de compras y proveedores
- `productos` - Catálogo y gestión de productos  
- `ventas` - Proceso de ventas y facturación
- `inventario` - Control de stock y almacén
- `clientes` - Gestión de clientes
- `usuarios` - Administración de usuarios
- `reportes` - Informes y estadísticas
- `dashboard` - Panel principal
- `caja` - Operaciones de caja
- `transferencias` - Movimientos entre sucursales

### Componentes Compartidos
- `shared` - Componentes reutilizables
- `sidebar` - Navegación lateral
- `modal` - Componentes de modal
- `forms` - Formularios compartidos
- `api` - Servicios de API

## ✅ Reglas de Nomenclatura

### ✅ Hacer
- Usar minúsculas y guiones
- Ser descriptivo pero conciso
- Incluir el módulo afectado
- Usar verbos en infinitivo
- Máximo 50 caracteres

### ❌ Evitar
- Espacios o caracteres especiales
- Nombres genéricos como `fix` o `update`
- Mayúsculas o camelCase
- Números sin contexto
- Nombres muy largos

## 📋 Ejemplos por Módulo

### Compras
```bash
feature/compras-modal-crear-orden
feature/compras-filtro-por-proveedor
bugfix/compras-validacion-fechas
refactor/compras-optimizar-busqueda
```

### Productos
```bash
feature/productos-importar-csv
feature/productos-codigo-barras
bugfix/productos-precio-negativo
style/productos-tabla-responsive
```

### Ventas
```bash
feature/ventas-descuentos-porcentaje
feature/ventas-metodos-pago-multiple
bugfix/ventas-calculo-impuestos
test/ventas-proceso-completo
```

### Dashboard
```bash
feature/dashboard-widget-ventas-dia
feature/dashboard-alertas-stock-bajo
style/dashboard-graficos-modernos
refactor/dashboard-cargar-datos-async
```

## 🔄 Flujo de Trabajo con Ramas

### 1. Crear Nueva Rama
```bash
# Desde main actualizada
git checkout main
git pull origin main
git checkout -b feature/compras-modal-proveedores
```

### 2. Trabajar en la Rama
```bash
# Hacer commits frecuentes
git add .
git commit -m "feat(compras): agregar estructura modal proveedores"
git commit -m "feat(compras): implementar validación formulario"
git commit -m "style(compras): mejorar diseño modal"
```

### 3. Mantener Actualizada
```bash
# Sincronizar con main regularmente
git checkout main
git pull origin main
git checkout feature/compras-modal-proveedores
git merge main
```

### 4. Finalizar y Limpiar
```bash
# Después del merge a main
git checkout main
git pull origin main
git branch -d feature/compras-modal-proveedores
```

## 🚀 Comandos Útiles

### Ver Todas las Ramas
```bash
git branch -a
```

### Buscar Ramas por Patrón
```bash
git branch | grep feature
git branch | grep compras
```

### Cambiar Nombre de Rama
```bash
git branch -m nombre-viejo nombre-nuevo
```

### Eliminar Rama Remota
```bash
git push origin --delete nombre-rama
```

## 📞 Dudas Frecuentes

**P: ¿Qué hago si mi descripción es muy larga?**
R: Prioriza claridad sobre brevedad, pero trata de resumir en palabras clave.

**P: ¿Puedo usar números en el nombre?**
R: Sí, si tienen contexto: `feature/productos-version-2-api`

**P: ¿Qué pasa si trabajo en múltiples módulos?**
R: Usa el módulo principal: `feature/dashboard-integrar-compras-ventas`

**P: ¿Cuándo usar hotfix vs bugfix?**
R: Hotfix solo para errores críticos en producción que no pueden esperar.

---

**Recuerda**: Un buen nombre de rama facilita la colaboración y el mantenimiento del proyecto. ¡Cuando tengas dudas, consulta con el equipo!