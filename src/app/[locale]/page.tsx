import { notFound } from 'next/navigation';
import { getContent, isLocale } from '@/content';
import { Hero } from '@/components/Hero';
import { Perfil } from '@/components/Perfil';
import { Experiencia } from '@/components/Experiencia';
import { Producao } from '@/components/Producao';
import { Projetos } from '@/components/Projetos';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main>
      <Hero hero={content.hero} />
      <Perfil perfil={content.perfil} />
      <Experiencia experiencia={content.experiencia} />
      <Producao producao={content.producao} />
      <Projetos projetos={content.projetos} />
    </main>
  );
}
