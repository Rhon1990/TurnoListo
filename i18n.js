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

  function translateTextNode(node, language) {
    if (!node || !node.parentElement) return;
    if (["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentElement.tagName)) return;

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

  function translateElementAttributes(element, language) {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeI18n, { once: true });
  } else {
    initializeI18n();
  }
})();
