# TurnoListo

TurnoListo es una plataforma software-first para restaurantes que conecta operacion, cliente y administracion sin depender de hardware dedicado para avisos de recogida. El producto combina seguimiento en tiempo real, QR seguro, notificaciones, lectura operativa e inteligencia adaptativa para mejorar tiempos, visibilidad y renovacion de cuentas.

Estado actual del proyecto: estable.

## Propuesta de valor

- Sustituye el flujo de aviso basado en dispositivos fisicos por una experiencia conectada entre restaurante y cliente.
- Permite operar pedidos desde una interfaz ligera y clara, sin obligar al negocio a reemplazar su sistema principal.
- Da al cliente una vista movil del pedido con progreso, QR y avisos cuando el pedido esta listo.
- Centraliza la cartera de restaurantes, el onboarding, la renovacion y las señales de uso desde un panel administrador.

## Modulos del producto

- `index.html`: landing comercial y posicionamiento B2B de TurnoListo.
- `admin.html`: panel maestro para altas, cartera, renovaciones, mensajes y lectura ejecutiva.
- `restaurant.html`: panel operativo para pedidos activos, dashboard, modo hora pico e historial.
- `client.html`: seguimiento publico del pedido por codigo seguro o QR, con avisos y valoracion posterior.
- `contact.html`: canal de entrada para soporte, alianzas y conversaciones comerciales.
- `admin-profile.html` y `restaurant-profile.html`: gestion de perfil, branding y datos de cuenta.

## Capacidades principales

- Seguimiento de pedidos en tiempo real entre restaurante y cliente.
- QR seguro para consulta publica del pedido.
- ETA adaptativo y priorizacion automatica por restaurante.
- Panel administrador con salud de cartera, renovaciones y señales heuristicas de churn.
- Alta automatizada de restaurantes y administradores con Firebase Authentication y Firestore.
- Notificaciones push web para el cliente cuando el pedido pasa a estado `ready`.
- Valoracion publica del servicio una vez entregado el pedido.
- Branding por restaurante con logo, datos de contacto y configuracion de cuenta.
- Internacionalizacion runtime y experiencia responsive para movil y escritorio.
- Soporte PWA en cliente con `manifest.webmanifest`, instalacion en pantalla de inicio y experiencia `standalone`.

## Arquitectura

### Frontend

- HTML, CSS y JavaScript vanilla.
- Paginas separadas por contexto de uso: comercial, administrador, restaurante y cliente.
- `config/firebase-environments.json` actua como fuente unica de verdad para separar `develop` y `production`.
- `scripts/render-firebase-runtime.mjs` genera los runtimes raiz con resolucion por hostname para diagnostico y desarrollo local.
- `scripts/build-hosting-env.mjs` construye bundles estaticos por entorno en `dist/develop` y `dist/production`.
- Los bundles publicados no dependen del hostname para elegir proyecto Firebase: cada build de Hosting queda fijado al entorno que se despliega.
- `shared.js` concentra el dominio compartido, utilidades comunes, persistencia y logica transversal.
- `firebase-bridge.js` encapsula acceso a Firestore y Cloud Functions.
- `i18n.js` resuelve traducciones y textos dinamicos en runtime.
- `firebase-messaging-sw.js` y `manifest.webmanifest` cubren notificaciones e instalacion de la vista cliente.

### Backend

- Firebase Authentication para identidades privadas.
- Cloud Firestore como base de datos operativa.
- Cloud Functions for Firebase en Node.js 22 para automatizaciones y validaciones de negocio.
- Firebase Cloud Messaging para avisos push del cliente.
- Firebase Hosting para publicar el frontend con CSP y headers de seguridad definidos en `firebase.json`.

## Colecciones principales

- `users`: perfiles, roles y metadatos de cuenta.
- `restaurants`: restaurantes, plan, activacion, branding y configuracion operativa.
- `orders`: flujo operativo privado de pedidos.
- `tracking`: seguimiento publico sanitizado, estado visible y valoracion del cliente.
- `contactInquiries`: solicitudes recibidas desde el formulario de contacto.
- `clientPushSubscriptions`: suscripciones push vinculadas a pedidos concretos.

## Cloud Functions incluidas

- `createRestaurantAccount`: alta completa de un restaurante.
- `createRestaurantAccessLink`: genera enlace seguro de acceso inicial para restaurante.
- `updateCurrentAdminProfile`: actualiza el perfil del administrador autenticado.
- `createAdminAccount`: alta completa de nuevos administradores.
- `getPublicTrackingOrder`: obtiene el seguimiento publico de un pedido.
- `submitPublicTrackingRating`: registra la valoracion del cliente tras la entrega.
- `submitContactInquiry`: almacena solicitudes comerciales o de soporte.
- `registerClientPushSubscription`: vincula un token push a un pedido publico.
- `unregisterClientPushSubscription`: elimina una suscripcion push.
- `notifyClientOrderReady`: envia una notificacion cuando el pedido cambia a `ready`.
- `syncRestaurantAiModelSummary`: recalcula el resumen del modelo adaptativo por restaurante.

## Seguridad

- Reglas de Firestore por rol en `firestore.rules`.
- Escritura privada restringida segun rol y ownership del documento.
- Lectura publica del pedido expuesta mediante Cloud Function sanitizada, no por acceso directo a Firestore.
- CSP, `Referrer-Policy`, `X-Frame-Options`, `X-Content-Type-Options` y `Permissions-Policy` definidos en Hosting.

## Estructura tecnica relevante

- `styles.css`: sistema visual y layouts responsive.
- `shared.js`: modelo compartido, sincronizacion y utilidades de producto.
- `config/firebase-environments.json`: catalogo de entornos Firebase con hostnames, project IDs y credenciales web.
- `firebase-config.js`: runtime raiz generado para resolver el entorno correcto por hostname.
- `firebase-bridge.js`: integracion web con Firestore y Functions.
- `firebase.hosting.develop.json` y `firebase.hosting.production.json`: despliegues de Hosting explicitos y aislados por entorno.
- `scripts/deploy-firebase-env.mjs`: entrypoint para publicar Hosting y/o backend en el proyecto correcto.
- `functions/index.js`: backend serverless y automatizaciones.
- `firestore.rules`: control de acceso por roles.
- `assets/landing/`: material visual real de la web comercial.
- `qa/`: comprobaciones locales de layout, comportamiento y regresiones clave.

## Puesta en marcha

### Requisitos

- Firebase CLI instalada.
- Proyecto Firebase con Authentication, Firestore, Functions, Hosting y Cloud Messaging habilitados.
- Un usuario administrador existente en Authentication.
- Documento `users/{adminUid}` con `role: "admin"`.
- Dominios autorizados correctamente configurados en Firebase Authentication para los accesos web.

### Dependencias de Functions

```bash
cd functions
npm install
```

### Despliegue

```bash
firebase login
npm run build:runtime
npm run build:hosting:develop
npm run build:hosting:production
npm run deploy:hosting:develop
npm run deploy:hosting:production
npm run deploy:backend:develop
npm run deploy:backend:production
```

Notas operativas:

- `Hosting` ya no se despliega desde `firebase.json` raiz para evitar cruces ambiguos entre entornos.
- Cada deploy de `Hosting` usa un bundle distinto en `dist/` y un `firebase.hosting.<env>.json` dedicado.
- Cada deploy de `backend` publica `functions` y `firestore.rules` contra el `projectId` explicito del entorno elegido.

### Desarrollo local

Para desarrollo local:

```bash
npm run build:runtime
python3 -m http.server
```

El runtime raiz resuelve `localhost` y `127.0.0.1` contra `develop`. Para publicar o verificar artefactos reales de Hosting, usa los bundles generados en `dist/develop` y `dist/production`.

## Operacion del sistema

- El administrador crea cuentas, activa accesos y sigue renovaciones, actividad y mensajes entrantes.
- El restaurante crea y mueve pedidos por estados, consulta dashboard e historial y ajusta su operacion diaria.
- El cliente sigue su pedido desde el movil, visualiza el progreso, recibe avisos y puede valorar la experiencia al finalizar.
- Las Functions sincronizan onboarding, acceso, seguimiento publico, notificaciones y resumenes del modelo adaptativo.

## QA y validacion

La carpeta `qa/` incluye comprobaciones locales para puntos criticos del producto, entre ellos:

- landing comercial
- endurecimiento del login y cache-bust de runtimes
- sistema compartido de spinners y estados ocupados
- carga del pedido cliente
- alineacion de progreso en cliente
- layouts de administrador y restaurante
- colisiones entre scripts clasicos

Estas utilidades ayudan a validar cambios visuales, contratos de runtime y regresiones operativas antes de publicar.

Comprobacion recomendada de aislamiento:

```bash
npm run qa:env-separation
```
