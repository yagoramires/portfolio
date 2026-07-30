# Portfólio Yago Ramires — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o portfólio de 2023 por uma página única bilíngue (PT/EN) em Next 15 + TypeScript + Tailwind v4, com direção visual editorial escura e o conteúdo real do currículo.

**Architecture:** Todos os componentes são Server Components sem estado. Duas rotas estáticas (`/pt`, `/en`) geradas por `generateStaticParams` a partir de dois dicionários tipados; a troca de idioma é uma navegação real, não estado de cliente. Animação é 100% CSS nativo — sem biblioteca.

**Tech Stack:** Next 15 (App Router), React 19, TypeScript, Tailwind CSS v4, `next/font/google`. Nada além disso.

**Spec:** `docs/superpowers/specs/2026-07-29-portfolio-redesign-design.md`

## Global Constraints

- Diretório do projeto: `/Users/yagoramires/Projects/portfolio-2023`. Branch: `redesign-2026`.
- Dependências de runtime permitidas: `next`, `react`, `react-dom`. Dev: `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `@types/*`, `eslint`, `eslint-config-next`. **Nenhuma outra dependência pode ser adicionada.** Sem biblioteca de animação, de ícone, de i18n ou de formulário.
- Paleta exata: `--color-breu: #121110`, `--color-areia: #F0EBE3`, `--color-areia-mudo: #B5AFA6`, `--color-cobalto: #2B4FFF`, `--color-cobalto-claro: #9AA6FF`, `--color-painel: #1B1917`. Nenhuma outra cor entra no CSS.
- Fontes exatas: Bricolage Grotesque (display), Instrument Sans (corpo), Geist Mono (utilitária). Nenhuma outra família.
- Todo texto visível vem de `src/content/pt.ts` ou `src/content/en.ts`. **Nenhuma string literal em português ou inglês dentro de componente.**
- Toda animação fica dentro de `@supports` ou de `@media (prefers-reduced-motion: no-preference)`. O conteúdo é legível com JavaScript e animação desligados.
- Tema escuro único. Não existe light mode.
- Verificação de cada task: `npm run build` e `npm run lint` passando. Não há suíte de testes — a página é conteúdo estático sem lógica de negócio.
- Commits em português, formato Conventional Commits.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` | Configuração do projeto |
| `src/app/globals.css` | Tokens `@theme`, keyframes, reduced-motion, view transition |
| `src/app/page.tsx` | Redireciona `/` para `/pt` |
| `src/app/[locale]/layout.tsx` | Fontes, `<html lang>`, metadata, Header e Footer |
| `src/app/[locale]/page.tsx` | Composição das seções |
| `src/content/types.ts` | `type Content` — o contrato que pt e en cumprem |
| `src/content/projects.ts` | Dados de cases e projetos (comuns aos dois idiomas) |
| `src/content/pt.ts`, `src/content/en.ts` | Todo o texto |
| `src/components/*.tsx` | Uma seção por arquivo, cada uma recebendo sua fatia de `Content` |
| `scripts/check-links.mjs` | Verifica se os links externos respondem |
| `public/curriculo-yago-ramires.pdf` | Currículo para download |

---

### Task 1: Base limpa — Next 15, TypeScript, Tailwind v4 e tokens

Apaga o projeto de 2023 e sobe o esqueleto novo. Ao fim desta task o site compila e mostra uma página em branco na paleta certa, com as três fontes carregadas.

**Files:**
- Delete: `app/` (inteiro), `mock.js`, `jsconfig.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js`, `.eslintrc.json`, `public/*.svg`, `public/*.png`, `public/thumbs/`
- Modify: `package.json`
- Create: `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: as classes utilitárias `bg-breu`, `text-areia`, `text-areia-mudo`, `bg-cobalto`, `text-cobalto-claro`, `bg-painel`, `font-display`, `font-sans`, `font-mono`, usadas por todas as tasks seguintes.

- [ ] **Step 1: Apagar o projeto antigo**

```bash
cd /Users/yagoramires/Projects/portfolio-2023
git rm -r --quiet app public mock.js jsconfig.json next.config.js postcss.config.js tailwind.config.js .eslintrc.json
mkdir -p src/app src/components src/content public
```

- [ ] **Step 2: Reescrever o `package.json`**

```json
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "check:links": "node scripts/check-links.mjs"
  },
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@tailwindcss/postcss": "^4.1.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.5.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Instalar do zero**

```bash
rm -rf node_modules package-lock.json
npm install
```

- [ ] **Step 4: Criar a configuração**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
```

`postcss.config.mjs`:

```js
const config = {
  plugins: { '@tailwindcss/postcss': {} },
};

export default config;
```

`eslint.config.mjs`:

```js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default [...compat.extends('next/core-web-vitals', 'next/typescript')];
```

- [ ] **Step 5: Criar `src/app/globals.css` com os tokens**

```css
@import 'tailwindcss';

@theme {
  --color-breu: #121110;
  --color-areia: #f0ebe3;
  --color-areia-mudo: #b5afa6;
  --color-cobalto: #2b4fff;
  --color-cobalto-claro: #9aa6ff;
  --color-painel: #1b1917;

  --font-display: var(--font-bricolage);
  --font-sans: var(--font-instrument);
  --font-mono: var(--font-geist-mono);
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-breu);
}

body {
  color: var(--color-areia);
  -webkit-font-smoothing: antialiased;
}

::selection {
  background-color: var(--color-cobalto);
  color: var(--color-areia);
}

:focus-visible {
  outline: 2px solid var(--color-cobalto-claro);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    animation-timeline: auto !important;
  }
}
```

- [ ] **Step 6: Criar o layout raiz com as fontes**

`src/app/layout.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable}`}>
      <body className="bg-breu font-sans antialiased">{children}</body>
    </html>
  );
}
```

Nota: o `lang` do `<html>` é definido por rota na Task 2. Nesta task o elemento fica sem `lang` de propósito; o lint pode avisar e isso se resolve na Task 2.

- [ ] **Step 7: Criar uma página temporária de fumaça**

`src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="font-display text-6xl font-extrabold tracking-tight">Yago Ramires</h1>
      <p className="font-mono text-sm text-areia-mudo">tokens e fontes carregados</p>
      <span className="bg-cobalto px-3 py-1 font-mono text-xs">bloco cobalto</span>
    </main>
  );
}
```

- [ ] **Step 8: Verificar build e visual**

```bash
npm run build && npm run lint
```

Esperado: build com sucesso, listando `/` como rota estática.

```bash
npm run dev
```

Abrir `http://localhost:3000` e confirmar: fundo quase-preto quente, nome em Bricolage, linha em mono cinza-areia, bloco azul cobalto.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: base do projeto em next 15, typescript e tailwind v4"
```

---

### Task 2: Camada de conteúdo tipada e rotas por idioma

Todo o texto do site em dois dicionários com o mesmo tipo, e as rotas `/pt` e `/en` geradas estaticamente. O TypeScript passa a reprovar o build se uma tradução ficar faltando.

**Files:**
- Create: `src/content/types.ts`, `src/content/projects.ts`, `src/content/pt.ts`, `src/content/en.ts`, `src/content/index.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Modify: `src/app/page.tsx` (vira redirect), `src/app/layout.tsx` (ganha `lang="pt-BR"` no `<html>`)

**Interfaces:**
- Consumes: classes de cor e fonte da Task 1.
- Produces:
  - `type Locale = 'pt' | 'en'`
  - `type Content` com os campos `meta`, `nav`, `hero`, `perfil`, `experiencia`, `producao`, `projetos`, `stack`, `contato`, `footer`
  - `getContent(locale: Locale): Content`
  - `const cases: Case[]` e `const projects: Project[]` de `projects.ts`
  - As páginas recebem `params: Promise<{ locale: Locale }>` (Next 15 entrega params como Promise).

- [ ] **Step 1: Criar `src/content/projects.ts`**

```ts
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
```

- [ ] **Step 2: Criar `src/content/types.ts`**

```ts
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
    cases: Record<CaseSlug, { role: string; description: string }>;
  };
  projetos: {
    label: string;
    heading: string;
    codeLabel: string;
    demoLabel: string;
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
```

- [ ] **Step 3: Criar `src/content/pt.ts`**

```ts
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
```

- [ ] **Step 4: Criar `src/content/en.ts`**

```ts
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
```

- [ ] **Step 5: Criar `src/content/index.ts`**

```ts
import { pt } from './pt';
import { en } from './en';
import type { Content, Locale } from './types';

export const locales: Locale[] = ['pt', 'en'];

const dictionaries: Record<Locale, Content> = { pt, en };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type { Content, Locale };
```

- [ ] **Step 6: Criar as rotas por idioma**

`src/app/[locale]/layout.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContent, isLocale, locales, type Locale } from '@/content';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { 'pt-BR': '/pt', en: '/en' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <LocaleShell locale={locale}>{children}</LocaleShell>;
}

function LocaleShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <div lang={locale === 'pt' ? 'pt-BR' : 'en'} className="min-h-dvh">
      {children}
    </div>
  );
}
```

Nota sobre `lang`: o App Router só permite um `<html>`, definido no layout raiz, então o idioma é declarado no contêiner da rota. Ajuste o layout raiz para `<html lang="pt-BR">` como padrão — é o idioma do domínio principal e o destino do redirect.

`src/app/[locale]/page.tsx` (temporário, será preenchido nas próximas tasks):

```tsx
import { getContent, isLocale } from '@/content';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="font-display text-6xl font-extrabold tracking-tight">
        {content.hero.nameTop} {content.hero.nameBottom}
      </h1>
      <p className="mt-4 max-w-prose text-areia-mudo">{content.hero.lead}</p>
    </main>
  );
}
```

- [ ] **Step 7: Trocar `src/app/page.tsx` pelo redirect e ajustar o `<html lang>`**

`src/app/page.tsx`:

```tsx
import { redirect } from 'next/navigation';

export default function Root() {
  redirect('/pt');
}
```

Em `src/app/layout.tsx`, trocar a abertura da tag por:

```tsx
<html lang="pt-BR" className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable}`}>
```

- [ ] **Step 8: Verificar**

```bash
npm run build && npm run lint
```

Esperado: a saída lista `/pt` e `/en` como rotas estáticas (`●` ou `○`), e `/` como rota de redirect.

```bash
npm run dev
```

Conferir `http://localhost:3000` (redireciona para `/pt`), `/pt` (texto em português) e `/en` (texto em inglês).

- [ ] **Step 9: Provar que o tipo pega tradução faltando**

Comentar temporariamente a linha `statLabel` em `src/content/en.ts` e rodar:

```bash
npx tsc --noEmit
```

Esperado: erro `Property 'statLabel' is missing in type ... but required in type 'Content'`. Descomentar a linha e confirmar que `npx tsc --noEmit` volta a passar. Este é o mecanismo que garante os dois idiomas em sincronia — não remova o tipo `Content` das constantes.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: conteudo tipado em pt/en e rotas estaticas por idioma"
```

---

### Task 3: Header com troca de idioma e transição de view

Header fixo, discreto, com a marca à esquerda e o alternador de idioma à direita. A troca é navegação real, o que permite usar a transição de view nativa sem JavaScript.

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `Content['nav']`, `Content['footer']`, `Locale`.
- Produces: `<Header content={content.nav} />` e `<Footer text={content.footer} />`, ambos renderizados no layout da rota, envolvendo `{children}`.

- [ ] **Step 1: Criar o Header**

```tsx
import type { Content } from '@/content';

export function Header({ nav }: { nav: Content['nav'] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-areia/10 bg-breu/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#topo" className="font-mono text-xs tracking-[0.18em] text-areia-mudo uppercase">
          Yago Ramires
        </a>
        <a
          href={`/${nav.otherLocale}`}
          aria-label={nav.otherLocaleAria}
          className="rounded-full border border-areia/25 px-3 py-1 font-mono text-xs tracking-[0.14em] text-areia transition-colors hover:border-cobalto-claro hover:text-cobalto-claro"
        >
          {nav.otherLocaleLabel}
        </a>
      </div>
    </header>
  );
}
```

Use `<a>`, não `<Link>`: a navegação completa do documento é o que dispara `@view-transition`. Um `<Link>` faria roteamento no cliente e a transição não aconteceria.

- [ ] **Step 2: Criar o Footer**

```tsx
export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-areia/10 px-6 py-8">
      <p className="mx-auto max-w-6xl font-mono text-xs text-areia-mudo">{text}</p>
    </footer>
  );
}
```

- [ ] **Step 3: Montar Header e Footer no layout da rota**

Em `src/app/[locale]/layout.tsx`, substituir o corpo de `LocaleShell` por:

```tsx
function LocaleShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const content = getContent(locale);

  return (
    <div lang={locale === 'pt' ? 'pt-BR' : 'en'} className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cobalto focus:px-4 focus:py-2"
      >
        {content.nav.skipToContent}
      </a>
      <Header nav={content.nav} />
      <div className="flex-1">{children}</div>
      <Footer text={content.footer} />
    </div>
  );
}
```

Adicionar os imports de `Header` e `Footer` no topo do arquivo.

- [ ] **Step 4: Habilitar a transição de view em `globals.css`**

Acrescentar logo abaixo do bloco `@theme`:

```css
@view-transition {
  navigation: auto;
}

@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root) {
    animation: fade-out 140ms ease both;
  }
  ::view-transition-new(root) {
    animation: fade-in 220ms ease both;
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
```

- [ ] **Step 5: Verificar**

```bash
npm run build && npm run lint && npm run dev
```

Conferir em `http://localhost:3000/pt`:
1. O header gruda no topo ao rolar e o fundo fica translúcido.
2. Clicar em `EN` leva para `/en`, com o texto todo em inglês e o botão virando `PT`.
3. A troca acontece com um cruzamento curto (em navegador com suporte a view transitions; sem suporte, a navegação é seca e igualmente correta).
4. Pressionar Tab a partir do topo revela o link "Pular para o conteúdo" com anel de foco visível.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: header com troca de idioma e transicao de view nativa"
```

---

### Task 4: Herói e o bloco cobalto

A primeira tela. É aqui que mora o elemento-assinatura: o bloco cobalto sólido que corta o sobrenome.

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `Content['hero']`.
- Produces: `<Hero hero={content.hero} />`. Define as classes de animação `.anim-rise` e `.anim-clip` em `globals.css`, reaproveitadas nas tasks seguintes.

- [ ] **Step 1: Criar as animações de entrada em `globals.css`**

Acrescentar ao fim do arquivo:

```css
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
}

@keyframes clip-up {
  from {
    opacity: 0;
    clip-path: inset(100% 0 0 0);
    transform: translateY(0.75rem);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .anim-rise {
    animation: rise 620ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: var(--delay, 0ms);
  }

  .anim-clip {
    animation: clip-up 760ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: var(--delay, 0ms);
  }
}
```

Sem `prefers-reduced-motion: no-preference` as classes não fazem nada e o conteúdo nasce visível — que é o comportamento correto.

- [ ] **Step 2: Criar o Hero**

```tsx
import type { CSSProperties } from 'react';
import type { Content } from '@/content';

export function Hero({ hero }: { hero: Content['hero'] }) {
  return (
    <section id="topo" aria-labelledby="hero-nome" className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      <p
        className="anim-rise font-mono text-[0.7rem] tracking-[0.18em] text-cobalto-claro uppercase"
        style={{ '--delay': '80ms' } as CSSProperties}
      >
        {hero.eyebrow}
      </p>

      <h1
        id="hero-nome"
        className="mt-8 font-display leading-[0.86] font-extrabold tracking-[-0.045em]"
        style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}
      >
        <span className="anim-clip block" style={{ '--delay': '180ms' } as CSSProperties}>
          {hero.nameTop}
        </span>
        <span
          className="anim-clip mt-1 inline-block bg-cobalto px-[0.12em] pb-[0.04em] text-areia"
          style={{ '--delay': '320ms' } as CSSProperties}
        >
          {hero.nameBottom}
        </span>
      </h1>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end">
        <p
          className="anim-rise max-w-[46ch] text-base leading-relaxed text-areia-mudo md:text-lg"
          style={{ '--delay': '460ms' } as CSSProperties}
        >
          {hero.lead}
        </p>

        <div
          className="anim-rise border-l-2 border-cobalto pl-5"
          style={{ '--delay': '580ms' } as CSSProperties}
        >
          <p className="font-display text-5xl leading-none font-extrabold tracking-[-0.04em] md:text-6xl">
            {hero.statValue}
          </p>
          <p className="mt-2 max-w-[22ch] font-mono text-xs leading-relaxed text-areia-mudo">{hero.statLabel}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Montar o Hero na página**

Substituir o conteúdo de `src/app/[locale]/page.tsx` por:

```tsx
import { notFound } from 'next/navigation';
import { getContent, isLocale } from '@/content';
import { Hero } from '@/components/Hero';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main id="conteudo">
      <Hero hero={content.hero} />
    </main>
  );
}
```

- [ ] **Step 4: Verificar**

```bash
npm run build && npm run lint && npm run dev
```

Conferir em `/pt`:
1. Ao carregar, os elementos entram em cascata: eyebrow, "Yago", "Ramires" no bloco cobalto, lead e métrica. Total em torno de 1,3s até o último.
2. Em 375px de largura o nome não estoura a tela e nada gera rolagem horizontal.
3. Com "reduzir movimento" ligado no sistema, tudo aparece imediatamente e sem animação.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: heroi com bloco cobalto e entrada em cascata"
```

---

### Task 5: Perfil e Experiência

Duas seções de texto que estabelecem o ritmo do resto da página: rótulo em mono, título em display, conteúdo em corpo.

**Files:**
- Create: `src/components/SectionHeading.tsx`, `src/components/Perfil.tsx`, `src/components/Experiencia.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Content['perfil']`, `Content['experiencia']`.
- Produces:
  - `<SectionHeading id={string} label={string} heading={string} />` — usado por todas as seções seguintes. Renderiza o `<h2 id={id}>` que o `aria-labelledby` da seção referencia.
  - `<Perfil perfil={...} />`, `<Experiencia experiencia={...} />`.

- [ ] **Step 1: Criar o SectionHeading**

```tsx
export function SectionHeading({ id, label, heading }: { id: string; label: string; heading: string }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.18em] text-cobalto-claro uppercase">
        <span aria-hidden="true" className="inline-block h-3 w-8 shrink-0 bg-cobalto" />
        {label}
      </p>
      <h2 id={id} className="mt-4 font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.035em] md:text-5xl">
        {heading}
      </h2>
    </div>
  );
}
```

O retângulo cobalto antes do rótulo é a mesma forma do herói, reduzida. É ela que ganha a varredura no scroll na Task 8.

- [ ] **Step 2: Criar o Perfil**

```tsx
import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';

export function Perfil({ perfil }: { perfil: Content['perfil'] }) {
  return (
    <section aria-labelledby="perfil-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="perfil-titulo" label={perfil.label} heading={perfil.heading} />

      <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-areia-mudo md:text-lg">{perfil.body}</p>

      <ul className="mt-14 grid gap-px overflow-hidden rounded-lg bg-areia/10 md:grid-cols-3">
        {perfil.pillars.map((pillar) => (
          <li key={pillar.title} className="bg-painel p-6">
            <h3 className="font-display text-lg font-bold tracking-[-0.02em]">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-areia-mudo">{pillar.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

O truque do `gap-px` sobre fundo `areia/10` desenha as divisórias entre os cards sem precisar de borda em cada um.

- [ ] **Step 3: Criar a Experiência**

```tsx
import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';

export function Experiencia({ experiencia }: { experiencia: Content['experiencia'] }) {
  return (
    <section aria-labelledby="experiencia-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="experiencia-titulo" label={experiencia.label} heading={experiencia.heading} />

      <ol className="mt-14 border-l border-areia/15">
        {experiencia.items.map((item) => (
          <li key={`${item.company}-${item.period}`} className="relative pb-14 pl-6 last:pb-0 md:pl-10">
            <span aria-hidden="true" className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full bg-cobalto" />

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">{item.role}</h3>
              <p className="text-base text-cobalto-claro">{item.company}</p>
            </div>

            <p className="mt-2 font-mono text-xs tracking-[0.08em] text-areia-mudo uppercase">
              {item.period} · {item.mode}
            </p>

            <ul className="mt-5 space-y-3">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="max-w-[58ch] text-sm leading-relaxed text-areia-mudo md:text-base">
                  {bullet}
                </li>
              ))}
            </ul>

            <p className="mt-5 font-mono text-xs text-areia-mudo/80">{item.stack}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Montar na página**

Em `src/app/[locale]/page.tsx`, acrescentar dentro do `<main>`, após `<Hero />`:

```tsx
<Perfil perfil={content.perfil} />
<Experiencia experiencia={content.experiencia} />
```

Com os imports correspondentes.

- [ ] **Step 5: Verificar**

```bash
npm run build && npm run lint && npm run dev
```

Conferir em `/pt` e `/en`: as duas seções aparecem com o rótulo em mono precedido do retângulo cobalto, os três cards do perfil viram uma coluna no mobile, e a linha do tempo tem os dois pontos cobalto alinhados à régua vertical.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: secoes de perfil e experiencia"
```

---

### Task 6: Em produção e Projetos pessoais

O miolo do argumento. Os dois cases ocupam largura total; os projetos pessoais vêm em grade de três.

**Files:**
- Create: `src/components/Producao.tsx`, `src/components/Projetos.tsx`, `src/components/ExternalIcon.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Content['producao']`, `Content['projetos']`, `cases` e `projects` de `@/content/projects`.
- Produces: `<Producao producao={...} />`, `<Projetos projetos={...} />`, `<ExternalIcon />` (SVG inline, 14×14, `currentColor`, `aria-hidden`).

- [ ] **Step 1: Criar o ícone inline**

```tsx
export function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
```

- [ ] **Step 2: Criar a seção Em produção**

```tsx
import type { Content } from '@/content';
import { cases } from '@/content/projects';
import { SectionHeading } from './SectionHeading';
import { ExternalIcon } from './ExternalIcon';

export function Producao({ producao }: { producao: Content['producao'] }) {
  return (
    <section aria-labelledby="producao-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="producao-titulo" label={producao.label} heading={producao.heading} />

      <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-areia-mudo">{producao.intro}</p>

      <div className="mt-14 space-y-6">
        {cases.map((item) => {
          const copy = producao.cases[item.slug];

          return (
            <a
              key={item.slug}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl bg-painel p-8 transition-transform duration-300 hover:-translate-y-1 md:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-cobalto transition-all duration-300 group-hover:w-2"
              />

              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] md:text-4xl">{item.name}</h3>
                  <p className="mt-2 font-mono text-xs tracking-[0.1em] text-cobalto-claro uppercase">{item.client}</p>
                </div>
                <span className="rounded-full border border-areia/20 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-areia-mudo uppercase">
                  {producao.closedSource}
                </span>
              </div>

              <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-areia-mudo md:text-base">
                {copy.description}
              </p>

              <p className="mt-6 font-mono text-xs text-areia-mudo">{item.stack.join(' · ')}</p>

              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-areia uppercase group-hover:text-cobalto-claro">
                {producao.visit}
                <ExternalIcon />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
```

O card inteiro é o link — o alvo de clique cobre a área toda e existe um único link por case, sem link aninhado.

- [ ] **Step 3: Criar a seção Projetos pessoais**

```tsx
import type { Content } from '@/content';
import { projects } from '@/content/projects';
import { SectionHeading } from './SectionHeading';
import { ExternalIcon } from './ExternalIcon';

export function Projetos({ projetos }: { projetos: Content['projetos'] }) {
  return (
    <section aria-labelledby="projetos-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="projetos-titulo" label={projetos.label} heading={projetos.heading} />

      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {projects.map((project) => {
          const copy = projetos.items[project.slug];

          return (
            <li key={project.slug} className="flex flex-col rounded-xl border border-areia/10 bg-painel p-6">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{project.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-areia-mudo">{copy.description}</p>
              <p className="mt-5 font-mono text-[0.7rem] text-areia-mudo/80">{project.stack.join(' · ')}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-[0.08em] uppercase">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-areia hover:text-cobalto-claro"
                >
                  {projetos.codeLabel}
                  <ExternalIcon />
                </a>

                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-areia hover:text-cobalto-claro"
                  >
                    {projetos.demoLabel}
                    <ExternalIcon />
                  </a>
                ) : (
                  <span className="text-areia-mudo/70">{projetos.noDemo}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Montar na página**

Acrescentar em `src/app/[locale]/page.tsx`, após `<Experiencia />`:

```tsx
<Producao producao={content.producao} />
<Projetos projetos={content.projetos} />
```

- [ ] **Step 5: Verificar**

```bash
npm run build && npm run lint && npm run dev
```

Conferir:
1. Os dois cases abrem os sites certos em aba nova.
2. No hover, o card sobe levemente e a faixa cobalto engorda.
3. O card do D2B mostra "Sem demo pública" em vez de um link quebrado, e os outros dois mostram Código e Demo.
4. Em 375px a grade de projetos vira uma coluna.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: secoes de produtos em producao e projetos pessoais"
```

---

### Task 7: Stack, Contato e o PDF do currículo

Fecha o conteúdo da página.

**Files:**
- Create: `src/components/Stack.tsx`, `src/components/Contato.tsx`, `public/curriculo-yago-ramires.pdf`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Content['stack']`, `Content['contato']`.
- Produces: `<Stack stack={...} />`, `<Contato contato={...} />`.

- [ ] **Step 1: Criar a seção Stack**

```tsx
import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';

export function Stack({ stack }: { stack: Content['stack'] }) {
  return (
    <section aria-labelledby="stack-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="stack-titulo" label={stack.label} heading={stack.heading} />

      <dl className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {stack.groups.map((group) => (
          <div key={group.title} className="border-t border-areia/15 pt-5">
            <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-cobalto-claro uppercase">{group.title}</dt>
            <dd className="mt-3 text-base leading-relaxed text-areia">{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

Lista de definição, não grade de logo: o conteúdo é textual e o leitor de tela entende o par rótulo/valor.

- [ ] **Step 2: Criar a seção Contato**

```tsx
import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';
import { ExternalIcon } from './ExternalIcon';

export function Contato({ contato }: { contato: Content['contato'] }) {
  return (
    <section aria-labelledby="contato-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="contato-titulo" label={contato.label} heading={contato.heading} />

      <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-areia-mudo md:text-lg">{contato.lead}</p>

      <ul className="mt-12 border-t border-areia/15">
        {contato.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-areia/15 py-5 transition-colors hover:bg-painel"
            >
              <span className="font-display text-2xl font-bold tracking-[-0.03em] group-hover:text-cobalto-claro md:text-3xl">
                {link.label}
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-sm text-areia-mudo">
                {link.value}
                <ExternalIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/curriculo-yago-ramires.pdf"
        download
        className="mt-12 inline-block bg-cobalto px-7 py-4 font-mono text-xs tracking-[0.14em] text-areia uppercase transition-transform hover:-translate-y-0.5"
      >
        {contato.resume}
      </a>
    </section>
  );
}
```

O botão do currículo é o bloco cobalto na sua última aparição — mesma forma do herói, agora como ação.

- [ ] **Step 3: Colocar o PDF do currículo**

O arquivo-fonte é `/Users/yagoramires/Documents/vagas/curriculo-base.md`. Exporte apenas o conteúdo acima do marcador `<!-- BLOCO DE USO INTERNO -->` — o bloco interno traz pretensão salarial e não pode ir para o PDF público. Salve como `public/curriculo-yago-ramires.pdf`.

```bash
ls -la public/curriculo-yago-ramires.pdf
```

Esperado: arquivo presente e com tamanho maior que zero. Se o PDF ainda não estiver pronto no momento da implementação, pare e peça o arquivo ao dono do repositório — não crie um PDF vazio nem um link para arquivo inexistente.

- [ ] **Step 4: Montar na página**

Acrescentar em `src/app/[locale]/page.tsx`, após `<Projetos />`:

```tsx
<Stack stack={content.stack} />
<Contato contato={content.contato} />
```

- [ ] **Step 5: Verificar**

```bash
npm run build && npm run lint && npm run dev
```

Conferir:
1. Cada link de contato abre o destino certo — `mailto:` abre o cliente de e-mail, WhatsApp abre a conversa, LinkedIn e GitHub abrem em aba nova.
2. O botão baixa o PDF.
3. Navegando só de Tab, todos os links de contato recebem anel de foco visível na ordem de leitura.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: secoes de stack e contato com download do curriculo"
```

---

### Task 8: Animação por scroll, revisão de acessibilidade e README

Última camada: o bloco cobalto que varre ao entrar na tela, a passada de acessibilidade e a documentação.

**Files:**
- Modify: `src/app/globals.css`, `src/components/SectionHeading.tsx`, `README.md`
- Create: `scripts/check-links.mjs`

**Interfaces:**
- Consumes: a marcação de todas as tasks anteriores.
- Produces: as classes `.reveal` e `.swipe`, aplicáveis a qualquer elemento; o script `npm run check:links`.

- [ ] **Step 1: Adicionar as animações dirigidas pelo scroll em `globals.css`**

Acrescentar ao fim do arquivo:

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
      animation-timeline: view();
      animation-range: entry 0% cover 32%;
    }

    .swipe {
      animation: swipe-in 500ms ease both;
      animation-timeline: view();
      animation-range: entry 10% cover 28%;
    }
  }
}

@keyframes swipe-in {
  from {
    transform: scaleX(0);
  }
}
```

Fora do `@supports` nenhuma dessas regras existe, então em navegador sem scroll-driven animations o conteúdo simplesmente aparece — nunca fica invisível esperando um evento que não vem.

- [ ] **Step 2: Aplicar as classes**

Em `src/components/SectionHeading.tsx`, trocar a div externa e o retângulo por:

```tsx
<div className="reveal max-w-3xl">
  <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.18em] text-cobalto-claro uppercase">
    <span aria-hidden="true" className="swipe inline-block h-3 w-8 shrink-0 origin-left bg-cobalto" />
    {label}
  </p>
```

Em `Perfil.tsx`, `Experiencia.tsx`, `Producao.tsx`, `Projetos.tsx`, `Stack.tsx` e `Contato.tsx`, acrescentar `reveal` à classe do primeiro elemento após o `SectionHeading` (o parágrafo de introdução ou a lista/grade). Não aplique `reveal` a mais de dois elementos por seção — o exagero é o que faz uma página parecer gerada.

- [ ] **Step 3: Criar o verificador de links**

`scripts/check-links.mjs`:

```js
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/content';
const urls = new Set();

for (const file of readdirSync(dir)) {
  const source = readFileSync(join(dir, file), 'utf8');
  for (const match of source.matchAll(/https?:\/\/[^\s'"`]+/g)) {
    urls.add(match[0]);
  }
}

let failed = 0;

for (const url of [...urls].sort()) {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const ok = response.status < 400;
    if (!ok) failed += 1;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${response.status} ${url}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL err ${url} — ${error.message}`);
  }
}

console.log(`\n${urls.size} links, ${failed} com falha`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 4: Rodar o verificador**

```bash
npm run check:links
```

Esperado: todos os links respondendo abaixo de 400 e saída `0 com falha`. Se algum falhar, corrija ou remova a entrada em `src/content/projects.ts` antes de seguir — link quebrado em portfólio custa mais caro que projeto a menos.

- [ ] **Step 5: Reescrever o README**

`README.md`:

````markdown
# Portfólio — Yago Ramires

Página única bilíngue (PT/EN) com a experiência, os produtos em produção e os projetos pessoais de Yago Ramires, desenvolvedor frontend.

**No ar:** https://portfolio-2023-sage.vercel.app

## Stack

Next 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Sem biblioteca de animação, de i18n ou de ícone — animação é CSS nativo e os idiomas são dois dicionários tipados.

## Rodando localmente

```bash
npm install
npm run dev
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em http://localhost:3000 |
| `npm run build` | Build de produção; gera `/pt` e `/en` estáticas |
| `npm run lint` | ESLint |
| `npm run check:links` | Verifica se os links externos do conteúdo respondem |

## Editando o conteúdo

Todo o texto vive em `src/content/pt.ts` e `src/content/en.ts`, ambos tipados por `Content` em `src/content/types.ts`. Se uma chave faltar em um dos idiomas, o build falha. Os dados de cases e projetos ficam em `src/content/projects.ts`, compartilhados pelos dois idiomas.

## Estrutura

```
src/app/[locale]/    rotas estáticas /pt e /en
src/components/      uma seção por arquivo
src/content/         dicionários e dados
```
````

- [ ] **Step 6: Passada final de acessibilidade e responsividade**

```bash
npm run build && npm run lint && npm run dev
```

Checklist, em `/pt` e em `/en`:

1. Em 375px de largura não há rolagem horizontal em nenhuma seção.
2. Em 1440px o conteúdo fica contido em `max-w-6xl` e centralizado.
3. Navegando só de Tab: skip link → alternador de idioma → todos os links, todos com anel de foco visível.
4. Com "reduzir movimento" ligado no sistema, nenhuma animação roda e todo o conteúdo está visível.
5. Existe exatamente um `<h1>` na página (o nome no herói).
6. No DevTools, painel de acessibilidade: contraste aprovado em texto areia sobre breu, areia sobre cobalto e areia-mudo sobre painel.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: animacao por scroll, revisao de acessibilidade e readme"
```

---

## Encerramento

Depois da Task 8, com o dono do repositório:

- Renomear o repositório no GitHub de `portfolio-2023` para `portfolio` e atualizar o `origin` local.
- Fazer o deploy na Vercel a partir da branch `redesign-2026` como preview, conferir, e só então integrar na `main`.
