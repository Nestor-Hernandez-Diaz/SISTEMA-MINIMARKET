# Git Cheat Sheet - Sistema Minimarket

## 🚀 Comandos Esenciales Diarios

### Configuración Inicial (Una sola vez)
```bash
# Configurar identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Configurar rama por defecto
git config --global init.defaultBranch main

# Configurar plantilla de commit
git config --global commit.template .gitmessage
```

### Flujo de Trabajo Básico
```bash
# 1. Actualizar repositorio local
git pull origin main

# 2. Crear nueva rama
git checkout -b feature/nombre-descriptivo

# 3. Ver estado actual
git status

# 4. Agregar cambios
git add .                    # Todos los archivos
git add archivo.html         # Archivo específico
git add *.js                 # Todos los .js

# 5. Hacer commit
git commit -m "feat(modulo): descripción breve"

# 6. Subir cambios
git push origin feature/nombre-descriptivo
```

## 📋 Gestión de Ramas

### Crear y Cambiar Ramas
```bash
# Crear nueva rama desde main
git checkout main
git checkout -b nueva-rama

# Cambiar a rama existente
git checkout nombre-rama

# Ver todas las ramas
git branch -a

# Ver rama actual
git branch --show-current
```

### Sincronizar con Main
```bash
# Actualizar main local
git checkout main
git pull origin main

# Traer cambios a tu rama
git checkout tu-rama
git merge main

# O usar rebase (alternativa)
git rebase main
```

### Eliminar Ramas
```bash
# Eliminar rama local (después del merge)
git branch -d nombre-rama

# Forzar eliminación (si no está mergeada)
git branch -D nombre-rama

# Eliminar rama remota
git push origin --delete nombre-rama
```

## 🔄 Comandos de Sincronización

### Actualizar desde Remoto
```bash
# Traer cambios sin mergear
git fetch origin

# Traer y mergear automáticamente
git pull origin main

# Ver diferencias antes de mergear
git diff HEAD origin/main
```

### Subir Cambios
```bash
# Primera vez (crear rama remota)
git push -u origin nombre-rama

# Pushes posteriores
git push

# Forzar push (¡CUIDADO!)
git push --force-with-lease
```

## 📝 Gestión de Commits

### Hacer Commits
```bash
# Commit con mensaje
git commit -m "tipo(alcance): descripción"

# Commit con editor (usa plantilla)
git commit

# Agregar y commitear en un paso
git commit -am "mensaje"

# Commit vacío (para triggers)
git commit --allow-empty -m "trigger: deploy"
```

### Modificar Commits
```bash
# Cambiar último commit (antes de push)
git commit --amend -m "nuevo mensaje"

# Agregar archivos al último commit
git add archivo-olvidado.js
git commit --amend --no-edit

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (eliminar cambios)
git reset --hard HEAD~1
```

## 🔍 Inspección y Historial

### Ver Historial
```bash
# Historial completo
git log

# Historial compacto
git log --oneline

# Últimos 5 commits
git log -5

# Historial gráfico
git log --graph --oneline --all

# Ver cambios en archivos
git log --stat
```

### Ver Diferencias
```bash
# Cambios no staged
git diff

# Cambios staged
git diff --staged

# Diferencias entre ramas
git diff main..tu-rama

# Diferencias en archivo específico
git diff archivo.html
```

### Buscar en Historial
```bash
# Buscar por mensaje de commit
git log --grep="modal"

# Buscar por autor
git log --author="Tu Nombre"

# Buscar cambios en archivo
git log -p archivo.html

# Ver quién modificó cada línea
git blame archivo.html
```

## 🚨 Comandos de Emergencia

### Deshacer Cambios
```bash
# Descartar cambios en archivo (no staged)
git checkout -- archivo.html

# Descartar todos los cambios no staged
git checkout -- .

# Quitar archivo del staging
git reset HEAD archivo.html

# Volver a commit específico
git reset --hard commit-hash
```

### Recuperar Trabajo Perdido
```bash
# Ver historial de referencias
git reflog

# Recuperar commit "perdido"
git checkout commit-hash

# Crear rama desde commit recuperado
git checkout -b rama-recuperada commit-hash
```

### Stash (Guardar Trabajo Temporal)
```bash
# Guardar cambios temporalmente
git stash

# Guardar con mensaje
git stash save "trabajo en progreso"

# Ver lista de stashes
git stash list

# Aplicar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}

# Eliminar stash
git stash drop stash@{0}
```

## 🔧 Resolución de Conflictos

### Cuando Hay Conflictos
```bash
# Ver archivos con conflictos
git status

# Después de resolver manualmente
git add archivo-resuelto.html
git commit -m "resolve: conflictos en archivo-resuelto"

# Abortar merge si es necesario
git merge --abort
```

### Herramientas de Merge
```bash
# Usar herramienta visual
git mergetool

# Ver conflictos en formato diff3
git config merge.conflictstyle diff3
```

## 📊 Comandos de Información

### Estado del Repositorio
```bash
# Estado actual
git status

# Estado compacto
git status -s

# Ver configuración
git config --list

# Ver remotes configurados
git remote -v

# Ver tags
git tag
```

### Información de Ramas
```bash
# Ramas locales
git branch

# Ramas remotas
git branch -r

# Todas las ramas
git branch -a

# Ramas mergeadas
git branch --merged

# Ramas no mergeadas
git branch --no-merged
```

## 🎯 Comandos Específicos del Proyecto

### Para Sistema Minimarket
```bash
# Crear rama para nuevo módulo
git checkout -b feature/compras-modal-proveedores

# Commit típico de funcionalidad
git commit -m "feat(compras): agregar modal crear proveedor"

# Commit típico de corrección
git commit -m "fix(sidebar): corregir enlaces navegación"

# Commit típico de estilo
git commit -m "style(productos): mejorar responsive tabla"
```

### Flujo Completo de Feature
```bash
# 1. Preparar
git checkout main
git pull origin main

# 2. Crear rama
git checkout -b feature/nueva-funcionalidad

# 3. Desarrollar (repetir según necesario)
git add .
git commit -m "feat(modulo): descripción del cambio"

# 4. Sincronizar antes de PR
git checkout main
git pull origin main
git checkout feature/nueva-funcionalidad
git merge main

# 5. Subir para PR
git push origin feature/nueva-funcionalidad

# 6. Después del merge, limpiar
git checkout main
git pull origin main
git branch -d feature/nueva-funcionalidad
```

## 🆘 Situaciones Comunes

### "No puedo hacer push"
```bash
# Alguien más hizo push antes que tú
git pull origin main
# Resolver conflictos si los hay
git push origin tu-rama
```

### "Cometí en la rama equivocada"
```bash
# Mover commits a nueva rama
git checkout -b rama-correcta
git checkout rama-equivocada
git reset --hard HEAD~1  # Quitar commit de rama equivocada
```

### "Quiero cambiar el mensaje del último commit"
```bash
# Solo si NO has hecho push
git commit --amend -m "nuevo mensaje correcto"
```

### "Agregué archivo por error"
```bash
# Quitar del staging (antes de commit)
git reset HEAD archivo-error.txt

# Quitar del último commit (antes de push)
git reset --soft HEAD~1
git reset HEAD archivo-error.txt
git commit -m "mensaje original sin el archivo"
```

## 📱 Aliases Útiles

### Configurar Shortcuts
```bash
# Agregar aliases comunes
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Usar aliases
git st          # En lugar de git status
git co main     # En lugar de git checkout main
git br          # En lugar de git branch
```

## 🔗 Enlaces Útiles

- **Documentación oficial**: https://git-scm.com/docs
- **Git Cheat Sheet oficial**: https://training.github.com/downloads/github-git-cheat-sheet/
- **Visualizador de Git**: https://git-school.github.io/visualizing-git/
- **Juego interactivo**: https://learngitbranching.js.org/

---

**💡 Tip**: Imprime esta guía y tenla cerca mientras te acostumbras a Git. ¡La práctica hace al maestro!