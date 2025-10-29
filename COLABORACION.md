# Guía de Colaboración - Sistema Minimarket

## 🎯 Objetivo
Esta guía establece las mejores prácticas para colaborar eficientemente en el desarrollo del Sistema Minimarket sin conflictos ni discrepancias.

## 📋 Flujo de Trabajo

### 1. Estructura de Ramas
- **`main`**: Rama principal (fuente de verdad)
- **`develop`**: Rama de desarrollo (integración de features)
- **`feature/nombre-funcionalidad`**: Ramas para nuevas funcionalidades
- **`bugfix/descripcion-error`**: Ramas para corrección de errores
- **`hotfix/descripcion-urgente`**: Ramas para correcciones urgentes

### 2. Comandos Esenciales Diarios

#### Antes de Empezar a Trabajar
```bash
# 1. Actualizar tu copia local
git pull origin main

# 2. Crear y cambiar a nueva rama
git checkout -b feature/nombre-descriptivo
```

#### Durante el Desarrollo
```bash
# Verificar estado actual
git status

# Preparar cambios
git add .
# O agregar archivos específicos
git add archivo1.html archivo2.js

# Guardar cambios con mensaje descriptivo
git commit -m "feat: agregar modal de proveedores en compras"

# Subir cambios al repositorio remoto
git push origin feature/nombre-descriptivo
```

#### Al Finalizar una Funcionalidad
```bash
# Actualizar con los últimos cambios de main
git checkout main
git pull origin main
git checkout feature/nombre-descriptivo
git merge main

# Resolver conflictos si existen, luego:
git push origin feature/nombre-descriptivo
```

### 3. Convenciones de Mensajes de Commit

#### Formato Estándar
```
tipo(alcance): descripción breve

Descripción detallada (opcional)
```

#### Tipos de Commit
- **feat**: Nueva funcionalidad
- **fix**: Corrección de errores
- **docs**: Cambios en documentación
- **style**: Cambios de formato (CSS, espacios, etc.)
- **refactor**: Refactorización de código
- **test**: Agregar o modificar pruebas
- **chore**: Tareas de mantenimiento

#### Ejemplos
```bash
git commit -m "feat(compras): agregar modal para crear proveedores"
git commit -m "fix(sidebar): corregir enlaces rotos en navegación"
git commit -m "style(productos): mejorar diseño de tabla de productos"
git commit -m "docs: actualizar guía de colaboración"
```

### 4. Convenciones de Nombres de Ramas

#### Estructura
```
tipo/modulo-descripcion-breve
```

#### Ejemplos
```bash
feature/compras-modal-proveedores
feature/productos-filtro-avanzado
bugfix/sidebar-enlaces-rotos
hotfix/login-error-critico
```

## 🔄 Proceso de Integración

### Pull Requests (Recomendado)
1. Crear Pull Request desde tu rama hacia `main`
2. Asignar revisor(es) del equipo
3. Esperar aprobación antes de hacer merge
4. Eliminar rama después del merge

### Merge Directo (Solo para cambios menores)
```bash
git checkout main
git pull origin main
git merge feature/tu-rama
git push origin main
git branch -d feature/tu-rama
```

## 🚨 Resolución de Conflictos

### Cuando Git Detecta Conflictos
1. **No entrar en pánico** - Los conflictos son normales
2. Abrir archivos marcados con conflictos
3. Buscar las marcas: `<<<<<<<`, `=======`, `>>>>>>>`
4. Decidir qué código mantener
5. Eliminar las marcas de conflicto
6. Hacer commit del resultado

### Ejemplo de Conflicto
```html
<<<<<<< HEAD
<button class="btn btn-primary">Nuevo Producto</button>
=======
<button class="btn btn-success">Crear Producto</button>
>>>>>>> feature/productos-boton
```

### Resolución
```html
<button class="btn btn-primary">Crear Producto</button>
```

## 📅 Horarios y Sincronización

### Recomendaciones del Equipo
- **Sincronización diaria**: Hacer `git pull` al inicio del día
- **Commits frecuentes**: Cada 1-2 horas de trabajo
- **Push diario**: Al final de cada sesión de trabajo
- **Integración semanal**: Revisar y mergear features completadas

### Comunicación
- Avisar en el chat del equipo antes de hacer cambios grandes
- Coordinar horarios para merges importantes
- Usar issues/tickets para trackear tareas

## 🛠️ Herramientas Recomendadas

### Interfaces Gráficas
- **GitHub Desktop**: Interfaz simple para principiantes
- **GitKraken**: Visualización avanzada de ramas
- **VS Code**: Integración nativa con Git

### Extensiones Útiles
- **GitLens** (VS Code): Información detallada de commits
- **Git Graph** (VS Code): Visualización de historial

## 🔧 Configuración Inicial del Equipo

### Configurar Git (Una sola vez)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
git config --global init.defaultBranch main
```

### Clonar el Proyecto
```bash
git clone https://github.com/tu-usuario/sistema-minimarket.git
cd sistema-minimarket
```

## 📝 Checklist Diario

### Al Empezar el Día
- [ ] `git pull origin main`
- [ ] Revisar issues asignados
- [ ] Crear rama para nueva tarea

### Durante el Desarrollo
- [ ] `git status` frecuentemente
- [ ] Commits pequeños y descriptivos
- [ ] Probar cambios localmente

### Al Terminar el Día
- [ ] `git push origin mi-rama`
- [ ] Actualizar progreso en issues
- [ ] Comunicar avances al equipo

## 🆘 Comandos de Emergencia

### Deshacer Último Commit (Sin Push)
```bash
git reset --soft HEAD~1
```

### Descartar Cambios Locales
```bash
git checkout -- archivo.html
# O para todos los archivos:
git checkout -- .
```

### Volver a Estado Anterior
```bash
git log --oneline  # Ver historial
git checkout commit-hash  # Ir a commit específico
```

### Recuperar Rama Eliminada
```bash
git reflog  # Ver historial de referencias
git checkout -b rama-recuperada commit-hash
```

## 📞 Contacto y Soporte

- **Líder técnico**: [Nombre y contacto]
- **Chat del equipo**: [Link o plataforma]
- **Documentación adicional**: Ver carpeta `/docs`

---

**Recuerda**: La colaboración exitosa depende de la comunicación constante y el seguimiento de estas convenciones. ¡Cuando tengas dudas, pregunta al equipo!