import { defineCollection, reference, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  Content Collections — única fuente de contenido (CLAUDE.md §8).
  Content Layer API (Astro 5+/6): cada collection usa el loader `glob()`.
  El `slug` de cada entrada = nombre del archivo (su `id`); no se repite en frontmatter.

  Imagen tipada: el campo `imagen` usa el helper `image()` para que Astro procese
  el asset con `astro:assets` (optimización + width/height → evita CLS).
  `alt` es obligatorio en cada imagen (WCAG 2.1 AA, §6).

  Silos: servicios, sectores, productos (+ cruces servicio×sector) y autoridad
  (proyectos, blog).
*/

const imagenConAlt = (image: SchemaContext['image']) =>
  z.object({
    src: image(),
    alt: z.string().min(1, 'El alt es obligatorio (accesibilidad).'),
  });

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/servicios' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      keywordPrimaria: z.string(),
      descripcionSEO: z.string().min(120).max(160),
      resumen: z.string(),
      alcance: z.array(z.string()).min(1),
      // Beneficios de negocio del servicio (para la sección "beneficios").
      beneficios: z.array(z.string()).default([]),
      sectoresRelacionados: z.array(reference('sectores')).default([]),
      imagen: imagenConAlt(image),
      orden: z.number().int().default(99),
    }),
});

const sectores = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sectores' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      keywordPrimaria: z.string(),
      descripcionSEO: z.string().min(120).max(160),
      resumen: z.string(),
      retos: z.array(z.string()).min(1),
      serviciosRelacionados: z.array(reference('servicios')).default([]),
      imagen: imagenConAlt(image),
      orden: z.number().int().default(99),
    }),
});

/*
  Cruces servicio×sector (CLAUDE.md §4). Cada entrada es contenido ÚNICO y genuino
  (anti doorway pages, §regla crítica): alcance específico, consideraciones y normativa
  propias de ese servicio en ese sector. Solo existen como página los cruces con
  material real. El routing /servicios/[servicio]/[sector] se genera desde aquí.
*/
const cruces = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cruces' }),
  schema: z.object({
    servicio: reference('servicios'),
    sector: reference('sectores'),
    titulo: z.string(),
    keywordPrimaria: z.string(),
    descripcionSEO: z.string().min(120).max(160),
    resumen: z.string(),
    alcanceEspecifico: z.array(z.string()).min(1),
    consideraciones: z.array(z.string()).min(1),
    normativa: z.array(z.string()).default([]),
    orden: z.number().int().default(99),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      cliente: z.string(),
      sector: reference('sectores'),
      servicios: z.array(reference('servicios')).min(1),
      alcance: z.string(),
      anio: z.number().int(),
      resultado: z.string(),
      imagenes: z.array(imagenConAlt(image)).default([]),
      descripcionSEO: z.string().min(120).max(160),
      // Marca una entrada como PLANTILLA de ejemplo (no es un caso real).
      // Regla de honestidad: empresa nueva, no inventar casos. Ver CLAUDE.md §8.
      esPlantilla: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descripcionSEO: z.string().min(120).max(160),
      keywordPrimaria: z.string().optional(),
      fecha: z.coerce.date(),
      // Fecha de última actualización (E-E-A-T: frescura del contenido).
      actualizado: z.coerce.date().optional(),
      categoria: z.string(),
      // Autoría real (E-E-A-T). Por defecto, el especialista de FEGHADAL.
      autor: z.string().default('Daniel Quintana Toledo'),
      // Enlace interno a la pillar relacionada (silo SEO + CTA contextual).
      pillar: z.string().optional(),
      pillarTitulo: z.string().optional(),
      // Imagen propia del artículo (FOTO REAL). Opcional hasta tenerla; nunca stock.
      imagen: imagenConAlt(image).optional(),
      draft: z.boolean().default(false),
    }),
});

/*
  FAQ — preguntas frecuentes (CLAUDE.md §8: contenido editorial en collection).
  Alimentan la sección de FAQ en home/contacto y el JSON-LD FAQPage (§5).
  `respuesta` es texto plano (válido para acceptedAnswer.text del FAQPage).
*/
const faq = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/faq' }),
  schema: z.object({
    pregunta: z.string(),
    respuesta: z.string(),
    orden: z.number().int().default(99),
  }),
});

/*
  Galería de trabajos ejecutados (CLAUDE.md §8 + regla de honestidad).
  Vacía hasta tener FOTOS REALES. El componente muestra estado vacío honesto
  ("Próximamente nuestros trabajos") si no hay entradas. NUNCA fotos de stock
  haciéndolas pasar por trabajos propios.
*/
const galeria = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/galeria' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descripcion: z.string().optional(),
      servicio: z.string().optional(),
      imagen: imagenConAlt(image),
      orden: z.number().int().default(99),
    }),
});

export const collections = {
  servicios,
  sectores,
  cruces,
  proyectos,
  blog,
  faq,
  galeria,
};
