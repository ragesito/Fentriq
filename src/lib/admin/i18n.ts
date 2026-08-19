/**
 * Client-facing strings for the monthly report.
 *
 * The admin chrome is Spanish because one person reads it. These strings are
 * different: they are printed on the sheet the client receives and pasted into
 * the message they read, so they follow the client's own language, not ours.
 */

export type ClientLang = "it" | "en";

export const reportStrings = {
  it: {
    header: "REPORT MENSILE",
    visits: "Persone che hanno visto il sito",
    calls: "Hanno chiamato da Google",
    directions: "Hanno chiesto indicazioni",
    reviews: "Nuove recensioni",
    firstMonth: "Primo mese — è la base di partenza",
    same: "uguale al mese scorso",
    vsPrev: "vs mese scorso",
    sources: "Da dove sono arrivati",
    done: "Cosa abbiamo fatto questo mese",
    next: "Cosa facciamo il prossimo",
    footer: "FENTRIQ · STUDIO DI SVILUPPO SOFTWARE",
    waGreeting: (month: string, client: string) =>
      `Buongiorno! 👋 Ecco il report di ${month} per ${client}.`,
    waVisits: (n: string) => `📈 ${n} persone hanno visto il sito`,
    waCalls: (n: string) => `📞 ${n} vi hanno chiamato da Google`,
    waDirections: (n: string) => `📍 ${n} hanno chiesto come arrivare`,
    waReviews: (n: string, rating: string | null) =>
      `⭐ ${n} nuove recensioni${rating ? ` (media ${rating})` : ""}`,
    waClosing: "Vi allego il report completo. Per qualsiasi cosa sono qui 🙂",
    locale: "it-IT",
  },
  en: {
    header: "MONTHLY REPORT",
    visits: "People who saw the site",
    calls: "Called you from Google",
    directions: "Asked for directions",
    reviews: "New reviews",
    firstMonth: "First month — this is the baseline",
    same: "same as last month",
    vsPrev: "vs last month",
    sources: "Where they came from",
    done: "What we did this month",
    next: "What we do next",
    footer: "FENTRIQ · SOFTWARE DEVELOPMENT STUDIO",
    waGreeting: (month: string, client: string) =>
      `Good morning! 👋 Here is the ${month} report for ${client}.`,
    waVisits: (n: string) => `📈 ${n} people saw the site`,
    waCalls: (n: string) => `📞 ${n} called you from Google`,
    waDirections: (n: string) => `📍 ${n} asked for directions`,
    waReviews: (n: string, rating: string | null) =>
      `⭐ ${n} new reviews${rating ? ` (${rating} average)` : ""}`,
    waClosing: "The full report is attached. Anything you need, I'm here 🙂",
    locale: "en-US",
  },
} as const;

/** Source labels are stored per report; these are the defaults we offer. */
export const sourceLabels = {
  it: { google: "Ricerca Google", direct: "Diretto", social: "Social e QR" },
  en: { google: "Google Search", direct: "Direct", social: "Social & QR" },
} as const;
