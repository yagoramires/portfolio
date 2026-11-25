export type WorkSlug = 'carreira' | 'aira' | 'yield' | 'pump' | 'neyhub';
export type ProjectSlug = 'rad-poker' | 'barber-shop' | 'd2b';

export type Work = {
  slug: WorkSlug;
  name: string;
  url: string;
  image: string;
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  repo: string;
  demo: string | null;
  stack: string[];
};

export const work: Work[] = [
  { slug: 'carreira', name: 'Carreira Médica', url: 'https://carreiramedica.pucpr.br/', image: '/work/carreira.webp' },
  { slug: 'aira', name: 'AIRA', url: 'https://github.com/GoogleCloudPlatform/aira', image: '/work/aira.webp' },
  { slug: 'yield', name: 'Yield', url: 'https://github.com/yagoramires/yield', image: '/work/yield.webp' },
  { slug: 'pump', name: 'Pump', url: 'https://github.com/yagoramires/pump', image: '/work/pump.webp' },
  { slug: 'neyhub', name: 'NeyHub', url: 'https://github.com/yagoramires/neyhub', image: '/work/neyhub.webp' },
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
