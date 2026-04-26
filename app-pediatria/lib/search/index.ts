/**
 * Search Module
 * 
 * Esporta tutte le funzioni e tipi necessari per la ricerca
 * 
 * Utilizzo:
 * ```tsx
 * import { searchContent, SearchResult } from "@/lib/search";
 * 
 * const results = searchContent("adrenalina");
 * // results è un array di SearchResult ordinati per rilevanza
 * ```
 */

export { searchIndex, type SearchItem } from "./searchIndex";
export { searchContent, highlightMatch, type SearchResult } from "./searchContent";
