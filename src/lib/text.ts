/**
 * Utilidades de texto. `slugify` convierte un texto a kebab-case sin acentos
 * (CLAUDE.md §4: slugs limpios). Se usa para las categorías del blog.
 */
export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // quita diacríticos combinantes
    .replace(/[^a-z0-9]+/g, '-') // no alfanumérico → guion
    .replace(/^-+|-+$/g, ''); // sin guiones al inicio/fin
}
