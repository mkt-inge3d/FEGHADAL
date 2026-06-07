// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL canónica del sitio (dominio definitivo). Necesaria para sitemap, canonicals
// y URLs absolutas en JSON-LD/Open Graph.
const SITE = 'https://feghadal.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Salida 100% estática: máximo rendimiento y SEO, cero servidor.
  output: 'static',
  // El antiguo silo /productos se unificó en la tienda. Redirige cada URL antigua a
  // su categoría equivalente para no perder SEO (301).
  redirects: {
    '/productos': '/tienda',
    '/productos/materiales-construccion': '/tienda/construccion',
    '/productos/ferreteria': '/tienda/ferreteria',
    '/productos/pinturas': '/tienda/pinturas-y-matizados',
    '/productos/fontaneria-gasfiteria': '/tienda/banos-y-gasfiteria',
    '/productos/vidrios': '/tienda',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Excluye páginas noindex del sitemap (confirmación de formulario y
      // proyectos marcados como plantilla). Al añadir una página noindex,
      // agrégala también aquí para mantener la coherencia con Search Console.
      filter: (page) =>
        !page.includes('/gracias') &&
        !page.includes('/productos') &&
        !page.includes('/proyectos/mantenimiento-sede-corporativa'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
