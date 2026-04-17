# DECISION: PartySlider — native HTML range input over shadcn primitive

**Date:** 2026-04-17
**Status:** Accepted

## Context

The two party sliders are the primary interaction of the game. They need to:

- Visually communicate party identity (blue = Dem, red = Rep) via track color
- Have a filled range that grows from 0% → the player's current value
- Feel tactile — glow, hover grow, active squish
- Work on touch and keyboard
- Be controlled (bound to React state for the submit handler)

## Options Considered

1. **shadcn `Slider` component (`@base-ui/react/slider` under the hood)**
   - Pros: the canonical choice in this stack; consistent keyboard/a11y
   - Cons: every style hook funnels through the primitive's CSS variable system (`--primary`). Getting two sliders with *different* track gradients in the same tree requires either CSS variable scoping gymnastics or wrapper subcomponents. The thumb glow + hover-scale + active-squish treatment wants direct control.

2. **Radix UI `Slider` directly**
   - Not viable — shadcn in this project is already standardized on `@base-ui/react`, and Radix is not installed. (Caught during the build: a first attempt at `@radix-ui/react-slider` failed.)

3. **Native `<input type="range">` with injected per-party `<style>`** ✅ chosen
   - Pros: full CSS control over track, thumb, range fill; fewer moving parts; keyboard + touch come free from the browser
   - Cons: ships a scoped `<style>` block per party inside the component (minor cognitive cost), slight cross-browser quirks between `::-webkit-slider-thumb` and `::-moz-range-thumb` (we write both)

## Decision

`PartySlider.tsx` uses a plain `<input type="range" value={value} onChange={…} />` with a per-party `.party-slider-dem` / `.party-slider-rep` class and an inline `<style>` tag that sets the track gradient, thumb size, thumb color, border, and glow shadow.

Party config (colors, labels) is defined in a `PARTY_CONFIG` object in the same file.

## Consequences

- **Gets easier:** total visual control, trivial to tweak gradients/glow; no primitive API surface to learn.
- **Gets harder:** if we ever need more sophisticated slider behavior (e.g. range sliders, tick marks, step labels, RTL support), we lose the primitive's out-of-the-box handling. Revisit and migrate if that day comes.
- **Do not** swap this component for the shadcn `Slider` without preserving the gradient fill and glow thumb — those are load-bearing to the game's tactile feel. If a swap is proposed, it requires AAP because the interaction is the product.
