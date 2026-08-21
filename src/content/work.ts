import type { Locale } from "@/i18n/routing";

export interface CaseStudy {
  slug: string;
  /** Brand/product name — locale-independent. */
  title: string;
  year: number;
  featured: boolean;
  /**
   * client  — a paying client; the site is theirs and live.
   * concept — built on our own initiative for a local business that has NOT
   *           hired us. Shown honestly as a proposal, never as a client.
   * lab     — in-house products and demos.
   */
  kind: "client" | "concept" | "lab";
  /** Short business line shown on cards, e.g. "Ristorante di pesce · Torvaianica". */
  sector: Record<Locale, string>;
  /** Optional cover image under /public/work. Falls back to a branded tile. */
  cover?: string;
  /** Optional mobile screenshot under /public/work/mobile — same site, phone. */
  mobile?: string;
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
    slug: "nonsolofitness",
    title: "Nonsolofitness",
    year: 2026,
    featured: true,
    kind: "client",
    sector: {
      it: "Palestra · Torvaianica (RM)",
      en: "Gym · Torvaianica (RM)",
    },
    cover: "/work/nonsolofitness.jpg",
    mobile: "/work/mobile/nonsolofitness.jpg",
    stack: ["Web", "SEO locale", "i18n"],
    links: { live: "https://www.nonsolofitnesstorvaianica.com" },
    roles: {
      it: ["Sito bilingue", "SEO locale", "Funnel recensioni QR"],
      en: ["Bilingual site", "Local SEO", "QR review funnel"],
    },
    badge: { it: "Online", en: "Live" },
    summary: {
      it: "Sito bilingue per la palestra di Davide e Dominica: una pagina dedicata a ogni corso, SEO locale e un circuito di recensioni con QR stampabili.",
      en: "Bilingual site for Davide and Dominica's gym: a dedicated page per course, local SEO and a review loop driven by printable QR signs.",
    },
    sections: {
      problem: {
        it: "Una palestra di quartiere con 4,5 su Google ma poca visibilità online: corsi, sala pesi e listino difficili da comunicare, e nessun modo semplice per trasformare i clienti contenti in recensioni.",
        en: "A neighbourhood gym rated 4.5 on Google but with little online visibility: courses, weight room and pricing hard to communicate, and no easy way to turn happy members into reviews.",
      },
      solution: {
        it: "Un sito statico velocissimo, italiano e inglese, con una landing per ogni corso — sala pesi, boxe, pilates, funzionale — listino chiaro e un percorso recensioni: cartelli QR in palestra che portano al posto giusto.",
        en: "A very fast static site in Italian and English, with a landing page per course — weight room, boxing, pilates, functional training — clear pricing and a review funnel: QR signs in the gym that lead to the right place.",
      },
      build: {
        it: "Zero richieste esterne, dati strutturati per Google, e cartelli QR che puntano a un link aggiornabile: se cambia la destinazione, non si ristampa nulla.",
        en: "Zero external requests, structured data for Google, and QR signs pointing at an updatable link: if the destination changes, nothing gets reprinted.",
      },
      result: {
        it: "Online su nonsolofitnesstorvaianica.com, con contenuti e listino forniti direttamente dal cliente.",
        en: "Live at nonsolofitnesstorvaianica.com, with content and pricing supplied directly by the client.",
      },
    },
  },
  {
    slug: "aulon-detailing",
    title: "Aulon Detailing",
    year: 2026,
    featured: false,
    kind: "client",
    sector: {
      it: "Detailing auto · Melrose Park, Illinois (USA)",
      en: "Car detailing · Melrose Park, Illinois (USA)",
    },
    cover: "/work/aulon-detailing.jpg",
    mobile: "/work/mobile/aulon-detailing.jpg",
    stack: ["Web", "Prenotazioni", "Pagamenti"],
    links: { live: "https://aulondetailing.com" },
    roles: {
      it: ["Sito e prenotazioni", "Pagamenti online", "Pannello gestionale"],
      en: ["Site and booking", "Online payments", "Admin panel"],
    },
    badge: { it: "Online", en: "Live" },
    summary: {
      it: "Sito con prenotazione online, acconto tramite pagamento sicuro e pannello per gestire gli appuntamenti. Il primo cliente entrato con la Formula.",
      en: "Website with online booking, a secured deposit at checkout and an admin panel to manage appointments. The first client to join through the Formula.",
    },
    sections: {
      problem: {
        it: "Un servizio di detailing premium su appuntamento, con prenotazioni gestite a voce e nessun modo per bloccare davvero uno slot: chi non si presentava lasciava un buco in agenda.",
        en: "A premium detailing service by appointment, with bookings handled by phone and no way to actually hold a slot: no-shows left holes in the calendar.",
      },
      solution: {
        it: "Un sito dove il cliente sceglie il pacchetto, prenota il giorno e versa un piccolo acconto che conferma l'appuntamento e viene scalato dal totale. L'acconto filtra da solo chi non è serio.",
        en: "A site where the customer picks a package, books a day and leaves a small deposit that confirms the appointment and is applied to the final price. The deposit filters out no-shows by itself.",
      },
      build: {
        it: "Prenotazioni con pagamento sicuro, pannello riservato per vedere e gestire gli appuntamenti, contenuti (prezzi, pacchetti, galleria, recensioni) modificabili dal titolare senza toccare codice.",
        en: "Bookings with secure payment, a private panel to see and manage appointments, and content (prices, packages, gallery, reviews) the owner can edit without touching code.",
      },
      result: {
        it: "Online su aulondetailing.com, dagli Stati Uniti: il primo cliente entrato con la Formula e la prova che funziona anche a distanza.",
        en: "Live at aulondetailing.com, from the United States: the first client to join through the Formula, and proof it works remotely too.",
      },
    },
  },
  {
    slug: "schiano",
    title: "Schiano Cantina & Cucina",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Ristorante di pesce · Torvaianica (RM)",
      en: "Seafood restaurant · Torvaianica (RM)",
    },
    cover: "/work/schiano.jpg",
    mobile: "/work/mobile/schiano.jpg",
    stack: ["Web", "Design", "SEO"],
    links: { live: "https://schiano.vercel.app" },
    roles: {
      it: ["Sito su misura", "Brand digitale", "SEO"],
      en: ["Custom website", "Digital brand", "SEO"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Sito editoriale per un ristorante di pesce sul mare dal 1960: narrativa a scroll, carta strutturata e prenotazione integrata nei canali che il locale già usa.",
      en: "Editorial website for a seaside fish restaurant open since 1960: scroll-driven storytelling, a structured menu and booking wired into the channels the venue already uses.",
    },
    sections: {
      problem: {
        it: "Un'istituzione del litorale romano — dal 1960, 4,5 su Google con oltre 2.300 recensioni — con una presenza digitale sparsa tra portali e social, non all'altezza della sala.",
        en: "An institution on the Roman coast — open since 1960, 4.5 on Google with 2,300+ reviews — whose digital presence was scattered across portals and social media, far below the standard of the dining room.",
      },
      solution: {
        it: "Un sito scuro, fotografico, con narrativa a scroll: Storia, Cucina, Cantina, Esperienza, Eventi. La carta è una pagina strutturata, e la prenotazione porta ai canali reali del ristorante: telefono, WhatsApp e Google.",
        en: "A dark, photographic site with scroll-driven storytelling: Story, Kitchen, Cellar, Experience, Events. The menu is a structured page, and booking routes to the restaurant's real channels: phone, WhatsApp and Google.",
      },
      build: {
        it: "Design su misura, niente template: animazioni fluide che rispettano le preferenze di movimento dell'utente, foto a tutto schermo, menù gestito come dati e dati strutturati per Google.",
        en: "Custom design, no templates: smooth animations that honour the user's motion preferences, full-bleed photography, the menu managed as data and structured data for Google.",
      },
      result: {
        it: "Un sito online all'altezza del locale: veloce, curato e costruito per portare ogni visita verso la prenotazione.",
        en: "A live site that matches the venue: fast, polished and built to walk every visit toward a booking.",
      },
    },
  },
  {
    slug: "ottica-ramunno",
    title: "Ottica Ramunno",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Ottica · Torvaianica (RM)",
      en: "Optician · Torvaianica (RM)",
    },
    stack: ["Web app", "AR", "Gestionale"],
    links: {},
    roles: {
      it: ["Prodotto web", "Prova virtuale AR", "Gestionale"],
      en: ["Web product", "AR virtual try-on", "Admin panel"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Prova occhiali virtuale in tempo reale dal browser — senza app e senza registrazione — con catalogo filtrabile e pannello gestionale, per un'ottica attiva dal 1990.",
      en: "Real-time virtual glasses try-on in the browser — no app, no sign-up — with a filterable catalogue and an admin panel, for an optician's shop open since 1990.",
    },
    sections: {
      problem: {
        it: "Per provare una montatura bisogna entrare in negozio. Un'ottica di quartiere attiva dal 1990 voleva portare online il catalogo e far provare gli occhiali anche da casa.",
        en: "Trying on frames means walking into the shop. A neighbourhood optician's, open since 1990, wanted its catalogue online and a way for people to try frames from home.",
      },
      solution: {
        it: "Catalogo online con filtri per forma, colore e calibro, e prova virtuale con la fotocamera direttamente dal browser. Il video non lascia mai il dispositivo: tutto il tracciamento avviene in locale, per privacy.",
        en: "An online catalogue with shape, colour and size filters, plus a camera-based virtual try-on right in the browser. The video never leaves the device: all tracking runs locally, by design, for privacy.",
      },
      build: {
        it: "Tracciamento del volto in tempo reale nel browser, montature rese in 3D sul viso, e un pannello riservato allo staff per gestire catalogo, foto e richieste di appuntamento. Funziona anche su iPhone, dove il tracciamento in-browser è notoriamente difficile.",
        en: "Real-time face tracking in the browser, frames rendered in 3D on the face, and a private staff panel to manage the catalogue, photos and appointment requests. It works on iPhone too, where in-browser tracking is notoriously hard.",
      },
      result: {
        it: "La piattaforma è completa e funzionante; si lancia con il caricamento del catalogo reale del negozio. La stessa base è pronta per essere offerta ad altre ottiche.",
        en: "The platform is complete and working; it launches once the shop's real catalogue is loaded. The same foundation is ready to be offered to other opticians.",
      },
    },
  },
  {
    slug: "fedele",
    title: "Fedele Ristorante",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Cucina di mare · Torvaianica (RM)",
      en: "Seafood restaurant · Torvaianica (RM)",
    },
    cover: "/work/fedele.jpg",
    mobile: "/work/mobile/fedele.jpg",
    stack: ["Web", "Brand", "WhatsApp"],
    links: {},
    roles: {
      it: ["Brand completo", "Sito one-page", "Prenotazione WhatsApp"],
      en: ["Full brand", "One-page site", "WhatsApp booking"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Da zero presenza web a un sito che trasforma 4,8★ e 309 recensioni in prenotazioni via WhatsApp, a un tocco di distanza.",
      en: "From no web presence at all to a site that turns 4.8★ and 309 reviews into WhatsApp bookings, one tap away.",
    },
    sections: {
      problem: {
        it: "4,8 su Google, Travelers' Choice 2025, la terrazza sul mare — e nessun sito. Tutto il traffico digitale passava da portali di terzi, con dati incoerenti e nessun menù consultabile.",
        en: "4.8 on Google, Travelers' Choice 2025, a terrace over the sea — and no website. All digital traffic went through third-party listings with inconsistent data and no menu to browse.",
      },
      solution: {
        it: "Un one-page mobile-first con WhatsApp come canale principale: pulsante di prenotazione con messaggio precompilato, stato aperto/chiuso in tempo reale e la riprova sociale (recensioni, riconoscimenti) come spina dorsale della pagina.",
        en: "A mobile-first one-pager with WhatsApp as the primary channel: a booking button with a pre-filled message, live open/closed status, and social proof (reviews, awards) as the backbone of the page.",
      },
      build: {
        it: "Prima il brand — logo, palette, tipografia — poi il sito: veloce, con dati strutturati completi di orari reali e anteprime curate per le condivisioni su WhatsApp.",
        en: "Brand first — logo, palette, typography — then the site: fast, with structured data including real opening hours and previews crafted for WhatsApp shares.",
      },
      result: {
        it: "Pronto al lancio sul dominio del ristorante: ogni visita finisce a un tocco dalla prenotazione.",
        en: "Ready to launch on the restaurant's domain: every visit ends one tap away from a booking.",
      },
    },
  },
  {
    slug: "mecs-village",
    title: "Mecs Village",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Stabilimento balneare · Lido di Ostia (RM)",
      en: "Beach club · Lido di Ostia (RM)",
    },
    cover: "/work/mecs-village.jpg",
    mobile: "/work/mobile/mecs-village.jpg",
    stack: ["Web", "Design", "Privacy"],
    links: { live: "https://mecs-village.pages.dev" },
    roles: {
      it: ["Sito vetrina", "Identità digitale"],
      en: ["Showcase site", "Digital identity"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Vetrina digitale per uno stabilimento con cucina di mare, dal 1997 sul litorale: veloce, senza cookie, con le foto vere del posto.",
      en: "Digital showcase for a beach club with a seafood kitchen, on the coast since 1997: fast, cookie-free, with real photos of the place.",
    },
    sections: {
      problem: {
        it: "Un'attività viva soprattutto su Instagram, senza una casa digitale propria dove raccontarsi e farsi trovare.",
        en: "A business that lived mostly on Instagram, with no digital home of its own to tell its story and be found.",
      },
      solution: {
        it: "Un sito vetrina con la giornata al Mecs, la storia dal 1997, la galleria e i contatti — il tramonto dentro le lettere del logo come firma visiva.",
        en: "A showcase site with the day at Mecs, the story since 1997, the gallery and contacts — the sunset inside the logo's letters as the visual signature.",
      },
      build: {
        it: "Completamente statico: niente cookie, niente script di terzi, intestazioni di sicurezza rigorose e contenuti gestiti come dati. Ogni informazione non confermata dal cliente resta fuori, per costruzione.",
        en: "Fully static: no cookies, no third-party scripts, strict security headers and content managed as data. Anything not confirmed by the client stays out, by construction.",
      },
      result: {
        it: "Online in anteprima, in attesa del dominio definitivo dell'attività.",
        en: "Live in preview, awaiting the business's final domain.",
      },
    },
  },
  {
    slug: "happiness-la-casetta",
    title: "Happiness La Casetta",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Pizzeria e birreria · Torvaianica (RM)",
      en: "Pizzeria & beer house · Torvaianica (RM)",
    },
    cover: "/work/happiness.jpg",
    mobile: "/work/mobile/happiness-la-casetta.jpg",
    stack: ["Web", "i18n", "Privacy"],
    links: {},
    roles: {
      it: ["Sito bilingue", "Zero dipendenze"],
      en: ["Bilingual site", "Zero dependencies"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Sito bilingue, senza cookie e senza framework, per la pizzeria e birreria di Viale Danimarca, dal 1986.",
      en: "A bilingual, cookie-free, framework-free website for the pizzeria and beer house on Viale Danimarca, since 1986.",
    },
    sections: {
      problem: {
        it: "Una pizzeria storica — forno a legna dal 1986 — conosciuta da tutti in zona ma senza un sito proprio: menù, orari e contatti sparsi tra social e portali.",
        en: "A historic pizzeria — wood-fired oven since 1986 — that everyone in the area knows, but with no site of its own: menu, hours and contacts scattered across social media and listings.",
      },
      solution: {
        it: "Un sito artigianale come la pizza: HTML scritto a mano, italiano e inglese completi, menù, orari e contatti, mappa caricata solo su richiesta e modulo con protezione anti-spam. Zero cookie.",
        en: "A site as handcrafted as the pizza: hand-written HTML, complete Italian and English versions, menu, hours and contacts, a map that loads only on demand and a spam-protected form. Zero cookies.",
      },
      build: {
        it: "Nessun framework e nessuna dipendenza: carica in un lampo e può vivere su qualsiasi hosting, per sempre. Sicurezza rigorosa e dati strutturati per Google inclusi.",
        en: "No framework and no dependencies: it loads instantly and can live on any hosting, forever. Strict security and structured data for Google included.",
      },
      result: {
        it: "Pronto al lancio: quarant'anni di serate felici, finalmente anche online.",
        en: "Ready to launch: forty years of happy evenings, finally online too.",
      },
    },
  },
  {
    slug: "cuocimi",
    title: "Cuocimi",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Braceria, pesce e pizza · Torvaianica (RM)",
      en: "Grill, seafood & pizza · Torvaianica (RM)",
    },
    cover: "/work/cuocimi.jpg",
    mobile: "/work/mobile/cuocimi.jpg",
    stack: ["Web", "Brand", "Motion"],
    links: { live: "https://cuocimi.pages.dev" },
    roles: {
      it: ["Sito vetrina", "Logo animato"],
      en: ["Showcase site", "Animated logo"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Il logo diventa animazione: la padella vola al suo posto come la O di CUOCIMI. Vetrina statica per la braceria sul lungomare di Torvaianica.",
      en: "The logo becomes the animation: the frying pan lands in place as the O of CUOCIMI. A static showcase for the grill house on the Torvaianica seafront.",
    },
    sections: {
      problem: {
        it: "Carne alla brace, pesce e pizza romana a dieci metri dal mare, oltre 300 recensioni — e una presenza digitale affidata solo ai portali di consegna.",
        en: "Charcoal-grilled meat, seafood and Roman pizza ten metres from the sea, 300+ reviews — and a digital presence that lived only on delivery portals.",
      },
      solution: {
        it: "Una vetrina con il menù organizzato come quello stampato — brace, mare, pizza e fritti — recensioni vere di Google e una mappa disegnata a mano, senza servizi di terzi.",
        en: "A showcase with the menu organised like the printed one — grill, sea, pizza and fried — real Google reviews and a hand-drawn map, with no third-party services.",
      },
      build: {
        it: "Logo rivettorializzato a mano in cinque varianti e trasformato in preloader: la padella cade sulla linea di brace e vola al suo posto. Tutto statico, zero cookie.",
        en: "The logo hand-re-vectorised in five variants and turned into the preloader: the pan drops onto the ember line and flies into place. Fully static, zero cookies.",
      },
      result: {
        it: "Il sito è online in anteprima, con il nostro footer già firmato: manca solo il via del locale.",
        en: "The site is live as a preview, our footer already signed: it only needs the venue's go-ahead.",
      },
    },
  },
  {
    slug: "zampami",
    title: "Zampami",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Negozio per animali · Torvaianica (RM)",
      en: "Pet shop · Torvaianica (RM)",
    },
    cover: "/work/zampami.jpg",
    mobile: "/work/mobile/zampami.jpg",
    stack: ["Web", "E-commerce", "Pagamenti"],
    links: {},
    roles: {
      it: ["Sito vetrina", "E-commerce attivabile", "Area clienti"],
      en: ["Showcase site", "Switchable e-commerce", "Customer area"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Vetrina di quartiere con un e-commerce completo dietro un interruttore: catalogo, carrello, pagamenti sicuri e area clienti senza password.",
      en: "A neighbourhood showcase with a full e-commerce hidden behind a switch: catalogue, cart, secure payments and a passwordless customer area.",
    },
    sections: {
      problem: {
        it: "Un negozio per animali che vuole partire da una vetrina semplice, ma senza dover rifare tutto il giorno in cui deciderà di vendere online.",
        en: "A pet shop that wants to start with a simple showcase, without rebuilding everything the day it decides to sell online.",
      },
      solution: {
        it: "Un sito con il negozio già integrato, spento da un solo interruttore: quando il cliente è pronto, si accendono catalogo, carrello, checkout e area clienti — senza toccare la vetrina.",
        en: "A site with the shop already built in, switched off by a single flag: when the client is ready, catalogue, cart, checkout and the customer area come alive — without touching the showcase.",
      },
      build: {
        it: "Pagamenti validati lato server, ordini e ricevute letti in tempo reale dal circuito di pagamento — niente database da mantenere — e accesso clienti via link email, senza password.",
        en: "Payments validated server-side, orders and receipts read live from the payment provider — no database to maintain — and customer access via email link, no passwords.",
      },
      result: {
        it: "Pronto al lancio: prima la passeggiata in vetrina, poi il negozio, quando serve.",
        en: "Ready to launch: the window-shopping stroll first, the shop itself whenever it's needed.",
      },
    },
  },
  {
    slug: "talea",
    title: "Talea Ristorante & Bistrot",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Ristorante e bistrot · Torvaianica (RM)",
      en: "Restaurant & bistrot · Torvaianica (RM)",
    },
    cover: "/work/talea.jpg",
    mobile: "/work/mobile/talea.jpg",
    stack: ["Web", "Design editoriale", "Performance"],
    links: {},
    roles: {
      it: ["Design editoriale", "Illustrazioni animate"],
      en: ["Editorial design", "Animated illustrations"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "“Inchiostro e mare”: un sito editoriale che cambia colore mentre scorri, con le illustrazioni a penna del menù che si disegnano da sole. Lighthouse 100 su tutta la linea.",
      en: "“Ink and sea”: an editorial site that shifts colour as you scroll, with the menu's pen illustrations drawing themselves. Lighthouse 100 across the board.",
    },
    sections: {
      problem: {
        it: "Un ristorante con oltre 2.200 recensioni e un'identità di carta bellissima — le illustrazioni a penna del menù — senza un equivalente digitale.",
        en: "A restaurant with 2,200+ reviews and a beautiful paper identity — the pen illustrations on its menu — with no digital counterpart.",
      },
      solution: {
        it: "Un design editoriale a blocchi di colore pieni che si fondono mentre scorri, tipografia oversize e le illustrazioni del menù ricreate e animate: si disegnano da sole sullo schermo.",
        en: "An editorial design of solid colour blocks that blend as you scroll, oversized typography and the menu illustrations recreated and animated: they draw themselves on screen.",
      },
      build: {
        it: "Tutto statico, niente dipendenze in produzione: Lighthouse desktop 100/100/100/100 e zero vulnerabilità. Il movimento si spegne da solo per chi preferisce ridurlo.",
        en: "Fully static with no production dependencies: desktop Lighthouse 100/100/100/100 and zero vulnerabilities. Motion switches itself off for users who prefer less of it.",
      },
      result: {
        it: "Pronto al lancio sul dominio del ristorante.",
        en: "Ready to launch on the restaurant's domain.",
      },
    },
  },
  {
    slug: "osteria-del-mare",
    title: "Osteria Del Mare",
    year: 2026,
    featured: false,
    kind: "concept",
    sector: {
      it: "Osteria di mare · Torvaianica (RM)",
      en: "Seafood osteria · Torvaianica (RM)",
    },
    cover: "/work/osteria-del-mare.jpg",
    mobile: "/work/mobile/osteria-del-mare.jpg",
    stack: ["Web", "Design", "Privacy"],
    links: {},
    roles: {
      it: ["Sito vetrina", "Identità digitale"],
      en: ["Showcase site", "Digital identity"],
    },
    badge: { it: "Concept", en: "Concept" },
    summary: {
      it: "Trenta coperti e prenotazione solo al telefono: un sito che rispetta com'è davvero il locale, invece di forzarlo dentro un widget.",
      en: "Thirty covers and phone-only booking: a site that respects how the place really works, instead of forcing it into a widget.",
    },
    sections: {
      problem: {
        it: "Un'osteria piccola — trenta coperti, le finestre sulla sabbia — con più di mille recensioni e nessun sito. La prenotazione vive al telefono, su due turni: così funziona, e così deve restare.",
        en: "A tiny osteria — thirty covers, windows onto the sand — with a thousand-plus reviews and no website. Booking happens by phone, over two sittings: that's how it works, and how it should stay.",
      },
      solution: {
        it: "Una vetrina sobria costruita sulla metafora della finestra sul mare: la cucina, la sala, il menù del giorno. Il telefono resta il canale di prenotazione; il sito lo racconta con chiarezza.",
        en: "A sober showcase built on the window-onto-the-sea metaphor: the kitchen, the room, the day's menu. The phone stays the booking channel; the site simply makes it clear.",
      },
      build: {
        it: "Statico e veloce, senza moduli inutili: superficie d'attacco quasi nulla. Nessun prezzo e nessun orario non verificato viene pubblicato — per scelta, non per dimenticanza.",
        en: "Static and fast, with no unnecessary forms: near-zero attack surface. No unverified price or opening hour gets published — by choice, not by omission.",
      },
      result: {
        it: "Pronto al lancio sul dominio dell'osteria.",
        en: "Ready to launch on the osteria's domain.",
      },
    },
  },
  {
    slug: "matchmood",
    title: "MatchMood",
    year: 2025,
    featured: false,
    kind: "lab",
    sector: {
      it: "Prodotto interno · Piattaforma",
      en: "In-house product · Platform",
    },
    cover: "/work/matchmood.jpg",
    mobile: "/work/mobile/matchmood.jpg",
    stack: ["Real-time", "Sandbox", "Pagamenti"],
    links: { live: "https://matchmood.dev" },
    roles: { it: ["Full-stack", "Real-time"], en: ["Full-stack", "Real-time"] },
    summary: {
      it: "Piattaforma 1v1 di coding competitivo in tempo reale, costruita da zero: sfide dal vivo, esecuzione sicura del codice e classifiche.",
      en: "Real-time 1v1 competitive coding platform built from scratch: live duels, sandboxed code execution and rankings.",
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
        it: "Partite in tempo reale, esecuzione sicura del codice in ambienti isolati, pagamenti integrati e suggerimenti generati dall'intelligenza artificiale.",
        en: "Real-time matches, sandboxed code execution in isolated environments, integrated payments and AI-generated hints.",
      },
      result: {
        it: "Online su matchmood.dev: la prova, dal vivo, di cosa sappiamo costruire quando il tempo reale conta.",
        en: "Live at matchmood.dev: living proof of what we can build when real-time matters.",
      },
    },
  },
  {
    slug: "docsense",
    title: "docSense",
    year: 2026,
    featured: false,
    kind: "lab",
    sector: {
      it: "Demo interna · IA documentale",
      en: "In-house demo · Document AI",
    },
    // No cover on purpose: the old generated SVG tile is not a real screenshot.
    stack: ["IA", "Automazione"],
    links: { repo: "https://github.com/ragesito/docSense" },
    roles: { it: ["Full-stack", "IA"], en: ["Full-stack", "AI"] },
    badge: { it: "Costruito in poche ore", en: "Built in a few hours" },
    summary: {
      it: "Pipeline IA che estrae i dati delle fatture, li concilia con il catalogo e segnala le anomalie in tempo reale. La stessa tecnica che portiamo nelle PMI.",
      en: "AI pipeline that extracts invoice data, reconciles it against a catalogue and flags anomalies in real time. The same technique we bring to SMEs.",
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
        it: "Interfaccia web reattiva, estrazione dei dati guidata dall'intelligenza artificiale e logica di conciliazione sul backend. Dal problema al prototipo funzionante in poche ore.",
        en: "Reactive web interface, AI-driven data extraction and reconciliation logic on the backend. From problem to a working prototype in a few hours.",
      },
      result: {
        it: "Un controllo che prima richiedeva ore si chiude in minuti, con le anomalie evidenziate prima che diventino un costo.",
        en: "A check that used to take hours closes in minutes, with anomalies surfaced before they become a cost.",
      },
    },
  },
];

export function getCaseStudies(): CaseStudy[] {
  return [...caseStudies].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
  );
}

export function getClientCases(): CaseStudy[] {
  return getCaseStudies().filter((c) => c.kind === "client");
}

/** Sites built on our own initiative — proposals, not client relationships. */
export function getConceptCases(): CaseStudy[] {
  return getCaseStudies().filter((c) => c.kind === "concept");
}

export function getLabCases(): CaseStudy[] {
  return getCaseStudies().filter((c) => c.kind === "lab");
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
