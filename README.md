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
