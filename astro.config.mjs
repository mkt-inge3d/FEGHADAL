// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL canónica del sitio. Cambiar al dominio definitivo cuando esté disponible.
// Necesaria para sitemap, canonicals y URLs absolutas en JSON-LD/Open Graph.
const SITE = 'https://feghadal.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Salida 100% estática: máximo rendimiento y SEO, cero servidor.
  output: 'static',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
