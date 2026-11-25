import { notFound } from 'next/navigation';
import { getContent, isLocale } from '@/content';
import { Hero } from '@/components/Hero';
import { Perfil } from '@/components/Perfil';
import { Servicos } from '@/components/Servicos';
import { Processo } from '@/components/Processo';
import { Trabalhos } from '@/components/Trabalhos';
import { Projetos } from '@/components/Projetos';
import { Experiencia } from '@/components/Experiencia';
import { Lema } from '@/components/Lema';
import { Fora } from '@/components/Fora';
import { Contato } from '@/components/Contato';
import { DotStage } from '@/components/DotStage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const { asides } = content.ui;
  const hasFora = Boolean(content.fora.spotifyEmbed || content.fora.games.length);

  return (
    <main>
      <Hero hero={content.hero} ui={content.ui} />
      <Perfil perfil={content.perfil} aside={asides.perfil} />
      <Servicos servicos={content.servicos} items={content.perfil.pillars} aside={asides.servicos} />
      <Processo processo={content.processo} label={content.servicos.label} skip={content.servicos.skip} />
      <Trabalhos trabalhos={content.trabalhos} aside={asides.trabalhos} skip={content.servicos.skip} />
      <Projetos projetos={content.projetos} aside={asides.projetos} />
      <Experiencia experiencia={content.experiencia} ui={content.ui} tools={content.stack.groups.flatMap((g) => g.items)} />
      <Lema lema={content.lema} />
      <Fora fora={content.fora} index="06" />
      <Contato contato={content.contato} ui={content.ui} footer={content.footer} index={hasFora ? '07' : '06'} />
      <DotStage />
    </main>
  );
}
