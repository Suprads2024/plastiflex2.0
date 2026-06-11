PLASTIFLEX S.A. — Rediseño web 2026 · v4
Suprads S.R.L.

ESTRUCTURA (14 páginas estáticas, sin dependencias de build)
  index.html              Home (hero original)
  index1.html             Home VARIANTE 1: split 50/50 a pantalla completa
  index2.html             Home VARIANTE 2: foto full-bleed cinematográfica
  index3.html             Home VARIANTE 3: editorial, título a todo el ancho
                          (cada variante lleva su CSS en un <style> en el
                          <head>, comentado, listo para copiar a styles.css;
                          al elegir una, renombrarla a index.html)
  nosotros.html           Empresa, misión/visión/valores (fundada 1967)
  servicios.html          Los 8 servicios Plastiflex
  informacion-util.html   Guía técnica de instalación (8 capítulos + índice con scrollspy)
  contacto.html           Datos + mapa
  productos/              9 landings: sanitarios, encofrados, hidraulicos,
                          cloacales, desague, tendido-electrico, pead,
                          poceros, accesorios
  css/styles.css          Estilos completos (responsive + reduced-motion)
  js/main.js              Motor de animaciones (12 módulos, ver cabecera del archivo)
  js/vendor/              GSAP 3.12.5 + ScrollTrigger + Lenis SELF-HOSTED
                          (no depende de ningún CDN externo)
  assets/img/             Imágenes optimizadas WebP + logos PNG

IDENTIDAD APLICADA
  Azul Plastiflex:   #274C93  (corregido según pedido)
  Navy profundo:     #0A1428 / #122448 (derivados del azul)
  Acento amarillo:   #FFB400  (línea amarilla PEAD para gas)
  Tipografías:       Archivo variable (display expandida) + IBM Plex Mono

ANIMACIONES (js/main.js)
  01 Preloader con isotipo y contador %        07 Parallax en imágenes
  02 Barra de progreso de scroll               08 Contadores animados
  03 Header que se oculta al bajar             09 Botones magnéticos
  04 Menú móvil + dropdown Productos           10 Tilt 3D en cards
  05 Hero animado palabra por palabra          11 Cursor custom (dot + ring)
  06 Reveals con ScrollTrigger (stagger)       12 Scrollspy (nav + guía técnica)
  13 Loops infinitos (marquee + biglines): motor único GSAP que
     clona el contenido hasta cubrir 2 pantallas y desplaza con wrap
     matemático. NUNCA se cortan ni se detienen. El marquee acelera
     y se inclina con el scroll; las biglines derivan lento en
     direcciones alternadas. Desktop y mobile.
  IMPORTANTE: las animaciones corren SIEMPRE, aunque el visitante
     tenga desactivados los efectos de animación en su sistema
     operativo (Windows/macOS/iOS "reducir movimiento"). Decisión
     de producto: es una pieza comercial. Sólo el cursor custom
     respeta esa configuración.
  15 Ambient: Ken Burns en imagen del hero, círculos de diámetro que
     "respiran" en cascada, anillo del CTA girando, brillo en franjas
     PEAD. Visibles también en celular (iOS/Android).
  16 Scroll suave con inercia (Lenis) en desktop; en táctiles se
     mantiene el scroll nativo, que es la mejor práctica móvil.
  · Fallback total: si JS falla o el usuario tiene reduced-motion,
    el contenido se ve completo igual.

NOTAS PARA PUBLICAR
  - Mapa: Google Maps embed sin API key (query genérica del Polo Industrial
    Ezeiza). Reemplazar por el pin exacto si lo quieren.
  - WhatsApp (wa.me/5491146013913) armado desde el fijo: CONFIRMAR el
    número real de WhatsApp Business con el cliente.
  - "Catálogo 2026" apunta al PDF del hosting actual: al migrar, subir el
    PDF al nuevo hosting y actualizar la URL (aparece en header, footer y CTAs).
  - Fuentes vía Google Fonts (requiere conexión); GSAP ya es local.
