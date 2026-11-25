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
    brandAria: 'Back to top',
  },
  hero: {
    eyebrow: 'Frontend Developer · Rio de Janeiro · Remote',
    nameTop: 'Yago',
    nameBottom: 'Ramires',
    lead: 'Five years turning product into interface. Today I build and maintain education platforms for the Paraná State Government and PUCPR in Next.js and TypeScript.',
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
    stats: [
      { value: '{years}', unit: 'years', label: 'building for the web, since 2021' },
      { value: '+30%', label: 'team delivery capacity' },
      { value: '2', unit: 'platforms', label: 'in production, with real users' },
      { value: '6', unit: 'apps', label: 'of my own, shipped' },
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
  servicos: {
    label: 'What I do',
    intro: 'From the first component to the last test.',
    skip: 'Skip to the next section',
  },
  processo: {
    heading: 'From first brief\nto long after launch',
    items: [
      { title: 'Understand', text: 'What people need, and what done looks like.' },
      { title: 'Design', text: 'Figma screens and components before any code.' },
      { title: 'Architect', text: 'Data, state and APIs mapped out first.' },
      { title: 'Build', text: 'Next.js and TypeScript, in small reviewed PRs.' },
      { title: 'Test', text: 'Vitest and Playwright on the paths people use.' },
      { title: 'Maintain', text: 'When something breaks, I fix it. Then keep improving.' },
    ],
  },
  trabalhos: {
    label: 'Selected work',
    heading: 'Work I have had a hand in',
    visit: 'Visit',
    visitAria: 'Open {project}',
    items: {
      carreira: {
        meta: 'PUCPR · Built at Radhark Tech',
        description: 'Medical-career platform from PUCPR, with content and learning tracks for students and doctors.',
      },
      aira: {
        meta: 'Google Cloud · Open-source contribution',
        description: 'Open-source experiment by Google Cloud education engineers that helps teachers spot reading gaps.',
      },
      yield: {
        meta: 'macOS and Windows · My own',
        description: 'Local-first personal finance: spending, subscriptions, portfolio and stock tax, with read-only Open Finance.',
      },
      pump: {
        meta: 'PWA · My own',
        description: 'Workout and diet on the phone. No account, and the data never leaves the device.',
      },
      neyhub: {
        meta: 'macOS · My own',
        description: 'A store and hub for my menu bar apps: install, update and use each one in one place.',
      },
    },
  },
  lema: {
    label: 'My motto',
    line1: 'Production',
    line2: 'forgives',
    accent: 'nothing.',
    hint: 'Hover to read the honest version',
    honest: 'Tests forgive a lot.',
  },
  fora: {
    label: 'Off the clock',
    aside: 'Music and games',
    heading: 'After hours',
    musicLabel: 'On repeat',
    openSpotify: 'Open on Spotify',
    gamesLabel: 'Playing',
    now: 'Now',
    next: 'Next',
    // fill these in to show the section
    spotifyEmbed: null,
    games: [],
  },
  projetos: {
    label: 'Side projects',
    heading: 'Things I built on my own',
    codeLabel: 'Code',
    demoLabel: 'Demo',
    codeAria: '{project} source code on GitHub',
    demoAria: '{project} live demo',
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
  ui: {
    available: 'Open to remote roles',
    menu: 'Menu',
    menuOpen: 'Open menu',
    menuClose: 'Close',
    menuLabel: 'Site menu',
    marquee: 'Frontend Developer',
    dockLabel: 'Language and résumé',
    dockCv: 'CV',
    ctaPrimary: "Let's talk",
    ctaSecondary: 'See the work',
    city: 'Rio de Janeiro',
    behindLondon: '{n} hours behind London',
    asides: {
      perfil: 'Rio de Janeiro, working remotely',
      servicos: 'Day to day',
      trabalhos: 'Team and personal',
      projetos: 'Built on my own',
      experiencia: 'Since 2021',
      contato: 'Rio de Janeiro, BRT (UTC−3)',
    },
    yearN: 'Year {n}',
    yearsIn: '{n} years in',
    now: 'Now',
    history: 'History',
    version: 'Version',
    localTime: 'Local time',
    elsewhere: 'Elsewhere',
  },
  footer: 'Yago Ramires · 2026 · built with Next.js, TypeScript and Tailwind CSS',
};
