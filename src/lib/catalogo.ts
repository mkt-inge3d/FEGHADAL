/**
 * Catálogo de la tienda (CLAUDE.md §tienda). Los productos provienen del catálogo
 * del cliente (rosita.pe, autorizado) y viven como datos en `src/data/catalogo.json`
 * (no markdown: son SKUs de tienda, no contenido editorial; excepción acotada igual
 * que `config/home.ts`). Regenerar con el script de extracción cuando cambie.
 *
 * Precios: la fuente no publica precios → `precio` puede ser null y la UI muestra
 * "Cotizar"; el carrito funciona como solicitud de pedido/cotización por WhatsApp.
 * En cuanto se carguen precios reales (campo `precio`), la UI calcula totales sola.
 */
import data from '../data/catalogo.json';

export interface ProductoCatalogo {
  id: number;
  nombre: string;
  slug: string;
  sku: string;
  precio: number | null;
  regular: number | null;
  img: string;
  categoria: string;
  categoriaSlug: string;
  desc: string;
}

export interface CategoriaCatalogo {
  slug: string;
  nombre: string;
  total: number;
}

export const categorias = data.categorias as CategoriaCatalogo[];
export const productos = data.productos as ProductoCatalogo[];

export const productosPorCategoria = (slug: string) =>
  productos.filter((p) => p.categoriaSlug === slug);

export const getCategoria = (slug: string) =>
  categorias.find((c) => c.slug === slug);

/** Formato de precio en soles; "Cotizar" cuando no hay precio. */
export const formatPrecio = (n: number | null) =>
  n == null ? 'Cotizar' : `S/ ${n.toFixed(2)}`;
