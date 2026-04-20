# TurnoListo Investor Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la portada pública por una landing comercial premium, blanca y muy visual, centrada en el ahorro frente al hardware tradicional y apoyada por capturas reales del producto.

**Architecture:** La implementación se limita a `index.html`, a estilos aislados dentro de `styles.css`, a una pequeña capa opcional de motion en `landing.js` y a assets reproducibles de screenshots reales en `assets/landing/`. La home debe evolucionar desde una landing ilustrada hacia una portada editorial con capturas auténticas de `restaurant.html` y `client.html`, y motion sutil. La verificación automatizada se resuelve con un script ligero en `qa/` que cubre el contenido clave, la referencia a assets reales y los elementos visuales principales.

**Tech Stack:** HTML estático, CSS global existente, JavaScript ligero para animación, Node.js para verificación local, Playwright CLI para capturas reproducibles

---

### Task 1: Actualizar el check rojo de la nueva landing visual

**Files:**
- Modify: `qa/check-investor-landing.mjs`
- Test: `qa/check-investor-landing.mjs`

- [ ] **Step 1: Escribir la verificación esperada**

```js
assert.match(indexHtml, /assets\/landing\/restaurant-workspace\.png/i);
assert.match(indexHtml, /assets\/landing\/client-tracking\.png/i);
assert.match(indexHtml, /landing\.js/i);
assert.ok(existsSync(restaurantShotPath));
assert.ok(existsSync(clientShotPath));
```

- [ ] **Step 2: Ejecutar el check y confirmar fallo**

Run: `node qa/check-investor-landing.mjs`
Expected: FAIL porque la `index.html` actual no referencia screenshots reales ni la nueva capa de motion.

### Task 2: Generar capturas reales reproducibles del producto

**Files:**
- Create: `qa/restaurant-capture.html`
- Create: `qa/client-capture.html`
- Create: `assets/landing/restaurant-workspace.png`
- Create: `assets/landing/client-tracking.png`

- [ ] **Step 1: Capturar restaurante real**

Run: `npx -y playwright@latest screenshot --channel=chrome --color-scheme=light --viewport-size="1512,1100" --wait-for-selector="#restaurantWorkspace:not([hidden])" --wait-for-timeout=1800 http://127.0.0.1:4173/qa/restaurant-capture.html assets/landing/restaurant-workspace.png`
Expected: PASS con una captura real y legible del workspace restaurante.

- [ ] **Step 2: Capturar cliente real**

Run: `npx -y playwright@latest screenshot --channel=chrome --color-scheme=light --viewport-size="520,1080" --wait-for-selector="#clientTicket" --wait-for-timeout=1400 http://127.0.0.1:4173/qa/client-capture.html assets/landing/client-tracking.png`
Expected: PASS con una captura real y legible de la experiencia cliente.

### Task 3: Rediseñar la portada con screenshots reales

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Sustituir la escena ilustrada por una composición editorial**

```html
<figure class="market-shot market-shot--restaurant">
  <img src="./assets/landing/restaurant-workspace.png" alt="Captura real del panel restaurante de TurnoListo" />
</figure>
<figure class="market-shot market-shot--client">
  <img src="./assets/landing/client-tracking.png" alt="Captura real del seguimiento del cliente en TurnoListo" />
</figure>
```

- [ ] **Step 2: Mantener navegación mínima y CTA principal**

```html
<a class="launcher" href="./contact.html">Solicitar demo</a>
<a class="button-secondary" href="#como-funciona">Ver cómo funciona</a>
```

### Task 4: Añadir estilos y motion sutil

**Files:**
- Modify: `styles.css`
- Create: `landing.js`

- [ ] **Step 1: Reorientar la landing a fondo blanco editorial**

```css
.market-home { ... }
.market-shot { ... }
.market-feature { ... }
.market-compare { ... }
.market-close { ... }
```

- [ ] **Step 2: Añadir reveal suave**

```js
const observer = new IntersectionObserver(...);
document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
```

### Task 5: Ejecutar verificación verde y revisión rápida

**Files:**
- Test: `qa/check-investor-landing.mjs`
- Test: `index.html`
- Test: `styles.css`
- Test: `landing.js`

- [ ] **Step 1: Ejecutar el check automatizado**

Run: `node qa/check-investor-landing.mjs`
Expected: PASS

- [ ] **Step 2: Revisar contenido final**

Run: `git diff -- index.html styles.css landing.js qa/check-investor-landing.mjs qa/client-capture.html qa/restaurant-capture.html docs/superpowers/specs/2026-04-20-turnolisto-investor-landing-design.md docs/superpowers/plans/2026-04-20-turnolisto-investor-landing.md`
Expected: Solo cambios en la landing, assets visuales, motion y documentación de soporte.
