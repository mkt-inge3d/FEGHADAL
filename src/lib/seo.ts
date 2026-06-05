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
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.direccion.calle,
      addressLocality: site.direccion.ciudad,
      addressRegion: site.direccion.region,
      postalCode: site.direccion.codigoPostal,
      addressCountry: site.direccion.pais,
    },
    areaServed: site.ambitoServicio,
    ...(site.redes.length > 0 ? { sameAs: site.redes } : {}),
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
