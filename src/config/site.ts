/**
 * Datos institucionales y de navegación de FEGHADAL.
 * Fuente única para NAP (Name/Address/Phone), JSON-LD global y menús.
 *
 * NOTA: los valores marcados con `// TODO:` son provisionales y deben
 * confirmarse con el cliente antes de publicar (CLAUDE.md §8: no inventar datos).
 */

export const site = {
  nombre: 'FEGHADAL',
  nombreLegal: 'FEGHADAL S.A.C.', // TODO: confirmar razón social y RUC
  descripcion:
    'Empresa peruana de servicios generales: mantenimiento, limpieza integral, ' +
    'instalaciones y saneamiento ambiental para el sector privado y público.',
  url: 'https://feghadal.vercel.app',
  // NAP — debe ser idéntico en todo el sitio y en directorios externos (SEO local).
  telefono: '+51 999 999 999', // TODO: confirmar teléfono
  email: 'contacto@feghadal.com', // TODO: confirmar correo
  direccion: {
    calle: 'Av. Ejemplo 123', // TODO: confirmar dirección
    ciudad: 'Lima',
    region: 'Lima',
    pais: 'PE',
    codigoPostal: '15001',
  },
  // Para LocalBusiness: zona de cobertura.
  ambitoServicio: 'Perú',
  // Redes/perfiles para sameAs en JSON-LD (agregar los reales).
  redes: [] as string[], // TODO: LinkedIn, Facebook, etc.
  // Imagen Open Graph por defecto (ruta en /public). TODO: diseñar OG real.
  ogImagen: '/og-default.png',
} as const;

/** Navegación principal: los 3 silos SEO (CLAUDE.md §4). */
export const navPrincipal = [
  {
    titulo: 'Servicios',
    href: '/servicios',
    descripcion: 'Qué hacemos',
  },
  {
    titulo: 'Sectores',
    href: '/sectores',
    descripcion: 'Para quién trabajamos',
  },
  {
    titulo: 'Productos',
    href: '/productos',
    descripcion: 'Materiales y ferretería',
  },
  {
    titulo: 'Proyectos',
    href: '/proyectos',
    descripcion: 'Portafolio',
  },
  {
    titulo: 'Nosotros',
    href: '/nosotros',
    descripcion: 'RNP, certificaciones y SST',
  },
  {
    titulo: 'Blog',
    href: '/blog',
    descripcion: 'Recursos',
  },
] as const;
