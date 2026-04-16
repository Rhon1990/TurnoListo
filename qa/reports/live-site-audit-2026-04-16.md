# Auditoria Web Publica TurnoListo

Fecha: 2026-04-16
URL auditada: https://rhon1990.github.io/TurnoListo/admin.html

## Alcance ejecutado

- Login real de admin con la URL publica.
- Alta real de restaurantes temporales de auditoria.
- Activacion de plan, apertura de plantillas y generacion de acceso seguro.
- Login real de restaurante.
- Creacion de pedidos, validacion de duplicado, edicion y cancelacion.
- Apertura de la vista cliente publica desde el pedido.
- Revisión de idioma, QR y caso de codigo invalido.
- Limpieza final de los restaurantes temporales `QA Unicorn` creados durante la auditoria en vivo.

## Hallazgos principales en produccion

### 1. La vista cliente publica servida por GitHub Pages esta desfasada

Se detecto que `client.html` en produccion carga assets con cache-bust antiguo:

- `shared.js?v=20260408e`
- `client.js?v=20260408e`
- `firebase-bridge.js?v=20260408e`

Mientras tanto `admin.html` y `restaurant.html` ya sirven:

- `shared.js?v=20260416f`
- `admin.js?v=20260416f`
- `restaurant.js?v=20260416f`

Impacto:

- La pagina cliente publica en la URL real no expone el flujo moderno de tracking publico.
- `window.__turnoDataBackendMode` llega vacio.
- `refreshPublicTrackingFromBackend` no existe en la build servida al cliente.
- El cliente puede quedarse en placeholders (`ticket "--"`, QR de ejemplo) aunque el pedido real exista.

Conclusion:

- Hay una incoherencia de despliegue/cache bust entre admin/restaurante y cliente.
- El flujo end-to-end completo no puede validarse de forma fiable en la web publica hasta desplegar el cliente actualizado.

### 2. Sincronizacion multitab rota cuando una pestaña externa actualiza localStorage

En el codigo actual del repo, las pestañas escuchaban `storage`, `focus`, `visibilitychange` y `BroadcastChannel`, pero al recibir el evento solo repintaban con la cache en memoria.

Impacto:

- Si otra pestaña actualiza pedidos/tracking, la vista cliente puede no reflejar el cambio aunque `localStorage` ya contenga el estado nuevo.
- Este bug fue observable durante la auditoria al mover un pedido a `preparing`.

Estado:

- Corregido en `shared.js` rehidratando la cache desde `localStorage` antes de volver a renderizar.

### 3. UX mejorable en pedido invalido

Cuando el cliente introduce un codigo inexistente, el feedback dependia solo de `reportValidity()`.

Impacto:

- El error era poco persistente y poco consistente con el resto de feedback del producto.

Estado:

- Mejorado en `client.js` añadiendo `showTurnoAlert(...)` con el mismo mensaje.

## Cambios aplicados en el repo

- `shared.js`
  - Rehidratacion de cache desde `localStorage` en eventos externos de sincronizacion.
- `client.js`
  - Feedback visible adicional para codigos invalidos.
- `client.html`
  - Cache-bust alineado con la version actual de `shared.js` y `firebase-bridge.js`.
- `client-launch.html`
  - Cache-bust del puente `client-launch.js`.
- `qa/cdp-client.mjs`
  - Cliente CDP reutilizable para automatizacion visible en Chrome.
- `qa/live-visual-audit.mjs`
  - Auditoria visual reutilizable sobre Chrome con depuracion remota.
- `qa/inspect-state.mjs`
  - Inspector de estado local para comparar pedido privado y tracking publico.
- `qa/inspect-client.mjs`
  - Inspector de la pagina cliente publica.
- `qa/cleanup-live-restaurants.mjs`
  - Limpieza de restaurantes temporales de auditoria.

## Evidencia relevante de la auditoria

- Se eliminaron 6 restaurantes temporales `QA Unicorn` creados durante la prueba en vivo.
- En almacenamiento compartido del navegador, el tracking del pedido auditado si llego a `preparing`.
- La vista cliente publica de produccion no reflejo ese estado porque la build servida estaba desfasada.

## Riesgos de regresion a vigilar

- Cualquier vista que dependa de sincronizacion cruzada entre pestañas (`admin`, `restaurant`, `client`) puede sufrir estados obsoletos si no se rehidrata cache al recibir eventos externos.
- Si se actualiza `shared.js`, `client.js` o `firebase-bridge.js`, hay que cambiar el cache-bust en `client.html` y revisar coherencia con `admin.html` y `restaurant.html`.

## Siguiente accion recomendada

1. Desplegar la web estatica actualizada para que `client.html` deje de servir assets desfasados.
2. Repetir la auditoria visible sobre la URL publica ya desplegada.
3. Verificar especificamente:
   - carga real del pedido en cliente
   - paso `received -> preparing -> ready -> delivered`
   - sonido y vibracion al entrar en `ready`
   - feedback y comentario tras `delivered`
