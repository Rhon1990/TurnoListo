# TurnoListo Investor Landing Design

**Fecha:** 2026-04-20

## Objetivo

Reemplazar la `index.html` pública actual por una landing comercial premium que posicione a TurnoListo como una plataforma software-first para restaurantes e inversionistas, con el ahorro frente al hardware tradicional como diferencial central.

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

1. Hero principal con promesa de categoría, CTA `Solicitar demo` y CTA secundario `Ver cómo funciona`.
2. Bloque de diferenciación inmediata centrado en la eliminación del hardware dedicado.
3. Comparativa entre el modelo tradicional basado en hardware y el enfoque software-first de TurnoListo.
4. Sección de valor para restaurantes.
5. Sección de valor para inversionistas.
6. Sección `Cómo funciona` en tres pasos.
7. Cierre comercial con repetición del CTA principal.

## Dirección Visual

- Reutilizar la identidad visual existente: `workspace-topbar`, `workspace-brand`, `glass-card`, `launcher`.
- Añadir clases exclusivas de landing para evitar impacto en `admin.html`, `restaurant.html`, `client.html` y `contact.html`.
- Usar una composición editorial, clara y sobria, con jerarquías amplias y contraste contenido.
- Dar protagonismo a una escena visual de producto con menos dependencia del texto:
  - logo de TurnoListo integrado en el hero
  - localizador o mapa de pedidos
  - estados visuales como `Listo` y `Cancelado`
  - un mockup móvil con seguimiento del pedido
  - comparativa gráfica frente al hardware tradicional

## Alcance Técnico

- Sustituir el contenido de [index.html](/Users/rdelgpad/Documents/personal/TurnoListo/index.html).
- Añadir estilos específicos y aislados en [styles.css](/Users/rdelgpad/Documents/personal/TurnoListo/styles.css).
- No introducir JavaScript nuevo en la landing.
- Mantener la navegación principal hacia [contact.html](/Users/rdelgpad/Documents/personal/TurnoListo/contact.html) y anclas internas.
- Reducir densidad textual en hero y bloques de valor, apoyando la narrativa con componentes visuales hechos en HTML/CSS.

## Riesgos y Mitigación

- Riesgo: contaminación visual sobre otras pantallas por clases genéricas.
  Mitigación: prefijos exclusivos para la landing comercial.
- Riesgo: pérdida de claridad en móvil en la sección comparativa.
  Mitigación: diseño responsive que apile columnas en pantallas pequeñas.
- Riesgo: copy exagerado o poco creíble.
  Mitigación: lenguaje concreto, sin métricas inventadas ni promesas vacías.

## Validación QA

- Verificar que `index.html` muestra la nueva narrativa comercial.
- Verificar que existe CTA principal hacia `contact.html`.
- Verificar que existe CTA secundario hacia `#como-funciona`.
- Verificar que la comparativa hardware vs software aparece en desktop y móvil.
- Verificar que desaparecen los CTA operativos anteriores de la portada pública.
- Verificar que las páginas privadas siguen renderizando sin cambios visuales inesperados.
