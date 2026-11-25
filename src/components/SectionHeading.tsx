type Props = { index: string; label: string; aside?: string; className?: string };

/** "(01)  LABEL ............ aside" rule that opens every section. */
export function SectionHeading({ index, label, aside, className = 'mb-16 border-t md:mb-24' }: Props) {
  return (
    <header
      data-reveal=""
      className={`sh grid grid-cols-[var(--index-col)_1fr] items-baseline border-line pt-6 md:grid-cols-[var(--index-col)_1fr_auto] ${className}`}
    >
      <span data-scramble="" className="text-step--1 tracking-[0.02em]">
        {`(${index})`}
      </span>
      <p data-scramble="" className="text-step--1 leading-none font-bold tracking-[0.2em] uppercase">
        {label}
      </p>
      {aside && <p className="col-start-2 mt-2 text-sm text-fg-muted md:col-start-auto md:mt-0 md:text-right">{aside}</p>}
    </header>
  );
}
