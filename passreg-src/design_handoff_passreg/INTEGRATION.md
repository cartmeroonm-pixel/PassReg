# PassReg — Design Handoff (terminal direction)

## What this is

A **design-only** package. It contains the complete visual layer — colors,
typography, layout, components, animations — with **no password logic**. Your
generator (templates, phrase logic, CSPRNG, strength math) stays exactly as
Claude Code built it; this bundle tells you where to plug it in.

These are **design references**, not drop-in production code. Recreate the
markup + styles using your project's existing environment (React/Vue/Svelte/
plain DOM — whatever you already have), then bind your generator to the hooks
listed below. The CSS is framework-agnostic and can be used verbatim.

This is a **high-fidelity** design: colors, spacing, type, and motion are final.

## Files

| File | Role |
|------|------|
| `passreg.css` | Complete stylesheet. Tokens + layout + components + animations. Use as-is. |
| `markup-reference.html` | Static DOM skeleton with class names. Every logic seam marked `<!-- HOOK: ... -->`. Open it in a browser to see the finished look. |
| `Password Generator (Terminal).html` | The original working prototype, for reference (this one *does* include sample logic — ignore it, it's just so the reference runs). |

---

## The design / logic boundary

**Design owns:** the `.dirC` container, all `C-*` classes, the theme tokens,
the scanline/glow effects, the strength-gauge rendering, hover/transition states.

**Your logic owns:** generating the password string, the "picture" memo phrase,
the strength tone/label/ratio/bits, the mode + options state, and the
copy/regenerate/hide actions.

You connect the two through the **hooks** below. Each one maps to a
`<!-- HOOK[name] -->` comment in `markup-reference.html`.

### Hook reference

| Hook | What your code provides | How the design consumes it |
|------|------------------------|----------------------------|
| `mode` | current mode: `memorable` \| `random` | add class `on` to the active `.C-tab`; its `.C-pre` shows `▶`, the other a blank space |
| `password` | the generated string | text content of `.C-pw`. When hidden, add class `hide` and render bullets (`•`) |
| `hide-toggle` | boolean show/hide | toggles `.hide` on `.C-pw`; button label swaps `hide`/`show` |
| `memo` | the "picture" phrase (memorable mode only) | text of `.C-memo-body`; omit the whole `.C-memo` block when absent |
| `copy` | clipboard write | on success add class `hot` to the copy `.C-bracket` and swap its label to `copied ✓` for ~1.5s |
| `regen` | re-run generator | click handler on the `[ ↻ new ]` `.C-bracket` |
| `strength-tone` | `weak` \| `fair` \| `good` | set `tone-{value}` on **both** `.C-gauge` and `.C-strength-lbl` |
| `strength-ratio` | number 0–1 | inline `width: {ratio*100}%` on `.C-gauge-fill` |
| `strength-label` | lowercase text e.g. `strong` | text of `.C-strength-lbl` |
| `strength-bits` | entropy estimate | text of `.C-bits` (format `· ~78 bits`) |
| `option` | each generator flag (symbols / dashes / digits) | checked row → class `on` on `.C-cb` + `[x]`; unchecked → `[ ]` |
| `length` | integer (random mode only) | bind the `range` input + the 2-digit readout in `.C-opt-r`; render the row only in random mode |
| `cursor-blink` | — (pure design) | toggle `.C-cursor` `data-on` true/false on a ~540ms interval |
| `rules` | boolean (cosmetic preference) | `data-rules="1"` on `.dirC` → ascii `── section ──` rules; `"0"` → plain uppercase labels |

> The strength gauge is the one place design needs a numeric `ratio` from your
> logic. Everything else is strings + boolean class toggles.

---

## Design tokens

All defined as CSS custom properties on `.dirC` (top of `passreg.css`).

### Colors
| Token | Value | Use |
|-------|-------|-----|
| `--c-bg` | `#18140f` | page background (warm near-black) |
| `--c-panel` | `#1f1a14` | password field background |
| `--c-ink` | `#e9e0c8` | body text (cream) |
| `--c-ink-hi` | `#f3eada` | password + headline |
| `--c-ink-mid` | `#d4c9a6` | memo / option labels |
| `--c-muted` | `#b8aa8c` | secondary text |
| `--c-muted-lo` | `#8a7f64` | hints, meta |
| `--c-muted-soft` | `#5e5644` | footer, rules |
| `--c-rule` | `#3a3326` | divider line |
| `--c-good` | `#9ec57a` | strong strength + copied state |
| `--c-weak` | `#d96e54` | weak strength |
| `--c-accent` | `#e3a14a` | **amber** — primary accent |
| `--c-accent-hi` | `#f0b25c` | accent hover |

### Accent themes
Switch by setting `data-accent` on `.dirC`. Only `--c-accent` / `--c-accent-hi`
change; everything else stays constant.

| `data-accent` | accent | accent-hi |
|---------------|--------|-----------|
| `amber` (default) | `#e3a14a` | `#f0b25c` |
| `phosphor` | `#9ec57a` | `#b8d995` |
| `cyan` | `#6cb8b8` | `#84cccc` |
| `crimson` | `#d96e54` | `#ed8a72` |

### Typography
- Family: **IBM Plex Mono**, weights 400 / 500 / 600 (fallback `ui-monospace, monospace`).
- Headline `h1`: 600 / 38px / `-.01em`
- Password: 500 / 20px
- Body: 400 / 14px / 1.55
- Section rules + meta: 11–13px

### Spacing & layout
- Page padding: `48px 64px`
- Centered stage: `max-width: 880px`
- Section gap: `margin-top: 18px`
- No border-radius anywhere — everything is sharp-cornered (intentional, part of the terminal aesthetic).

---

## Animations / effects

| Effect | Implementation |
|--------|----------------|
| Cursor blink | `.C-cursor[data-on="false"]` → `opacity:0`, `transition: opacity .1s`. Toggle `data-on` every ~540ms. |
| Scanlines | `.dirC::after` — 3px-period `repeating-linear-gradient`, `mix-blend-mode: multiply`, `opacity: .55`. Pure CSS, no JS. |
| Phosphor glow | `text-shadow` on `h1`, `.C-pw`, `.C-cursor`; `drop-shadow` on `.C-gauge-fill`. Tinted via `color-mix` so each theme glows in its own hue. |
| Gauge fill | `.C-gauge-fill` animates `width` with `transition: width .25s cubic-bezier(.3,.7,.4,1)`. |
| Ambient gradients | `.dirC::before` — two soft radial gradients (accent glow top-right, vignette bottom-left). |
| Button hovers | `.C-bracket`, `.C-tab`, `.C-eye` — `.12s` color/background transitions. |

The gauge ticks (filled + empty) are drawn as `repeating-linear-gradient`
patterns, **not** text glyphs — this keeps them crisp at any zoom/DPI.

---

## Quick start

1. Open `markup-reference.html` in a browser to confirm the target look.
2. Copy `passreg.css` into your project; load IBM Plex Mono.
3. Recreate the markup structure in your framework, preserving the class names.
4. Wire each `HOOK[...]` to your existing generator state/handlers per the table above.
5. Drop the theme/cosmetic prefs (`data-accent`, `data-rules`) into your settings if you want them user-facing — otherwise just hardcode `amber` + `1`.
