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
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Excluye páginas noindex del sitemap (confirmación de formulario y
      // proyectos marcados como plantilla). Al añadir una página noindex,
      // agrégala también aquí para mantener la coherencia con Search Console.
      filter: (page) =>
        !page.includes('/gracias') &&
        !page.includes('/proyectos/mantenimiento-sede-corporativa'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
