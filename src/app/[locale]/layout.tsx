import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getContent, isLocale, locales } from '@/content';
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

  return (
    <html
      lang={locale === 'pt' ? 'pt-BR' : 'en'}
      className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable}`}
    >
      <body className="bg-breu font-sans antialiased">{children}</body>
    </html>
  );
}
