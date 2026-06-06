/**
 * Datos institucionales y de navegación de FEGHADAL.
 * Fuente única para NAP (Name/Address/Phone), JSON-LD global, credenciales y menús.
 *
 * Variables de entorno (prefijo PUBLIC_, expuestas en build estático):
 * - PUBLIC_WEB3FORMS_KEY  → access key del formulario de cotización (Web3Forms).
 * - PUBLIC_WHATSAPP_NUMERO → número de WhatsApp en formato internacional sin "+", ej. 51999000111.
 * Ver `.env.example`. Los valores // TODO siguen pendientes de confirmar con el cliente.
 */

const WHATSAPP_NUMERO = import.meta.env.PUBLIC_WHATSAPP_NUMERO ?? '51999000111'; // TODO: confirmar número real
const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';

export const site = {
  nombre: 'FEGHADAL',
  nombreLegal: 'FEGHADAL E.I.R.L.',
  descripcion:
    'Empresa peruana de servicios generales: mantenimiento, limpieza integral, ' +
    'instalaciones y saneamiento ambiental para el sector privado y público.',
  url: 'https://feghadal.vercel.app',

  // NAP — debe ser idéntico en todo el sitio y en directorios externos (SEO local).
  telefono: '+51 999 000 111', // TODO: confirmar teléfono fijo/comercial
  email: 'contacto@feghadal.com', // TODO: confirmar correo
  direccion: {
    calle: 'Puente Piedra', // TODO: confirmar calle y número exactos
    distrito: 'Puente Piedra',
    ciudad: 'Lima',
    region: 'Lima',
    pais: 'PE',
    codigoPostal: '15118',
  },
  horario: 'Lunes a sábado, 8:00 a. m. – 6:00 p. m.', // TODO: confirmar horario de atención
  ambitoServicio: 'Lima Norte y Lima Metropolitana, Perú',

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

  // Redes/perfiles para sameAs en JSON-LD (agregar los reales).
  redes: [] as string[], // TODO: LinkedIn, Facebook, etc.
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
