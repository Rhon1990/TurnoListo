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

Ambas páginas comparten los pedidos usando `localStorage`, así que si las abres en el mismo navegador verás los cambios reflejados.

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
