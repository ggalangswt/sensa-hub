export default function Footer() {
  return (
    <>
      <footer className="border-t-2 border-border bg-secondary-background py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-base bg-main border-2 border-border flex items-center justify-center">
              <span className="text-main-foreground font-heading text-xs">N</span>
            </div>
            <span className="font-heading text-foreground">Sensa</span>
          </div>
          <p className="text-sm text-foreground/50">Brain skill game hub on Celo. Built for MiniPay play.</p>
          <div className="flex gap-4 text-sm text-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Discord</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </div>
        </div>
      </footer>

      <div className="border-t-2 border-border bg-main text-main-foreground overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex items-center h-8 text-xs font-base tracking-wide">
            {["MEMORY", "TIMING", "PATTERNS", "PRIVATE ROOMS", "VAULT WITHDRAW"].flatMap((item, i) => [
              <span key={item} className="px-4">{item}</span>,
              <span key={`dot-${i}`} className="px-4">·</span>,
            ])}
          </div>
        </div>
      </div>
    </>
  );
}
