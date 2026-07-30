import type { Content } from '@/content';
import { projects } from '@/content/projects';
import { SectionHeading } from './SectionHeading';
import { ExternalIcon } from './ExternalIcon';

export function Projetos({ projetos }: { projetos: Content['projetos'] }) {
  return (
    <section aria-labelledby="projetos-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="projetos-titulo" label={projetos.label} heading={projetos.heading} />

      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {projects.map((project) => {
          const copy = projetos.items[project.slug];

          return (
            <li key={project.slug} className="flex flex-col rounded-xl border border-areia/10 bg-painel p-6">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{project.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-areia-mudo">{copy.description}</p>
              <p className="mt-5 font-mono text-[0.7rem] text-areia-mudo/80">{project.stack.join(' · ')}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-[0.08em] uppercase">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={projetos.codeAria.replace('{project}', project.name)}
                  className="inline-flex items-center gap-1.5 text-areia hover:text-cobalto-claro"
                >
                  {projetos.codeLabel}
                  <ExternalIcon />
                </a>

                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={projetos.demoAria.replace('{project}', project.name)}
                    className="inline-flex items-center gap-1.5 text-areia hover:text-cobalto-claro"
                  >
                    {projetos.demoLabel}
                    <ExternalIcon />
                  </a>
                ) : (
                  <span className="text-areia-mudo/70">{projetos.noDemo}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
