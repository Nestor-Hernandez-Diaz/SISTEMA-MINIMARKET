# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-tenant minimarket management system with two distinct environments:
- **Superadmin**: Central control panel for managing multiple minimarket locations
- **Sucursal** (Branch): Operational system for individual minimarket daily operations (POS, inventory, purchases, cash management)

**Tech Stack**: Pure HTML5/CSS3 + jQuery 3.6+ (no frameworks), prepared for REST API integration

## Development Commands

### Running the Application
```bash
# Serve the project with a local static server from the project root
# No build step required - open HTML files directly in browser
```

Access points:
- Superadmin: `minimarket-system/superadmin/index.html`
- Sucursal: `minimarket-system/sucursal/index.html`

### Testing
```bash
# Open in browser:
# minimarket-system/tests/index.html
# Test suite runs with Jasmine
```

No package manager, build tools, or test runners required - this is a pure frontend project.

## Architecture

### Two-Environment Structure

The codebase is split into two parallel environments that share common components:

```
minimarket-system/
├── superadmin/          # Central management (multi-tenant oversight)
├── sucursal/            # Branch operations (POS, inventory, sales)
└── shared/              # Common components, utilities, and styles
```

### Shared Module System

**Location**: `minimarket-system/shared/`

All shared code is organized into three categories:

1. **Components** (`shared/components/`): Reusable HTML templates
   - `navbar.html`, `sidebar.html`, `sidebar-sucursal.html`
   - `modal-template.html`, `table-template.html`, `form-inputs.html`
   - `alerts.html`, `pagination.html`
   - Each component is self-contained with no cross-dependencies

2. **JavaScript Modules** (`shared/js/`): Global utilities exposed via `window` object
   - `auth.js` → `window.Auth` - Session management (localStorage-based)
   - `api.js` → `window.API` - Simulated REST client with delay
   - `utils.js` → `window.Utils` - Helper functions
   - `validation.js` → `window.Validation` - Form validators
   - `notifications.js` → `window.Notifications` - Toast notifications

3. **Styles** (`shared/css/`):
   - `variables.css` - CSS custom properties (colors, spacing, typography)
   - `components.css` - Button, input, card, modal, table styles
   - `utilities.css` - Helper classes (margin, padding, display)
   - `reset.css`, `print.css`

### Environment-Specific Code

Each environment (`superadmin/` and `sucursal/`) follows identical structure:

```
[environment]/
├── assets/
│   ├── css/
│   │   ├── variables.css    # Environment-specific color overrides
│   │   ├── layout.css        # Grid, sidebar, navbar layout
│   │   ├── components.css    # Environment-specific components
│   │   └── pages.css         # Page-specific styles
│   └── js/
│       ├── main.js           # Initialization, component loading
│       ├── dashboard.js      # Dashboard KPIs and charts
│       ├── forms.js          # Form validation and submission
│       ├── tables.js         # Table interactivity (filter, sort)
│       └── [module].js       # Module-specific logic (e.g., pos.js)
└── [pages].html
```

### Sucursal Module Organization

The `sucursal/` environment is further organized into functional modules:

- **productos/** - Product management (CRUD, categories, suppliers)
- **compras/** - Purchase orders and reception
- **almacen/** - Warehouse operations (entries, exits, adjustments, kardex)
- **inventario/** - Inventory tracking, alerts, valuation
- **ventas/** - POS, sales history, returns
- **caja/** - Cash register (open, close, count, transactions)
- **clientes/** - Customer management, credit tracking
- **cotizaciones/** - Quotations
- **transferencias/** - Inter-branch transfers
- **reportes/** - Reports (sales, purchases, inventory, cash)
- **usuarios/** - User management, parameters

Each module contains related pages (list, create, edit, detail views).

### Key Architectural Patterns

1. **Module Pattern**: All shared JS uses IIFE returning public API
   ```javascript
   window.ModuleName = (function() {
     // private state
     return { publicMethod1, publicMethod2 };
   })();
   ```

2. **Data Attributes**: jQuery selectors use `data-*` attributes for actions
   ```html
   <button data-action="delete" data-id="123">Delete</button>
   ```

3. **Component Loading**: Pages load shared components via jQuery
   ```javascript
   $('#sidebar').load('/minimarket-system/shared/components/sidebar-sucursal.html');
   ```

4. **CSS Variables**: Theming through CSS custom properties in `variables.css`

5. **Simulated API**: `window.API` provides mock data with artificial delay (200ms) for realistic testing

### POS System (`sucursal/ventas/pos.html`)

The Point-of-Sale is the most complex module:
- State management in `window.POS` (cart items array)
- Real-time calculations: subtotal, IGV (18% tax), total
- Product search and cart manipulation
- Integration with `window.API` and `window.Notifications`
- Located at: `minimarket-system/sucursal/assets/js/pos.js`

## CSS Architecture

**Approach**: Pure CSS (no preprocessors), mobile-first responsive design

**Organization**:
1. `shared/css/variables.css` - Design tokens (loaded first)
2. `shared/css/reset.css` - Normalize styles
3. `[env]/assets/css/layout.css` - Grid, flexbox layouts
4. `[env]/assets/css/components.css` - Reusable UI components
5. `[env]/assets/css/pages.css` - Page-specific overrides

**Layout System**:
- Flexbox for navbar, sidebar, forms
- CSS Grid for dashboard stats, data tables
- Responsive breakpoints: 768px (tablet), 1024px (desktop), 1440px (wide)

**Component States**: All components support hover, active, disabled, loading states

## Role-Based Access

**Roles** (defined in `window.Auth`):
- **superadmin**: Full system access, manages all branches
- **admin**: Branch administrator, full module access for assigned branch
- **cajero**: POS, cash register, customer management
- **almacenero**: Warehouse, inventory, purchase reception

Check roles with: `Auth.requireRole(['admin', 'cajero'])`

## Testing

Tests use Jasmine framework (loaded via CDN in `tests/index.html`).

**Test files** (`minimarket-system/tests/specs/`):
- `utils.spec.js` - Utility function tests
- `validation.spec.js` - Form validation tests
- `auth.spec.js` - Authentication/session tests
- `pos.spec.js` - POS calculation and state tests

No test runners required - open `tests/index.html` in browser to run suite.

## File References

When referencing code, use the pattern: `file_path:line_number`

Key files:
- Auth system: `minimarket-system/shared/js/auth.js`
- API client: `minimarket-system/shared/js/api.js`
- POS logic: `minimarket-system/sucursal/assets/js/pos.js`
- Design tokens: `minimarket-system/shared/css/variables.css`
- Sidebar (Sucursal): `minimarket-system/shared/components/sidebar-sucursal.html`

## Important Notes

- **No build process**: This is a pure HTML/CSS/jQuery project
- **API is simulated**: `window.API` returns mock data - real API integration pending
- **Components are loaded dynamically**: Pages use `$('#id').load('component.html')`
- **Session storage**: Authentication uses `localStorage` with key `mm_session`
- **Path structure**: All absolute paths start from `/minimarket-system/`
- **jQuery version**: Must use 3.6.0 or higher
- **No external CSS frameworks**: Bootstrap, Tailwind, etc. are not used
