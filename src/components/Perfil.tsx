import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';

export function Perfil({ perfil }: { perfil: Content['perfil'] }) {
  return (
    <section aria-labelledby="perfil-titulo" className="mx-auto max-w-6xl px-6">
      <SectionHeading id="perfil-titulo" label={perfil.label} heading={perfil.heading} />

      <p className="reveal mt-8 max-w-[52ch] text-base leading-relaxed text-areia-mudo md:text-lg">{perfil.body}</p>

      <ul className="reveal mt-14 grid gap-px overflow-hidden rounded-lg bg-areia/10 md:grid-cols-3">
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
