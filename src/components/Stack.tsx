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
