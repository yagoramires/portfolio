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
