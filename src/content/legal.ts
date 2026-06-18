import type { Locale } from "@/i18n/routing";

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
  updated: "2026-06-18",
  blocks: {
    it: [
      {
        heading: "Titolare del trattamento",
        body: [
          "Il Titolare del trattamento dei dati è Fentriq (P.IVA IT00000000000). Per qualsiasi richiesta relativa ai tuoi dati personali puoi scriverci a hello@fentriq.app.",
        ],
      },
      {
        heading: "Quali dati raccogliamo",
        body: [
          "Quando compili il modulo di contatto raccogliamo i dati che ci fornisci: nome, email, eventuale nome dell'azienda, budget indicativo e il contenuto del messaggio.",
          "Per finalità statistiche utilizziamo Plausible Analytics, uno strumento che non usa cookie e non raccoglie dati personali identificativi.",
        ],
      },
      {
        heading: "Perché trattiamo i dati",
        body: [
          "Trattiamo i tuoi dati esclusivamente per rispondere alla tua richiesta e gestire l'eventuale rapporto commerciale. La base giuridica è il consenso che presti inviando il modulo e l'esecuzione di misure precontrattuali.",
        ],
      },
      {
        heading: "Come e dove conserviamo i dati",
        body: [
          "I dati del modulo vengono trasmessi alla nostra infrastruttura di automazione (n8n) e ai nostri strumenti di posta (Resend) e CRM. I fornitori sono selezionati per garantire un adeguato livello di protezione dei dati.",
          "Conserviamo i dati per il tempo necessario a gestire la tua richiesta e gli obblighi di legge.",
        ],
      },
      {
        heading: "I tuoi diritti",
        body: [
          "Hai diritto di accedere, rettificare, cancellare e limitare il trattamento dei tuoi dati, oltre al diritto di opposizione e portabilità. Per esercitarli scrivici a hello@fentriq.app. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.",
        ],
      },
    ],
    en: [
      {
        heading: "Data controller",
        body: [
          "The data controller is Fentriq (VAT IT00000000000). For any request about your personal data, write to hello@fentriq.app.",
        ],
      },
      {
        heading: "What data we collect",
        body: [
          "When you fill in the contact form we collect the data you provide: name, email, optional company name, indicative budget and the content of your message.",
          "For analytics we use Plausible Analytics, a cookie-less tool that does not collect personally identifiable data.",
        ],
      },
      {
        heading: "Why we process data",
        body: [
          "We process your data solely to respond to your request and manage any resulting business relationship. The legal basis is the consent you give by submitting the form and the performance of pre-contractual measures.",
        ],
      },
      {
        heading: "How and where we store data",
        body: [
          "Form data is sent to our automation infrastructure (n8n) and to our email (Resend) and CRM tools. Providers are selected to ensure an adequate level of data protection.",
          "We keep data for as long as needed to handle your request and meet legal obligations.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, rectify, erase and restrict the processing of your data, as well as the right to object and to data portability. To exercise them, write to hello@fentriq.app. You also have the right to lodge a complaint with the Italian Data Protection Authority.",
        ],
      },
    ],
  },
};

export const cookieDoc: LegalDoc = {
  title: { it: "Cookie Policy", en: "Cookie Policy" },
  updated: "2026-06-18",
  blocks: {
    it: [
      {
        heading: "Uso dei cookie",
        body: [
          "Questo sito non utilizza cookie di profilazione né cookie di tracciamento di terze parti.",
          "Per le statistiche di visita usiamo Plausible Analytics, che funziona senza cookie e senza raccogliere dati personali. Per questo motivo non è necessario alcun banner di consenso ai cookie.",
        ],
      },
      {
        heading: "Cookie tecnici",
        body: [
          "Possono essere utilizzati cookie tecnici strettamente necessari al funzionamento del sito (ad esempio per ricordare la lingua selezionata). Questi cookie non richiedono consenso.",
        ],
      },
      {
        heading: "Servizi esterni",
        body: [
          "Quando prenoti una call tramite Cal.com o ci scrivi su WhatsApp, vieni reindirizzato a servizi di terze parti che applicano le proprie informative sulla privacy.",
        ],
      },
    ],
    en: [
      {
        heading: "Use of cookies",
        body: [
          "This site does not use profiling cookies or third-party tracking cookies.",
          "For visit statistics we use Plausible Analytics, which works without cookies and without collecting personal data. For this reason no cookie consent banner is required.",
        ],
      },
      {
        heading: "Technical cookies",
        body: [
          "Strictly necessary technical cookies may be used for the site to function (e.g. to remember the selected language). These cookies do not require consent.",
        ],
      },
      {
        heading: "External services",
        body: [
          "When you book a call via Cal.com or message us on WhatsApp, you are redirected to third-party services that apply their own privacy policies.",
        ],
      },
    ],
  },
};
