(function () {
  const LANGUAGE_STORAGE_KEY = "turnolisto-language";
  const DEFAULT_LANGUAGE = "es";
  const SUPPORTED_LANGUAGES = {
    es: { flag: "🇪🇸", label: "Español" },
    en: { flag: "🇬🇧", label: "English" },
    fr: { flag: "🇫🇷", label: "Français" },
  };

  const textNodeOrigins = new WeakMap();
  let titleOrigin = "";
  let isApplyingTranslations = false;
  let observer = null;

  const SKIP_TRANSLATION_SELECTOR = [
    "[translate='no']",
    "[data-i18n-skip]",
    ".workspace-brand__name",
    ".auth-brand__name",
    ".hero-brand__name",
  ].join(", ");

  const KEY_TRANSLATION_SOURCES = {
    "brand.tagline": "Tecnología que Agiliza tu Restaurante",
    "layout.topbar.aria": "Cabecera principal TurnoListo",
    "layout.actions.aria": "Acciones de cabecera",
    "layout.home.aria": "Ir al inicio de TurnoListo",
    "layout.homePanel.aria": "Ir al panel principal",
    "layout.adminPanel.aria": "Ir al panel principal de administración",
    "layout.restaurantPanel.aria": "Ir al panel principal del restaurante",
    "layout.home": "Inicio",
    "layout.contact": "Contáctenos",
    "layout.profile": "Perfil",
    "layout.logout": "Cerrar sesión",
    "layout.accountMenu.aria": "Abrir menú de cuenta",
    "layout.messages": "Mensajes",
    "layout.messagesInbox.aria": "Abrir bandeja de mensajes",
    "alert.closeAria": "Cerrar alerta",
    "alert.successTitle": "Todo correcto",
    "alert.warningTitle": "Revisa esto",
    "alert.errorTitle": "Algo ha fallado",
    "alert.unexpected": "Ha ocurrido un error inesperado.",

    "landing.hero.title": "Dos códigos, un mismo pedido.",
    "landing.hero.text": "Una pantalla para el restaurante y otra para el cliente, conectadas por el mismo flujo.",
    "landing.admin.code": "Código 0",
    "landing.admin.title": "Panel administrador",
    "landing.admin.text": "Crea restaurantes, define su usuario y contraseña y controla quién entra al panel operativo.",
    "landing.admin.cta": "Abrir administrador",
    "landing.restaurant.code": "Código 1",
    "landing.restaurant.title": "Panel restaurante",
    "landing.restaurant.text": "Cambia el estado de cada pedido de forma amigable y entrega un QR al cliente.",
    "landing.restaurant.cta": "Abrir restaurante",
    "landing.client.code": "Código 2",
    "landing.client.title": "Vista cliente",
    "landing.client.text": "El usuario lee su QR y ve el estado por colores junto a los pedidos anteriores.",
    "landing.client.cta": "Abrir cliente",

    "client.brand.eyebrow": "Restaurante",
    "client.queue.label": "Pedidos antes que tú",
    "client.eta.label": "Tiempo estimado",
    "client.status.received": "Recibido",
    "client.status.preparing": "Preparando",
    "client.status.ready": "Listo",
    "client.status.delivered": "Entregado",
    "client.ready.title": "Tu pedido ya está listo.",
    "client.ready.text": "Ya puedes acercarte al punto de recogida.",
    "client.alerts.title": "Activa los avisos del pedido.",
    "client.alerts.default": "Recibiras sonido si tienes la app abierta, y notificacion si el movil esta bloqueado.",
    "client.alerts.button": "Activar avisos",
    "client.ios.title": "Mejora los avisos en tu iPhone.",
    "client.ios.text": "Para que TurnoListo pueda avisarte mejor, abre este pedido en Safari, anadelo a pantalla de inicio y activalo desde ese icono.",
    "client.ios.button": "Como activarlo en iPhone",
    "client.ios.copyLink": "Copia el enlace de este pedido",
    "client.ios.step.copy": "1. Copia el enlace de este pedido.",
    "client.ios.step.safari": "2. Abre Safari y pega el enlace.",
    "client.ios.step.share": "3. Toca Compartir.",
    "client.ios.step.install": "4. Elige \"Anadir a pantalla de inicio\".",
    "client.ios.step.open": "5. Abre TurnoListo desde el nuevo icono y toca \"Activar avisos\".",
    "client.alerts.confirmation": "Tienes las notificaciones activadas.",
    "client.feedback.kicker": "Pedido entregado",
    "client.feedback.title": "Gracias por su compra, vuelva pronto",
    "client.feedback.text": "Valora tu experiencia",
    "client.feedback.improve": "¿Qué podemos mejorar?",
    "client.feedback.placeholder": "Escribe un comentario corto",
    "client.feedback.send": "Enviar comentario",
    "client.feedback.sent": "Gracias por sus comentarios.",
    "client.tools.kicker": "Herramientas del pedido",
    "client.tools.openAnother": "Abrir otro pedido",
    "client.tools.showQr": "Mostrar mi QR",
    "client.tools.hint": "Escribe el código seguro del pedido solo si quieres consultar uno distinto.",
    "client.qr.closeAria": "Cerrar QR",
    "client.close": "Cerrar",
    "client.code.label": "Tu código",

    "admin.login.kicker": "Acceso administrador",
    "admin.login.title": "Accede al panel maestro",
    "admin.showcase.kicker": "Administrador",
    "admin.showcase.title": "Controla expansión, renovación y adopción desde un solo panel.",
    "admin.showcase.text": "Diseñado para operar una cartera de restaurantes con lectura ejecutiva, alertas comerciales y visibilidad clara sobre uso real.",
    "admin.showcase.executive.label": "Visión ejecutiva",
    "admin.showcase.executive.text": "Salud de cuentas, actividad y riesgo en la misma pantalla.",
    "admin.showcase.retention.label": "Retención",
    "admin.showcase.retention.text": "Detecta renovaciones pendientes y churn antes de perder el local.",
    "admin.showcase.commercial.label": "Escala comercial",
    "admin.showcase.commercial.text": "Onboarding, upsell y seguimiento pensados para crecer cartera.",
    "admin.showcase.signal.guided": "Activación guiada",
    "admin.showcase.signal.renewal": "Renovación segura",
    "admin.showcase.signal.demo": "Panel listo para demo",
    "admin.login.text": "Entra para gestionar restaurantes, revisar señales de negocio y mover la operación comercial del producto.",
    "admin.login.email": "Correo administrador",
    "admin.login.password": "Contraseña",
    "admin.login.showPassword": "Mostrar contraseña",
    "admin.login.submit": "Entrar al panel",
    "admin.account.emptyName": "Sin datos cargados",
    "admin.account.emptyMeta": "Cuenta no cargada",

    "restaurant.login.kicker": "Acceso restaurante",
    "restaurant.login.email": "Correo de acceso",
    "restaurant.login.password": "Contraseña",
    "restaurant.login.showPassword": "Mostrar contraseña",
    "restaurant.login.submit": "Entrar al restaurante",
    "restaurant.account.emptyName": "Sin datos cargados",
    "restaurant.account.emptyMeta": "Cuenta no cargada",
  };

  const EXACT_TRANSLATIONS = {
    en: {
      "TurnoListo | Cliente": "TurnoListo | Customer",
      "TurnoListo | Contáctenos": "TurnoListo | Contact us",
      "TurnoListo | Abriendo pedido": "TurnoListo | Opening order",
      "TurnoListo | Administrador": "TurnoListo | Admin",
      "TurnoListo | Perfil admin": "TurnoListo | Admin profile",
      "TurnoListo | Restaurante": "TurnoListo | Restaurant",
      "TurnoListo | Perfil restaurante": "TurnoListo | Restaurant profile",
      "Cabecera principal TurnoListo": "TurnoListo main header",
      "Ir al inicio de TurnoListo": "Go to TurnoListo home",
      "Ir al panel principal": "Go to main dashboard",
      "Ir al panel principal de administración": "Go to main admin dashboard",
      "Ir al panel principal del restaurante": "Go to main restaurant dashboard",
      "Acciones de cabecera": "Header actions",
      "Inicio": "Home",
      "Contáctenos": "Contact us",
      "Panel administrador": "Admin panel",
      "Panel restaurante": "Restaurant panel",
      "Vista cliente": "Customer view",
      "Abrir administrador": "Open admin",
      "Abrir restaurante": "Open restaurant",
      "Abrir cliente": "Open customer",
      "Dos códigos, un mismo pedido.": "Two codes, one shared order.",
      "Una pantalla para el restaurante y otra para el cliente, conectadas por el mismo flujo.": "One screen for the restaurant and another for the customer, connected by the same flow.",
      "Código 0": "Code 0",
      "Código 1": "Code 1",
      "Código 2": "Code 2",
      "Crea restaurantes, define su usuario y contraseña y controla quién entra al panel operativo.": "Create restaurants, define their user and password, and control who can access the operational dashboard.",
      "Cambia el estado de cada pedido de forma amigable y entrega un QR al cliente.": "Update each order status easily and hand a QR to the customer.",
      "El usuario lee su QR y ve el estado por colores junto a los pedidos anteriores.": "The user scans their QR and sees the status by color along with previous orders.",
      "Restaurante": "Restaurant",
      "Pedidos antes que tú": "Orders ahead of you",
      "Tiempo estimado": "Estimated time",
      "Recibido": "Received",
      "Preparando": "Preparing",
      "Listo": "Ready",
      "Entregado": "Delivered",
      "Tu pedido ya está listo.": "Your order is ready.",
      "Ya puedes acercarte al punto de recogida.": "You can now head to the pickup point.",
      "Activa los avisos del pedido.": "Turn on order alerts.",
      "Activar avisos": "Enable alerts",
      "Mejora los avisos en tu iPhone.": "Improve alerts on your iPhone.",
      "Como activarlo en iPhone": "How to enable it on iPhone",
      "Copia el enlace de este pedido": "Copy this order link",
      "Tienes las notificaciones activadas.": "Notifications are enabled.",
      "Pedido entregado": "Order delivered",
      "Gracias por su compra, vuelva pronto": "Thank you for your purchase, come back soon",
      "Valora tu experiencia": "Rate your experience",
      "¿Qué podemos mejorar?": "What can we improve?",
      "Escribe un comentario corto": "Write a short comment",
      "Enviar comentario": "Send comment",
      "Gracias por sus comentarios.": "Thanks for your feedback.",
      "Herramientas del pedido": "Order tools",
      "Abrir otro pedido": "Open another order",
      "Mostrar mi QR": "Show my QR",
      "Escribe el código seguro del pedido solo si quieres consultar uno distinto.": "Enter the secure order code only if you want to check a different one.",
      "Cerrar QR": "Close QR",
      "Cerrar": "Close",
      "Tu código": "Your code",
      "Contáctenos": "Contact us",
      "Hablemos de la siguiente etapa de TurnoListo": "Let's talk about TurnoListo's next stage",
      "B2B para restauración": "B2B for restaurants",
      "Operación en tiempo real": "Real-time operations",
      "Canal directo con fundador": "Direct channel with the founder",
      "Formulario": "Form",
      "Cuéntanos tu interés": "Tell us about your interest",
      "Nombre completo": "Full name",
      "Empresa o fondo": "Company or fund",
      "Correo de contacto": "Contact email",
      "Número móvil": "Mobile number",
      "Motivo": "Reason",
      "Mensaje": "Message",
      "Enviar solicitud": "Send request",
      "Información": "Information",
      "Datos de empresa": "Company details",
      "Canal de atención": "Support channel",
      "Bandeja privada TurnoListo": "TurnoListo private inbox",
      "Teléfono": "Phone",
      "Horario de atención": "Support hours",
      "Ubicación": "Location",
      "Mapa": "Map",
      "Ubicación de la empresa": "Company location",
      "Perfil": "Profile",
      "Foto y presencia de cuenta": "Photo and account presence",
      "Foto de perfil": "Profile photo",
      "Información principal": "Main information",
      "Nombre": "Name",
      "Responsable": "Owner",
      "Correo": "Email",
      "Ciudad": "City",
      "Plan": "Plan",
      "Dirección": "Address",
      "Notas internas": "Internal notes",
      "Trazabilidad": "Traceability",
      "Acceso hasta": "Access until",
      "Estado": "Status",
      "Mi cuenta": "My account",
      "Perfil actual": "Current profile",
      "Sin datos cargados": "No data loaded",
      "Cuenta no cargada": "Account not loaded",
      "No disponible": "Not available",
      "Cuenta verificada": "Verified account",
      "Logo editable": "Editable logo",
      "Datos operativos": "Operational data",
      "Guardar perfil": "Save profile",
      "Administrador": "Admin",
      "Acceso administrador": "Admin access",
      "Accede al panel maestro": "Access the master dashboard",
      "Correo administrador": "Admin email",
      "Contraseña": "Password",
      "Mostrar contraseña": "Show password",
      "Entrar al panel": "Enter dashboard",
      "Mensajes": "Messages",
      "Perfil admin": "Admin profile",
      "Gestiona tu cuenta y el equipo administrador": "Manage your account and the admin team",
      "Cuenta privada": "Private account",
      "Equipo administrador": "Admin team",
      "Gestión segura": "Secure management",
      "Cargo": "Role",
      "Teléfono": "Phone",
      "Creado": "Created",
      "Última actualización": "Last update",
      "Restablecer": "Reset",
      "Equipo admin": "Admin team",
      "Agregar administradores": "Add admins",
      "Buscar país o indicativo": "Search country or dialing code",
      "Selecciona el país del móvil y escribe el número local sin añadir el prefijo.": "Select the phone country and type the local number without the prefix.",
      "Restaurante": "Restaurant",
      "Acceso restaurante": "Restaurant access",
      "Correo de acceso": "Access email",
      "Entrar al restaurante": "Enter restaurant",
      "Panel restaurante": "Restaurant dashboard",
      "Pedidos activos": "Active orders",
      "Gestión": "Management",
      "Operación de pedidos con IA adaptativa": "AI-driven order operations",
      "Acción sugerida ahora": "Suggested action now",
      "Todo bajo control": "Everything under control",
      "Operación estable": "Stable operation",
      "Listo para hora pico": "Ready for rush hour",
      "Nuevo pedido": "New order",
      "Dashboard": "Dashboard",
      "Archivados": "Archived",
      "Playbook operativo": "Operational playbook",
      "Modo completo": "Full mode",
      "Modo hora pico": "Rush-hour mode",
      "En riesgo": "At risk",
      "Vencen pronto": "Due soon",
      "Listos por recoger": "Ready for pickup",
      "Panel maestro": "Master dashboard",
      "Alta": "Create",
      "Restaurantes": "Restaurants",
      "Dashboard administrador": "Admin dashboard",
      "Resumen general": "General overview",
      "Ver por": "View by",
      "Día": "Day",
      "Mes": "Month",
      "Año": "Year",
      "Pulso del negocio": "Business pulse",
      "Base activa": "Active base",
      "Actividad observada del periodo": "Observed activity for the period",
      "Renovación inmediata": "Immediate renewal",
      "Señal de churn": "Churn signal",
      "Cartera total": "Total portfolio",
      "Abriendo tu pedido": "Opening your order",
      "Estamos preparando el seguimiento.": "We are preparing the tracking.",
      "Un momento...": "One moment...",
      "Te llevamos al estado actual de tu pedido.": "We are taking you to the current status of your order.",
      "Idioma": "Language",
      "Español": "Spanish",
      "English": "English",
      "Français": "French",
      "Lista de países para contacto": "Country list for contact",
      "Lista de países para móvil del restaurante": "Country list for restaurant mobile",
      "Lista de países para móvil admin": "Country list for admin mobile",
      "Abrir menú de cuenta": "Open account menu",
      "Abrir bandeja de mensajes": "Open messages inbox",
      "Para que TurnoListo pueda avisarte mejor, abre este pedido en Safari, anadelo a pantalla de inicio y activalo desde ese icono.": "To let TurnoListo notify you better, open this order in Safari, add it to your home screen, and enable it from that icon.",
      "3. Toca Compartir.": "3. Tap Share.",
      "4. Elige \"Anadir a pantalla de inicio\".": "4. Choose \"Add to Home Screen\".",
      "5. Abre TurnoListo desde el nuevo icono y toca \"Activar avisos\".": "5. Open TurnoListo from the new icon and tap \"Enable alerts\".",
      "Tecnología que Agiliza tu Restaurante": "Technology that streamlines your restaurant",
      "Cerrar sesión": "Log out",
      "Acceso verificado": "Verified access",
      "Credenciales incorrectas o la cuenta no tiene un perfil admin en users/{uid}.": "Incorrect credentials or the account does not have an admin profile in users/{uid}.",
      "No se pudo iniciar sesion. Verifica que la cuenta del restaurante exista en Firebase Authentication y que la clave coincida.": "Sign-in failed. Verify that the restaurant account exists in Firebase Authentication and that the password matches.",
      "No se pudo iniciar sesion. Revisa credenciales, dominio autorizado y el perfil users/{uid}.": "Sign-in failed. Check the credentials, authorized domain, and the users/{uid} profile.",
      "No se pudo iniciar sesion como administrador. Verifica credenciales, dominio autorizado y el perfil users/{uid}.": "Admin sign-in failed. Check the credentials, authorized domain, and the users/{uid} profile.",
      "Cerrar alerta": "Close alert",
      "Todo correcto": "All good",
      "Revisa esto": "Check this",
      "Algo ha fallado": "Something went wrong",
      "Ha ocurrido un error inesperado.": "An unexpected error occurred.",
      "Pedido no disponible": "Order unavailable",
      "Este seguimiento ya no está activo o fue archivado.": "This tracking is no longer active or was archived.",
      "Este QR ya no está disponible.": "This QR is no longer available.",
      "QR no disponible": "QR unavailable",
      "Tienes las notificaciones activadas. Toca una vez la pantalla para activar el sonido.": "Notifications are on. Tap the screen once to enable sound.",
      "Activando...": "Activating...",
      "Avisos activados.": "Alerts enabled.",
      "Avisos activados": "Alerts enabled",
      "Este pedido ya quedó configurado para avisarte.": "This order is already set up to notify you.",
      "Las notificaciones están bloqueadas en este navegador. Actívalas en los permisos del sitio.": "Notifications are blocked in this browser. Enable them in the site permissions.",
      "Los avisos no estan disponibles aqui.": "Alerts are not available here.",
      "Usa Safari y pantalla de inicio": "Use Safari and your home screen",
      "Avisos no disponibles aqui": "Alerts unavailable here",
      "Recibiras sonido si tienes la pagina abierta, y notificacion si el movil esta bloqueado.": "You will get sound if you keep the page open, and a notification if the phone is locked.",
      "Recibiras sonido si tienes la app abierta, y notificacion si el movil esta bloqueado.": "You will get sound if you keep the app open, and a notification if the phone is locked.",
      "Recibiras sonido y vibracion si tienes la pagina abierta, y notificacion si el movil esta bloqueado.": "You will get sound and vibration if you keep the page open, and a notification if the phone is locked.",
      "Recibiras sonido y vibracion si tienes la app abierta, y notificacion si el movil esta bloqueado.": "You will get sound and vibration if you keep the app open, and a notification if the phone is locked.",
      "Si quieres que TurnoListo te avise mientras usas otras apps, primero abre este pedido en Safari.": "If you want TurnoListo to notify you while you use other apps, first open this order in Safari.",
      "Si quieres que TurnoListo te avise mientras usas otras apps, anade este pedido a pantalla de inicio y abrelo desde ese icono.": "If you want TurnoListo to notify you while you use other apps, add this order to your home screen and open it from that icon.",
      "Abrir paso a paso en iPhone": "Open iPhone step by step",
      "Como anadirlo a pantalla de inicio": "How to add it to the home screen",
      "Ocultar pasos": "Hide steps",
      "1. Copia el enlace de este pedido.": "1. Copy this order link.",
      "2. Abre Safari y pega el enlace.": "2. Open Safari and paste the link.",
      "1. Toca Compartir.": "1. Tap Share.",
      "2. Elige \"Anadir a pantalla de inicio\".": "2. Choose \"Add to Home Screen\".",
      "3. Abre TurnoListo desde el nuevo icono y toca \"Activar avisos\".": "3. Open TurnoListo from the new icon and tap \"Enable alerts\".",
      "Enlace copiado. Ahora puedes pegarlo en Safari.": "Link copied. You can now paste it into Safari.",
      "No se pudo copiar automaticamente. Copia la URL desde la barra del navegador.": "It could not be copied automatically. Copy the URL from the browser bar.",
      "Panel restaurante": "Restaurant dashboard",
      "Demo restaurante": "Restaurant demo",
      "No hay pedidos activos que coincidan con esos filtros.": "No active orders match those filters.",
      "No hay pedidos archivados que coincidan con esos filtros.": "No archived orders match those filters.",
      "Aqui apareceran los pedidos entregados o cancelados.": "Delivered or cancelled orders will appear here.",
      "Demo en uso": "Demo in use",
      "La demo ya demostro el valor": "The demo already proved its value",
      "Activa el plan completo": "Activate the full plan",
      "Listo para recibir más pedidos": "Ready to receive more orders",
      "Operacion estable": "Stable operation",
      "Listo para escalar": "Ready to scale",
      "No encontramos ningún país con esa búsqueda.": "We could not find any country matching that search.",
      "Ocultar contraseña": "Hide password",
      "Ver comentario": "View comment",
      "Abrir vista cliente": "Open customer view",
      "Editar información": "Edit information",
      "Guardar cambios": "Save changes",
      "No se pudo cargar el equipo administrador por ahora.": "The admin team could not be loaded right now.",
      "Aquí verás el equipo administrador con acceso activo.": "The active admin team will appear here.",
      "No hay mensajes que coincidan con esos filtros.": "No messages match those filters.",
      "Sin empresa": "No company",
      "Sin correo": "No email",
      "Sin teléfono": "No phone",
      "Leído": "Read",
      "Sin leer": "Unread",
      "Sin mensaje": "No message",
      "Marcar sin leer": "Mark as unread",
      "Marcar leído": "Mark as read",
      "No se pudo actualizar el estado del mensaje.": "The message status could not be updated.",
      "No hay cuentas urgentes de renovación ahora mismo": "There are no urgent renewal accounts right now",
      "No hay onboarding bloqueado en este momento": "There is no blocked onboarding at the moment",
      "No hay señales de riesgo relevantes ahora": "There are no relevant risk signals right now",
      "Aún no hay base sana suficiente para empujar upsell": "There is not yet a healthy enough base to push upsell",
      "Todavía no hay pedidos suficientes para construir un dataset de entrenamiento.": "There are not enough orders yet to build a training dataset.",
      "Dataset IA exportado en formato JSON.": "AI dataset exported in JSON format.",
      "No hay restaurantes que coincidan con esos filtros.": "No restaurants match those filters.",
      "Contexto": "Context",
      "Siguiente paso": "Next step",
      "Logo del restaurante": "Restaurant logo",
      "Sube un logo cuadrado o rectangular. Lo optimizaremos para restaurante y cliente.": "Upload a square or rectangular logo. We will optimize it for restaurant and customer views.",
      "Acceso:": "Access:",
      "Gestionado con enlace seguro": "Managed with a secure link",
      "Acción prioritaria": "Priority action",
      "Activar plan comercial": "Activate commercial plan",
      "Abrir acceso restaurante": "Open restaurant access",
      "Plantillas": "Templates",
      "Activar plan": "Activate plan",
      "Renovar plan": "Renew plan",
      "Eliminar": "Delete",
      "No hay enlace seguro disponible para este restaurante.": "There is no secure link available for this restaurant.",
      "No se pudo generar el enlace seguro del restaurante.": "The restaurant secure link could not be generated.",
      "No disponible": "Not available",
      "No se pudo guardar el perfil administrador en esta configuración.": "The admin profile could not be saved in this configuration.",
      "Perfil administrador actualizado correctamente.": "Admin profile updated successfully.",
      "No se pudo guardar el perfil administrador.": "The admin profile could not be saved.",
      "No se pudo crear el usuario administrador en esta configuración.": "The admin user could not be created in this configuration.",
      "Administrador creado. Se generó un enlace seguro para definir contraseña.": "Administrator created. A secure link was generated to set the password.",
      "Administrador creado correctamente.": "Administrator created successfully.",
      "Nuevo administrador creado correctamente.": "New administrator created successfully.",
      "Ese correo ya existe en Firebase Authentication.": "That email already exists in Firebase Authentication.",
      "No se pudo crear el nuevo administrador.": "The new administrator could not be created.",
      "Controla expansión, renovación y adopción desde un solo panel.": "Control expansion, renewal, and adoption from a single dashboard.",
      "Diseñado para operar una cartera de restaurantes con lectura ejecutiva, alertas comerciales y visibilidad clara sobre uso real.": "Designed to run a restaurant portfolio with executive visibility, commercial alerts, and clear insight into real usage.",
      "Visión ejecutiva": "Executive visibility",
      "Salud de cuentas, actividad y riesgo en la misma pantalla.": "Account health, activity, and risk on the same screen.",
      "Retención": "Retention",
      "Detecta renovaciones pendientes y churn antes de perder el local.": "Detect pending renewals and churn before losing the venue.",
      "Escala comercial": "Commercial scale",
      "Onboarding, upsell y seguimiento pensados para crecer cartera.": "Onboarding, upsell, and follow-up designed to grow the portfolio.",
      "Activación guiada": "Guided activation",
      "Renovación segura": "Secure renewal",
      "Panel listo para demo": "Demo-ready dashboard",
      "Entra para gestionar restaurantes, revisar señales de negocio y mover la operación comercial del producto.": "Sign in to manage restaurants, review business signals, and drive the product's commercial operation.",
    },
    fr: {
      "TurnoListo | Cliente": "TurnoListo | Client",
      "TurnoListo | Contáctenos": "TurnoListo | Contactez-nous",
      "TurnoListo | Abriendo pedido": "TurnoListo | Ouverture de commande",
      "TurnoListo | Administrador": "TurnoListo | Administration",
      "TurnoListo | Perfil admin": "TurnoListo | Profil admin",
      "TurnoListo | Restaurante": "TurnoListo | Restaurant",
      "TurnoListo | Perfil restaurante": "TurnoListo | Profil restaurant",
      "Cabecera principal TurnoListo": "En-tête principal TurnoListo",
      "Ir al inicio de TurnoListo": "Aller à l'accueil de TurnoListo",
      "Ir al panel principal": "Aller au tableau principal",
      "Ir al panel principal de administración": "Aller au tableau principal d'administration",
      "Ir al panel principal del restaurante": "Aller au tableau principal du restaurant",
      "Acciones de cabecera": "Actions d'en-tête",
      "Inicio": "Accueil",
      "Contáctenos": "Contactez-nous",
      "Panel administrador": "Tableau admin",
      "Panel restaurante": "Tableau restaurant",
      "Vista cliente": "Vue client",
      "Abrir administrador": "Ouvrir l'administration",
      "Abrir restaurante": "Ouvrir le restaurant",
      "Abrir cliente": "Ouvrir le client",
      "Dos códigos, un mismo pedido.": "Deux codes, une même commande.",
      "Una pantalla para el restaurante y otra para el cliente, conectadas por el mismo flujo.": "Un écran pour le restaurant et un autre pour le client, reliés par le même flux.",
      "Código 0": "Code 0",
      "Código 1": "Code 1",
      "Código 2": "Code 2",
      "Crea restaurantes, define su usuario y contraseña y controla quién entra al panel operativo.": "Créez des restaurants, définissez leur utilisateur et mot de passe, et contrôlez qui accède au tableau opérationnel.",
      "Cambia el estado de cada pedido de forma amigable y entrega un QR al cliente.": "Mettez à jour facilement l'état de chaque commande et remettez un QR au client.",
      "El usuario lee su QR y ve el estado por colores junto a los pedidos anteriores.": "L'utilisateur scanne son QR et voit l'état en couleurs avec ses commandes précédentes.",
      "Restaurante": "Restaurant",
      "Pedidos antes que tú": "Commandes avant vous",
      "Tiempo estimado": "Temps estimé",
      "Recibido": "Reçu",
      "Preparando": "Préparation",
      "Listo": "Prêt",
      "Entregado": "Livré",
      "Tu pedido ya está listo.": "Votre commande est prête.",
      "Ya puedes acercarte al punto de recogida.": "Vous pouvez maintenant vous rendre au point de retrait.",
      "Activa los avisos del pedido.": "Activez les alertes de commande.",
      "Activar avisos": "Activer les alertes",
      "Mejora los avisos en tu iPhone.": "Améliorez les alertes sur votre iPhone.",
      "Como activarlo en iPhone": "Comment l'activer sur iPhone",
      "Copia el enlace de este pedido": "Copier le lien de cette commande",
      "Tienes las notificaciones activadas.": "Les notifications sont activées.",
      "Pedido entregado": "Commande livrée",
      "Gracias por su compra, vuelva pronto": "Merci pour votre achat, revenez bientôt",
      "Valora tu experiencia": "Évaluez votre expérience",
      "¿Qué podemos mejorar?": "Que pouvons-nous améliorer ?",
      "Escribe un comentario corto": "Écrivez un court commentaire",
      "Enviar comentario": "Envoyer le commentaire",
      "Gracias por sus comentarios.": "Merci pour vos commentaires.",
      "Herramientas del pedido": "Outils de commande",
      "Abrir otro pedido": "Ouvrir une autre commande",
      "Mostrar mi QR": "Afficher mon QR",
      "Escribe el código seguro del pedido solo si quieres consultar uno distinto.": "Saisissez le code sécurisé de la commande uniquement si vous souhaitez en consulter une autre.",
      "Cerrar QR": "Fermer le QR",
      "Cerrar": "Fermer",
      "Tu código": "Votre code",
      "Hablemos de la siguiente etapa de TurnoListo": "Parlons de la prochaine étape de TurnoListo",
      "B2B para restauración": "B2B pour la restauration",
      "Operación en tiempo real": "Opérations en temps réel",
      "Canal directo con fundador": "Canal direct avec le fondateur",
      "Formulario": "Formulaire",
      "Cuéntanos tu interés": "Parlez-nous de votre intérêt",
      "Nombre completo": "Nom complet",
      "Empresa o fondo": "Entreprise ou fonds",
      "Correo de contacto": "E-mail de contact",
      "Número móvil": "Numéro de mobile",
      "Motivo": "Motif",
      "Mensaje": "Message",
      "Enviar solicitud": "Envoyer la demande",
      "Información": "Informations",
      "Datos de empresa": "Données de l'entreprise",
      "Canal de atención": "Canal d'assistance",
      "Bandeja privada TurnoListo": "Boîte privée TurnoListo",
      "Teléfono": "Téléphone",
      "Horario de atención": "Horaires d'assistance",
      "Ubicación": "Emplacement",
      "Mapa": "Carte",
      "Ubicación de la empresa": "Emplacement de l'entreprise",
      "Perfil": "Profil",
      "Foto y presencia de cuenta": "Photo et présence du compte",
      "Foto de perfil": "Photo de profil",
      "Información principal": "Informations principales",
      "Nombre": "Nom",
      "Responsable": "Responsable",
      "Correo": "E-mail",
      "Ciudad": "Ville",
      "Plan": "Plan",
      "Dirección": "Adresse",
      "Notas internas": "Notes internes",
      "Trazabilidad": "Traçabilité",
      "Acceso hasta": "Accès jusqu'au",
      "Estado": "Statut",
      "Mi cuenta": "Mon compte",
      "Perfil actual": "Profil actuel",
      "Sin datos cargados": "Aucune donnée chargée",
      "Cuenta no cargada": "Compte non chargé",
      "No disponible": "Non disponible",
      "Cuenta verificada": "Compte vérifié",
      "Logo editable": "Logo modifiable",
      "Datos operativos": "Données opérationnelles",
      "Guardar perfil": "Enregistrer le profil",
      "Administrador": "Administration",
      "Acceso administrador": "Accès admin",
      "Accede al panel maestro": "Accéder au tableau principal",
      "Correo administrador": "E-mail admin",
      "Contraseña": "Mot de passe",
      "Mostrar contraseña": "Afficher le mot de passe",
      "Entrar al panel": "Entrer dans le tableau",
      "Mensajes": "Messages",
      "Perfil admin": "Profil admin",
      "Gestiona tu cuenta y el equipo administrador": "Gérez votre compte et l'équipe admin",
      "Cuenta privada": "Compte privé",
      "Equipo administrador": "Équipe admin",
      "Gestión segura": "Gestion sécurisée",
      "Cargo": "Fonction",
      "Creado": "Créé",
      "Última actualización": "Dernière mise à jour",
      "Restablecer": "Réinitialiser",
      "Equipo admin": "Équipe admin",
      "Agregar administradores": "Ajouter des administrateurs",
      "Buscar país o indicativo": "Rechercher un pays ou un indicatif",
      "Selecciona el país del móvil y escribe el número local sin añadir el prefijo.": "Sélectionnez le pays du mobile et saisissez le numéro local sans le préfixe.",
      "Acceso restaurante": "Accès restaurant",
      "Correo de acceso": "E-mail d'accès",
      "Entrar al restaurante": "Entrer dans le restaurant",
      "Panel restaurante": "Tableau restaurant",
      "Pedidos activos": "Commandes actives",
      "Gestión": "Gestion",
      "Operación de pedidos con IA adaptativa": "Opérations des commandes avec IA adaptative",
      "Acción sugerida ahora": "Action suggérée maintenant",
      "Todo bajo control": "Tout est sous contrôle",
      "Operación estable": "Opération stable",
      "Listo para hora pico": "Prêt pour l'heure de pointe",
      "Nuevo pedido": "Nouvelle commande",
      "Dashboard": "Tableau de bord",
      "Archivados": "Archivées",
      "Playbook operativo": "Playbook opérationnel",
      "Modo completo": "Mode complet",
      "Modo hora pico": "Mode heure de pointe",
      "En riesgo": "À risque",
      "Vencen pronto": "Bientôt dus",
      "Listos por recoger": "Prêtes au retrait",
      "Panel maestro": "Tableau principal",
      "Alta": "Création",
      "Restaurantes": "Restaurants",
      "Dashboard administrador": "Tableau admin",
      "Resumen general": "Résumé général",
      "Ver por": "Voir par",
      "Día": "Jour",
      "Mes": "Mois",
      "Año": "Année",
      "Pulso del negocio": "Pouls de l'activité",
      "Base activa": "Base active",
      "Actividad observada del periodo": "Activité observée sur la période",
      "Renovación inmediata": "Renouvellement immédiat",
      "Señal de churn": "Signal de churn",
      "Cartera total": "Portefeuille total",
      "Abriendo tu pedido": "Ouverture de votre commande",
      "Estamos preparando el seguimiento.": "Nous préparons le suivi.",
      "Un momento...": "Un instant...",
      "Te llevamos al estado actual de tu pedido.": "Nous vous conduisons à l'état actuel de votre commande.",
      "Idioma": "Langue",
      "Español": "Espagnol",
      "English": "Anglais",
      "Français": "Français",
      "Lista de países para contacto": "Liste des pays pour le contact",
      "Lista de países para móvil del restaurante": "Liste des pays pour le mobile du restaurant",
      "Lista de países para móvil admin": "Liste des pays pour le mobile admin",
      "Abrir menú de cuenta": "Ouvrir le menu du compte",
      "Abrir bandeja de mensajes": "Ouvrir la boîte de messages",
      "Para que TurnoListo pueda avisarte mejor, abre este pedido en Safari, anadelo a pantalla de inicio y activalo desde ese icono.": "Pour que TurnoListo puisse mieux vous avertir, ouvrez cette commande dans Safari, ajoutez-la à l'écran d'accueil et activez-la depuis cette icône.",
      "3. Toca Compartir.": "3. Touchez Partager.",
      "4. Elige \"Anadir a pantalla de inicio\".": "4. Choisissez \"Ajouter à l'écran d'accueil\".",
      "5. Abre TurnoListo desde el nuevo icono y toca \"Activar avisos\".": "5. Ouvrez TurnoListo depuis la nouvelle icône et touchez \"Activer les alertes\".",
      "Tecnología que Agiliza tu Restaurante": "La technologie qui fluidifie votre restaurant",
      "Cerrar sesión": "Se déconnecter",
      "Acceso verificado": "Accès vérifié",
      "Credenciales incorrectas o la cuenta no tiene un perfil admin en users/{uid}.": "Identifiants incorrects ou le compte n'a pas de profil admin dans users/{uid}.",
      "No se pudo iniciar sesion. Verifica que la cuenta del restaurante exista en Firebase Authentication y que la clave coincida.": "La connexion a échoué. Vérifiez que le compte du restaurant existe dans Firebase Authentication et que le mot de passe correspond.",
      "No se pudo iniciar sesion. Revisa credenciales, dominio autorizado y el perfil users/{uid}.": "La connexion a échoué. Vérifiez les identifiants, le domaine autorisé et le profil users/{uid}.",
      "No se pudo iniciar sesion como administrador. Verifica credenciales, dominio autorizado y el perfil users/{uid}.": "La connexion administrateur a échoué. Vérifiez les identifiants, le domaine autorisé et le profil users/{uid}.",
      "Cerrar alerta": "Fermer l'alerte",
      "Todo correcto": "Tout est bon",
      "Revisa esto": "Vérifiez ceci",
      "Algo ha fallado": "Quelque chose a échoué",
      "Ha ocurrido un error inesperado.": "Une erreur inattendue s'est produite.",
      "Pedido no disponible": "Commande indisponible",
      "Este seguimiento ya no está activo o fue archivado.": "Ce suivi n'est plus actif ou a été archivé.",
      "Este QR ya no está disponible.": "Ce QR n'est plus disponible.",
      "QR no disponible": "QR indisponible",
      "Tienes las notificaciones activadas. Toca una vez la pantalla para activar el sonido.": "Les notifications sont activées. Touchez l'écran une fois pour activer le son.",
      "Activando...": "Activation...",
      "Avisos activados.": "Alertes activées.",
      "Avisos activados": "Alertes activées",
      "Este pedido ya quedó configurado para avisarte.": "Cette commande est déjà configurée pour vous avertir.",
      "Las notificaciones están bloqueadas en este navegador. Actívalas en los permisos del sitio.": "Les notifications sont bloquées dans ce navigateur. Activez-les dans les autorisations du site.",
      "Los avisos no estan disponibles aqui.": "Les alertes ne sont pas disponibles ici.",
      "Usa Safari y pantalla de inicio": "Utilisez Safari et l'écran d'accueil",
      "Avisos no disponibles aqui": "Alertes indisponibles ici",
      "Recibiras sonido si tienes la pagina abierta, y notificacion si el movil esta bloqueado.": "Vous recevrez un son si vous gardez la page ouverte, et une notification si le téléphone est verrouillé.",
      "Recibiras sonido si tienes la app abierta, y notificacion si el movil esta bloqueado.": "Vous recevrez un son si vous gardez l'application ouverte, et une notification si le téléphone est verrouillé.",
      "Recibiras sonido y vibracion si tienes la pagina abierta, y notificacion si el movil esta bloqueado.": "Vous recevrez un son et une vibration si vous gardez la page ouverte, et une notification si le téléphone est verrouillé.",
      "Recibiras sonido y vibracion si tienes la app abierta, y notificacion si el movil esta bloqueado.": "Vous recevrez un son et une vibration si vous gardez l'application ouverte, et une notification si le téléphone est verrouillé.",
      "Si quieres que TurnoListo te avise mientras usas otras apps, primero abre este pedido en Safari.": "Si vous voulez que TurnoListo vous avertisse pendant que vous utilisez d'autres applications, ouvrez d'abord cette commande dans Safari.",
      "Si quieres que TurnoListo te avise mientras usas otras apps, anade este pedido a pantalla de inicio y abrelo desde ese icono.": "Si vous voulez que TurnoListo vous avertisse pendant que vous utilisez d'autres applications, ajoutez cette commande à l'écran d'accueil et ouvrez-la depuis cette icône.",
      "Abrir paso a paso en iPhone": "Ouvrir le guide iPhone",
      "Como anadirlo a pantalla de inicio": "Comment l'ajouter à l'écran d'accueil",
      "Ocultar pasos": "Masquer les étapes",
      "1. Copia el enlace de este pedido.": "1. Copiez le lien de cette commande.",
      "2. Abre Safari y pega el enlace.": "2. Ouvrez Safari et collez le lien.",
      "1. Toca Compartir.": "1. Touchez Partager.",
      "2. Elige \"Anadir a pantalla de inicio\".": "2. Choisissez \"Ajouter à l'écran d'accueil\".",
      "3. Abre TurnoListo desde el nuevo icono y toca \"Activar avisos\".": "3. Ouvrez TurnoListo depuis la nouvelle icône et touchez \"Activer les alertes\".",
      "Enlace copiado. Ahora puedes pegarlo en Safari.": "Lien copié. Vous pouvez maintenant le coller dans Safari.",
      "No se pudo copiar automaticamente. Copia la URL desde la barra del navegador.": "La copie automatique a échoué. Copiez l'URL depuis la barre du navigateur.",
      "Panel restaurante": "Tableau restaurant",
      "Demo restaurante": "Démo restaurant",
      "No hay pedidos activos que coincidan con esos filtros.": "Aucune commande active ne correspond à ces filtres.",
      "No hay pedidos archivados que coincidan con esos filtros.": "Aucune commande archivée ne correspond à ces filtres.",
      "Aqui apareceran los pedidos entregados o cancelados.": "Les commandes livrées ou annulées apparaîtront ici.",
      "Demo en uso": "Démo en cours",
      "La demo ya demostro el valor": "La démo a déjà prouvé sa valeur",
      "Activa el plan completo": "Activer le plan complet",
      "Listo para recibir más pedidos": "Prêt à recevoir plus de commandes",
      "Operacion estable": "Opération stable",
      "Listo para escalar": "Prêt à évoluer",
      "No encontramos ningún país con esa búsqueda.": "Aucun pays ne correspond à cette recherche.",
      "Ocultar contraseña": "Masquer le mot de passe",
      "Ver comentario": "Voir le commentaire",
      "Abrir vista cliente": "Ouvrir la vue client",
      "Editar información": "Modifier les informations",
      "Guardar cambios": "Enregistrer les modifications",
      "No se pudo cargar el equipo administrador por ahora.": "Impossible de charger l'équipe admin pour le moment.",
      "Aquí verás el equipo administrador con acceso activo.": "L'équipe admin avec accès actif apparaîtra ici.",
      "No hay mensajes que coincidan con esos filtros.": "Aucun message ne correspond à ces filtres.",
      "Sin empresa": "Sans entreprise",
      "Sin correo": "Sans e-mail",
      "Sin teléfono": "Sans téléphone",
      "Leído": "Lu",
      "Sin leer": "Non lu",
      "Sin mensaje": "Sans message",
      "Marcar sin leer": "Marquer comme non lu",
      "Marcar leído": "Marquer comme lu",
      "No se pudo actualizar el estado del mensaje.": "Impossible de mettre à jour l'état du message.",
      "No hay cuentas urgentes de renovación ahora mismo": "Il n'y a actuellement aucun compte urgent à renouveler",
      "No hay onboarding bloqueado en este momento": "Aucun onboarding n'est bloqué pour le moment",
      "No hay señales de riesgo relevantes ahora": "Il n'y a pas de signaux de risque pertinents pour le moment",
      "Aún no hay base sana suficiente para empujar upsell": "La base saine n'est pas encore suffisante pour pousser l'upsell",
      "Todavía no hay pedidos suficientes para construir un dataset de entrenamiento.": "Il n'y a pas encore assez de commandes pour construire un jeu de données d'entraînement.",
      "Dataset IA exportado en formato JSON.": "Jeu de données IA exporté au format JSON.",
      "No hay restaurantes que coincidan con esos filtros.": "Aucun restaurant ne correspond à ces filtres.",
      "Contexto": "Contexte",
      "Siguiente paso": "Étape suivante",
      "Logo del restaurante": "Logo du restaurant",
      "Sube un logo cuadrado o rectangular. Lo optimizaremos para restaurante y cliente.": "Téléchargez un logo carré ou rectangulaire. Nous l'optimiserons pour les vues restaurant et client.",
      "Acceso:": "Accès :",
      "Gestionado con enlace seguro": "Géré par lien sécurisé",
      "Acción prioritaria": "Action prioritaire",
      "Activar plan comercial": "Activer le plan commercial",
      "Abrir acceso restaurante": "Ouvrir l'accès restaurant",
      "Plantillas": "Modèles",
      "Activar plan": "Activer le plan",
      "Renovar plan": "Renouveler le plan",
      "Eliminar": "Supprimer",
      "No hay enlace seguro disponible para este restaurante.": "Aucun lien sécurisé n'est disponible pour ce restaurant.",
      "No se pudo generar el enlace seguro del restaurante.": "Impossible de générer le lien sécurisé du restaurant.",
      "No disponible": "Non disponible",
      "No se pudo guardar el perfil administrador en esta configuración.": "Impossible d'enregistrer le profil admin dans cette configuration.",
      "Perfil administrador actualizado correctamente.": "Profil administrateur mis à jour avec succès.",
      "No se pudo guardar el perfil administrador.": "Impossible d'enregistrer le profil administrateur.",
      "No se pudo crear el usuario administrador en esta configuración.": "Impossible de créer l'utilisateur administrateur dans cette configuration.",
      "Administrador creado. Se generó un enlace seguro para definir contraseña.": "Administrateur créé. Un lien sécurisé a été généré pour définir le mot de passe.",
      "Administrador creado correctamente.": "Administrateur créé avec succès.",
      "Nuevo administrador creado correctamente.": "Nouvel administrateur créé avec succès.",
      "Ese correo ya existe en Firebase Authentication.": "Cet e-mail existe déjà dans Firebase Authentication.",
      "No se pudo crear el nuevo administrador.": "Impossible de créer le nouvel administrateur.",
      "Controla expansión, renovación y adopción desde un solo panel.": "Pilotez l'expansion, le renouvellement et l'adoption depuis un seul tableau.",
      "Diseñado para operar una cartera de restaurantes con lectura ejecutiva, alertas comerciales y visibilidad clara sobre uso real.": "Conçu pour gérer un portefeuille de restaurants avec une lecture exécutive, des alertes commerciales et une visibilité claire sur l'usage réel.",
      "Visión ejecutiva": "Vision exécutive",
      "Salud de cuentas, actividad y riesgo en la misma pantalla.": "Santé des comptes, activité et risque sur le même écran.",
      "Retención": "Rétention",
      "Detecta renovaciones pendientes y churn antes de perder el local.": "Détectez les renouvellements en attente et le churn avant de perdre l'établissement.",
      "Escala comercial": "Échelle commerciale",
      "Onboarding, upsell y seguimiento pensados para crecer cartera.": "Onboarding, upsell et suivi pensés pour développer le portefeuille.",
      "Activación guiada": "Activation guidée",
      "Renovación segura": "Renouvellement sécurisé",
      "Panel listo para demo": "Tableau prêt pour démo",
      "Entra para gestionar restaurantes, revisar señales de negocio y mover la operación comercial del producto.": "Connectez-vous pour gérer les restaurants, revoir les signaux business et piloter l'opération commerciale du produit.",
    },
  };

  const PATTERN_TRANSLATIONS = {
    en: [
      { regex: /^(\d+)\s+mensajes$/, render: (_, count) => `${count} messages` },
      { regex: /^(\d+)\s+sin leer$/, render: (_, count) => `${count} unread` },
      { regex: /^(\d+)\s+leídos$/, render: (_, count) => `${count} read` },
      { regex: /^(\d+)\s+total hoy$/, render: (_, count) => `${count} total today` },
      { regex: /^(\d+)\s+entregados hoy$/, render: (_, count) => `${count} delivered today` },
      { regex: /^(\d+)\s+cancelados hoy$/, render: (_, count) => `${count} cancelled today` },
      { regex: /^ETA IA\s+(\d+)\s+min$/, render: (_, count) => `AI ETA ${count} min` },
      { regex: /^Muestras\s+(\d+)$/, render: (_, count) => `Samples ${count}` },
      { regex: /^Valoración\s+(\d+)$/, render: (_, count) => `Rating ${count}` },
      { regex: /^Demo activa · (\d+)\/(\d+) pedidos$/, render: (_, used, total) => `Active demo · ${used}/${total} orders` },
      { regex: /^Demo activa · (\d+)\/(\d+) pedidos usados$/, render: (_, used, total) => `Active demo · ${used}/${total} orders used` },
      { regex: /^Demo activa · (\d+) pedidos disponibles$/, render: (_, count) => `Active demo · ${count} orders available` },
      { regex: /^Estado actual:\s+(.+)\s+·\s+Vigente hasta\s+(.+)\.$/, render: (_, plan, date) => `Current status: ${plan} · Active until ${date}.` },
    ],
    fr: [
      { regex: /^(\d+)\s+mensajes$/, render: (_, count) => `${count} messages` },
      { regex: /^(\d+)\s+sin leer$/, render: (_, count) => `${count} non lus` },
      { regex: /^(\d+)\s+leídos$/, render: (_, count) => `${count} lus` },
      { regex: /^(\d+)\s+total hoy$/, render: (_, count) => `${count} total aujourd'hui` },
      { regex: /^(\d+)\s+entregados hoy$/, render: (_, count) => `${count} livrés aujourd'hui` },
      { regex: /^(\d+)\s+cancelados hoy$/, render: (_, count) => `${count} annulés aujourd'hui` },
      { regex: /^ETA IA\s+(\d+)\s+min$/, render: (_, count) => `ETA IA ${count} min` },
      { regex: /^Muestras\s+(\d+)$/, render: (_, count) => `Échantillons ${count}` },
      { regex: /^Valoración\s+(\d+)$/, render: (_, count) => `Évaluation ${count}` },
      { regex: /^Demo activa · (\d+)\/(\d+) pedidos$/, render: (_, used, total) => `Démo active · ${used}/${total} commandes` },
      { regex: /^Demo activa · (\d+)\/(\d+) pedidos usados$/, render: (_, used, total) => `Démo active · ${used}/${total} commandes utilisées` },
      { regex: /^Demo activa · (\d+) pedidos disponibles$/, render: (_, count) => `Démo active · ${count} commandes disponibles` },
      { regex: /^Estado actual:\s+(.+)\s+·\s+Vigente hasta\s+(.+)\.$/, render: (_, plan, date) => `État actuel : ${plan} · Valide jusqu'au ${date}.` },
    ],
  };

  function normalizeLanguage(value) {
    return SUPPORTED_LANGUAGES[value] ? value : DEFAULT_LANGUAGE;
  }

  function getCurrentLanguage() {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE);
  }

  function setCurrentLanguage(language) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
  }

  function translateCoreText(value, language) {
    const safeLanguage = normalizeLanguage(language);
    if (safeLanguage === "es") return value;
    const normalized = String(value || "").replace(/\s+/g, " ").trim();
    if (!normalized) return value;
    const exact = EXACT_TRANSLATIONS[safeLanguage]?.[normalized];
    if (exact) return exact;
    const matchedPattern = (PATTERN_TRANSLATIONS[safeLanguage] || []).find((item) => item.regex.test(normalized));
    if (!matchedPattern) return value;
    return normalized.replace(matchedPattern.regex, (...args) => matchedPattern.render(...args));
  }

  function getTranslationSourceByKey(key) {
    return KEY_TRANSLATION_SOURCES[String(key || "").trim()] || "";
  }

  function translateKey(key, language = getCurrentLanguage(), fallback = "") {
    const source = getTranslationSourceByKey(key);
    if (source) return translateCoreText(source, language);
    return fallback || "";
  }

  function shouldSkipTranslation(target) {
    return target instanceof Element && Boolean(target.closest(SKIP_TRANSLATION_SELECTOR));
  }

  function translateTextNode(node, language) {
    if (!node || !node.parentElement) return;
    if (["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentElement.tagName)) return;
    if (shouldSkipTranslation(node.parentElement)) return;

    const original = textNodeOrigins.has(node) ? textNodeOrigins.get(node) : node.textContent;
    if (!textNodeOrigins.has(node)) textNodeOrigins.set(node, original);

    const raw = String(original || "");
    const trimmed = raw.trim();
    if (!trimmed) return;

    const translated = translateCoreText(trimmed, language);
    const leading = raw.match(/^\s*/)?.[0] || "";
    const trailing = raw.match(/\s*$/)?.[0] || "";
    node.textContent = `${leading}${translated}${trailing}`;
  }

  function getOriginalAttribute(element, attributeName) {
    const originAttribute = `data-i18n-orig-${attributeName}`;
    if (!element.hasAttribute(originAttribute)) {
      const currentValue = element.getAttribute(attributeName);
      if (currentValue !== null) {
        element.setAttribute(originAttribute, currentValue);
      }
    }
    return element.getAttribute(originAttribute);
  }

  function shouldTranslateValueAttribute(element) {
    if (element.tagName === "OPTION") return true;
    if (element.tagName !== "INPUT") return false;
    const type = String(element.type || "").toLowerCase();
    return element.readOnly || element.disabled || ["button", "submit", "reset"].includes(type);
  }

  function translateElementKeys(element, language) {
    if (!(element instanceof Element)) return;

    const textKey = element.getAttribute("data-i18n-key");
    if (textKey) {
      const translated = translateKey(textKey, language, element.textContent);
      if (translated) element.textContent = translated;
    }

    ["placeholder", "title", "aria-label", "value"].forEach((attributeName) => {
      const key = element.getAttribute(`data-i18n-${attributeName}-key`);
      if (!key) return;
      const translated = translateKey(key, language, element.getAttribute(attributeName) || "");
      if (attributeName === "value" && "value" in element) {
        element.value = translated;
      } else {
        element.setAttribute(attributeName, translated);
      }
    });
  }

  function translateElementAttributes(element, language) {
    if (shouldSkipTranslation(element)) return;

    ["placeholder", "title", "aria-label"].forEach((attributeName) => {
      if (!element.hasAttribute(attributeName)) return;
      const original = getOriginalAttribute(element, attributeName);
      if (original === null) return;
      element.setAttribute(attributeName, translateCoreText(original, language));
    });

    if (shouldTranslateValueAttribute(element) && element.hasAttribute("value")) {
      const originalValue = getOriginalAttribute(element, "value");
      if (originalValue !== null) {
        element.value = translateCoreText(originalValue, language);
      }
    }
  }

  function translateDocument(language = getCurrentLanguage()) {
    if (isApplyingTranslations) return;
    isApplyingTranslations = true;
    observer?.disconnect();

    const safeLanguage = normalizeLanguage(language);
    document.documentElement.lang = safeLanguage;

    if (!titleOrigin) titleOrigin = document.title;
    document.title = translateCoreText(titleOrigin, safeLanguage);

    document.querySelectorAll("[data-i18n-key], [data-i18n-placeholder-key], [data-i18n-title-key], [data-i18n-aria-label-key], [data-i18n-value-key]").forEach((element) => {
      translateElementKeys(element, safeLanguage);
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      translateTextNode(walker.currentNode, safeLanguage);
    }

    document.querySelectorAll("*").forEach((element) => {
      translateElementAttributes(element, safeLanguage);
    });

    syncLanguageDock(safeLanguage);
    isApplyingTranslations = false;
    observeDomChanges();
  }

  function injectLanguageDockStyles() {
    if (document.querySelector("#turnolistoLanguageDockStyles")) return;
    const style = document.createElement("style");
    style.id = "turnolistoLanguageDockStyles";
    style.textContent = `
      .language-dock {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.45rem 0.7rem;
        border-radius: 999px;
        background: rgba(255, 252, 248, 0.94);
        border: 1px solid rgba(29, 26, 22, 0.08);
        box-shadow: 0 14px 28px rgba(105, 66, 28, 0.08);
        backdrop-filter: blur(10px);
      }
      .language-dock__flag {
        font-size: 0.95rem;
        line-height: 1;
      }
      .language-dock__select {
        border: 0;
        background: transparent;
        color: #5f5347;
        font: inherit;
        font-size: 0.9rem;
        font-weight: 700;
        padding-right: 0.2rem;
        outline: none;
        cursor: pointer;
      }
      .language-dock__select:focus {
        box-shadow: none;
      }
      @media (max-width: 640px) {
        .language-dock {
          right: 10px;
          bottom: 10px;
          padding: 0.38rem 0.62rem;
        }
        .language-dock__select {
          font-size: 0.82rem;
        }
      }
    `;
    document.head.append(style);
  }

  function injectLanguageDock() {
    if (document.querySelector("#turnolistoLanguageDock")) return;

    injectLanguageDockStyles();

    const dock = document.createElement("div");
    dock.className = "language-dock";
    dock.id = "turnolistoLanguageDock";

    const flag = document.createElement("span");
    flag.className = "language-dock__flag";
    flag.id = "turnolistoLanguageDockFlag";
    flag.setAttribute("aria-hidden", "true");

    const select = document.createElement("select");
    select.className = "language-dock__select";
    select.id = "turnolistoLanguageDockSelect";
    select.setAttribute("aria-label", "Idioma");

    Object.entries(SUPPORTED_LANGUAGES).forEach(([language, config]) => {
      const option = document.createElement("option");
      option.value = language;
      option.textContent = config.label;
      select.append(option);
    });

    select.addEventListener("change", (event) => {
      const nextLanguage = normalizeLanguage(event.target.value);
      setCurrentLanguage(nextLanguage);
      translateDocument(nextLanguage);
    });

    dock.append(flag, select);
    document.body.append(dock);
  }

  function syncLanguageDock(language) {
    const safeLanguage = normalizeLanguage(language);
    const flag = document.querySelector("#turnolistoLanguageDockFlag");
    const select = document.querySelector("#turnolistoLanguageDockSelect");
    if (flag) flag.textContent = SUPPORTED_LANGUAGES[safeLanguage].flag;
    if (select) select.value = safeLanguage;
  }

  function observeDomChanges() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (isApplyingTranslations) return;
      window.requestAnimationFrame(() => translateDocument(getCurrentLanguage()));
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "value"],
    });
  }

  function initializeI18n() {
    injectLanguageDock();
    translateDocument(getCurrentLanguage());
    observeDomChanges();
  }

  window.TurnoListoI18n = {
    getLanguage: getCurrentLanguage,
    setLanguage: setCurrentLanguage,
    translateKey,
    translateText(value, language = getCurrentLanguage()) {
      return translateCoreText(value, language);
    },
    translateDocument,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeI18n, { once: true });
  } else {
    initializeI18n();
  }
})();
