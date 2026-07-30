export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-areia/10 px-6 py-8">
      <p className="mx-auto max-w-6xl font-mono text-xs text-areia-mudo">{text}</p>
    </footer>
  );
}
