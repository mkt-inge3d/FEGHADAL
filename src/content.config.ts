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
      // Enlazado cruzado a productos que usa el servicio (solución llave en mano).
      productosRelacionados: z.array(reference('productos')).default([]),
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
  Productos — silo de comercialización de materiales y ferretería (CIIU 4663 y 4752).
  Cada pillar agrupa categorías; no es un catálogo de SKUs individuales.
*/
const productos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/productos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      keywordPrimaria: z.string(),
      descripcionSEO: z.string().min(120).max(160),
      resumen: z.string(),
      categorias: z.array(z.string()).min(1),
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
    productosRelacionados: z.array(reference('productos')).default([]),
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
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    descripcionSEO: z.string().min(120).max(160),
    fecha: z.coerce.date(),
    categoria: z.string(),
    autor: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  servicios,
  sectores,
  productos,
  cruces,
  proyectos,
  blog,
};
