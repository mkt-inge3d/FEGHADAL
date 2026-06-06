/**
 * Datos institucionales y de navegación de FEGHADAL.
 * Fuente única para NAP (Name/Address/Phone), JSON-LD global, credenciales y menús.
 *
 * Variables de entorno (prefijo PUBLIC_, expuestas en build estático):
 * - PUBLIC_WEB3FORMS_KEY     → access key del formulario de cotización (Web3Forms).
 * - PUBLIC_WHATSAPP_NUMERO   → WhatsApp en formato internacional sin "+", ej. 51932262669.
 * - PUBLIC_FACEBOOK_URL      → URL del perfil de Facebook (opcional; se oculta si vacío).
 * - PUBLIC_INSTAGRAM_URL     → URL del perfil de Instagram (opcional; se oculta si vacío).
 * - PUBLIC_GOOGLE_BUSINESS_URL → URL del Perfil de Empresa de Google (opcional).
 * Ver `.env.example`. Los datos de contacto (tel/WhatsApp/email) ya son los reales.
 */

// Número real comercial. `telefono` en formato +51 … para `tel:`/JSON-LD; el
// display se muestra sin prefijo internacional (uso local en Perú).
const WHATSAPP_NUMERO = import.meta.env.PUBLIC_WHATSAPP_NUMERO ?? '51932262669';
const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';

// Redes sociales por entorno: solo se incluyen las que tengan URL configurada
// (regla de honestidad §8: no inventar perfiles). Alimentan también `sameAs`.
const REDES_RAW = [
  { nombre: 'Facebook', url: import.meta.env.PUBLIC_FACEBOOK_URL ?? '', icono: 'facebook' as const },
  { nombre: 'Instagram', url: import.meta.env.PUBLIC_INSTAGRAM_URL ?? '', icono: 'instagram' as const },
];

export const site = {
  nombre: 'FEGHADAL',
  nombreLegal: 'FEGHADAL E.I.R.L.',
  descripcion:
    'Empresa peruana de servicios generales: mantenimiento, limpieza integral, ' +
    'instalaciones y saneamiento ambiental para el sector privado y público.',
  url: 'https://feghadal.com',

  // NAP — debe ser idéntico en todo el sitio y en directorios externos (SEO local).
  telefono: '+51 932 262 669', // formato internacional para tel: y JSON-LD
  telefonoDisplay: '932 262 669', // formato local que se muestra al usuario
  email: 'contacto@feghadal.com',
  direccion: {
    calle: 'Puente Piedra', // [COMPLETAR] calle y número exactos de la sede comercial
    distrito: 'Puente Piedra',
    ciudad: 'Lima',
    region: 'Lima',
    pais: 'PE',
    codigoPostal: '15118',
  },
  horario: 'Lunes a sábado, 8:00 a. m. – 6:00 p. m.', // [COMPLETAR] confirmar horario real
  ambitoServicio: 'Lima Norte y Lima Metropolitana, Perú',
  // Distritos de Lima Norte para reforzar el SEO local (areaServed en JSON-LD).
  areasServidas: [
    'Puente Piedra',
    'Comas',
    'Carabayllo',
    'Los Olivos',
    'San Martín de Porres',
    'Independencia',
    'Ancón',
    'Santa Rosa',
  ],

  // Credenciales (verificables) — clave para confianza y licitación con el Estado.
  credenciales: {
    ruc: '20615713865',
    sunatEstado: 'ACTIVO',
    sunatCondicion: 'HABIDO',
    rnp: 'Inscrito en el Registro Nacional de Proveedores (RNP)',
  },

  // Canales de conversión.
  whatsapp: {
    numero: WHATSAPP_NUMERO,
    // Mensaje precargado al abrir el chat (URL-encoded en el componente).
    mensaje: 'Hola FEGHADAL, quisiera solicitar una cotización.',
  },
  web3formsKey: WEB3FORMS_KEY,

  // Redes sociales con URL configurada (objetos {nombre,url,icono}); vacío si no hay.
  redes: REDES_RAW.filter((r) => r.url.trim().length > 0),
  // Perfil de Empresa de Google (SEO local). Vacío hasta que exista; se oculta.
  googleBusinessUrl: import.meta.env.PUBLIC_GOOGLE_BUSINESS_URL ?? '',
  // Imagen Open Graph por defecto (logo completo sobre fondo blanco, 1200×630).
  ogImagen: '/og-feghadal.png',
} as const;

/** Navegación principal: los silos SEO + conversión (CLAUDE.md §4). */
export const navPrincipal = [
  { titulo: 'Servicios', href: '/servicios', descripcion: 'Qué hacemos' },
  { titulo: 'Sectores', href: '/sectores', descripcion: 'Para quién trabajamos' },
  { titulo: 'Productos', href: '/productos', descripcion: 'Materiales y ferretería' },
  { titulo: 'Proyectos', href: '/proyectos', descripcion: 'Portafolio' },
  { titulo: 'Nosotros', href: '/nosotros', descripcion: 'RNP, RUC y SST' },
  { titulo: 'Blog', href: '/blog', descripcion: 'Recursos' },
  { titulo: 'Contacto', href: '/contacto', descripcion: 'Cotización' },
] as const;

/** Enlace wa.me con mensaje precargado (canal de cotización principal en Perú). */
export const whatsappUrl = `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(
  site.whatsapp.mensaje,
)}`;
