import type { Content } from './types';

export const en: Content = {
  meta: {
    title: 'Yago Ramires — Frontend Developer',
    description:
      'Frontend developer with five years of experience in React, Next.js and TypeScript. Production platforms for the Paraná State Government and PUCPR.',
  },
  nav: {
    skipToContent: 'Skip to content',
    otherLocale: 'pt',
    otherLocaleLabel: 'PT',
    otherLocaleAria: 'View this page in Portuguese',
  },
  hero: {
    eyebrow: 'Frontend Developer · Rio de Janeiro · Remote',
    nameTop: 'Yago',
    nameBottom: 'Ramires',
    lead: 'Five years turning product into interface. Today I build and maintain education platforms for the Paraná State Government and PUCPR in Next.js and TypeScript.',
    statValue: '+30%',
    statLabel: 'increase in team delivery capacity',
  },
  perfil: {
    label: 'Profile',
    heading: 'I work on software people already use',
    body: 'My day splits between shipping new features, maintaining what is already live and leaving the code better than I found it. Production software forgives no shortcuts, and that is exactly where I like to be.',
    pillars: [
      {
        title: 'Production product',
        text: 'New features in Next.js and TypeScript applications consuming REST APIs, with React Query handling the data layer.',
      },
      {
        title: 'Maintenance and refactoring',
        text: 'Bug fixing and refactoring in existing codebases without stalling the team — that is how I helped raise delivery capacity by around 30%.',
      },
      {
        title: 'Automated testing',
        text: 'Vitest for units and Playwright for end-to-end flows, covering the path users actually take.',
      },
    ],
  },
  experiencia: {
    label: 'Experience',
    heading: 'Where I have been',
    items: [
      {
        role: 'Mid-level Frontend Developer',
        company: 'Radhark Tech',
        period: 'Feb 2024 — present',
        mode: 'Remote',
        stack: 'Next.js · React · TypeScript · Tailwind CSS · React Query',
        bullets: [
          'Helped raise the team delivery capacity by around 30%, working across several fronts at once.',
          'Build and maintain Fluência Paraná, the Paraná State Government education platform, and Carreira Médica, from PUCPR.',
          'Write tests with Vitest and Playwright and take part in code review across the team.',
        ],
      },
      {
        role: 'Process automation',
        company: 'D2B Representações',
        period: '2021 — present',
        mode: 'Remote, alongside main role',
        stack: 'Automation · Systems integration · VBA',
        bullets: [
          'Built automations that download invoice XML files from around six manufacturers, import the data and register orders on their own.',
          'Developed VBA macros that cut hours of manual data entry per month from the admin routine.',
        ],
      },
    ],
  },
  producao: {
    label: 'In production',
    heading: 'Software that is already live',
    intro: 'Two products with real users on the other side. The code is proprietary, so the link goes straight to what is running.',
    closedSource: 'Proprietary code',
    visit: 'Visit live site',
    cases: {
      fluencia: {
        role: 'Development and maintenance',
        description:
          'Digital education platform for the state of Paraná, used by the public school network for school management. I work on new features, bug fixing and refactoring.',
      },
      carreira: {
        role: 'Development and maintenance',
        description:
          'Platform from Pontifícia Universidade Católica do Paraná focused on medical careers, with content and learning tracks for students and professionals.',
      },
    },
  },
  projetos: {
    label: 'Side projects',
    heading: 'Things I built on my own',
    codeLabel: 'Code',
    demoLabel: 'Demo',
    noDemo: 'No public demo',
    items: {
      'rad-poker': {
        description: 'Scrum poker for remote team estimation: room, voting and synchronised reveal.',
      },
      'barber-shop': {
        description: 'Booking system for a barber shop, covering services, time slots and customers.',
      },
      d2b: {
        description: 'Sales platform with a catalogue per manufacturer, per-customer discounts and order generation.',
      },
    },
  },
  stack: {
    label: 'Stack',
    heading: 'What I work with',
    groups: [
      { title: 'Languages', items: ['TypeScript', 'JavaScript (ES6+)'] },
      { title: 'Frameworks', items: ['Next.js', 'React', 'React Native'] },
      { title: 'Interface', items: ['Tailwind CSS', 'styled-components', 'shadcn/ui', 'Material UI', 'SASS'] },
      {
        title: 'State and data',
        items: ['React Query', 'Context API', 'Redux', 'Zustand', 'REST APIs', 'Firebase', 'Supabase', 'Prisma'],
      },
      { title: 'Testing', items: ['Vitest', 'Playwright', 'Testing Library'] },
      { title: 'Tooling', items: ['Git', 'Docker', 'Vercel', 'Figma', 'Storybook', 'CI/CD'] },
    ],
  },
  contato: {
    label: 'Contact',
    heading: 'Let us talk',
    lead: 'I am looking for a remote mid-level or senior frontend role. Email and LinkedIn get the fastest reply.',
    resume: 'Download résumé (PDF)',
    links: [
      { label: 'Email', value: 'yago.ramiresx@gmail.com', href: 'mailto:yago.ramiresx@gmail.com' },
      { label: 'LinkedIn', value: '/in/yagoramires', href: 'https://www.linkedin.com/in/yagoramires/' },
      { label: 'GitHub', value: '@yagoramires', href: 'https://github.com/yagoramires' },
      { label: 'WhatsApp', value: '+55 21 96971-1937', href: 'https://wa.me/5521969711937' },
    ],
  },
  footer: 'Yago Ramires · 2026 · built with Next.js, TypeScript and Tailwind CSS',
};
