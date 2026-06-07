# CLAUDE.md — Gobernanza del proyecto FEGHADAL

> **Fuente única de verdad** para decisiones de arquitectura, SEO, accesibilidad y
> contenido. Nada debe quedar implícito. Mantener este archivo actualizado en cada cambio.

---

## 1. Qué es este proyecto

Sitio web **corporativo e informativo** de **FEGHADAL**, empresa peruana de
**servicios generales** (mantenimiento, limpieza, instalaciones, saneamiento) que
atiende al **sector privado** y se prepara para **licitar con el Estado peruano**.

- **Objetivos primarios:** (1) máximo posicionamiento **SEO orgánico**; (2) **credibilidad**
  para procesos de licitación pública (RNP, certificaciones, SST).
- **Alcance técnico:** 100 % estático/informativo. **SIN** sistema, login, backend,
  base de datos ni formularios con persistencia.
- **Mercado y voz:** español del Perú, vocabulario de contrataciones públicas y B2B
  ("mantenimiento preventivo y correctivo", "limpieza integral", "saneamiento ambiental",
  "RNP", "OSCE", "SEACE", "SST").

---

## 2. Stack y decisiones (no negociables)

| Decisión | Elección | Motivo |
|---|---|---|
| Framework | **Astro 6** (última estable) | HTML estático, cero JS por defecto, ideal para SEO. |
| Lenguaje | **TypeScript estricto** (`astro/tsconfigs/strict`) | Seguridad de tipos en contenido y componentes. |
| JS en cliente | **Cero por defecto** | Islas (`client:*`) solo si es imprescindible; documentar el porqué aquí. |
| Contenido | **Content Collections** (Content Layer API + Zod) | Única fuente de contenido. **Nada hardcodeado** en componentes. |
| Estilos | **Tailwind CSS v4** vía `@tailwindcss/vite` | Sin runtime JS; design tokens centralizados en CSS (`@theme`). |
| Sitemap | **@astrojs/sitemap** | `sitemap-index.xml` automático. |
| Imágenes | **`astro:assets`** (`<Image>`, sharp) | Optimización, formatos modernos, sin CLS. |
| Hosting | **Vercel** (output estático) | Deploy automático por push a `main`. |

### Política de dependencias
Toda dependencia nueva debe justificarse en esta tabla antes de instalarse. Dependencias
actuales y su razón:
- `astro` — framework.
- `tailwindcss`, `@tailwindcss/vite` — estilos sin runtime.
- `@astrojs/sitemap` — sitemap requerido para SEO.
- `sharp` — incluido por Astro para optimización de imágenes.

Si una funcionalidad se puede resolver con HTML/CSS/Astro nativo, **no** se agrega paquete.

### Islas de JavaScript (excepciones a "cero JS")
Existen **tres** islas de JS, mínimas, justificadas y documentadas:
- **`CotizacionForm.astro`** — mejora progresiva del formulario de contacto. Sin JS
  funciona por POST nativo a Web3Forms (con `redirect` a `/gracias`); con JS envía por
  `fetch` y muestra el estado con `aria-live` sin recargar. Es un script pequeño que
  Astro incrusta en línea (no genera bundle aparte).
- **Reveal on-scroll (`BaseLayout.astro`)** — `IntersectionObserver` mínimo que revela
  secciones (clase `.reveal`) al entrar al viewport. Doble salvaguarda para no ocultar
  contenido nunca de forma indebida: (1) solo actúa si hay JS (clase `.js` añadida en
  `<head>` antes del paint → sin flash) y (2) solo bajo `prefers-reduced-motion:
  no-preference`. Sin JS o con movimiento reducido, todo es visible desde el inicio.
  Animación corta (<400ms), solo `opacity`/`transform` (no degrada CWV). El contenido
  siempre está en el DOM (los crawlers lo ven).
- **Carrito de pedido (`Carrito.astro`)** — catálogo de la tienda con "agregar al
  pedido", drawer accesible (role=dialog, Escape, foco) y estado en `localStorage`
  (persiste entre páginas). "Realizar pedido" arma un mensaje de WhatsApp con ítems,
  cantidades, precios y total y abre `wa.me`. Sin backend. Si un producto no tiene
  precio, el carrito funciona como **solicitud de cotización** (sin total monetario);
  al cargar precios reales calcula totales automáticamente.

### Servicios externos y variables de entorno
- **Web3Forms** (envío de formularios sin servidor) — access key en `PUBLIC_WEB3FORMS_KEY`.
- **WhatsApp** (canal de cotización, `wa.me`) — número en `PUBLIC_WHATSAPP_NUMERO`.
- **Redes sociales** (opcionales) — `PUBLIC_FACEBOOK_URL`, `PUBLIC_INSTAGRAM_URL`. Si no
  hay valor, el icono no se muestra y la red no entra en `sameAs` (regla de honestidad).
- **Perfil de Empresa de Google** (opcional) — `PUBLIC_GOOGLE_BUSINESS_URL`; si está,
  el mapa de /contacto enlaza a la ficha.
- Variables con prefijo `PUBLIC_` (se incrustan en el build estático). Ver `.env.example`.
  En Vercel: Project Settings → Environment Variables.
- **Datos de contacto (reales):** teléfono/WhatsApp **+51 932 262 669** (display
  "932 262 669"), correo **contacto@feghadal.com**. Centralizados en `src/config/site.ts`
  (`telefono` en formato internacional para `tel:`/JSON-LD; `telefonoDisplay` para mostrar).
  NUNCA hardcodear estos valores en componentes ni contenido.

---

## 3. Arquitectura de carpetas

```
feghadal/
├── CLAUDE.md                  # este archivo (gobernanza)
├── astro.config.mjs           # site URL, sitemap, plugin Tailwind
├── src/
│   ├── config/
│   │   ├── site.ts            # NAP, datos de empresa, navegación, redes (constantes tipadas)
│   │   ├── home.ts            # copy de marketing de la home (pasos/pilares/ventajas, tipado)
│   │   └── autores.ts         # ficha de autores del blog (E-E-A-T)
│   ├── data/
│   │   └── catalogo.json      # catálogo de la tienda (SKUs); generado del catálogo del cliente
│   ├── lib/
│   │   └── catalogo.ts        # tipos y helpers del catálogo (categorías, precio)
│   ├── content.config.ts      # schemas Zod de las 6 collections (Content Layer API)
│   ├── content/
│   │   ├── servicios/         # *.md  (silo SERVICIOS)
│   │   ├── sectores/          # *.md  (silo SECTORES)
│   │   ├── productos/         # *.md  (silo PRODUCTOS — materiales/ferretería)
│   │   ├── cruces/            # *.md  (cruces servicio×sector, contenido único)
│   │   ├── proyectos/         # *.md  (silo AUTORIDAD)
│   │   ├── blog/              # *.md  (silo AUTORIDAD)
│   │   ├── faq/               # *.md  (preguntas frecuentes → FAQPage)
│   │   └── galeria/           # *.md  (trabajos ejecutados; vacía hasta tener fotos reales)
│   ├── lib/
│   │   ├── seo.ts             # generadores de JSON-LD desde frontmatter
│   │   └── icon-names.ts      # tipo IconName (catálogo de iconos)
│   ├── components/
│   │   ├── SEO.astro          # meta tags, OG, canonical, JSON-LD
│   │   ├── Breadcrumbs.astro  # migas visibles + BreadcrumbList JSON-LD
│   │   ├── Header.astro       # navegación de los silos (wordmark) + redes (móvil)
│   │   ├── Footer.astro       # NAP + enlazado por silo + redes sociales
│   │   ├── Icon.astro         # iconos SVG inline por nombre (sin JS, sin deps)
│   │   ├── RedesSociales.astro        # redes por env; se ocultan si no hay URL
│   │   ├── Credenciales.astro         # bloque "credenciales y cumplimiento" (home + nosotros)
│   │   ├── FAQ.astro                   # acordeón <details> accesible (datos de collection faq)
│   │   ├── GaleriaTrabajos.astro       # galería con estado vacío honesto (collection galeria)
│   │   ├── MapaContacto.astro          # mapa Google embebido, carga diferida (LCP)
│   │   ├── SolucionLlaveEnMano.astro  # bloque reutilizable servicio + materiales
│   │   ├── CTACotizacion.astro        # CTA reutilizable → /contacto + WhatsApp
│   │   ├── CotizacionForm.astro       # formulario Web3Forms (isla JS, a11y)
│   │   └── WhatsAppButton.astro       # botón flotante wa.me (global)
│   ├── layouts/
│   │   └── BaseLayout.astro   # <html>, <head> (SEO + Organization/LocalBusiness), header, footer
│   ├── pages/
│   │   ├── index.astro                       # Home
│   │   ├── servicios/index.astro             # índice del silo
│   │   ├── servicios/[slug].astro            # pillar page por servicio
│   │   ├── servicios/[servicio]/[sector].astro  # cruces servicio×sector
│   │   ├── sectores/index.astro
│   │   ├── sectores/[slug].astro
│   │   ├── productos/index.astro
│   │   ├── productos/[slug].astro
│   │   ├── proyectos/index.astro
│   │   ├── proyectos/[slug].astro
│   │   ├── blog/index.astro
│   │   ├── blog/[slug].astro
│   │   ├── blog/categoria/[categoria].astro  # filtro por categoría (estático)
│   │   ├── nosotros.astro
│   │   ├── contacto.astro
│   │   └── gracias.astro                      # confirmación del form (noindex)
│   └── styles/
│       └── global.css         # @import tailwind + @theme (design tokens)
└── public/
    └── robots.txt
```

---

## 4. Arquitectura de información (silos SEO)

El sitio se organiza en **cuatro silos** con enlazado interno coherente:

1. **SERVICIOS** (*qué hacemos*) — pillar pages: mantenimiento de inmuebles, limpieza
   empresarial, instalaciones, acabados y obras menores, áreas verdes, saneamiento ambiental.
2. **SECTORES** (*para quién*) — oficinas/retail, salud, educación, sector público.
3. **PRODUCTOS** (*qué vendemos*, CIIU 4663/4752) — materiales de construcción, ferretería,
   pinturas, fontanería/gasfitería, vidrios. Se enlazan con los servicios que los usan
   ("solución llave en mano").
4. **AUTORIDAD** (*confianza*) — proyectos/portafolio, nosotros (RNP, certificaciones, SST),
   recursos/blog.

**Cruces servicio×sector** (long-tail): `/servicios/[servicio]/[sector]`
(ej. `/servicios/limpieza-empresarial/salud`). Se modelan como la collection `cruces`:
cada cruce es un archivo con **contenido único y genuino** (alcance específico,
consideraciones y normativa propias). El `getStaticPaths` genera **solo** los cruces que
existen como archivo → nunca páginas plantilla (anti doorway pages).

**Enlazado cruzado servicios↔productos**: cada servicio declara `productosRelacionados`
y el componente `SolucionLlaveEnMano` muestra el bloque "servicio + materiales". Las
páginas de producto enlazan de vuelta a los servicios que los usan (enlace inverso
calculado).

### Convención de URLs (limpias y jerárquicas)
- `/servicios/[slug]`
- `/servicios/[servicio]/[sector]`  (cruces)
- `/sectores/[slug]`
- `/productos/[slug]`
- `/proyectos/[slug]`
- `/blog/[slug]` · `/blog/categoria/[categoria]`
- `/nosotros` · `/contacto` · `/gracias` (noindex)

Slugs en **kebab-case**, sin acentos, derivados de la keyword primaria.

### Capa de conversión (CLAUDE.md §conversión)
- **`/contacto`** con formulario Web3Forms (select alimentado por las collections).
- **CTA "Solicita tu cotización"** consistente (componente `CTACotizacion`) en servicios,
  productos, cruces y sectores → `/contacto` + WhatsApp.
- **Botón flotante de WhatsApp** global (en `BaseLayout`).
- **Honestidad (§8):** Proyectos no inventa casos; entradas `esPlantilla` rotuladas y
  `noindex`; el índice muestra estado real ("casos en desarrollo") y forma de trabajo.

---

## 5. Convenciones de SEO

### Reglas
- **Un solo `<h1>`** por página, alineado a la **keyword primaria**.
- **`title`** ≤ 60 caracteres; **meta description** (`descripcionSEO`) 120–160 caracteres.
- **Canonical** siempre presente y absoluta.
- **URLs** según §4; nunca cambiar un slug publicado sin redirección.
- **Enlazado interno** por silo: cada pillar enlaza a sus sectores relacionados y viceversa.
- Imágenes con `alt` descriptivo (campo obligatorio en schema).

### Componente `<SEO>` (en `src/components/SEO.astro`)
Recibe `{ title, description, type, image?, canonical?, jsonLd? }` y genera:
meta básicos, **Open Graph**, **Twitter Card**, **canonical** y bloques **JSON-LD**.

### JSON-LD (generado desde frontmatter, nunca a mano en la página)
- **Organization / LocalBusiness** → en el layout global (todas las páginas). Datos en `src/config/site.ts`.
- **Service** → en cada pillar de servicio, desde la collection `servicios`.
- **BreadcrumbList** → en todas las páginas internas, desde el componente `Breadcrumbs`.
- Helpers en `src/lib/seo.ts`. Las páginas pasan el frontmatter, no construyen el JSON a mano.

### robots.txt y sitemap
- `public/robots.txt` apunta al sitemap.
- `@astrojs/sitemap` genera `/sitemap-index.xml`. `draft: true` en blog excluye del build.

### Core Web Vitals (objetivo: verde)
- **LCP**: imágenes optimizadas con `<Image>`, `loading="eager"` solo para el hero. El
  hero usa fondo de gradiente (placeholder), no imagen pesada. El mapa de /contacto usa
  `loading="lazy"` para no competir por el LCP.
- **CLS**: width/height explícitos en imágenes; reservar espacio (aspect-ratio en mapa y
  galería). El reveal on-scroll usa solo `opacity`/`transform` (sin reflow).
- **INP**: JS mínimo (dos islas pequeñas) → INP intrínsecamente bajo.

---

## 6. Estándares de accesibilidad (WCAG 2.1 AA — obligatorio)

- **HTML semántico**: `header`, `nav`, `main`, `section`, `article`, `footer`.
- **Jerarquía de headings** correcta y sin saltos (h1 → h2 → h3).
- **Roles ARIA** solo donde el HTML nativo no basta (ej. `aria-current="page"` en nav).
- **Navegación por teclado** completa; orden de tabulación lógico; **skip link** al `main`.
- **Foco visible** siempre (nunca `outline: none` sin reemplazo equivalente).
- **Contraste** mínimo 4.5:1 (texto normal) / 3:1 (texto grande), validado contra los tokens (§7).
- **Alt text** en todas las imágenes (campo obligatorio en el schema; vacío `alt=""` solo si es decorativa).
- **Idioma** declarado: `<html lang="es-PE">`.
- Áreas táctiles ≥ 44×44 px.

---

## 7. Design tokens — PALETA CORPORATIVA OFICIAL

Centralizados en `src/styles/global.css` mediante `@theme` de Tailwind v4 (este proyecto
**no** usa `tailwind.config.js`; en v4 el theme vive en CSS). **No usar valores mágicos**
en componentes; consumir siempre los tokens. Paleta derivada del logo:

| Rol | Token | Hex |
|---|---|---|
| **Marca / navy primario** | `brand-700` | `#152C50` |
| **Navy profundo (texto/oscuro)** | `brand-800` / `ink` | `#0F1B2D` |
| **Acento / acción** | `accent-600` | `#1036D9` |
| **Acento hover** | `accent-700` | `#0C2BAE` |
| **Acento soft (realces)** | `accent-50` | `#E8EDFD` |
| **Fondo base** | `surface` | `#FFFFFF` |
| **Superficie alterna** | `surface-alt` | `#F4F6FA` |
| **Borde** | `line` | `#CBD3E1` |
| **Texto tenue** | `muted` | `#51607A` |
| **Éxito / aviso / error / info** | `success`/`warning`/`error`/`info` | `#15803D` / `#B45309` / `#B91C1C` / `#1036D9` |

`brand-*` (navy) y `accent-*` (azul) son escalas completas 50–900 para estados/hover.
El token `danger` es alias de `error`. `whatsapp`/`whatsapp-700` (#25D366) es el color del
**canal** WhatsApp, exclusivo del botón flotante (excepción de marca, documentada).

### Reglas de uso del color (OBLIGATORIAS)
- **Azul acento = solo ACCIÓN**: botones, enlaces, foco visible, iconos/detalles. **Nunca**
  como fondo de secciones grandes (para fondos oscuros grandes se usa navy).
- **Navy**: header/footer, títulos (`text-brand-700`), fondos oscuros grandes (hero, CTA).
- **Cuerpo de texto**: `text-ink` (#0F1B2D) sobre blanco; texto secundario `text-muted`.
- **Foco visible** (`:focus-visible`): anillo de 3px en `accent-600`, offset 2px.
- **Contraste**: todas las combinaciones cumplen WCAG 2.1 AA (la mayoría AAA). No degradar
  con opacidades que bajen el contraste de los textos.

### Estilo visual y movimiento (referencia: estética moderna y elegante)
- **Radios**: tarjetas `rounded-xl`/`rounded-2xl`; sombras suaves tintadas con navy
  (`shadow-card`, `shadow-card-lg`).
- **Easing de marca**: `--ease-smooth` = `cubic-bezier(0.25,0.46,0.45,0.94)`.
- **Reveal on-scroll** (`.reveal` → fade-up de 30px en 0.7s) con cascada opcional en grids
  (`.stagger`). Microinteracciones de ~0.18s en enlaces/botones; `.hover-lift` (elevación +
  sombra) en tarjetas. Todo bajo `prefers-reduced-motion: no-preference` (ver §2/§8).
- **Tipografía**: system font stack (cero descargas → mejor LCP/CLS).

---

## 8. Reglas de contenido

- **Todo** el contenido editorial vive en `src/content/**` (Markdown/MDX tipado). **Nada**
  hardcodeado en componentes ni páginas.
- **Excepción acotada (copy de marketing con iconos):** los bloques de la home
  *Cómo trabajamos* (pasos), *Por qué FEGHADAL* (pilares) y *Ventajas de tercerizar*
  (ventajas) viven en `src/config/home.ts`, tipados y en una sola fuente. Motivo: son
  módulos de UI acoplados a iconos (`Icon.astro`) y a un layout fijo, no contenido que el
  cliente edite con frecuencia. El criterio: **contenido editorial → collection; copy de
  UI/marketing con iconos → `src/config`** (igual que NAP y navegación en `site.ts`).
- Cada entrada debe traer su `descripcionSEO` y `keywordPrimaria` (donde aplique).
- Tono: profesional, orientado a B2B y contrataciones públicas; afirmaciones verificables
  (no inventar certificaciones ni clientes reales sin confirmación del cliente).
- Imágenes con `alt` significativo siempre.
- `orden` controla la posición en listados; menor = primero.

### Schemas (resumen — definición en `src/content.config.ts`)
- **servicios**: `titulo, keywordPrimaria, descripcionSEO, resumen, alcance[], beneficios[], sectoresRelacionados[], productosRelacionados[], imagen, orden`.
- **sectores**: `titulo, keywordPrimaria, descripcionSEO, resumen, retos[], serviciosRelacionados[], imagen, orden`.
- **productos**: `titulo, keywordPrimaria, descripcionSEO, resumen, categorias[], imagen, orden`.
- **cruces**: `servicio (ref), sector (ref), titulo, keywordPrimaria, descripcionSEO, resumen, alcanceEspecifico[], consideraciones[], normativa[], productosRelacionados[], orden` + cuerpo único.
- **proyectos**: `titulo, cliente, sector, servicios[], alcance, anio, resultado, imagenes[], descripcionSEO, esPlantilla`.
- **blog**: `titulo, descripcionSEO, keywordPrimaria?, fecha, actualizado?, categoria, autor (default "Daniel Quintana Toledo"), pillar?, pillarTitulo?, imagen?, draft`.
- **faq**: `pregunta, respuesta (texto plano), orden`. Alimenta la sección FAQ y el `FAQPage`.
- **galeria**: `titulo, descripcion?, servicio?, imagen{src,alt}, orden`. Vacía hasta tener
  fotos REALES; el componente muestra estado vacío honesto (nunca stock como propio).

### Blog y E-E-A-T (autoría y fórmula obligatoria)
El blog es el motor de **E-E-A-T** (experiencia, pericia, autoridad, confianza).

- **Autor único:** todos los artículos los firma **Daniel Quintana Toledo**, *Especialista
  en servicios generales – FEGHADAL*. Su ficha vive en `src/config/autores.ts` (fuente
  única); el campo `autor` de la collection la referencia por nombre. Foto y LinkedIn son
  slots **[COMPLETAR]** (mientras no haya foto real se usa un **avatar de iniciales**, nunca
  stock). La bio está marcada **[REVISAR con datos reales de Daniel]**.
- **Componente `AutorBio.astro`:** `variant="byline"` (línea al inicio: "Por Daniel
  Quintana Toledo, especialista de FEGHADAL" + fecha/actualización) y `variant="full"`
  (ficha al pie con avatar, cargo, bio y LinkedIn si existe).
- **JSON-LD:** cada artículo emite `Article` con **`author` tipo `Person`** (nombre, cargo,
  `worksFor` la organización y `sameAs` al LinkedIn cuando exista) + `dateModified` e `image`.
- **Fórmula E-E-A-T obligatoria en CADA artículo:** voz en **primera persona** y lenguaje de
  campo; al menos un **detalle concreto del oficio** (herramienta, material, error, cifra);
  una **recomendación honesta** (incluso cuándo NO contratar); **contexto peruano/Lima**
  (humedad, normativa, sanidad); **enlace interno a su pillar** (`pillar`/`pillarTitulo`) y
  **CTA** de cotización; fecha de publicación y de actualización. Imagen propia (FOTO REAL)
  vía campo `imagen` cuando exista — nunca stock como trabajo propio.
- **Honestidad (§8):** no inventar casos, clientes, resultados, años ni certificaciones.
  Donde falte un dato real, dejar **[COMPLETAR]**.

### Tienda (catálogo y pedidos por WhatsApp)
Sección `/tienda` con catálogo navegable por categoría y **pedido por WhatsApp** (sin
backend ni pasarela de pago).
- **Datos:** `src/data/catalogo.json` (SKUs: nombre, categoría, imagen, precio, desc),
  consumido vía `src/lib/catalogo.ts`. Son datos de tienda, no contenido editorial →
  excepción acotada (igual que `config/home.ts`), no collection.
- **Páginas:** `/tienda` (índice + categorías) y `/tienda/[categoria]` (grid estático,
  bueno para SEO). Tarjeta `ProductoCard.astro` con "agregar al pedido".
- **Carrito:** isla `Carrito.astro` (ver §2) → mensaje de WhatsApp con ítems/total.
- **Honestidad de precios (no negociable):** **no inventar precios**. Si la fuente no
  publica precio, el producto muestra "Cotizar" y el carrito opera como solicitud de
  cotización. Los precios reales se cargan en `catalogo.json` (campo `precio`) y la UI
  calcula totales sola. El catálogo inicial se pobló desde el catálogo del cliente
  (rosita.pe, uso autorizado por el dueño); las imágenes se sirven desde su origen.

### JSON-LD por tipo de página
- **servicios** y **cruces** → `Service` (+ `OfferCatalog` del alcance) + `BreadcrumbList`.
- **productos** → `OfferCatalog` (categorías como `Offer`/`Product`) + `BreadcrumbList`.
- **sectores**, **proyectos**, **blog índice** → `BreadcrumbList` (entidad = `LocalBusiness` global).
- **blog [slug]** → `Article` + `BreadcrumbList`.
- **contacto** → `ContactPoint` (anclado a la organización) + `BreadcrumbList`.
- **nosotros** → `BreadcrumbList` (la organización global ya incluye RUC/`taxID`).
- **home** → `FAQPage` (desde la collection `faq`, vía `faqJsonLd`).
- **LocalBusiness global** → `areaServed` enriquecido: ámbito general + distritos de Lima
  Norte (`@type: City`) desde `site.areasServidas`; `sameAs` desde las redes configuradas.

> El `slug` es el nombre del archivo (`id` de la collection); no se duplica en el frontmatter.

---

## 9. Estado de avance

- [x] **Fase 0** — Repo, GitHub, Vercel, deploy automático.
- [x] **Fase 1** — Fundación: CLAUDE.md, Tailwind + tokens, 4 collections + ejemplos,
      layout base + SEO, vertical completa (home + pillar "Limpieza empresarial").
- [x] **Fase 2** — Silos SERVICIOS (6 pillars) y SECTORES (4) completos; índices de silo.
- [x] **Fase 2b** — Cruces servicio×sector (5 páginas con contenido único, collection `cruces`)
      + enlazado interno por silo (servicios↔sectores↔cruces).
- [x] **Fase 2c (ampliación)** — Silo PRODUCTOS (5 pillars, CIIU 4663/4752) + enlazado
      cruzado servicios↔productos ("solución llave en mano") + nav/footer actualizados.
- [x] **Fase 3** — Silo AUTORIDAD (Nosotros con credenciales reales, Proyectos honesto con
      plantilla, Blog con 3 artículos + filtro por categoría) y CAPA DE CONVERSIÓN
      (contacto + formulario Web3Forms, WhatsApp flotante, CTA de cotización consistente).
- [x] **Fase 4 (confianza, conversión y presentación)** — Datos reales centralizados
      (tel/WhatsApp/correo) + redes/GBP por env. Home enriquecida: hero con 2 CTAs y
      mensajes segmentados, "Cómo trabajamos", "Por qué FEGHADAL", "Ventajas de tercerizar",
      bloque "Credenciales y cumplimiento" (reutilizado en /nosotros), FAQ con `FAQPage`
      JSON-LD y formulario de cotización. Galería de trabajos (estructura + estado vacío
      honesto) en /proyectos. /contacto con mapa diferido y `LocalBusiness` reforzado
      (areaServed Lima Norte). /nosotros con sección "Responsable técnico" [COMPLETAR].
      Animaciones reveal on-scroll (2.ª isla JS, reduced-motion + anti-flash). Sistema de
      iconos `Icon.astro`. Redes en header/footer. `npm run build` + `astro check` OK.
- [ ] **Fase 5 (pre-lanzamiento)** — Auditoría performance/Core Web Vitals (Lighthouse),
      validación de structured data, Google Search Console, alta del Perfil de Empresa de
      Google y checklist de despliegue. Completar datos del dueño (ver más abajo).
