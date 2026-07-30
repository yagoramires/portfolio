import type { CaseSlug, ProjectSlug } from './projects';

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
    statValue: string;
    statLabel: string;
  };
  perfil: {
    label: string;
    heading: string;
    body: string;
    pillars: { title: string; text: string }[];
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
  producao: {
    label: string;
    heading: string;
    intro: string;
    closedSource: string;
    visit: string;
    visitAria: string;
    cases: Record<CaseSlug, { role: string; description: string }>;
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
  footer: string;
};
