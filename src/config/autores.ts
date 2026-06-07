/**
 * Autores del blog (E-E-A-T: experiencia, pericia, autoridad, confianza).
 * Fuente única de la ficha de cada autor; el campo `autor` de la collection `blog`
 * referencia a una de estas entradas por su nombre.
 *
 * Regla de honestidad (CLAUDE.md §8): no inventar títulos, años ni certificaciones.
 * La bio está marcada [REVISAR] hasta confirmar datos reales con la persona.
 */
export interface Autor {
  nombre: string;
  cargo: string;
  bio: string;
  /** Iniciales para el avatar placeholder mientras no haya FOTO REAL. */
  iniciales: string;
  /** Ruta a la foto real en /public (o vacío → se usa el avatar de iniciales). */
  foto: string;
  /** URL de LinkedIn (vacío → no se muestra ni entra en sameAs). */
  linkedin: string;
}

export const autorPorDefecto = 'Daniel Quintana Toledo';

export const autores: Record<string, Autor> = {
  'Daniel Quintana Toledo': {
    nombre: 'Daniel Quintana Toledo',
    cargo: 'Especialista en servicios generales – FEGHADAL',
    // [REVISAR con datos reales de Daniel] — bio profesional sin títulos/años inventados.
    bio:
      'Daniel Quintana Toledo es especialista en servicios generales en FEGHADAL. ' +
      'Trabaja a diario en limpieza, mantenimiento, instalaciones y acabados para ' +
      'empresas e instituciones en Lima, y acompaña a cada cliente desde el ' +
      'diagnóstico en sitio hasta la entrega del trabajo. En el blog comparte ' +
      'recomendaciones prácticas basadas en lo que ve en obra. [REVISAR con datos reales de Daniel]',
    iniciales: 'DQ',
    foto: '', // [COMPLETAR: foto real de Daniel en /public, ej. /equipo/daniel.jpg]
    linkedin: '', // [COMPLETAR: URL de LinkedIn de Daniel]
  },
};

/** Devuelve la ficha del autor por nombre; cae al autor por defecto si no existe. */
export function getAutor(nombre?: string): Autor {
  return autores[nombre ?? ''] ?? autores[autorPorDefecto];
}
