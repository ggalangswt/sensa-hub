"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useWallet } from "@/src/provider/WalletContext";
import { useTheme } from "@/src/provider/ThemeProvider";
import { Gamepad2, Vault, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SensaLogo } from "@/src/components/brand/SensaLogo";

const NAV_LINKS = [
  { href: "/play", label: "Play", icon: Gamepad2 },
  { href: "/vault", label: "Vault", icon: Vault },
  { href: "/me", label: "Me", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useWallet();
  const { theme, toggle } = useTheme();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/20 bg-[var(--console-shell)] text-background shadow-[0_8px_24px_rgb(66_32_87_/_0.18)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <SensaLogo />
              <span className="font-heading text-xl text-background">Sensa</span>
            </Link>

            {isConnected && (
              <div className="flex items-center gap-2 md:gap-8">
                <div className="hidden md:flex items-center gap-8">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-heading transition-colors no-underline ${
                          isActive
                            ? "text-main"
                            : "text-background/65 hover:text-background"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                <Button variant="neutral" size="icon" onClick={toggle} aria-label="Toggle theme">
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isConnected && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/20 bg-[var(--console-shell)] px-2 pb-safe text-background shadow-[0_-10px_24px_rgb(66_32_87_/_0.2)] md:hidden touch-none">
          <div className="flex items-center justify-around h-16 rounded-t-[18px]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full no-underline transition-colors ${
                    isActive
                      ? "text-main"
                      : "text-background/50 hover:text-background/70"
                  }`}
                >
                  <span
                    className={`mb-1 rounded-[12px] border px-2.5 py-1 ${
                      isActive
                        ? "border-main/70 bg-main/15 shadow-[inset_0_0_0_1px_rgb(253_251_81_/_0.18)]"
                        : "border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-heading">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
