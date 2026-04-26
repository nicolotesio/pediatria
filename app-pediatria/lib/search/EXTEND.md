/**
 * GUIDA: Come estendere il sistema di ricerca
 * 
 * Il sistema di ricerca è modulare e facilmente estendibile.
 * Per aggiungere nuovi contenuti ricercabili:
 * 
 * 1. APRIRE: lib/search/searchIndex.ts
 * 
 * 2. AGGIUNGERE un nuovo oggetto nell'array `searchIndex`:
 * 
 *    ```typescript
 *    {
 *      id: "unique-id",
 *      title: "Titolo del contenuto",
 *      description: "Breve descrizione",
 *      keywords: ["parola1", "parola2", "parola3"],
 *      route: "/percorso/pagina",
 *      icon: "🎯",
 *      category: "section" | "tool" | "calculator" | "emergency",
 *    }
 *    ```
 * 
 * 3. SPIEGAZIONE dei campi:
 *    - id: Identificativo unico (prefer: "category-name")
 *    - title: Il nome che appare nei risultati
 *    - description: Descrizione breve (massimo 1-2 righe)
 *    - keywords: Termini per la ricerca (es: varianti, sinonimi, concetti correlati)
 *    - route: Path della pagina (/categoria/sottocategoria)
 *    - icon: Emoji o Unicode per identificare visivamente
 *    - category: Tipo di contenuto (sezione principale, tool, calcolatore, emergenza)
 * 
 * 4. ESEMPI storici da cui prendere spunto:
 * 
 *    // Farmaco con sinonimi
 *    {
 *      id: "drug-adrenaline",
 *      title: "Adrenalina (Epinefrina)",
 *      description: "Dosaggio e calcolo rapido",
 *      keywords: ["adrenalina", "epinefrina", "adrenalin", "emergenza", "shock"],
 *      route: "/emergenze/farmaci",
 *      icon: "💉",
 *      category: "emergency",
 *    }
 * 
 *    // Calcolatore di crescita
 *    {
 *      id: "calculator-growth",
 *      title: "Percentili di crescita",
 *      description: "WHO, INeS, INTERGROWTH comparati",
 *      keywords: ["crescita", "percentili", "centili", "peso", "lunghezza"],
 *      route: "/calcolatori/confronto",
 *      icon: "📊",
 *      category: "calculator",
 *    }
 * 
 * 5. COME FUNZIONA LA RICERCA:
 *    - Fuzzy matching: tolera errori e input parziali
 *    - Non case-sensitive
 *    - Ordina per rilevanza:
 *      * Match nel TITLE = massima priorità (+30 punti)
 *      * Match nelle KEYWORDS = media priorità (+15 punti)
 *      * Match nella DESCRIPTION = bassa priorità (0 punti)
 * 
 * 6. PERFORMANCE:
 *    - Il componente SearchBar usa useMemo per evitare ricalcoli
 *    - Nessun impatto di performance anche con 100+ items
 *    - La ricerca avviene interamente nel client (lato browser)
 * 
 * 7. TESTING:
 *    - Prova queste ricerche:
 *      "adrenalina" → mostra farmaci emergenza
 *      "centili" → mostra tutti i calcolatori di crescita
 *      "peso" → mostra tool correlati
 *      "wetflag" → mostra calcolatore WETFLAG
 * 
 */

// TypeScript non consente di eseguire questo file, è solo documentazione
// Usa lib/search/searchIndex.ts per aggiungere nuovi contenuti
