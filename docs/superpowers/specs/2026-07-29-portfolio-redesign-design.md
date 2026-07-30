# Portfólio Yago Ramires — redesign 2026

**Data:** 2026-07-29
**Repositório:** https://github.com/yagoramires/portfolio-2023
**Status:** design aprovado, pronto para plano de implementação

## Problema

O portfólio atual (Next 13, JSX, Tailwind 3) foi escrito em 2023 e não representa mais quem escreveu. São quatro páginas separadas, um formulário de contato via EmailJS e seis projetos de bootcamp (`mock.js`) — nenhum deles em produção, nenhum ligado aos cinco anos de experiência do currículo. Quem chega pelo LinkedIn não descobre que existem dois produtos no ar com usuário real por trás desse nome.

## Objetivo

Uma página única, bilíngue, que em trinta segundos comunique: **frontend com cinco anos de estrada, cujos produtos estão em produção com usuário real.** Alvo: recrutadores e líderes técnicos de vagas remotas de nível pleno/sênior.

## Decisões tomadas

| Decisão | Escolha |
|---|---|
| Projetos exibidos | 2 cases de trabalho + 3 projetos pessoais |
| Idioma | Bilíngue PT/EN com toggle |
| Escopo | Rebuild: one-page, Next 15 + TypeScript |
| Contato | Links diretos + PDF do currículo (sem formulário) |
| Direção visual | Editorial escuro — areia & cobalto |

## Identidade visual

### Paleta

Definida como tokens Tailwind v4 em `@theme`.

| Token | Hex | Uso |
|---|---|---|
| `--color-breu` | `#121110` | Fundo. Quase-preto quente, não neutro. |
| `--color-areia` | `#F0EBE3` | Texto principal. |
| `--color-areia-mudo` | `#B5AFA6` | Texto secundário, legendas. |
| `--color-cobalto` | `#2B4FFF` | Blocos de destaque, CTA, anel de foco. |
| `--color-cobalto-claro` | `#9AA6FF` | Eyebrows, links dentro de texto corrido. |
| `--color-painel` | `#1B1917` | Cards e superfícies elevadas. |

Tema escuro único. Não há toggle de light mode — o header já carrega o toggle de idioma, e dois controles competindo no mesmo canto diluem os dois.

### Tipografia

Carregadas via `next/font/google`, subset `latin`, com `display: swap`.

- **Bricolage Grotesque** (display) — nome no herói e títulos de seção. Tracking `-0.04em`. Usada só em tamanho grande; nunca em corpo de texto.
- **Instrument Sans** (corpo) — parágrafos, bullets, botões.
- **Geist Mono** (utilitária) — eyebrows, anos, rótulos de stack, numeração. É o que dá cara de dossiê técnico em vez de landing page.

Escala fluida com `clamp()`. Herói: `clamp(3.5rem, 12vw, 11rem)`.

### Elemento-assinatura

**O bloco cobalto.** Uma única forma sólida, reaproveitada pela página inteira em vez de decoração espalhada:

1. Corta o sobrenome no herói (`Ramires` sobre fundo cobalto).
2. Varre horizontalmente da esquerda para a direita ao anunciar cada seção, dirigido pelo scroll.
3. Cresce por trás do card de case em produção no hover.
4. Vira o botão de contato no fim da página.

Toda a ousadia do design mora aqui. O resto — grid, espaçamento, hierarquia — fica disciplinado e quieto.

## Estrutura da página

Seções na ordem, uma rolagem contínua:

### 1. Herói

Nome em tipo gigante em duas linhas, sobrenome dentro do bloco cobalto. Eyebrow em mono: `Desenvolvedor Frontend · Rio de Janeiro · Remoto`. Lead de duas linhas. Bloco lateral com a métrica **+30%** e o rótulo "de capacidade de entrega do time". Header fixo com o toggle PT/EN.

### 2. Perfil

Parágrafo curto derivado do resumo do currículo, seguido de três frentes de atuação: produto em produção, refatoração e sustentação, testes automatizados. Espaço reservado para foto, sem foto na primeira entrega.

### 3. Experiência

Linha do tempo vertical com dois itens:

- **Radhark Tech — Desenvolvedor Frontend Pleno**, Fev/2024 → atual, remoto. Stack: Next.js, React, TypeScript, Tailwind, React Query, APIs REST. Três bullets: capacidade de entrega do time em ~30%; desenvolvimento e manutenção de Fluência Paraná e Carreira Médica; testes com Vitest e Playwright.
- **D2B Representações — Automação de processos**, 2021 → atual, remoto em paralelo. Dois bullets: download automatizado de XMLs de NF-e de ~6 indústrias com cadastro automático de pedidos; macros VBA para rotinas administrativas.

### 4. Em produção

Dois cases grandes, um por linha, cada um com cliente, o que foi feito, stack e link para o site no ar:

- **Fluência Paraná** — Governo do Paraná — https://gestaoescolar.escoladigital.pr.gov.br/
- **Carreira Médica** — PUCPR — https://carreiramedica.pucpr.br/

Ambos exibem o rótulo **"código proprietário"** no lugar do link de repositório. Isso é informação, não desculpa: sinaliza trabalho contratado em produto real.

### 5. Projetos pessoais

Três cards menores:

- **Rad Poker** — scrum poker em TypeScript — demo https://rad-poker.vercel.app · código https://github.com/yagoramires/rad-poker
- **Barber Shop** — agendamento para barbearia em TypeScript — demo https://barber-shop-rouge.vercel.app · código https://github.com/yagoramires/barber-shop
- **D2B Sales Platform** — plataforma de vendas em React + TypeScript — código https://github.com/yagoramires/d2b-sales-platform-v2

O D2B não tem deploy público ativo (o antigo `order-simulator-react.vercel.app` responde 404). O card mostra apenas o link de código, e o componente trata a ausência de demo sem quebrar o layout.

### 6. Stack

Lista agrupada em texto, sem logos: linguagens, frameworks, UI, estado e dados, testes, ferramentas. Os SVGs coloridos do site atual saem — parecem badge de bootcamp e brigam com a paleta.

### 7. Contato

Quatro links grandes — e-mail `yago.ramiresx@gmail.com`, LinkedIn `https://www.linkedin.com/in/yagoramires/`, GitHub `https://github.com/yagoramires`, WhatsApp `(21) 96971-1937` — mais o botão de baixar o currículo em PDF, servido de `public/`.

### 8. Rodapé

Uma linha: nome, ano e a stack do próprio site.

## Arquitetura

```
src/
  app/
    [locale]/
      layout.tsx        fontes, metadata por idioma, header
      page.tsx          composição das seções
    globals.css         tokens @theme, keyframes, reduced-motion
  content/
    types.ts            type Content — a forma que pt e en devem cumprir
    pt.ts               todo o texto em português
    en.ts               todo o texto em inglês
    projects.ts         cases e projetos (dados comuns aos dois idiomas)
  components/
    Header.tsx  Hero.tsx  Perfil.tsx  Experiencia.tsx
    Producao.tsx  Projetos.tsx  Stack.tsx  Contato.tsx  Footer.tsx
public/
  curriculo-yago-ramires.pdf
```

Cada componente recebe sua fatia de `Content` por props e não conhece nada além dela. Nenhum estado, nenhum contexto: a página é conteúdo estático.

**Next 15, App Router, TypeScript, Tailwind v4.** Todos os componentes são Server Components. `generateStaticParams` gera `/pt` e `/en` no build; `/` redireciona para `/pt`. Deploy na Vercel.

### Bilinguismo sem biblioteca

Dois objetos tipados, `pt.ts` e `en.ts`, ambos declarados como `Content`. O TypeScript falha o build se uma chave faltar na tradução — é a garantia de que os idiomas não desandam.

O toggle é um `<a href>` para a rota do outro idioma, não um botão com estado — a navegação completa do documento é justamente o que dispara `@view-transition` (um `<Link>` rotearia no cliente e a transição não aconteceria). Sem `next-intl`, sem provider, sem client component, e os dois idiomas são indexáveis. `metadata` e `<html lang>` mudam por rota; cada página declara `alternates.languages` apontando para a outra.

### Animação

Sem biblioteca de animação. Tudo em CSS nativo:

- **Entrada de seção e varredura do bloco cobalto** — `animation-timeline: view()`, dentro de `@supports (animation-timeline: view())`. Onde o navegador não suporta, o conteúdo já nasce visível: a animação é melhoria, nunca requisito de leitura.
- **Abertura do herói** — `@keyframes` com `animation-delay` escalonado: eyebrow → nome linha a linha em `clip-path` → lead → métrica. Cerca de 700ms no total.
- **Header** — `position: sticky` no topo, com fundo translúcido, sem JS de scroll.
- **Cards** — `transition` de `transform` e cor no hover, com o bloco cobalto crescendo por trás.
- **Troca de idioma** — `@view-transition { navigation: auto; }` em CSS, que cruza as duas rotas sem JS e sem flag experimental do Next. Onde o navegador não suporta, a navegação acontece seca, sem quebrar nada.
- **`prefers-reduced-motion: reduce`** — um único bloco em `globals.css` zera duração e desliga as timelines.

### Dependências

Ficam: `next`, `react`, `react-dom`, `tailwindcss`, `typescript` e as `@types`.

Saem: `@emailjs/browser`, `react-hook-form`, `@hookform/resolvers`, `zod`, `axios`, `react-toastify`, `react-icons`. Os cinco ou seis ícones necessários viram SVG inline.

## Acessibilidade e qualidade

- Contraste mínimo AA: areia sobre breu passa com folga; texto sobre cobalto usa areia, não cinza.
- Foco visível em todo elemento interativo, com anel cobalto sobre fundo escuro.
- Estrutura semântica: um `<h1>`, `<section>` com `aria-labelledby`, links descritivos (nunca "clique aqui").
- Responsivo de 320px para cima; a escala fluida de tipo cobre o intervalo sem breakpoints extras.
- Imagens via `next/image` com `alt` real.

## Verificação

Não há suíte de testes automatizados: a página é conteúdo estático sem lógica de negócio. A verificação de conclusão é:

1. `npm run build` e `npm run lint` passando.
2. Todos os links externos da spec respondendo 200 (já conferido em 2026-07-29, exceto o demo do D2B, que foi removido do design por isso).
3. Inspeção visual em 375px e 1440px, com e sem `prefers-reduced-motion`.
4. `/pt` e `/en` renderizando o conteúdo completo, sem chave faltando.

Se o site ganhar formulário ou dados dinâmicos no futuro, aí entra Playwright.

## Fora de escopo

- Blog, CMS ou qualquer conteúdo dinâmico.
- Light mode.
- Foto pessoal na primeira entrega (o espaço fica reservado no layout).
- Analytics.
- Domínio próprio — continua no subdomínio da Vercel.

## Itens para o dono do repositório

- Renomear o repositório de `portfolio-2023` para `portfolio`: o ano no nome envelhece sozinho, e o link aparece no LinkedIn.
- Gerar o PDF do currículo a partir de `~/Documents/vagas/curriculo-base.md` e colocá-lo em `public/`.
- O `README.md` atual é o template do `create-next-app` e será reescrito.
