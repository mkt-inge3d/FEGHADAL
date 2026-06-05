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
Solo existe **una** isla de JS, justificada y documentada:
- **`CotizacionForm.astro`** — mejora progresiva del formulario de contacto. Sin JS
  funciona por POST nativo a Web3Forms (con `redirect` a `/gracias`); con JS envía por
  `fetch` y muestra el estado con `aria-live` sin recargar. Es un script pequeño que
  Astro incrusta en línea (no genera bundle aparte).

### Servicios externos y variables de entorno
- **Web3Forms** (envío de formularios sin servidor) — access key en `PUBLIC_WEB3FORMS_KEY`.
- **WhatsApp** (canal de cotización, `wa.me`) — número en `PUBLIC_WHATSAPP_NUMERO`.
- Variables con prefijo `PUBLIC_` (se incrustan en el build estático). Ver `.env.example`.
  En Vercel: Project Settings → Environment Variables.

---

## 3. Arquitectura de carpetas

```
feghadal/
├── CLAUDE.md                  # este archivo (gobernanza)
├── astro.config.mjs           # site URL, sitemap, plugin Tailwind
├── src/
│   ├── config/
│   │   └── site.ts            # NAP, datos de empresa, navegación (constantes tipadas)
│   ├── content.config.ts      # schemas Zod de las 6 collections (Content Layer API)
│   ├── content/
│   │   ├── servicios/         # *.md  (silo SERVICIOS)
│   │   ├── sectores/          # *.md  (silo SECTORES)
│   │   ├── productos/         # *.md  (silo PRODUCTOS — materiales/ferretería)
│   │   ├── cruces/            # *.md  (cruces servicio×sector, contenido único)
│   │   ├── proyectos/         # *.md  (silo AUTORIDAD)
│   │   └── blog/              # *.md  (silo AUTORIDAD)
│   ├── lib/
│   │   └── seo.ts             # generadores de JSON-LD desde frontmatter
│   ├── components/
│   │   ├── SEO.astro          # meta tags, OG, canonical, JSON-LD
│   │   ├── Breadcrumbs.astro  # migas visibles + BreadcrumbList JSON-LD
│   │   ├── Header.astro       # navegación de los silos
│   │   ├── Footer.astro       # NAP + enlazado por silo (servicios/sectores/productos)
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
- **LCP**: imágenes optimizadas con `<Image>`, `loading="eager"` solo para el hero.
- **CLS**: width/height explícitos en imágenes; reservar espacio.
- **INP**: cero JS de cliente por defecto → INP intrínsecamente bajo.

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

## 7. Design tokens

Centralizados en `src/styles/global.css` mediante `@theme` de Tailwind v4.
**No usar valores mágicos** en componentes; consumir siempre los tokens.

- **Color de marca** (`--color-brand-*`): azul corporativo (confianza/institucional).
- **Color de acento** (`--color-accent-*`): verde (servicios/saneamiento ambiental).
- **Neutros** (`--color-ink`, `--color-muted`, `--color-surface`): texto y fondos.
- Todos los pares texto/fondo deben cumplir contraste AA (§6).
- **Tipografía**: system font stack (cero descargas → mejor LCP/CLS).
- **Espaciado y radios**: escala de Tailwind; contenedor centrado con ancho máximo legible.

---

## 8. Reglas de contenido

- **Todo** el contenido vive en `src/content/**` (Markdown/MDX tipado). **Nada** hardcodeado
  en componentes ni páginas.
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
- **blog**: `titulo, descripcionSEO, fecha, categoria, autor, draft`.

### JSON-LD por tipo de página
- **servicios** y **cruces** → `Service` (+ `OfferCatalog` del alcance) + `BreadcrumbList`.
- **productos** → `OfferCatalog` (categorías como `Offer`/`Product`) + `BreadcrumbList`.
- **sectores**, **proyectos**, **blog índice** → `BreadcrumbList` (entidad = `LocalBusiness` global).
- **blog [slug]** → `Article` + `BreadcrumbList`.
- **contacto** → `ContactPoint` (anclado a la organización) + `BreadcrumbList`.
- **nosotros** → `BreadcrumbList` (la organización global ya incluye RUC/`taxID`).

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
- [ ] **Fase 4 (pre-lanzamiento)** — Auditoría performance/Core Web Vitals, Google Search
      Console, Perfil de Empresa de Google y checklist de despliegue.
