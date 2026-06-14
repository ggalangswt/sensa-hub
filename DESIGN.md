---
name: Sensa Hub
description: Mobile-first Celo skill game hub with lime-on-deep-purple arcade UI and trustworthy stablecoin states.
colors:
  lime-yellow: "#FDFB51"
  dark-purple: "#422057"
  lime-wash: "#FFFEE8"
  surface: "#FFFFFF"
  deep-surface: "#261232"
  soft-purple: "#7B4F96"
  ink: "#1A0B22"
  reverse-ink: "#FFFEE8"
  overlay-purple: "#16071FCC"
  success-green: "#00D696"
  warning-amber: "#FACC00"
  danger-red: "#FF4D50"
  info-blue: "#0099FF"
typography:
  display:
    fontFamily: "var(--font-heading)"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-heading)"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-heading)"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "var(--font-base)"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-base)"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  base: "10px"
  pill: "9999px"
spacing:
  shadow-x: "2px"
  shadow-y: "2px"
  button-x: "16px"
  button-y: "8px"
  card-x: "24px"
  card-y: "24px"
components:
  button-primary:
    backgroundColor: "{colors.lime-yellow}"
    textColor: "{colors.dark-purple}"
    rounded: "{rounded.base}"
    padding: "{spacing.button-y} {spacing.button-x}"
    height: "40px"
  button-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dark-purple}"
    rounded: "{rounded.base}"
    padding: "{spacing.button-y} {spacing.button-x}"
    height: "40px"
  card:
    backgroundColor: "{colors.lime-wash}"
    textColor: "{colors.dark-purple}"
    rounded: "{rounded.base}"
    padding: "{spacing.card-y} {spacing.card-x}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dark-purple}"
    rounded: "{rounded.base}"
    padding: "8px 12px"
    height: "40px"
  badge-primary:
    backgroundColor: "{colors.lime-yellow}"
    textColor: "{colors.dark-purple}"
    rounded: "{rounded.base}"
    padding: "2px 10px"
---

# Design System: Sensa Hub

## Overview

**Creative North Star: "Tactile Arcade Ledger"**

Sensa Hub is a product UI for a mobile-first Celo skill game. It should feel like a pocket arcade machine: direct, physical, playful, and fast. The same surface also carries stake, refund, result, vault, and withdraw states, so every money moment must feel calm and legible.

The system now uses a high-visibility Lime Yellow and Dark Purple pairing. Lime Yellow carries primary actions, selected states, and celebratory highlights. Dark Purple carries the app stage, borders, text, and trust-heavy wallet states. The combination should feel more distinctive and game-like than the previous lavender shell while keeping the same tactile neobrutalist structure.

It explicitly rejects generic DeFi dashboards, casino UI, and generic SaaS polish. Sensa is a game-first product with Celo settlement in the background, not a wallet dashboard with a game attached.

**Key Characteristics:**

- Mobile-first, MiniPay-first, and thumb-friendly at 360px.
- Lime Yellow primary actions against Dark Purple structural UI.
- Tactile neobrutalist surfaces with dark purple borders and hard shadows.
- One primary action per state, especially in room, stake, refund, result, vault, and withdraw flows.
- Neutral active gameplay surfaces so surrounding UI color does not bias the player.
- Trustworthy stablecoin copy that avoids blockchain jargon.

## Colors

The palette is a committed lime-and-purple arcade system: Dark Purple gives the product weight and trust, Lime Yellow creates the fast game-console signal, and neutral surfaces keep forms and money states readable.

### Primary

- **Lime Yellow** (`lime-yellow`): the primary action, selected state, active control, and positive game highlight. It should feel bright, decisive, and rare enough to matter.
- **Dark Purple** (`dark-purple`): the app stage, structural border, shadow color, primary text, and wallet-state anchor. It replaces black as the default brand ink when contrast permits.

### Secondary

- **Success Green** (`success-green`): successful deposits, resolved wins, healthy connection, and completed withdraw states.
- **Warning Amber** (`warning-amber`): pending, attention, countdown, and recoverable waiting states.
- **Danger Red** (`danger-red`): failed transaction, rejected action, expired room, and destructive confirmation states.
- **Info Blue** (`info-blue`): neutral system information, room codes, helper notes, and non-critical status.

### Neutral

- **Lime Wash** (`lime-wash`): broad light-mode background and soft app shell.
- **Surface** (`surface`): cards, inputs, dialogs, bottom navigation, and transaction panels.
- **Deep Surface** (`deep-surface`): dark-mode panels and cards inside the Dark Purple shell.
- **Soft Purple** (`soft-purple`): muted helper text, inactive icons, and secondary labels when full Dark Purple is too heavy.
- **Ink** (`ink`): deepest text fallback for dense content that needs maximum readability.
- **Reverse Ink** (`reverse-ink`): text on Dark Purple surfaces.
- **Overlay Purple** (`overlay-purple`): modal scrims and blocking overlays.

### Named Rules

**The Lime Means Action Rule.** Lime Yellow is for the next action, selected state, and important game feedback. Do not use it as a background wash across whole screens.

**The Purple Carries Trust Rule.** Dark Purple should hold structure: borders, stage areas, nav, wallet states, and serious copy. It keeps the game from feeling like a toy when money is involved.

**The Game Neutrality Rule.** During active color gameplay, the app must switch to monochrome surfaces. Lime, purple, green, amber, red, and blue must not surround the player's color judgment area.

**The State Color Rule.** Green, amber, red, and blue are semantic. If a color does not explain state or feedback, remove it.

## Typography

**Display Font:** project heading font via `font-heading`.
**Body Font:** project base font via `font-base`.
**Label/Mono Font:** no separate mono role; labels use the base font.

**Character:** Typography is punchy and compact. Headings can feel arcade-like and bold, but labels, values, and wallet states must stay plain enough to be trusted.

### Hierarchy

- **Display** (800, 2rem, 1.05 line-height): page titles, hero statements, and major game state announcements.
- **Headline** (800, 1.5rem, 1.1 line-height): modal titles, result titles, section headers, and lobby state headers.
- **Title** (800, 1.125rem, 1.2 line-height): card titles, room names, vault rows, and player result names.
- **Body** (500, 1rem, 1.5 line-height): instructions, state explanations, support copy, and stablecoin messaging.
- **Label** (500, 0.875rem, 1.25 line-height): button text, badges, form labels, status pills, and compact metadata.

### Named Rules

**The Short Copy Rule.** Product copy must be short, direct, and task-focused. Long prose belongs only in support, terms, privacy, and onboarding explanations.

**The No Badge Soup Rule.** Labels can be badge-like, but every line of UI must not become a badge. Use badges for mode, state, price, online count, and room identity only.

## Elevation

Sensa uses structural hard shadow, not ambient softness. Depth is created by dark purple borders, a 2px offset shadow, and press-state translation. The shadow is part of the product's tactile arcade grammar, so it should be crisp and consistent rather than blurred or decorative.

### Shadow Vocabulary

- **Structural Shadow** (`2px 2px 0px 0px var(--border)`): default card, button, modal, toast, and game-control shadow.
- **Pressed State** (`translate(2px, 2px)` with shadow removed): hover or active feedback for tactile controls.
- **Reverse Press State** (`translate(-2px, -2px)` with structural shadow): occasional reverse control treatment where the existing button variant calls for it.
- **Overlay Layer** (`#16071FCC`): modal and blocking state scrim.

### Named Rules

**The Structural Shadow Rule.** If a surface has a 2px dark purple border, its shadow must be hard and aligned to the token. Do not add soft 16px+ blur shadows to the same element.

**The Modal Restraint Rule.** Modals are for blocking decisions only. Multi-step room or wallet tasks should prefer step views when inline progression is clearer on mobile.

## Components

### Buttons

- **Shape:** compact rounded rectangle (10px radius) with 2px dark purple border.
- **Primary:** Lime Yellow background, Dark Purple text, 40px default height, 16px horizontal padding.
- **Hover / Focus:** translate by the shadow offset and remove the shadow on hover; use a visible 2px focus ring with offset.
- **Neutral:** white or Lime Wash background with Dark Purple text and the same border/shadow structure.
- **Disabled / Loading:** keep shape and layout stable, reduce opacity, and avoid changing the primary action position.

### Chips

- **Style:** 2px dark purple border, 10px radius, compact 12px text, and 10px horizontal padding.
- **Primary chip:** Lime Yellow background for selected mode or active state.
- **Neutral chip:** surface background for metadata such as room size, status, or online count.

### Cards / Containers

- **Corner Style:** tactile rounded rectangle (10px radius).
- **Background:** Lime Wash for broad panels, surface for inputs and high-contrast task areas, Dark Purple for high-emphasis wallet or result states.
- **Shadow Strategy:** structural hard shadow only.
- **Border:** 2px Dark Purple border on interactive or grouped surfaces.
- **Internal Padding:** 24px default card padding; reduce only when mobile density requires it.

### Inputs / Fields

- **Style:** 40px height, 10px radius, 2px Dark Purple border, surface background, 12px horizontal padding.
- **Focus:** visible Dark Purple focus ring with 2px offset.
- **Placeholder:** must stay readable; do not use low-contrast gray on Lime Wash.
- **Error / Disabled:** error uses Danger Red with visible text; disabled preserves layout and reduces opacity.

### Navigation

- **Style:** simple app shell with clear current location, bottom navigation on mobile, and no raw wallet address as primary identity.
- **Active State:** use Lime Yellow only for the current location or primary affordance. Inactive items should stay muted purple, not pale gray.
- **MiniPay Behavior:** inside MiniPay, avoid redundant wallet prompts; the app should feel already connected when auto-connect succeeds.

### Gameplay Surfaces

- **Active Game:** monochrome shell, hidden nav, neutral controls, and no surrounding hue bias.
- **Room Flow:** room creation, staking, ready, waiting, result, refund, and withdraw screens must each have one obvious Lime Yellow primary action.
- **Vault Flow:** stablecoin balances, pending winnings, refunds, and withdraw actions must use clear state copy before decorative game copy.

## Do's and Don'ts

### Do:

- **Do** design for 360px mobile first, then expand to wider screens.
- **Do** use Lime Yellow (`#FDFB51`) and Dark Purple (`#422057`) as the main Sensa combination.
- **Do** keep Dark Purple as the structural border, stage, and trust color.
- **Do** keep Lime Yellow reserved for primary actions, selected states, and meaningful game feedback.
- **Do** keep primary actions visually singular on each state screen.
- **Do** use MiniPay-safe language: Stablecoin, Deposit, Withdraw, Network fee.
- **Do** keep money states calm, explicit, and recoverable.
- **Do** use neutral monochrome surfaces during active color gameplay.
- **Do** replace legacy brand references with Sensa and Celo.

### Don't:

- **Don't** use generic DeFi dashboard patterns: token tables, yield language, protocol jargon, or wallet-first framing.
- **Don't** use casino UI: flashing rewards, fake jackpot hype, manipulative urgency, or cluttered badges.
- **Don't** use generic SaaS polish; the lime-and-purple pairing must serve action, trust, and game structure.
- **Don't** flood whole screens with Lime Yellow. If everything is highlighted, nothing is actionable.
- **Don't** use Gas, crypto, onramp, or offramp in user-facing copy.
- **Don't** present a raw wallet address as the primary user identity.
- **Don't** leave legacy source brand or network references in user-facing UI, metadata, placeholder content, or docs.
- **Don't** combine the Sensa 2px border language with soft decorative glassmorphism or wide ghost-card shadows.
