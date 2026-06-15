import { SensaLogo } from "@/src/components/brand/SensaLogo";

export default function Footer() {
  return (
    <>
      <footer className="border-t border-border/20 bg-[var(--console-shell)] py-8 px-4 text-background">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SensaLogo size="sm" />
            <span className="font-heading text-background">Sensa</span>
          </div>
          <p className="text-sm text-background/65">Brain skill game hub on Celo. Built for MiniPay play.</p>
          <div className="flex gap-4 text-sm text-background/60">
            <a href="#" className="hover:text-background transition-colors">Twitter</a>
            <a href="#" className="hover:text-background transition-colors">Discord</a>
            <a href="#" className="hover:text-background transition-colors">Docs</a>
          </div>
        </div>
      </footer>

      <div className="border-t border-main/30 bg-main text-main-foreground overflow-hidden">
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
