# TurnoListo Investor Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la portada pública por una landing comercial premium centrada en el ahorro frente al hardware tradicional.

**Architecture:** La implementación se limita a `index.html` y a estilos aislados dentro de `styles.css`, reutilizando componentes visuales ya existentes para preservar consistencia y reducir riesgo. La verificación automatizada se resuelve con un script ligero en `qa/` que cubre el contenido clave de la nueva home.

**Tech Stack:** HTML estático, CSS global existente, Node.js para verificación local

---

### Task 1: Crear el check rojo de la nueva landing

**Files:**
- Create: `qa/check-investor-landing.mjs`
- Test: `qa/check-investor-landing.mjs`

- [ ] **Step 1: Escribir la verificación esperada**

```js
assert.match(indexHtml, /Solicitar demo/i);
assert.match(indexHtml, /sin hardware dedicado/i);
assert.match(indexHtml, /id="como-funciona"/i);
assert.match(indexHtml, /href="\.\/contact\.html"/i);
assert.doesNotMatch(indexHtml, /Abrir administrador|Abrir restaurante|Abrir cliente/i);
```

- [ ] **Step 2: Ejecutar el check y confirmar fallo**

Run: `node qa/check-investor-landing.mjs`
Expected: FAIL porque la `index.html` actual sigue mostrando la portada operativa.

### Task 2: Sustituir la portada por la landing comercial

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Reemplazar la estructura de la portada**

```html
<header class="market-hero glass-card">...</header>
<section class="market-proof" id="diferencial">...</section>
<section class="market-compare" id="comparativa">...</section>
<section class="market-journey" id="como-funciona">...</section>
```

- [ ] **Step 2: Mantener navegación mínima y CTA principal**

```html
<a class="launcher" href="./contact.html">Solicitar demo</a>
<a class="button-secondary" href="#como-funciona">Ver cómo funciona</a>
```

### Task 3: Añadir estilos aislados de la landing

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Añadir clases exclusivas para la home comercial**

```css
.market-home { ... }
.market-hero { ... }
.market-compare { ... }
.market-clients { ... }
.market-final { ... }
```

- [ ] **Step 2: Añadir reglas responsive**

```css
@media (max-width: 640px) {
  .market-hero,
  .market-proof,
  .market-compare__grid,
  .market-value {
    grid-template-columns: 1fr;
  }
}
```

### Task 4: Ejecutar verificación verde y revisión rápida

**Files:**
- Test: `qa/check-investor-landing.mjs`
- Test: `index.html`
- Test: `styles.css`

- [ ] **Step 1: Ejecutar el check automatizado**

Run: `node qa/check-investor-landing.mjs`
Expected: PASS

- [ ] **Step 2: Revisar contenido final**

Run: `git diff -- index.html styles.css qa/check-investor-landing.mjs docs/superpowers/specs/2026-04-20-turnolisto-investor-landing-design.md docs/superpowers/plans/2026-04-20-turnolisto-investor-landing.md`
Expected: Solo cambios en la landing, estilos aislados y documentación de soporte.
