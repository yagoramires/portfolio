import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getContent, isLocale, locales } from '@/content';
import { Header } from '@/components/Header';
import { Motion } from '@/components/Motion';
import { Chrome } from '@/components/Chrome';
import '../globals.css';

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
    metadataBase: new URL('https://portfolio-2023-sage.vercel.app'),
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
  const content = getContent(locale);

  return (
    <html
      lang={locale === 'pt' ? 'pt-BR' : 'en'}
      className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col">
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cobalto focus:px-4 focus:py-2"
          >
            {content.nav.skipToContent}
          </a>
          <Header
            nav={content.nav}
            role={content.hero.eyebrow}
            ui={content.ui}
            links={[
              { href: '#perfil', label: content.perfil.label },
              { href: '#trabalhos', label: content.trabalhos.label },
              { href: '#contato', label: content.contato.label },
            ]}
          />
          <div id="conteudo" tabIndex={-1} className="relative z-[1] flex-1">
            {children}
          </div>
        </div>
        <Chrome
          locale={locale}
          ui={content.ui}
          contacts={content.contato.links}
          links={[
            { href: '#perfil', label: content.perfil.label },
            { href: '#servicos', label: content.servicos.label },
            { href: '#trabalhos', label: content.trabalhos.label },
            { href: '#projetos', label: content.projetos.label },
            { href: '#experiencia', label: content.experiencia.label },
            { href: '#contato', label: content.contato.label },
          ]}
        />
        <Motion />
      </body>
    </html>
  );
}
