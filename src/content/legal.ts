import type { Locale } from "@/content/home";

export interface LegalBlock {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: Record<Locale, string>;
  updated: string; // ISO date
  blocks: Record<Locale, LegalBlock[]>;
}

/**
 * Placeholder-but-real GDPR copy. Review with a lawyer and fill in the
 * Titolare/registered details before going live.
 */
export const privacyDoc: LegalDoc = {
  title: { it: "Privacy Policy", en: "Privacy Policy" },
  updated: "2026-11-01",
  blocks: {
    it: [
      {
        heading: "Titolare del trattamento",
        body: [
          "Il Titolare del trattamento dei dati è Marcelo Amaro, che opera con il nome Fentriq. Per qualsiasi richiesta relativa ai tuoi dati personali puoi scrivere a info@fentriq.app.",
        ],
      },
      {
        heading: "Quali dati raccolgo",
        body: [
          "Quando compili il modulo di contatto raccolgo i dati che mi fornisci: il tuo nome, il telefono o l'email su cui rispondere e il contenuto del messaggio.",
          "Per finalità statistiche utilizzo Plausible Analytics, uno strumento che non usa cookie e non raccoglie dati personali identificativi.",
        ],
      },
      {
        heading: "Perché tratto i dati",
        body: [
          "Tratto i tuoi dati esclusivamente per rispondere alla tua richiesta e gestire l'eventuale rapporto commerciale. La base giuridica è il consenso che presti inviando il modulo e l'esecuzione di misure precontrattuali.",
        ],
      },
      {
        heading: "Come e dove conservo i dati",
        body: [
          "I dati del modulo vengono trasmessi ai miei strumenti di posta (Resend) e di automazione (n8n). I fornitori sono selezionati per garantire un adeguato livello di protezione dei dati.",
          "Conservo i dati per il tempo necessario a gestire la tua richiesta e gli obblighi di legge.",
        ],
      },
      {
        heading: "I tuoi diritti",
        body: [
          "Hai diritto di accedere, rettificare, cancellare e limitare il trattamento dei tuoi dati, oltre al diritto di opposizione e portabilità. Per esercitarli scrivi a info@fentriq.app. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.",
        ],
      },
    ],
    en: [
      {
        heading: "Data controller",
        body: [
          "The data controller is Marcelo Amaro, operating under the name Fentriq. For any request about your personal data, write to info@fentriq.app.",
        ],
      },
      {
        heading: "What data I collect",
        body: [
          "When you fill in the contact form I collect the data you provide: your name, the phone or email to reply on and the content of your message.",
          "For analytics I use Plausible Analytics, a cookie-less tool that does not collect personally identifiable data.",
        ],
      },
      {
        heading: "Why I process data",
        body: [
          "I process your data solely to respond to your request and manage any resulting business relationship. The legal basis is the consent you give by submitting the form and the performance of pre-contractual measures.",
        ],
      },
      {
        heading: "How and where I store data",
        body: [
          "Form data is sent to my email (Resend) and automation (n8n) tools. Providers are selected to ensure an adequate level of data protection.",
          "I keep data for as long as needed to handle your request and meet legal obligations.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, rectify, erase and restrict the processing of your data, as well as the right to object and to data portability. To exercise them, write to info@fentriq.app. You also have the right to lodge a complaint with the Italian Data Protection Authority.",
        ],
      },
    ],
  },
};

export const cookieDoc: LegalDoc = {
  title: { it: "Cookie Policy", en: "Cookie Policy" },
  updated: "2026-11-01",
  blocks: {
    it: [
      {
        heading: "Uso dei cookie",
        body: [
          "Questo sito non utilizza cookie di profilazione né cookie di tracciamento di terze parti.",
          "Per le statistiche di visita uso Plausible Analytics, che funziona senza cookie e senza raccogliere dati personali. Per questo motivo non è necessario alcun banner di consenso ai cookie.",
        ],
      },
      {
        heading: "Preferenza della lingua",
        body: [
          "La lingua che scegli viene ricordata solo nel tuo browser, per mostrarti il sito nella stessa lingua alla visita successiva. Questa memorizzazione tecnica non richiede consenso.",
        ],
      },
    ],
    en: [
      {
        heading: "Use of cookies",
        body: [
          "This site does not use profiling cookies or third-party tracking cookies.",
          "For visit statistics I use Plausible Analytics, which works without cookies and without collecting personal data. For this reason no cookie consent banner is required.",
        ],
      },
      {
        heading: "Language preference",
        body: [
          "The language you choose is remembered only in your browser, to show you the site in the same language on your next visit. This technical storage does not require consent.",
        ],
      },
    ],
  },
};
