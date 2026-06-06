/**
 * Generadores de JSON-LD (schema.org) desde datos tipados.
 * Las páginas pasan frontmatter/datos; aquí se construye el structured data.
 * (CLAUDE.md §5.)
 */
import { site } from '../config/site';

/** Convierte una ruta relativa en URL absoluta usando `Astro.site`. */
export function absoluteUrl(path: string, base: URL | string): string {
  return new URL(path, base).toString();
}

/**
 * Organization + LocalBusiness para el layout global.
 * Se emite una sola vez por página, en <head>.
 */
export function organizationJsonLd(siteUrl: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absoluteUrl('/#organization', siteUrl),
    name: site.nombre,
    legalName: site.nombreLegal,
    description: site.descripcion,
    url: absoluteUrl('/', siteUrl),
    telephone: site.telefono,
    email: site.email,
    image: absoluteUrl(site.ogImagen, siteUrl),
    // RUC como identificador fiscal verificable (SEO de confianza/local).
    taxID: site.credenciales.ruc,
    vatID: site.credenciales.ruc,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.direccion.calle,
      addressLocality: site.direccion.distrito,
      addressRegion: site.direccion.region,
      postalCode: site.direccion.codigoPostal,
      addressCountry: site.direccion.pais,
    },
    // areaServed enriquecido: ámbito general + distritos de Lima Norte (SEO local).
    areaServed: [
      site.ambitoServicio,
      ...site.areasServidas.map((nombre) => ({
        '@type': 'City',
        name: nombre,
      })),
    ],
    ...(site.redes.length > 0
      ? { sameAs: site.redes.map((red) => red.url) }
      : {}),
  };
}

/**
 * ContactPoint del negocio para la página de contacto (CLAUDE.md §5).
 * Se ancla al mismo @id de la organización global.
 */
export function contactPointJsonLd(siteUrl: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization', siteUrl),
    name: site.nombre,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'ventas y cotizaciones',
        telephone: site.telefono,
        email: site.email,
        areaServed: 'PE',
        availableLanguage: ['Spanish'],
      },
    ],
  };
}

/**
 * Article para una entrada de blog. Datos desde la collection `blog`.
 */
export function articleJsonLd(
  post: {
    titulo: string;
    descripcionSEO: string;
    fecha: Date;
    autor: string;
  },
  pageUrl: URL | string,
  siteUrl: URL | string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.descripcionSEO,
    datePublished: post.fecha.toISOString(),
    author: { '@type': 'Organization', name: post.autor },
    publisher: { '@id': absoluteUrl('/#organization', siteUrl) },
    mainEntityOfPage: pageUrl.toString(),
    inLanguage: 'es-PE',
  };
}

/**
 * Service para una pillar page de servicio. Datos desde la collection `servicios`.
 */
export function serviceJsonLd(
  servicio: {
    titulo: string;
    descripcionSEO: string;
    keywordPrimaria: string;
    alcance: readonly string[];
  },
  pageUrl: URL | string,
  siteUrl: URL | string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: servicio.titulo,
    description: servicio.descripcionSEO,
    serviceType: servicio.keywordPrimaria,
    url: pageUrl.toString(),
    provider: { '@id': absoluteUrl('/#organization', siteUrl) },
    areaServed: site.ambitoServicio,
    // El alcance se expone como catálogo de ofertas del servicio.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Alcance de ${servicio.titulo}`,
      itemListElement: servicio.alcance.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item },
      })),
    },
  };
}

/**
 * OfferCatalog para una pillar de productos. Las categorías se exponen como
 * catálogo de oferta (CIIU 4663/4752: comercialización de materiales).
 */
export function productJsonLd(
  producto: {
    titulo: string;
    descripcionSEO: string;
    keywordPrimaria: string;
    categorias: readonly string[];
  },
  pageUrl: URL | string,
  siteUrl: URL | string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: producto.titulo,
    description: producto.descripcionSEO,
    url: pageUrl.toString(),
    seller: { '@id': absoluteUrl('/#organization', siteUrl) },
    itemListElement: producto.categorias.map((cat) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Product', name: cat },
    })),
  };
}

/**
 * FAQPage para la sección de preguntas frecuentes (CLAUDE.md §5).
 * Recibe las preguntas/respuestas (texto plano) desde la collection `faq`.
 */
export function faqJsonLd(
  items: { pregunta: string; respuesta: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.respuesta,
      },
    })),
  };
}

export type Breadcrumb = { nombre: string; href: string };

/**
 * BreadcrumbList para páginas internas. Recibe las migas ya ordenadas.
 */
export function breadcrumbJsonLd(items: Breadcrumb[], siteUrl: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      item: absoluteUrl(item.href, siteUrl),
    })),
  };
}
