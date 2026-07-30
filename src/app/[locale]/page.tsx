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
