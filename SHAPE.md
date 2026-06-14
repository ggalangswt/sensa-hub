# Mobile-First Sensa Hub Redesign Plan

## Summary

Redesign Sensa Hub as a production-ready, MiniPay-first mobile product UI across all user-facing routes. Use PRODUCT.md and DESIGN.md as source of truth for behavior and product constraints, but reject the legacy hard-outline, hard-shadow direction. The target visual system is a Modern Retro Handheld Console: compact screen panels, cartridge-like cards, status LEDs, physical buttons, and soft device depth. Keep existing behavior, APIs, wallet logic, staking, rooms, contract calls, and Supabase/Redis flows intact.

Primary implementation order: /play and lobby flows first, then money/profile routes, then full landing redesign.

## Key Changes

- Create a mobile-first app shell with clearer hierarchy:
    - Keep bottom nav for authenticated mobile use.
    - Tighten top nav/header density and make page headings more task-specific.
    - Add reusable route header, trust/status strip, and bottom action patterns instead of ad hoc headers per screen.
    - Preserve neutral body.game-active gameplay mode so color matching is not biased by the shell.

- Redesign /play as the core flow:
    - Replace card-heavy mode selection with a thumb-first “choose your next round” stack: Practice, Solo, Friends, Online.
    - Make one primary action visible per state.
    - Move payout/reserve info into compact inline disclosure, not a bulky nested card.
    - Keep stake presets and existing room logic, but present room creation as a guided bottom-sheet style flow on mobile.
    - Make low-balance, approval, deposit, ready, resolving, refund, and vault outcomes visible as persistent state blocks, not only toasts.

- Redesign room and multiplayer states:
    - /play/lobby/[code] should prioritize room code/share, player readiness, and the next required action.
    - Use player rows with nickname-first identity, short address only as secondary.
    - Show paid/casual, stake amount, ready/staked status, and leader controls without crowding the screen.
    - Replace unclear waiting copy with specific next states: waiting for players, waiting for stake, waiting for leader, resolving results.

- Redesign result, refund, and leaderboard states:
    - Keep color result split-screen neutral and high-contrast.
    - Clarify solo outcomes: earned, missed, or stake refunded.
    - Make “Vault” the calm next step for earned/refunded funds.
    - For multiplayer leaderboard, reduce reveal delay, make winner and “You” easier to scan, and keep share secondary.

- Redesign money/profile routes:
    - /vault and /payout should show one primary balance story: withdrawable vault balance first, wallet balance second.
    - Withdraw CTA must clearly state amount and “Network fee applies.”
    - Empty vault state should teach the loop: play, win/refund, withdraw.
    - /me should prioritize nickname/profile, vault summary, stats, recent rounds, and avoid raw address as primary identity.

- Fully redesign / landing:
    - Keep brand identity but replace placeholder jackpot/no-loss style copy with product-accurate positioning.
    - Mobile-first hero should explain the game in one screen: match from memory, play free or stake stablecoin, withdraw from vault.
    - Avoid DeFi dashboard metrics and casino hype.
    - Use sections that support conversion into play: how it works, game modes, trust/vault, MiniPay/Celo readiness.
    - Keep desktop as expansion of mobile, not the primary design.

- Copy And UX Rules

- Use MiniPay-safe copy only:
    - Use Stablecoin, Deposit, Withdraw, Network fee.
    - Avoid Gas, crypto, onramp, offramp.

- Remove all Nadient and Monad references from user-facing UI, copy, examples, labels, headings, metadata, and placeholder content. Replace them with Sensa and Celo language consistently:
    - Nadient → Sensa
    - Monad → Celo
    - Monad chain/network references → Celo
    - Monad-themed protocol copy → Celo/MiniPay stablecoin copy

- Keep money actions calm and explicit:
    - “Deposit stake”
    - “Stake locked”
    - “Result resolving”
    - “Stake refunded to Vault”
    - “Withdraw from Vault”

- Do not use raw wallet address as primary identity.
- Avoid generic DeFi, casino UI, wallet dashboard, gradient text, glassmorphism, fake XP panels, and cluttered reward badges.

## Implementation Notes

- Public API/interface changes: none planned.
- Behavioral changes: none planned.
- Extract small UI helpers only when they reduce repetition:
    - mobile route header
    - trust/status strip
    - primary bottom action container
    - money state block
    - player row

- Keep current component system:
    - Button, Badge, Card, Input, Switch, Tabs
    - existing Tailwind tokens in app/globals.css

- Replace overly bouncy new motion with 150-250ms decisive ease-out transitions.
- Add prefers-reduced-motion fallbacks for major page, lobby, result, and confetti-like effects.

## Route Acceptance Criteria

- /: redesigned fully, mobile-first, product-accurate, no casino/DeFi copy.
- /play: all modes usable at 360px without cramped modals or nested card clutter.
- /play/lobby/[code]: invite, readiness, stake, leader actions, cancel/leave/kick are clear on mobile.
- /vault and /payout: withdrawable balance, wallet balance, empty state, withdrawing state, and fee copy are clear.
- /me: nickname-first profile, readable stats, vault summary, recent rounds, no raw address as primary identity.
- Result/refund states: user can tell whether they won, lost, are waiting, or got stake refunded.
- Active color gameplay remains visually neutral.

## Test Plan

- Run npm run lint.
- Run npm run build.
- Manual mobile checks at 360x640:
    - landing to connect/play
    - practice solo
    - solo paid with insufficient reserve refund
    - private room create/join
    - staking/ready/start
    - waiting/resolving/result
    - vault withdraw empty and non-empty states
    - profile nickname edit

- Check copy scan manually for banned terms:
    - Gas
    - crypto
    - onramp
    - offramp

- Check brand/network copy scan manually for legacy references:
    - Nadient
    - Monad

- Check reduced-motion path for major transitions.
- Verify no contract/API behavior changed.

## Assumptions

- Production-ready fidelity.
- Full landing redesign is in scope.
- Implementation should proceed Play-first if the work must be split.
- No commits or pushes unless explicitly requested.
