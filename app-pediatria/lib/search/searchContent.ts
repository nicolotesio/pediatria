/**
 * Logica di ricerca fuzzy e ordinamento dei risultati
 */

import { searchIndex, SearchItem } from "./searchIndex";

/**
 * Calcola la somiglianza fuzzy tra due stringhe
 * Versione semplificata che controlla la sottostringaRelative position
 */
function calculateFuzzySimilarity(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  // Match esatto = punteggio massimo
  if (t === q) return 100;

  // Contiene la query come substring = punteggio alto
  if (t.includes(q)) {
    // Bonus se match all'inizio
    if (t.startsWith(q)) return 95;
    return 80;
  }

  // Levenshtein-like: controlla caratteri in ordine
  let matches = 0;
  let lastIndex = -1;

  for (let i = 0; i < q.length; i++) {
    const index = t.indexOf(q[i], lastIndex + 1);
    if (index === -1) return 0; // Carattere non trovato
    matches++;
    lastIndex = index;
  }

  // Punteggio basato su quanti caratteri corrispondono
  const score = (matches / q.length) * 60;
  return score;
}

export interface SearchResult extends SearchItem {
  score: number;
  matchType: "title" | "keyword" | "description";
}

/**
 * Ricerca nei contenuti in base alla query fornita
 * Supporta ricerca fuzzy e multi-field
 */
export function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const trimmedQuery = query.trim();
  const results: SearchResult[] = [];

  for (const item of searchIndex) {
    let bestScore = 0;
    let matchType: "title" | "keyword" | "description" = "description";

    // 1. Controlla il titolo (peso massimo)
    const titleScore = calculateFuzzySimilarity(trimmedQuery, item.title);
    if (titleScore > bestScore) {
      bestScore = titleScore + 30; // Bonus per match nel titolo
      matchType = "title";
    }

    // 2. Controlla le keyword (peso medio)
    for (const keyword of item.keywords) {
      const keywordScore = calculateFuzzySimilarity(trimmedQuery, keyword);
      if (keywordScore > 0 && keywordScore + 15 > bestScore) {
        bestScore = keywordScore + 15; // Bonus per keyword match
        matchType = "keyword";
      }
    }

    // 3. Controlla la descrizione (peso basso)
    const descScore = calculateFuzzySimilarity(trimmedQuery, item.description);
    if (descScore > 0 && descScore < bestScore) {
      bestScore = Math.max(bestScore, descScore);
      matchType = "description";
    }

    // Se trovato un match, aggiungi ai risultati
    if (bestScore > 0) {
      results.push({
        ...item,
        score: bestScore,
        matchType,
      });
    }
  }

  // Ordina per punteggio (decrescente)
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Highlighting del testo cercato nei risultati
 * Utile per evidenziare dove è stato trovato il match
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
