# Prompt for Claude Code — convert to "Boxed" layout

Paste everything below the line into Claude Code. For pixel-exact fidelity you
can ALSO attach `passreg.css` from the design handoff — but this prompt alone
is enough to match the design.

---

Refactor the password generator page to the "Boxed" layout. Keep all my
existing generator logic untouched — this is a presentation/CSS change only.
Use IBM Plex Mono (weights 400/500/600) everywhere.

## Color tokens (define as CSS custom properties on the page root)
- `--c-bg: #18140f`        page background (warm near-black)
- `--c-panel: #1f1a14`     field/box fill base
- `--c-ink: #e9e0c8`       body text
- `--c-ink-hi: #f3eada`    password + headline
- `--c-ink-mid: #d4c9a6`   option labels / memo
- `--c-muted: #b8aa8c`     secondary text
- `--c-muted-lo: #8a7f64`  hints, meta, bits
- `--c-muted-soft: #5e5644` section-rule label
- `--c-rule: #3a3326`      thin divider lines
- `--c-good: #9ec57a`      strong strength + "copied" state
- `--c-weak: #d96e54`      weak strength
- `--c-accent: #e3a14a`    amber — primary accent
- `--c-accent-hi: #f0b25c` accent hover

## Page container
- Center the whole tool: `max-width: 1080px; margin: 0 auto; padding: 48px 56px;`
- No border-radius anywhere — sharp corners are intentional.

## Vertical structure (top to bottom)
1. **Header row** — `$ passreg --generate` (accent on `--generate`) on the left,
   `v0.1.0 · local-only · 2026` on the right. Thin bottom border.
2. **Intro** — big `PassReg` headline (600, 38px) with a blinking accent cursor
   `▌` after it; two muted lines below.
3. **mode** section (NOT boxed) — a section rule, then two tabs
   `memorable` / `random`; the active tab is brighter and prefixed with `▶`.
4. **OUTPUT box** (full width) — see Box style. Contains: the password field,
   the picture memo (memorable mode only), and the copy/new buttons.
5. **2-column grid** — `display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
   align-items: start;` containing two boxes:
   - left: **STRENGTH box**
   - right: **OPTIONS box**
6. **Footer** — a flex-grow divider line + `crypto.getRandomValues() · open source · MIT`.

## Box style (`.box`)
- `border: 1px solid rgba(233,224,200,0.12);`
- `background: color-mix(in oklab, var(--c-panel) 35%, var(--c-bg));`
- `padding: 6px 24px 22px;`
- Each box starts with a **section rule**: a small lowercase label
  (`output` / `strength` / `options`) followed by a thin horizontal line that
  flex-grows to fill the remaining width:
  ```css
  .rule { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
  .rule .label { color: var(--c-muted-soft); font-size: 13px; flex-shrink:0; }
  .rule .line  { flex:1; height:0; border-top:1px solid var(--c-rule); }
  ```
  (This replaces any fixed run of `─` characters — important so lines never
  look ragged at any width.)

## Password field
- Flex row, panel background, 1px subtle border, padding `12px 8px 12px 18px`.
- Accent `»` prompt, then the password (500, 20px, `--c-ink-hi`, soft glow:
  `text-shadow: 0 0 8px color-mix(in oklab, var(--c-ink-hi) 25%, transparent)`).
- A right-aligned `hide`/`show` text link inside the field (underlined, muted,
  turns accent on hover). When hidden, render bullets and drop the glow.

## Buttons (copy / new)
- Outlined "bracket" style: `border: 1px solid var(--c-accent); background:
  transparent; color: var(--c-accent); padding: 11px 22px;` labels
  `[ ⎘ copy ]` and `[ ↻ new ]`.
- On successful copy, the copy button turns green (`--c-good` border/text +
  12% green fill) and its label becomes `[ copied ✓ ]` for ~1.5s.

## Strength gauge (inside the STRENGTH box)
- A horizontal bar of "ticks" drawn as a CSS `repeating-linear-gradient`
  (NOT text characters — keeps it crisp): empty track is faint ink, the filled
  portion is an absolutely-positioned overlay whose `width` = `ratio*100%`,
  colored by tone (`--c-good` / `--c-accent` / `--c-weak`) with a soft
  `drop-shadow` glow.
- Because this box is narrow, let the gauge take the full box width and put the
  label below it: `super strong · ~200 bits` (lowercase label tinted by tone,
  bits in `--c-muted-lo`).

## Options (inside the OPTIONS box)
- One row per flag (uppercase / lowercase / digits / symbols): a monospace
  `[x]`/`[ ]` checkbox marker (accent when off, green when on), the label, and a
  right-aligned char hint (`A–Z`, `a–z`, `0–9`, `! @ # $`).
- `length` row (random mode): label left, range slider in the middle (2px track,
  12px square accent thumb, no border-radius), 2-digit value on the right.

## Ambient effects (subtle — don't overdo)
- On the page root, two soft radial gradients: a faint accent glow top-right and
  a dark vignette bottom-left.
- A very faint CRT scanline overlay: a fixed/absolute `::after` with
  `repeating-linear-gradient(0deg, rgba(0,0,0,.10) 0 1px, transparent 1px 3px)`,
  `mix-blend-mode: multiply; opacity: .55; pointer-events:none;`.
- Phosphor glow (`text-shadow`) on the headline, the password, and the cursor —
  tinted via `color-mix` so it glows in the accent hue.

## Responsive
- Below ~720px, collapse the 2-column grid to a single column.

Do not change any password-generation, strength-calculation, or option logic —
only restructure the markup and styles to match the above.
