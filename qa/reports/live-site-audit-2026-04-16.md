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

### 1. Inspeccion de Chrome: `shared.js` lanza un `ReferenceError` al cargar la vista cliente

Tras actualizar GitHub Pages y repetir la inspeccion en Chrome sobre `client.html`, la pagina publica sigue registrando un error de runtime:

- `ReferenceError: getCountryByIso is not defined`
- origen: `initializePhoneFieldHelpers()` en `shared.js`

Impacto:

- La inicializacion compartida del frontend falla al cargar.
- El error ensucia la consola y añade riesgo de comportamientos colaterales en cualquier vista que cargue `shared.js`.
- Aunque el cliente todavia llega a pintar parte del tracking, la pagina arranca con una excepcion evitable.

Estado:

- Corregido en el repo manteniendo el contrato publico `getCountryByIso`, pero apuntandolo a la implementacion interna correcta.

### 2. Faltan dos Firebase Functions publicas en produccion

La inspeccion de red desde Chrome mostraba CORS, pero al contrastarlo contra el endpoint real y contra `firebase functions:list` se confirmo la causa exacta: los endpoints publicos no existen todavia en produccion.

Endpoints ausentes:

- `getPublicTrackingOrder`
- `submitPublicTrackingRating`

Endpoint equivalente que si existe:

- `createRestaurantAccount`

Impacto:

- El cliente publico no puede refrescar el seguimiento desde Firebase Functions.
- La consola del navegador lo muestra como error CORS, pero el preflight real devuelve `404 Page not found`.
- La valoracion publica del pedido tampoco puede completarse en vivo.

Conclusion:

- El bloqueo actual del tramo publico es de despliegue de Functions, no de cache del HTML.
- Para cerrar el flujo completo hay que desplegar al menos esas dos callables.

### 3. Sincronizacion multitab rota cuando una pestaña externa actualiza localStorage

En el codigo actual del repo, las pestañas escuchaban `storage`, `focus`, `visibilitychange` y `BroadcastChannel`, pero al recibir el evento solo repintaban con la cache en memoria.

Impacto:

- Si otra pestaña actualiza pedidos/tracking, la vista cliente puede no reflejar el cambio aunque `localStorage` ya contenga el estado nuevo.
- Este bug fue observable durante la auditoria al mover un pedido a `preparing`.

Estado:

- Corregido en `shared.js` rehidratando la cache desde `localStorage` antes de volver a renderizar.

### 4. UX mejorable en pedido invalido

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
- `qa/inspect-client-errors.mjs`
  - Inspector de consola, runtime y fallos de red sobre la pagina cliente publica.
- `qa/cleanup-live-restaurants.mjs`
  - Limpieza de restaurantes temporales de auditoria.

## Evidencia relevante de la auditoria

- Se eliminaron 6 restaurantes temporales `QA Unicorn` creados durante la prueba en vivo.
- La web publica se versiona ahora con `shared.js?v=20260416h` para invalidar caches antiguas del cliente.
- En almacenamiento compartido del navegador, el tracking del pedido auditado si llego a `preparing`.
- La recarga publica del tracking falla porque `getPublicTrackingOrder` no esta desplegada en Firebase Functions.

## Riesgos de regresion a vigilar

- Cualquier vista que dependa de sincronizacion cruzada entre pestañas (`admin`, `restaurant`, `client`) puede sufrir estados obsoletos si no se rehidrata cache al recibir eventos externos.
- Si se actualiza `shared.js`, `client.js` o `firebase-bridge.js`, hay que cambiar el cache-bust en `client.html` y revisar coherencia con `admin.html` y `restaurant.html`.
- Si se añaden nuevas Firebase Functions publicas y no se despliegan junto al frontend, el navegador las reportara como CORS aunque el problema real sea `404`.

## Siguiente accion recomendada

1. Desplegar las Functions `getPublicTrackingOrder` y `submitPublicTrackingRating`.
2. Dejar que GitHub Pages publique el fix de `shared.js`.
3. Repetir la auditoria visible sobre la URL publica.
4. Verificar especificamente:
   - carga real del pedido en cliente
   - paso `received -> preparing -> ready -> delivered`
   - sonido y vibracion al entrar en `ready`
   - feedback y comentario tras `delivered`
