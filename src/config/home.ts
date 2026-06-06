/**
 * Contenido estructurado de las secciones de marketing de la home (CLAUDE.md §8).
 *
 * DECISIÓN DE ARQUITECTURA: estos bloques (proceso, diferenciadores y ventajas de
 * tercerización) son copy de marketing acoplado a iconos y a un layout fijo, no
 * contenido editorial que el cliente edite con frecuencia. Por eso viven aquí,
 * tipados y en una sola fuente (no dispersos en el markup), en lugar de en una
 * content collection. El contenido editorial (servicios, sectores, blog, FAQ…)
 * sí vive en `src/content/**`. La clave `icono` la resuelve `Icon.astro`.
 *
 * Regla de honestidad (§8): nada de cifras infladas, años de experiencia ni
 * número de proyectos. Solo afirmaciones verificables.
 */
import type { IconName } from '../lib/icon-names';

export interface Paso {
  icono: IconName;
  titulo: string;
  descripcion: string;
}

/** §1 "Cómo trabajamos": proceso de 4 pasos que genera confianza B2B. */
export const pasos: Paso[] = [
  {
    icono: 'phone',
    titulo: 'Solicitud y contacto',
    descripcion:
      'Nos escribes por WhatsApp o el formulario con lo que necesitas. Respondemos a la brevedad para entender el alcance.',
  },
  {
    icono: 'magnifying-glass',
    titulo: 'Visita técnica y diagnóstico',
    descripcion:
      'Cuando hace falta, coordinamos una visita para evaluar en sitio, medir y precisar requerimientos y normativa.',
  },
  {
    icono: 'document-text',
    titulo: 'Propuesta y cotización',
    descripcion:
      'Te enviamos una propuesta clara: alcance, materiales, plazos y precio, lista para tu evaluación o licitación.',
  },
  {
    icono: 'shield-check',
    titulo: 'Ejecución y entrega con garantía',
    descripcion:
      'Ejecutamos con personal capacitado y supervisión, y entregamos el trabajo con garantía y respaldo documentario.',
  },
];

export interface Pilar {
  icono: IconName;
  titulo: string;
  descripcion: string;
}

/** §2 "Por qué FEGHADAL": diferenciadores reales (sin inflar). */
export const pilares: Pilar[] = [
  {
    icono: 'cube',
    titulo: 'Solución llave en mano',
    descripcion:
      'Servicios y materiales bajo un mismo proveedor: menos coordinación, una sola compra y una sola facturación.',
  },
  {
    icono: 'check-badge',
    titulo: 'Empresa formal y verificable',
    descripcion:
      'RUC activo y habido, inscripción en el RNP y datos legales visibles. Transparencia para licitar y contratar con confianza.',
  },
  {
    icono: 'map-pin',
    titulo: 'Enfoque en Lima Norte',
    descripcion:
      'Base en Puente Piedra y operación en Lima Norte y Lima Metropolitana: cercanía y respuesta para tu zona.',
  },
  {
    icono: 'bolt',
    titulo: 'Respuesta ágil y supervisión',
    descripcion:
      'Atención rápida a tus solicitudes y supervisión del trabajo para asegurar la calidad acordada.',
  },
];

export interface Ventaja {
  icono: IconName;
  titulo: string;
  descripcion: string;
}

/** §3 "Ventajas de tercerizar con FEGHADAL": argumento de externalización B2B. */
export const ventajas: Ventaja[] = [
  {
    icono: 'briefcase',
    titulo: 'Concéntrate en tu core business',
    descripcion:
      'Delega la limpieza, el mantenimiento y los servicios generales para enfocar a tu equipo en lo que genera valor.',
  },
  {
    icono: 'cube',
    titulo: 'Un solo proveedor',
    descripcion:
      'Trabajo y materiales en un mismo contrato: simplificas compras, logística y administración.',
  },
  {
    icono: 'users',
    titulo: 'Menos contingencia de personal',
    descripcion:
      'Reduces la carga de contratar, capacitar y gestionar personal propio para tareas no centrales.',
  },
  {
    icono: 'banknotes',
    titulo: 'Costos controlados',
    descripcion:
      'Presupuestos claros por servicio o proyecto, sin sobrecostos ocultos, para planificar mejor.',
  },
  {
    icono: 'shield-check',
    titulo: 'Formalidad y cumplimiento',
    descripcion:
      'Respaldo documentario, enfoque en seguridad y salud en el trabajo (SST) y comprobantes en regla.',
  },
  {
    icono: 'arrow-trending-up',
    titulo: 'Escala según tu demanda',
    descripcion:
      'Ampliamos o ajustamos el servicio según tus necesidades, sin que tengas que dimensionar un equipo fijo.',
  },
];
