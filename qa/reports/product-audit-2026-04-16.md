# Auditoria de Producto, UX e IA

Fecha: 2026-04-16
URL auditada: https://rhon1990.github.io/TurnoListo/admin.html
Rama: `feature/Sprint2/security-ux-hardening-audit`

## Alcance ejecutado

- Auditoria visible en Chrome sobre la web publica.
- Flujo real `admin -> restaurante -> cliente` con altas temporales y limpieza final.
- Validacion responsive en desktop, tablet y movil para landing, contacto, admin, restaurante y cliente.
- Validacion movil real en emulador Android para `recibido -> preparando -> listo -> entregado -> rating bajo -> comentario enviado`.
- Revision de la narrativa de negocio y de la coherencia entre metricas, promesas de tiempo y comportamiento real del producto.
- Revision de la IA adaptativa y de si el aprendizaje es realmente historico y por restaurante.

## Hallazgos corregidos

### 1. Las metricas operativas no estaban alineadas con la promesa real al cliente

Problema:

- El dashboard del restaurante seguia usando umbrales fijos de 15 minutos para comunicar rendimiento, riesgo y puntualidad.
- Eso no reflejaba el tiempo prometido por pedido y degradaba la credibilidad del producto ante operadores e inversores.

Correccion:

- La puntualidad ahora se calcula contra `promisedReadyAt`.
- `Entregas a tiempo` paso a medir cumplimiento de promesa.
- `Retrasados +15 min` y `Criticos +30 min` pasaron a lecturas operativas reales: fuera de promesa y desvio grave.
- El dashboard principal paso a mostrar `Tiempo medio hasta listo` y desviacion media sobre la promesa.

Impacto:

- La narrativa comercial ya no vende una velocidad ficticia.
- La lectura del local ahora es defendible con datos reales de servicio.

### 2. La IA no estaba aprendiendo con suficiente historico por restaurante

Problema:

- La construccion del modelo adaptativo se apoyaba en una muestra acotada al dia en el flujo principal de inteligencia.
- Eso debilitaba la promesa de aprendizaje historico y personalizacion por restaurante.

Correccion:

- El modelo adaptativo ahora se entrena con historico propio del restaurante.
- Se limito la ventana de entrenamiento a un lookback operativo y a un maximo de ejemplos recientes para mantenerlo util y estable.

Impacto:

- La IA ahora se acerca mucho mas a un aprendizaje real del local y no a una heuristica del dia.

### 3. Los indicadores de `activos ahora` podian mentir

Problema:

- Parte de la lectura de activos y riesgo usaba pedidos creados en el periodo, no todos los pedidos abiertos en este momento.
- Un pedido viejo pero aun abierto podia desaparecer de la fotografia operativa.

Correccion:

- `activeNow`, `readyNow`, `delayedActive`, `longestActiveMinutes`, `aiHighRiskCount` y señales asociadas pasan a apoyarse en pedidos abiertos reales.

Impacto:

- La vista operativa del restaurante refleja la cocina y mostrador actuales, no solo lo creado hoy.

### 4. El cliente movil mostraba un logo roto si el restaurante no tenia imagen

Problema:

- En Android el cliente mostraba el icono roto del `img` vacio en la cabecera del restaurante.
- Esto afectaba directamente la percepcion de calidad del producto.

Correccion:

- El cliente ahora oculta el contenedor del logo si no existe `restaurantLogoUrl` y mantiene solo el nombre del restaurante.

Impacto:

- La degradacion visual es limpia y consistente en web movil.

## QA ejecutado

### Flujo visible en Chrome

Se ejecuto de forma visible:

- login de admin existente
- bandeja de mensajes
- export de dataset IA
- alta de restaurante temporal
- activacion de plan
- apertura de plantillas y enlace seguro
- definicion de contrasena inicial
- login real del restaurante
- creacion de pedido principal
- control de ticket duplicado
- creacion y cancelacion de pedido secundario
- edicion del pedido principal
- apertura del cliente publico
- prueba de QR
- caso de codigo invalido
- activacion de avisos
- paso `recibido -> preparando -> listo -> entregado`
- valoracion baja con comentario
- dashboard e historial del restaurante
- limpieza final del restaurante temporal

Resultado:

- Flujo completado en Chrome con `status: completed`.
- La instrumentacion de cliente registro una sola vibracion al entrar en `ready`, sin repeticion espuria.

### Responsive

Se revisaron las superficies principales en desktop, tablet y movil:

- `index.html`
- `contact.html`
- `admin.html`
- `restaurant.html`
- `client.html`

Resultado:

- No se detectaron desbordes globales severos en landing, contacto, restaurante o cliente.
- La mayor parte del ruido detectado por el auditor provenia de elementos opcionales u ocultos, por lo que se endurecio la herramienta para separar mejor falsos positivos de fallos reales.
- El hallazgo visual real fue el logo roto del cliente movil, ya corregido.

### Android emulado

Se valido en Android el mismo pedido desde un contexto movil independiente:

- carga del pedido publico
- actualizacion a `En preparacion`
- actualizacion a `Listo`
- aparicion del banner de pedido listo
- paso a `Entregado`
- seleccion de rating bajo
- aparicion del campo de comentario
- envio de comentario

Resultado:

- El cliente movil reflejo correctamente los cambios de estado.
- La experiencia final de feedback quedo operativa tambien en Android.

## Herramientas QA reutilizables anadidas

- `qa/responsive-visual-audit.mjs`
- `qa/create-live-order.mjs`
- `qa/update-live-order-status.mjs`

Estas utilidades permiten repetir auditorias visibles y pruebas de flujo sin reescribir automatizacion.

## Riesgos residuales

- El banner de traduccion de Chrome en Android puede superponerse a la UI del cliente, pero es una capa del navegador, no de TurnoListo.
- Audio y vibracion dependen de gesto de usuario y politicas del navegador. Se valido la logica y la reaccion visual; la prueba de sonido en emulador no es una evidencia acustica fiable.
- El auditor responsive sigue siendo conservador: detecta posibles tensiones de layout, pero algunos casos requieren confirmacion visual antes de tratarlos como bug real.

## Conclusiones

- La app ya vende mejor lo que realmente hace: una operacion guiada por promesa y una IA adaptativa por restaurante.
- El flujo principal funciona en web publica y movil Android, incluyendo cierre de experiencia con rating y comentario.
- El principal bug visual real detectado durante esta auditoria fue el logo roto en cliente movil y ya esta corregido.
