import type { Locale } from "@/i18n/routing";

export interface CaseStudy {
  slug: string;
  /** Brand/product name — locale-independent. */
  title: string;
  year: number;
  featured: boolean;
  /** Optional cover image under /public/work. Falls back to a generated tile. */
  cover?: string;
  stack: string[];
  links: { repo?: string; live?: string };
  roles: Record<Locale, string[]>;
  badge?: Record<Locale, string>;
  summary: Record<Locale, string>;
  sections: {
    problem: Record<Locale, string>;
    solution: Record<Locale, string>;
    build: Record<Locale, string>;
    result: Record<Locale, string>;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "docsense",
    title: "docSense",
    year: 2026,
    featured: true,
    cover: "/work/docsense.svg",
    stack: ["Next.js", "Node", "OpenAI", "Tailwind"],
    links: { repo: "https://github.com/ragesito/docSense", live: "" },
    roles: { it: ["Full-stack", "IA"], en: ["Full-stack", "AI"] },
    badge: { it: "Costruito in poche ore", en: "Built in a few hours" },
    summary: {
      it: "Pipeline IA full-stack che estrae i dati delle fatture, li concilia con il catalogo e segnala le anomalie in tempo reale.",
      en: "Full-stack AI pipeline that extracts invoice data, reconciles it against a catalogue and flags anomalies in real time.",
    },
    sections: {
      problem: {
        it: "Controllare le fatture a mano è lento e pieno di errori: prezzi sbagliati, quantità che non tornano, anomalie che passano inosservate fino a fine mese.",
        en: "Checking invoices by hand is slow and error-prone: wrong prices, mismatched quantities, anomalies that slip through until month end.",
      },
      solution: {
        it: "Una pipeline che legge la fattura, ne estrae le righe, le concilia contro il catalogo prodotti e segnala in tempo reale tutto ciò che non quadra.",
        en: "A pipeline that reads the invoice, extracts the line items, reconciles them against the product catalogue and flags anything that doesn't add up — in real time.",
      },
      build: {
        it: "Front-end Next.js, estrazione con modelli OpenAI, logica di conciliazione su Node. Dal problema al prototipo funzionante in poche ore.",
        en: "Next.js front-end, extraction with OpenAI models, reconciliation logic on Node. From problem to working prototype in a few hours.",
      },
      result: {
        it: "Un controllo che prima richiedeva ore si chiude in minuti, con le anomalie evidenziate prima che diventino un costo.",
        en: "A check that used to take hours closes in minutes, with anomalies surfaced before they become a cost.",
      },
    },
  },
  {
    slug: "matchmood",
    title: "MatchMood",
    year: 2025,
    featured: false,
    cover: "/work/matchmood.svg",
    stack: ["Angular", "Socket.io", "Judge0", "Stripe", "OpenAI", "Docker"],
    links: { repo: "", live: "https://matchmood.dev" },
    roles: { it: ["Full-stack", "Real-time"], en: ["Full-stack", "Real-time"] },
    summary: {
      it: "Piattaforma 1v1 di coding competitivo in tempo reale.",
      en: "Real-time 1v1 competitive coding platform.",
    },
    sections: {
      problem: {
        it: "Imparare a programmare da soli è noioso. Mancava un modo veloce e competitivo per sfidarsi e migliorare giocando.",
        en: "Learning to code alone is dull. There was no fast, competitive way to challenge others and improve while playing.",
      },
      solution: {
        it: "Una piattaforma dove due persone si sfidano dal vivo su problemi di coding, con esecuzione del codice e valutazione istantanea.",
        en: "A platform where two people face off live on coding problems, with live code execution and instant grading.",
      },
      build: {
        it: "Front-end Angular, partite in tempo reale con Socket.io, esecuzione sicura del codice con Judge0 in container Docker, pagamenti con Stripe e suggerimenti IA con OpenAI.",
        en: "Angular front-end, real-time matches over Socket.io, sandboxed code execution with Judge0 in Docker containers, payments with Stripe and AI hints with OpenAI.",
      },
      result: {
        it: "Una piattaforma in tempo reale fluida, scalabile e pronta a monetizzare.",
        en: "A smooth, scalable real-time platform ready to monetise.",
      },
    },
  },
  {
    slug: "asroma",
    title: "Asroma",
    year: 2025,
    featured: false,
    cover: "/work/asroma.svg",
    stack: ["Next.js", "Node", "MongoDB", "WebSockets", "Solana"],
    links: { repo: "", live: "https://asroma.app" },
    roles: { it: ["Full-stack", "Web3"], en: ["Full-stack", "Web3"] },
    summary: {
      it: "Piattaforma Web3 multiplayer in produzione, con wallet custodiali.",
      en: "Multiplayer Web3 platform in production, with custodial wallets.",
    },
    sections: {
      problem: {
        it: "Portare il Web3 a un pubblico non tecnico è difficile: wallet complicati, frizione all'onboarding, esperienze multiplayer lente.",
        en: "Bringing Web3 to a non-technical audience is hard: complicated wallets, onboarding friction, slow multiplayer experiences.",
      },
      solution: {
        it: "Una piattaforma multiplayer in tempo reale con wallet custodiali, così l'utente gioca senza preoccuparsi della complessità della blockchain.",
        en: "A real-time multiplayer platform with custodial wallets, so users play without worrying about blockchain complexity.",
      },
      build: {
        it: "Next.js e Node, dati su MongoDB, multiplayer su WebSockets e integrazione con la SDK di Solana per gli asset on-chain.",
        en: "Next.js and Node, data on MongoDB, multiplayer over WebSockets and integration with the Solana SDK for on-chain assets.",
      },
      result: {
        it: "Una piattaforma Web3 in produzione, accessibile anche a chi non ha mai usato un wallet.",
        en: "A Web3 platform in production, accessible even to people who have never used a wallet.",
      },
    },
  },
  {
    slug: "automazione-pmi",
    title: "Automazione PMI",
    year: 2025,
    featured: false,
    cover: "/work/automazione.svg",
    stack: ["n8n", "Python", "OpenAI", "Telegram", "Google Sheets"],
    links: { repo: "", live: "" },
    roles: { it: ["Automazione", "IA"], en: ["Automation", "AI"] },
    badge: { it: "Montato in un giorno", en: "Set up in a day" },
    summary: {
      it: "Sistema che legge email e PDF, concilia l'inventario e invia preventivi su Telegram. Montato in un giorno.",
      en: "System that reads emails and PDFs, reconciles inventory and sends quotes over Telegram. Set up in a day.",
    },
    sections: {
      problem: {
        it: "Un cliente in Perù perdeva ore ogni giorno a leggere email e PDF, aggiornare l'inventario a mano e preparare preventivi.",
        en: "A client in Peru lost hours every day reading emails and PDFs, updating inventory by hand and preparing quotes.",
      },
      solution: {
        it: "Un flusso che legge automaticamente mail e allegati, concilia l'inventario su Google Sheets e consegna i preventivi via Telegram.",
        en: "A flow that automatically reads emails and attachments, reconciles inventory on Google Sheets and delivers quotes via Telegram.",
      },
      build: {
        it: "Orchestrazione con n8n, parsing e logica in Python, estrazione dati con OpenAI, notifiche su Telegram e inventario su Google Sheets. Tutto in un giorno.",
        en: "Orchestration with n8n, parsing and logic in Python, data extraction with OpenAI, Telegram notifications and inventory on Google Sheets. All in one day.",
      },
      result: {
        it: "Ore di lavoro manuale eliminate ogni giorno, con preventivi pronti in pochi minuti.",
        en: "Hours of manual work removed every day, with quotes ready in minutes.",
      },
    },
  },
];

export function getCaseStudies(): CaseStudy[] {
  return [...caseStudies].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
  );
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
