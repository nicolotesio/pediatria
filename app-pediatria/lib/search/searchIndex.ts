/**
 * Indice centralizzato di tutti i contenuti ricercabili
 * Facilmente estendibile aggiungendo nuovi oggetti
 */

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  route: string;
  icon: string;
  category: "section" | "tool" | "calculator" | "emergency";
}

export const searchIndex: SearchItem[] = [
  // ===== SEZIONI PRINCIPALI =====

  {
    id: "section-appunti",
    title: "Appunti",
    description: "Appunti divisi per materia",
    keywords: ["studio", "materia", "note", "lezioni"],
    route: "/appunti",
    icon: "📚",
    category: "section",
  },

  {
    id: "section-emergenze",
    title: "Emergenze",
    description: "Strumenti rapidi per la gestione in urgenza",
    keywords: ["urgenza", "emergenza", "urgente", "rapido", "adrenalina"],
    route: "/emergenze",
    icon: "🚑",
    category: "section",
  },

  {
    id: "section-calcolatori",
    title: "Calcolatori",
    description: "Strumenti clinici rapidi per crescita e sviluppo",
    keywords: [
      "centili",
      "percentili",
      "z-score",
      "peso",
      "lunghezza",
      "crescita",
      "sviluppo",
    ],
    route: "/calcolatori",
    icon: "🧮",
    category: "section",
  },

  {
    id: "section-risorse",
    title: "Risorse",
    description: "Linee guida e link utili",
    keywords: ["linee guida", "reference", "link", "risorse", "documenti"],
    route: "/risorse",
    icon: "📖",
    category: "section",
  },

  {
    id: "section-genitori",
    title: "Genitori",
    description: "Info pratiche per le famiglie",
    keywords: ["famiglia", "genitori", "bambini", "info", "istruzioni"],
    route: "/genitori",
    icon: "👶",
    category: "section",
  },

  {
    id: "section-info",
    title: "Informazioni",
    description: "Progetto, disclaimer e contatti",
    keywords: ["info", "progetto", "disclaimer", "contatti", "aiuto"],
    route: "/info",
    icon: "ℹ️",
    category: "section",
  },

  // ===== STRUMENTI EMERGENZA =====

  {
    id: "tool-wetflag",
    title: "WETFLAG",
    description: "Calcoli rapidi da peso o età per situazioni di emergenza",
    keywords: [
      "wetflag",
      "età",
      "calcoli rapidi",
      "emergenza",
      "fluidi",
      "liquidi",
      "adrenalina",
      "epinefrina",
      "atropina",
      "farmaci",
      "dosaggio",
      "dosi",
    ],
    route: "/emergenze/wetflag",
    icon: "🚑",
    category: "emergency",
  },

  {
    id: "tool-farmaci-emergenza",
    title: "Farmaci in emergenza pediatrica",
    description: "Calcolatore di dosaggi pediatrici in emergenza",
    keywords: [
      "farmaci",
      "dosaggio",
      "adrenalina",
      "epinefrina",
      "atropina",
      "amiodarone",
      "procainamide",
      "emergenza",
      "dosi",
      "pediatrico",
      "farmaci emergenza",
    ],
    route: "/emergenze/farmaci",
    icon: "💊",
    category: "emergency",
  },

  // ===== CALCOLATORI CRESCITA =====

  {
    id: "calculator-who",
    title: "WHO 0–2 anni",
    description: "Centili di peso, lunghezza e circonferenza cranica",
    keywords: [
      "who",
      "centili",
      "percentili",
      "peso",
      "lunghezza",
      "circonferenza cranica",
      "testa",
      "altezza",
      "0-2 anni",
      "lattante",
      "z-score",
      "crescita",
      "sviluppo",
    ],
    route: "/calcolatori/who",
    icon: "📈",
    category: "calculator",
  },

  {
    id: "calculator-ines",
    title: "INeS Neonatali",
    description: "Centili per neonati italiani 24–42 settimane EG",
    keywords: [
      "ines",
      "neonato",
      "neonatale",
      "centili",
      "percentili",
      "peso",
      "lunghezza",
      "circonferenza cranica",
      "settimane",
      "eg",
      "età gestazionale",
      "italiano",
      "z-score",
      "nascita",
    ],
    route: "/calcolatori/ines",
    icon: "👶",
    category: "calculator",
  },

  {
    id: "calculator-intergrowth",
    title: "INTERGROWTH-21",
    description: "Centili di peso alla nascita 22–50 settimane EG",
    keywords: [
      "intergrowth",
      "intergrowth-21",
      "centili",
      "percentili",
      "peso",
      "peso alla nascita",
      "lunghezza",
      "circonferenza cranica",
      "neonato",
      "neonatale",
      "settimane",
      "eg",
      "età gestazionale",
      "internazionale",
      "z-score",
      "nascita",
    ],
    route: "/calcolatori/intergrowth",
    icon: "🌍",
    category: "calculator",
  },
];
