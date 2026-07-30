export type CaseSlug = 'fluencia' | 'carreira';
export type ProjectSlug = 'rad-poker' | 'barber-shop' | 'd2b';

export type Case = {
  slug: CaseSlug;
  name: string;
  client: string;
  url: string;
  stack: string[];
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  repo: string;
  demo: string | null;
  stack: string[];
};

export const cases: Case[] = [
  {
    slug: 'fluencia',
    name: 'Fluência Paraná',
    client: 'Governo do Paraná',
    url: 'https://gestaoescolar.escoladigital.pr.gov.br/',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React Query'],
  },
  {
    slug: 'carreira',
    name: 'Carreira Médica',
    client: 'PUCPR',
    url: 'https://carreiramedica.pucpr.br/',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React Query'],
  },
];

export const projects: Project[] = [
  {
    slug: 'rad-poker',
    name: 'Rad Poker',
    repo: 'https://github.com/yagoramires/rad-poker',
    demo: 'https://rad-poker.vercel.app',
    stack: ['TypeScript', 'React'],
  },
  {
    slug: 'barber-shop',
    name: 'Barber Shop',
    repo: 'https://github.com/yagoramires/barber-shop',
    demo: 'https://barber-shop-rouge.vercel.app',
    stack: ['TypeScript', 'React', 'Firebase'],
  },
  {
    slug: 'd2b',
    name: 'D2B Sales Platform',
    repo: 'https://github.com/yagoramires/d2b-sales-platform-v2',
    demo: null,
    stack: ['TypeScript', 'React', 'Firebase'],
  },
];
