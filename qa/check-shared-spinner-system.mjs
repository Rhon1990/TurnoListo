import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const sharedJs = readFileSync(path.join(projectRoot, "shared.js"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");
const clientHtml = readFileSync(path.join(projectRoot, "client.html"), "utf8");
const clientJs = readFileSync(path.join(projectRoot, "client.js"), "utf8");
const adminJs = readFileSync(path.join(projectRoot, "admin.js"), "utf8");
const restaurantJs = readFileSync(path.join(projectRoot, "restaurant.js"), "utf8");

assert.match(
  stylesCss,
  /\.tl-spinner\s*\{[\s\S]*border-top-color:\s*var\(--brand\);[\s\S]*animation:\s*clientPanelLoadingSpin 780ms linear infinite;/,
  "El proyecto debe definir un spinner reutilizable con la animacion compartida."
);

assert.match(
  stylesCss,
  /\.tl-busy-button\.is-busy\s*\{[\s\S]*pointer-events:\s*none;/,
  "Los botones ocupados deben usar una variante reutilizable que bloquee interacciones."
);

assert.match(
  stylesCss,
  /\.tl-busy-overlay\s*\{[\s\S]*position:\s*absolute;[\s\S]*inset:\s*0;[\s\S]*display:\s*grid;/,
  "Las regiones ocupadas deben apoyarse en un overlay reutilizable."
);

assert.match(
  clientHtml,
  /class="tl-busy-overlay client-panel-loading" id="clientPanelLoading"/,
  "El loading del cliente debe reutilizar la clase global de overlay ocupado."
);

assert.match(
  sharedJs,
  /function setBusyButton\(button, isBusy, options = \{\}\) \{[\s\S]*button\.classList\.toggle\("is-busy", isPending\);[\s\S]*button\.innerHTML = isPending[\s\S]*class="tl-spinner"[\s\S]*\}/,
  "shared.js debe exponer un helper reutilizable para botones ocupados."
);

assert.match(
  sharedJs,
  /function setBusyRegion\(region, overlay, isBusy\) \{[\s\S]*overlay\.hidden = !isPending;[\s\S]*region\.setAttribute\("aria-busy", isPending \? "true" : "false"\);[\s\S]*\}/,
  "shared.js debe exponer un helper reutilizable para regiones ocupadas."
);

assert.match(
  sharedJs,
  /window\.TurnoListoUiBusy = \{\s*setBusyButton,\s*setBusyRegion,\s*\};/,
  "Los helpers reutilizables del spinner deben publicarse en un namespace compartido."
);

assert.match(
  clientJs,
  /const setBusyButton = window\.TurnoListoUiBusy\?\.setBusyButton;/,
  "La vista cliente debe consumir el helper comun de botones ocupados."
);

assert.match(
  clientJs,
  /const setBusyRegion = window\.TurnoListoUiBusy\?\.setBusyRegion;/,
  "La vista cliente debe consumir el helper comun de regiones ocupadas."
);

assert.match(
  clientJs,
  /setBusyButton\(loadButton, isPending, \{ busyLabel: translateKey\("client\.dynamic\.order\.loading", "Buscando\.\.\."\) \}\);/,
  "El boton Abrir del cliente debe usar el helper reutilizable del spinner."
);

assert.match(
  clientJs,
  /setBusyButton\(commentSaveButton, isSubmittingComment, \{[\s\S]*busyLabel: translateKey\("client\.dynamic\.comment\.sending", "Enviando\.\.\."\)/,
  "El guardado del comentario del cliente debe reutilizar el spinner inline."
);

assert.match(
  clientJs,
  /setBusyRegion\(clientTicket, clientPanelLoading, isPending\);/,
  "La hidratacion del cliente debe reutilizar el overlay ocupado comun."
);

assert.match(
  adminJs,
  /const setBusyButton = window\.TurnoListoUiBusy\?\.setBusyButton;/,
  "Admin debe reutilizar el helper comun de botones ocupados."
);

assert.match(
  adminJs,
  /setBusyButton\(adminLoginSubmitButton, true, \{ busyLabel: translateRuntimeText\("Entrando\.\.\."\) \}\);/,
  "El login de admin debe activar el spinner reutilizable."
);

assert.match(
  adminJs,
  /setBusyButton\(adminCreateRestaurantSubmitButton, true, \{ busyLabel: translateRuntimeText\("Creando acceso\.\.\."\) \}\);/,
  "La creacion de restaurantes debe activar el spinner reutilizable."
);

assert.match(
  adminJs,
  /setBusyButton\(adminProfileSubmitButton, true, \{ busyLabel: translateRuntimeText\("Guardando perfil\.\.\."\) \}\);/,
  "El guardado del perfil admin debe activar el spinner reutilizable."
);

assert.match(
  adminJs,
  /setBusyButton\(adminCreateAdminSubmitButton, true, \{ busyLabel: translateRuntimeText\("Creando admin\.\.\."\) \}\);/,
  "La creacion de admins debe activar el spinner reutilizable."
);

assert.match(
  restaurantJs,
  /const setBusyButton = window\.TurnoListoUiBusy\?\.setBusyButton;/,
  "Restaurant debe reutilizar el helper comun de botones ocupados."
);

assert.match(
  restaurantJs,
  /setBusyButton\(restaurantLoginSubmitButton, true, \{ busyLabel: translateRuntimeText\("Entrando\.\.\."\) \}\);/,
  "El login del restaurante debe activar el spinner reutilizable."
);

const busyButtonStart = sharedJs.indexOf("function setBusyButton");
const busyButtonEnd = sharedJs.indexOf("\n\nfunction setBusyRegion", busyButtonStart);
assert.notEqual(busyButtonStart, -1, "No se encontro el helper setBusyButton en shared.js.");
assert.notEqual(busyButtonEnd, -1, "No se pudo aislar el helper setBusyButton.");
const busyButtonSource = sharedJs.slice(busyButtonStart, busyButtonEnd);

const context = {
  document: {
    createElement(tagName) {
      return {
        tagName,
        className: "",
        textContent: "",
        outerHTML: `<${tagName}></${tagName}>`,
      };
    },
  },
  button: null,
};

context.button = {
  disabled: false,
  innerHTML: "<span>Guardar</span>",
  dataset: {},
  attributes: {},
  classList: {
    values: new Set(),
    add(...classNames) {
      classNames.forEach((className) => this.values.add(className));
    },
    remove(...classNames) {
      classNames.forEach((className) => this.values.delete(className));
    },
    toggle(className, force) {
      if (force) {
        this.values.add(className);
        return true;
      }
      this.values.delete(className);
      return false;
    },
    contains(className) {
      return this.values.has(className);
    },
  },
  setAttribute(name, value) {
    this.attributes[name] = value;
  },
  removeAttribute(name) {
    delete this.attributes[name];
  },
};

vm.runInNewContext(`${busyButtonSource}`, context);

context.setBusyButton(context.button, true, { busyLabel: "Guardando..." });
assert.equal(context.button.disabled, true, "El helper debe deshabilitar el boton mientras esta ocupado.");
assert.equal(context.button.attributes["aria-busy"], "true", "El helper debe marcar el boton ocupado para accesibilidad.");
assert.equal(context.button.dataset.tlBusyRestoreHtml, "<span>Guardar</span>", "El helper debe recordar el contenido original del boton.");
assert.match(context.button.innerHTML, /Guardando\.\.\./, "El helper debe renderizar la etiqueta de carga proporcionada.");
assert.equal(context.button.classList.contains("tl-busy-button"), true, "El helper debe aplicar la clase reutilizable de boton ocupado.");
assert.equal(context.button.classList.contains("is-busy"), true, "El helper debe marcar el boton ocupado.");

context.setBusyButton(context.button, false, { busyLabel: "Guardando..." });
assert.equal(context.button.innerHTML, "<span>Guardar</span>", "El helper debe restaurar el contenido original del boton.");
assert.equal(context.button.attributes["aria-busy"], undefined, "El helper debe limpiar aria-busy al terminar.");
assert.equal(context.button.classList.contains("is-busy"), false, "El helper debe limpiar el estado ocupado.");

console.log("Shared spinner system check passed.");
