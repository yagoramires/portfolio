import type { Content } from './types';

export const pt: Content = {
  meta: {
    title: 'Yago Ramires — Desenvolvedor Frontend',
    description:
      'Desenvolvedor frontend com cinco anos de experiência em React, Next.js e TypeScript. Plataformas em produção para o Governo do Paraná e a PUCPR.',
  },
  nav: {
    skipToContent: 'Pular para o conteúdo',
    otherLocale: 'en',
    otherLocaleLabel: 'EN',
    otherLocaleAria: 'Ver esta página em inglês',
  },
  hero: {
    eyebrow: 'Desenvolvedor Frontend · Rio de Janeiro · Remoto',
    nameTop: 'Yago',
    nameBottom: 'Ramires',
    lead: 'Cinco anos transformando produto em interface. Hoje construo e sustento plataformas de educação do Governo do Paraná e da PUCPR em Next.js e TypeScript.',
    statValue: '+30%',
    statLabel: 'de capacidade de entrega do time',
  },
  perfil: {
    label: 'Perfil',
    heading: 'Trabalho em software que já tem gente usando',
    body: 'Meu dia se divide entre entregar funcionalidade nova, sustentar o que já está no ar e deixar o código melhor do que encontrei. Produto em produção não perdoa atalho, e é exatamente aí que eu gosto de estar.',
    pillars: [
      {
        title: 'Produto em produção',
        text: 'Funcionalidade nova em aplicações Next.js e TypeScript que consomem APIs REST, com React Query cuidando dos dados.',
      },
      {
        title: 'Sustentação e refatoração',
        text: 'Correção de bug e refatoração em base existente sem travar a entrega do time — foi assim que ajudei a subir a capacidade em cerca de 30%.',
      },
      {
        title: 'Teste automatizado',
        text: 'Vitest para unidade e Playwright para fluxo ponta a ponta, cobrindo o caminho que o usuário realmente percorre.',
      },
    ],
  },
  experiencia: {
    label: 'Experiência',
    heading: 'Onde eu estive',
    items: [
      {
        role: 'Desenvolvedor Frontend Pleno',
        company: 'Radhark Tech',
        period: 'Fev 2024 — atual',
        mode: 'Remoto',
        stack: 'Next.js · React · TypeScript · Tailwind CSS · React Query',
        bullets: [
          'Ajudei a aumentar a capacidade de entrega do time em cerca de 30%, atuando em várias frentes ao mesmo tempo.',
          'Desenvolvo e mantenho o Fluência Paraná, plataforma de educação do Governo do Paraná, e o Carreira Médica, da PUCPR.',
          'Escrevo testes com Vitest e Playwright e participo do code review das entregas do time.',
        ],
      },
      {
        role: 'Automação de processos',
        company: 'D2B Representações',
        period: '2021 — atual',
        mode: 'Remoto, em paralelo',
        stack: 'Automação · Integração de sistemas · VBA',
        bullets: [
          'Criei automações que baixam os XMLs de NF-e de cerca de seis indústrias, importam os dados e cadastram os pedidos sozinhas.',
          'Desenvolvi macros em VBA que eliminaram horas de digitação por mês na rotina administrativa.',
        ],
      },
    ],
  },
  producao: {
    label: 'Em produção',
    heading: 'Software que já está no ar',
    intro: 'Dois produtos com usuário real do outro lado. O código é fechado, então o link vai direto para o que está rodando.',
    closedSource: 'Código proprietário',
    visit: 'Ver no ar',
    cases: {
      fluencia: {
        role: 'Desenvolvimento e sustentação',
        description:
          'Plataforma de educação digital do estado do Paraná, usada pela rede pública na gestão escolar. Atuo em funcionalidade nova, correção de bug e refatoração.',
      },
      carreira: {
        role: 'Desenvolvimento e sustentação',
        description:
          'Plataforma da Pontifícia Universidade Católica do Paraná voltada à carreira médica, com conteúdo e trilhas para estudantes e profissionais.',
      },
    },
  },
  projetos: {
    label: 'Projetos pessoais',
    heading: 'Coisas que construí por fora',
    codeLabel: 'Código',
    demoLabel: 'Demo',
    codeAria: 'Código de {project} no GitHub',
    demoAria: 'Demo de {project}',
    noDemo: 'Sem demo pública',
    items: {
      'rad-poker': {
        description: 'Scrum poker para estimativa em time remoto: sala, votação e revelação sincronizada.',
      },
      'barber-shop': {
        description: 'Sistema de agendamento para barbearia, com cadastro de serviço, horário e cliente.',
      },
      d2b: {
        description: 'Plataforma de vendas com catálogo por indústria, desconto por cliente e geração de pedido.',
      },
    },
  },
  stack: {
    label: 'Stack',
    heading: 'Com o que eu trabalho',
    groups: [
      { title: 'Linguagens', items: ['TypeScript', 'JavaScript (ES6+)'] },
      { title: 'Frameworks', items: ['Next.js', 'React', 'React Native'] },
      { title: 'Interface', items: ['Tailwind CSS', 'styled-components', 'shadcn/ui', 'Material UI', 'SASS'] },
      {
        title: 'Estado e dados',
        items: ['React Query', 'Context API', 'Redux', 'Zustand', 'APIs REST', 'Firebase', 'Supabase', 'Prisma'],
      },
      { title: 'Testes', items: ['Vitest', 'Playwright', 'Testing Library'] },
      { title: 'Ferramentas', items: ['Git', 'Docker', 'Vercel', 'Figma', 'Storybook', 'CI/CD'] },
    ],
  },
  contato: {
    label: 'Contato',
    heading: 'Vamos conversar',
    lead: 'Busco vaga remota de frontend pleno ou sênior. Respondo rápido no e-mail e no LinkedIn.',
    resume: 'Baixar currículo em PDF',
    links: [
      { label: 'E-mail', value: 'yago.ramiresx@gmail.com', href: 'mailto:yago.ramiresx@gmail.com' },
      { label: 'LinkedIn', value: '/in/yagoramires', href: 'https://www.linkedin.com/in/yagoramires/' },
      { label: 'GitHub', value: '@yagoramires', href: 'https://github.com/yagoramires' },
      { label: 'WhatsApp', value: '(21) 96971-1937', href: 'https://wa.me/5521969711937' },
    ],
  },
  footer: 'Yago Ramires · 2026 · feito em Next.js, TypeScript e Tailwind CSS',
};
