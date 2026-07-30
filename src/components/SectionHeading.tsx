export function SectionHeading({ id, label, heading }: { id: string; label: string; heading: string }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.18em] text-cobalto-claro uppercase">
        <span aria-hidden="true" className="inline-block h-3 w-8 shrink-0 bg-cobalto" />
        {label}
      </p>
      <h2 id={id} className="mt-4 font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.035em] md:text-5xl">
        {heading}
      </h2>
    </div>
  );
}
