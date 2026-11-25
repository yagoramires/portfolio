import type { ProjectSlug, WorkSlug } from './projects';

export type Locale = 'pt' | 'en';

export type Content = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    skipToContent: string;
    otherLocale: Locale;
    otherLocaleLabel: string;
    otherLocaleAria: string;
    brandAria: string;
  };
  hero: {
    eyebrow: string;
    nameTop: string;
    nameBottom: string;
    lead: string;
  };
  perfil: {
    label: string;
    heading: string;
    body: string;
    pillars: { title: string; text: string }[];
    /** `{years}` in a value is replaced with the years since 2021 */
    stats: { value: string; unit?: string; label: string }[];
  };
  experiencia: {
    label: string;
    heading: string;
    items: {
      role: string;
      company: string;
      period: string;
      mode: string;
      stack: string;
      bullets: string[];
    }[];
  };
  servicos: {
    label: string;
    intro: string;
    skip: string;
  };
  processo: {
    heading: string;
    items: { title: string; text: string }[];
  };
  trabalhos: {
    label: string;
    heading: string;
    visit: string;
    visitAria: string;
    items: Record<WorkSlug, { meta: string; description: string }>;
  };
  lema: {
    label: string;
    line1: string;
    line2: string;
    accent: string;
    hint: string;
    honest: string;
  };
  fora: {
    label: string;
    aside: string;
    heading: string;
    musicLabel: string;
    openSpotify: string;
    gamesLabel: string;
    now: string;
    next: string;
    /** Spotify embed URL (open.spotify.com/embed/playlist/…); the section stays hidden until music or games are set */
    spotifyEmbed: string | null;
    games: { title: string; note: string; status: 'now' | 'next' }[];
  };
  projetos: {
    label: string;
    heading: string;
    codeLabel: string;
    demoLabel: string;
    codeAria: string;
    demoAria: string;
    noDemo: string;
    items: Record<ProjectSlug, { description: string }>;
  };
  stack: {
    label: string;
    heading: string;
    groups: { title: string; items: string[] }[];
  };
  contato: {
    label: string;
    heading: string;
    lead: string;
    resume: string;
    links: { label: string; value: string; href: string }[];
  };
  ui: {
    available: string;
    menu: string;
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
    marquee: string;
    dockLabel: string;
    dockCv: string;
    ctaPrimary: string;
    ctaSecondary: string;
    city: string;
    /** `{n}` = whole hours; used when Rio is behind London */
    behindLondon: string;
    asides: Record<'perfil' | 'servicos' | 'trabalhos' | 'projetos' | 'experiencia' | 'contato', string>;
    /** `{n}` = year count */
    yearN: string;
    yearsIn: string;
    now: string;
    history: string;
    version: string;
    localTime: string;
    elsewhere: string;
  };
  footer: string;
};
