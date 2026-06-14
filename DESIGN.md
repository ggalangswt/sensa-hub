# Design

## Overview

Sensa Hub is a Next.js App Router product UI for a mobile-first Celo skill game. It combines a playful neobrutalist visual shell with gameplay, room creation, wallet connection, vault, and profile flows.

The current identity uses lavender backgrounds, black outlines, hard shadows, bold headings, compact cards, and colorful chart accents. Future work should preserve the tactile game feel while reducing clutter, improving mobile rhythm, and making money states clearer.

## Color

Current tokens:

- Background: `oklch(93.88% 0.033 300.19)`
- Dark background: `oklch(30.14% 0.0826 296.5)`
- Surface: `oklch(100% 0 0)` in light mode, `oklch(23.93% 0 0)` in dark mode
- Foreground: `oklch(0% 0 0)` in light mode, `oklch(92.49% 0 0)` in dark mode
- Main accent: `oklch(70.28% 0.1753 295.36)`
- Border and shadow ink: black
- Accent roles: purple `#A985FF`, green `#00D696`, yellow `#FACC00`, red `#FF4D50`, blue `#0099FF`

Direction:

- Preserve the bold lavender and black-outline identity for the app shell.
- Use neutral monochrome overrides during active color gameplay to avoid biasing the player's eye.
- Reserve green/yellow/red/blue for state and feedback, not decoration.
- New authored color tokens should use OKLCH and maintain contrast for mobile readability.

## Typography

Current type:

- Tailwind theme uses `font-base` and `font-heading` utilities.
- Headings are bold and high-contrast.
- UI labels are compact, often badge-like.

Direction:

- Keep headings punchy, but avoid turning every label into a badge.
- Use short, direct product copy.
- Cap explanatory text around 65 to 75 characters per line.
- Use `text-wrap: balance` for major headings when adding new surfaces.

## Layout

Current structure:

- Landing page with centered hero and floating color swatches.
- Authenticated app shell with `Navbar`, centered max-width content, and bottom navigation.
- Play flow uses screen components: select, staking, queueing, lobby, preview, guess, waiting, leaderboard, result.
- Cards and modals are common for mode selection, room setup, payout details, and actions.

Direction:

- Prioritize 360px mobile layouts and MiniPay in-app browser constraints.
- Keep one primary action per state.
- Avoid nested card stacks where inline progressive disclosure would be clearer.
- Use spacing rhythm to distinguish gameplay, wallet actions, and informational copy.

## Components And Patterns

Existing patterns:

- Neobrutalist cards with `border-2`, `shadow-shadow`, and `rounded-base`.
- Buttons from `components/ui/button.tsx` with default and neutral variants.
- Badges for mode, price, status, and online count.
- Radix/shadcn-style form controls.
- Toasts via Sonner.
- Wallet context, profile, vault, and room APIs.

Direction:

- Cards are acceptable for distinct game modes, but avoid using them as the default answer for every state.
- Money actions should use consistent copy and clear outcome states.
- Modals should be used carefully; for mobile, prefer simple step views when a task has multiple decisions.
- Toasts should supplement, not replace, visible state changes.

## Motion

Current motion:

- Page enter fade-up.
- Floating color swatches.
- Marquee.
- Pulse indicators.
- Heavy lobby match animations with bounce-like cubic-bezier curves.
- Confetti/result effects.

Direction:

- Motion should make matchmaking, staking, and results feel alive.
- Avoid bounce/elastic motion in new work; use decisive ease-out curves.
- Add reduced-motion alternatives for major transitions and result effects.
- Do not hide important state behind animation completion.

## MiniPay And Wallet UX

Preferred copy:

- Stablecoin
- Deposit
- Withdraw
- Network fee

Avoid:

- Gas or gas fee
- Crypto
- Onramp
- Offramp

Wallet UX should auto-connect in MiniPay where possible, avoid message-sign auth, and avoid presenting raw addresses as the main identity. Low-balance and failed transaction states should point to the next recovery action.

## Technical Notes

Framework:

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Wagmi and Viem
- Supabase
- Upstash Redis
- Celo Mainnet/Sepolia contract wiring

Important files:

- `app/globals.css`: theme tokens and global animation styles
- `app/layout.tsx`: root providers and metadata
- `src/modules/play/Play.tsx`: main gameplay state machine
- `src/modules/play/components/SelectScene.tsx`: mode selection and room creation
- `src/provider/WalletContext.tsx`: wallet connection and profile identity
- `lib/sc/contracts.ts`: contract and token addresses

Known design risks:

- The app leans heavily on card/modal patterns.
- Some copy still reflects early color-game placeholder positioning and may need tightening for MiniPay launch.
- Active gameplay correctly removes theme color bias, but surrounding app states still need stronger hierarchy.
- Existing motion includes bounce-like easing that should be replaced in future polish passes.
