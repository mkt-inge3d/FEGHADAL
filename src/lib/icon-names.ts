/**
 * Nombres de iconos disponibles en `Icon.astro` (CLAUDE.md §7).
 * Tipo en módulo .ts neutral para poder importarlo tanto desde componentes
 * .astro como desde config (evita importar `type` desde un archivo .astro).
 */
export type IconName =
  | 'phone'
  | 'magnifying-glass'
  | 'document-text'
  | 'shield-check'
  | 'check-badge'
  | 'cube'
  | 'map-pin'
  | 'bolt'
  | 'briefcase'
  | 'users'
  | 'banknotes'
  | 'arrow-trending-up'
  | 'facebook'
  | 'instagram';
