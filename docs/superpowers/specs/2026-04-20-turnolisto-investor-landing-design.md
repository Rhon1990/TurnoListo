# TurnoListo Investor Landing Design

**Fecha:** 2026-04-20

## Objetivo

Reemplazar la `index.html` pública actual por una landing comercial premium, limpia y editorial, que posicione a TurnoListo como una plataforma software-first para restaurantes e inversionistas, con el ahorro frente al hardware tradicional como diferencial central y con capturas reales del producto como soporte principal.

## Audiencias

- Restaurantes y operadores que buscan una solución más simple para comunicar el estado del pedido.
- Inversionistas y aliados estratégicos que evalúan modelos con menor complejidad física y mejor capacidad de escalado.

## Mensaje Central

TurnoListo elimina la necesidad de hardware dedicado para avisar al cliente del estado del pedido. Ese cambio reduce fricción operativa, acelera la implementación y permite escalar con una lógica de software en lugar de una dependencia física.

## Tono

- Premium y confiable
- Ambicioso, pero creíble
- Enfocado en eficiencia, despliegue y escalabilidad

## Estructura de Contenido

1. Hero principal con promesa de categoría, CTA `Solicitar demo` y composición de capturas reales de `restaurant.html` y `client.html`.
2. Bloque de diferenciación inmediata centrado en la eliminación del hardware dedicado.
3. Sección dedicada al panel restaurante con screenshot real.
4. Sección dedicada a la experiencia cliente con screenshot real.
5. Comparativa entre el modelo tradicional basado en hardware y el enfoque software-first de TurnoListo.
6. Sección `Cómo funciona` en tres pasos.
7. Cierre comercial con repetición del CTA principal.

## Dirección Visual

- Reutilizar la identidad visual existente: `workspace-topbar`, `workspace-brand`, `glass-card`, `launcher`.
- Añadir clases exclusivas de landing para evitar impacto en `admin.html`, `restaurant.html`, `client.html` y `contact.html`.
- Usar una composición editorial, blanca y sobria, inspirada en la claridad visual de Apple, sin copiar su interfaz.
- Reducir la densidad textual y dar protagonismo a material visual real del producto.
- Integrar dos capturas auténticas:
  - `restaurant.html` como vista operativa protagonista
  - `client.html` como vista móvil o vertical de seguimiento
- Aplicar animaciones sutiles y agradables:
  - reveal al entrar en viewport
  - entrada suave de hero
  - superposición elegante de capturas
  - respeto por `prefers-reduced-motion`

## Alcance Técnico

- Sustituir el contenido de [index.html](/Users/rdelgpad/Documents/personal/TurnoListo/index.html).
- Añadir estilos específicos y aislados en [styles.css](/Users/rdelgpad/Documents/personal/TurnoListo/styles.css).
- Añadir una capa mínima de JavaScript solo para animaciones de reveal si aporta valor real.
- Mantener la navegación principal hacia [contact.html](/Users/rdelgpad/Documents/personal/TurnoListo/contact.html) y anclas internas.
- Reducir densidad textual en hero y bloques de valor, apoyando la narrativa con screenshots reales y composición visual.
- Generar assets locales reproducibles para la landing con capturas reales de `restaurant.html` y `client.html`.

## Riesgos y Mitigación

- Riesgo: contaminación visual sobre otras pantallas por clases genéricas.
  Mitigación: prefijos exclusivos para la landing comercial.
- Riesgo: pérdida de claridad en móvil si las capturas y superposiciones quedan demasiado densas.
  Mitigación: diseño responsive con apilado limpio y capturas grandes, no mosaicos pequeños.
- Riesgo: screenshots poco representativas o desactualizadas.
  Mitigación: script reproducible de captura local y referencias explícitas a assets reales.
- Riesgo: motion excesivo o molesto.
  Mitigación: animación mínima, sutil y desactivable con `prefers-reduced-motion`.

## Validación QA

- Verificar que `index.html` muestra la nueva narrativa comercial.
- Verificar que existe CTA principal hacia `contact.html`.
- Verificar que existe CTA secundario hacia `#como-funciona`.
- Verificar que la landing referencia capturas reales de `restaurant.html` y `client.html`.
- Verificar que los assets de screenshots existen localmente y tienen contenido.
- Verificar que la comparativa hardware vs software aparece en desktop y móvil.
- Verificar que desaparecen los CTA operativos anteriores de la portada pública.
- Verificar que las páginas privadas siguen renderizando sin cambios visuales inesperados.
