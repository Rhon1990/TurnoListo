# TurnoListo demo

La demo está separada en tres páginas:

- `admin.html`: el administrador crea restaurantes y genera sus accesos
- `restaurant.html`: el restaurante crea, edita, archiva y actualiza el estado de cada pedido de forma amigable
- `client.html`: el cliente lee su QR y ve el estado por colores junto a los pedidos anteriores

## Cómo probarla

1. Abre [admin.html](/Users/rdelgpad/Documents/personal/ideas/admin.html).
2. Entra como administrador con `admin` / `admin123`.
3. Crea un restaurante o usa el restaurante demo `demo` / `demo123`.
4. Abre [restaurant.html](/Users/rdelgpad/Documents/personal/ideas/restaurant.html) e inicia sesión con ese acceso.
5. Abre [client.html](/Users/rdelgpad/Documents/personal/ideas/client.html).
6. En restaurante crea un pedido nuevo o edita uno existente.
7. En cliente escribe `POS-801`, `POS-802`, `POS-803` o `POS-799`, o abre `client.html?order=POS-801`.

## Cómo se conectan

Si no configuras Firebase, la demo usa `localStorage`, así que solo verás los cambios reflejados dentro del mismo navegador.

Si configuras Firebase, `admin.html`, `restaurant.html` y `client.html` comparten los mismos datos en Firestore y ya funcionan entre dispositivos.

## Configurar Firebase

1. Crea un proyecto en Firebase y habilita `Cloud Firestore`.
2. En la configuración web del proyecto copia las credenciales en [firebase-config.js](/Users/rdelgpad/Documents/personal/TurnoListo/firebase-config.js).
3. Cambia `enabled: false` por `enabled: true`.
4. Crea dos colecciones en Firestore o deja que la app las cree al arrancar:
   `orders`
   `restaurants`
5. Usa reglas de prueba durante el arranque del proyecto. Por ejemplo:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Abre `admin.html`, `restaurant.html` y `client.html` con esa configuración y comprueba que los cambios viajan entre navegador y móvil.

La integración de Firebase usa el SDK web por CDN y sincroniza los pedidos y restaurantes en tiempo real con Firestore.

## Automatizar alta de restaurantes

La carpeta `functions/` incluye una Cloud Function callable llamada `createRestaurantAccount`.

Esta funcion hace el alta completa:

- crea el usuario en `Firebase Authentication`
- crea `users/{uid}` con `role: "restaurant"`
- crea `restaurants/{restaurantId}`

### Despliegue

1. Instala Firebase CLI si no la tienes.
2. Inicia sesion:

```bash
firebase login
```

3. Instala dependencias de Functions:

```bash
cd functions
npm install
```

4. Vuelve a la raiz del proyecto y despliega:

```bash
cd ..
firebase deploy --only functions
```

### Requisitos

- el admin debe existir en `Authentication`
- `users/{adminUid}` debe tener `role: "admin"`
- `rhon1990.github.io` debe estar en `Authentication > Configuracion > Dominios autorizados`

Si la funcion no esta desplegada, `admin.html` mostrara un error indicando que la automatizacion no esta disponible.

## Alta de restaurantes

Desde administración ahora puedes guardar:

- nombre del restaurante
- responsable
- correo electrónico
- número móvil
- ciudad
- dirección
- plan: `Quincenal`, `Mensual`, `Trimestral`, `Semestral`, `Anual`
- días de activación
- notas internas

El sistema genera automáticamente:

- usuario: `correo electrónico registrado`
- contraseña aleatoria segura

Cuando se vence el tiempo de activación, el restaurante queda bloqueado hasta renovación.

## Qué cambió

- alta rápida de pedidos con origen, cliente, pedido, recogida y notas
- edición segura del seguimiento sin tocar el registro original del restaurante
- archivado en lugar de borrado duro
- estados operativos: `Recibido`, `En preparación`, `Listo`, `Entregado`, `Cancelado`
- historial de pedidos archivados para no perder trazabilidad
- panel administrador con dashboard, filtros y fichas de restaurante
- acceso del restaurante protegido por usuario y contraseña
- eliminación manual de restaurantes desde administración
- el QR del cliente usa directamente el `Pedido original`

## Archivos

- `index.html`: portada con acceso a ambas vistas
- `admin.html`: interfaz del administrador
- `restaurant.html`: interfaz del restaurante
- `client.html`: interfaz del cliente
- `shared.js`: datos y persistencia compartida
- `admin.js`: lógica del administrador
- `restaurant.js`: lógica del restaurante
- `client.js`: lógica del cliente
- `styles.css`: estilos responsive
- `firebase-config.js`: configuración del proyecto Firebase
- `firebase-bridge.js`: conexión web con Firestore
