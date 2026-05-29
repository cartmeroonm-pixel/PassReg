// terminal.jsx — Direction C: terminal / monospace document.
// Warm dark canvas, amber accent, IBM Plex Mono throughout. Feels like the
// manpage for a thoughtful CLI tool, not a hacker-movie terminal.
//
// Props (all optional — defaults match the canvas usage exactly):
//   accent     "amber" | "phosphor" | "cyan" | "crimson"   (default "amber")
//   showMemo   bool — show the "picture" memo for memorable mode (default true)
//   showRules  bool — show "── section ───" ASCII rules (default true)

function DirectionC({ accent = "amber", showMemo = true, showRules = true } = {}) {
  const PR = window.PassReg;
  const [mode, setMode] = React.useState("memorable");
  const [opts, setOpts] = React.useState({ ...PR.DEFAULT_OPTS });
  const [showPw, setShowPw] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [gen, setGen] = React.useState(() => PR.generateMemorable(opts));
  const [blink, setBlink] = React.useState(true);

  React.useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 540);
    return () => clearInterval(id);
  }, []);

  const regenerate = React.useCallback(() => {
    setGen(mode === "memorable" ? PR.generateMemorable(opts) : PR.generateRandom(opts));
    setCopied(false);
  }, [mode, opts]);

  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    regenerate();
  }, [mode, opts.symbols, opts.dashes, opts.digits, opts.length]);

  const setOpt = (k, v) => setOpts((p) => ({ ...p, [k]: v }));
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(gen.password); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  const s = PR.strengthOf(gen.password);

  return (
    <div className="dirC" data-accent={accent} data-rules={showRules ? "1" : "0"}>
      <style>{styleC}</style>

      <header className="C-head">
        <span className="C-prompt">$&nbsp;passreg&nbsp;<span className="C-flag">--generate</span></span>
        <span className="C-meta">v0.1.0 · local-only · 2026</span>
      </header>

      <section className="C-intro">
        <h1>PassReg<span className="C-cursor" data-on={blink}>▌</span></h1>
        <p>
          A password generator that runs entirely in your browser.<br />
          No servers. No accounts. No syncing.
        </p>
      </section>

      <Section title="mode" showRules={showRules}>
        <div className="C-tabs">
          {[["memorable","memorable"],["random","random"]].map(([v,l]) => (
            <button key={v} className={`C-tab ${mode===v?"on":""}`} onClick={() => setMode(v)}>
              <span className="C-pre">{mode===v ? "▶" : " "}</span>{l}
            </button>
          ))}
        </div>
      </Section>

      <Section title="output" showRules={showRules}>
        <div className="C-pw-wrap">
          <span className="C-prompt-mini">»</span>
          <div className={`C-pw ${showPw?"":"hide"}`}>
            {showPw ? gen.password : "•".repeat(Math.min(28, gen.password.length))}
          </div>
          <button className="C-eye" onClick={() => setShowPw(!showPw)}
                  title={showPw ? "Hide" : "Show"}>
            {showPw ? "hide" : "show"}
          </button>
        </div>

        {showMemo && mode === "memorable" && gen.memo && (
          <div className="C-memo">
            <div className="C-memo-top">─── picture ───</div>
            <div className="C-memo-body">{gen.memo}</div>
          </div>
        )}

        <div className="C-actions">
          <button className={`C-bracket ${copied?"hot":""}`} onClick={onCopy}>
            [ {copied ? "copied ✓" : "⎘ copy"} ]
          </button>
          <button className="C-bracket" onClick={regenerate}>
            [ ↻ new ]
          </button>
        </div>
      </Section>

      <Section title="strength" showRules={showRules}>
        <div className="C-strength">
          <div className={`C-gauge tone-${s.tone}`}>
            <div className="C-gauge-fill" style={{ width: `${s.ratio * 100}%` }} />
          </div>
          <div className="C-strength-meta">
            <span className={`C-strength-lbl tone-${s.tone}`}>{s.label.toLowerCase()}</span>
            <span className="C-bits"> · ~{s.bits} bits</span>
          </div>
        </div>
      </Section>

      <Section title="options" showRules={showRules}>
        <OptC label="symbols"             hint="! @ # $ % ^ & * ?" checked={opts.symbols} onChange={(v)=>setOpt("symbols",v)} />
        <OptC label="dashes/underscores"  hint="- _"               checked={opts.dashes}  onChange={(v)=>setOpt("dashes",v)} />
        <OptC label="digits"              hint="0–9"               checked={opts.digits}  onChange={(v)=>setOpt("digits",v)} />
        {mode === "random" && (
          <div className="C-opt-row">
            <span className="C-opt-l">length</span>
            <span className="C-opt-mid">
              <input type="range" min="8" max="48" value={opts.length}
                     onChange={(e)=>setOpt("length",Number(e.target.value))} />
            </span>
            <span className="C-opt-r">{String(opts.length).padStart(2,"0")}</span>
          </div>
        )}
      </Section>

      {showRules && <div className="C-divider">{"─".repeat(72)}</div>}

      <footer className="C-foot">
        <span className="C-foot-note">crypto.getRandomValues() · open source · MIT</span>
      </footer>
    </div>
  );
}

function Section({ title, showRules = true, children }) {
  return (
    <section className="C-section">
      {showRules ? (
        <div className="C-sec-head">── {title} {"─".repeat(Math.max(0, 64 - title.length))}</div>
      ) : (
        <div className="C-sec-head plain">{title}</div>
      )}
      <div className="C-sec-body">{children}</div>
    </section>
  );
}

function OptC({ label, hint, checked, onChange }) {
  return (
    <label className="C-opt-row C-opt-checkable">
      <span className="C-opt-l">
        <span className={`C-cb ${checked?"on":""}`}>[{checked ? "x" : " "}]</span>
        <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
        <span className="C-opt-name">{label}</span>
      </span>
      <span className="C-opt-r">{hint}</span>
    </label>
  );
}

// ── Palette tokens. Defaults match the original amber direction; accent and
// accent-hi swap per [data-accent=...]; good/weak/bg/ink stay constant.
const styleC = `
  .dirC {
    --c-bg: #18140f;
    --c-panel: #1f1a14;
    --c-ink: #e9e0c8;
    --c-ink-hi: #f3eada;
    --c-ink-mid: #d4c9a6;
    --c-muted: #b8aa8c;
    --c-muted-lo: #8a7f64;
    --c-muted-soft: #5e5644;
    --c-rule: #3a3326;
    --c-good: #9ec57a;
    --c-weak: #d96e54;
    --c-accent: #e3a14a;
    --c-accent-hi: #f0b25c;
  }
  .dirC[data-accent="phosphor"] { --c-accent: #9ec57a; --c-accent-hi: #b8d995; }
  .dirC[data-accent="cyan"]     { --c-accent: #6cb8b8; --c-accent-hi: #84cccc; }
  .dirC[data-accent="crimson"]  { --c-accent: #d96e54; --c-accent-hi: #ed8a72; }

  .dirC {
    width: 100%; min-height: 100%; box-sizing: border-box;
    background: var(--c-bg);
    color: var(--c-ink);
    font: 14px/1.55 "IBM Plex Mono", ui-monospace, monospace;
    padding: 48px 64px;
    position: relative;
  }
  .dirC::before {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(at 80% 20%, color-mix(in oklab, var(--c-accent) 8%, transparent), transparent 50%),
      radial-gradient(at 20% 80%, rgba(0,0,0,.4), transparent 60%);
  }
  /* Very faint scanlines — invisible at a glance, gives the surface a slight
     CRT texture. Period of 3px so it survives at any zoom without aliasing. */
  .dirC::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      rgba(0,0,0,.10) 0 1px,
      transparent 1px 3px
    );
    mix-blend-mode: multiply;
    opacity: .55;
  }
  .dirC > * { position: relative; z-index: 1; }

  .C-head {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 12.5px; color: var(--c-muted);
    padding-bottom: 14px;
    border-bottom: 1px solid color-mix(in oklab, var(--c-ink) 14%, transparent);
  }
  .C-prompt { color: var(--c-muted); }
  .C-flag { color: var(--c-accent); }
  .C-meta { color: var(--c-muted-lo); font-size: 11.5px; letter-spacing: .04em; }

  .C-intro { padding: 36px 0 24px; }
  .C-intro h1 {
    font: 600 38px "IBM Plex Mono", monospace;
    margin: 0 0 14px; letter-spacing: -.01em;
    color: var(--c-ink-hi);
    text-shadow: 0 0 12px color-mix(in oklab, var(--c-ink-hi) 30%, transparent);
  }
  .C-cursor {
    color: var(--c-accent); margin-left: 6px;
    text-shadow: 0 0 10px color-mix(in oklab, var(--c-accent) 60%, transparent);
    transition: opacity .1s;
  }
  .C-cursor[data-on="false"] { opacity: 0; }
  .C-intro p { margin: 0; color: var(--c-muted); font-size: 13.5px; }

  .C-section { margin-top: 18px; }
  .C-sec-head {
    color: var(--c-muted-soft);
    font-size: 13px;
    letter-spacing: -.04em;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .C-sec-head.plain {
    color: var(--c-muted-lo);
    font-size: 11px;
    letter-spacing: .18em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .C-sec-body { padding: 0; }

  .C-tabs { display: flex; gap: 24px; }
  .C-tab {
    appearance: none; border: 0; background: transparent;
    font: 400 15px "IBM Plex Mono", monospace;
    color: var(--c-muted-lo); cursor: pointer; padding: 0;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .C-tab .C-pre { color: var(--c-accent); width: 12px; display: inline-block; }
  .C-tab.on { color: var(--c-ink); }

  .C-pw-wrap {
    display: flex; align-items: center; gap: 12px;
    background: var(--c-panel);
    border: 1px solid color-mix(in oklab, var(--c-ink) 12%, transparent);
    padding: 12px 8px 12px 18px;
  }
  .C-prompt-mini { color: var(--c-accent); flex-shrink: 0; font-weight: 600; }
  .C-pw {
    flex: 1; min-width: 0;
    font: 500 20px "IBM Plex Mono", monospace;
    color: var(--c-ink-hi); word-break: break-all;
    line-height: 1.3; letter-spacing: -.005em;
    text-shadow: 0 0 8px color-mix(in oklab, var(--c-ink-hi) 25%, transparent);
  }
  .C-pw.hide { color: var(--c-muted-lo); letter-spacing: .1em; text-shadow: none; }
  .C-eye {
    appearance: none; border: 0; background: transparent;
    color: var(--c-muted); cursor: pointer; flex-shrink: 0;
    font: 400 12.5px "IBM Plex Mono", monospace;
    padding: 8px 14px;
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--c-muted) 35%, transparent);
    text-underline-offset: 4px;
    transition: color .12s, text-decoration-color .12s;
  }
  .C-eye:hover { color: var(--c-accent); text-decoration-color: var(--c-accent); }

  .C-memo {
    margin-top: 14px;
    padding: 10px 14px;
    border: 1px dashed color-mix(in oklab, var(--c-ink) 14%, transparent);
  }
  .C-memo-top { font-size: 11px; color: var(--c-muted-lo); margin-bottom: 6px; }
  .C-memo-body { color: var(--c-ink-mid); font-style: italic; font-size: 13.5px; }

  .C-actions { display: flex; gap: 8px; margin-top: 16px; }
  /* V1 bracket buttons — accent-bordered, equal weight for copy + regen. */
  .C-bracket {
    appearance: none; cursor: pointer;
    border: 1px solid var(--c-accent);
    background: transparent; color: var(--c-accent);
    font: 500 13px "IBM Plex Mono", monospace;
    padding: 11px 22px;
    letter-spacing: .02em;
    transition: background .12s, color .12s, border-color .12s;
  }
  .C-bracket:hover { background: color-mix(in oklab, var(--c-accent) 12%, transparent); }
  .C-bracket.hot {
    border-color: var(--c-good); color: var(--c-good);
    background: color-mix(in oklab, var(--c-good) 12%, transparent);
  }

  .C-strength { display: flex; align-items: center; gap: 20px; flex-wrap: nowrap; }
  /* Block-style gauge as CSS patterns so it stays sharp at any canvas zoom. */
  .C-gauge {
    position: relative;
    flex: 1 1 auto; min-width: 0;
    height: 12px;
    overflow: hidden;
    background: repeating-linear-gradient(
      to right,
      color-mix(in oklab, var(--c-ink) 16%, transparent) 0 6px,
      transparent 6px 8px
    );
  }
  .C-gauge-fill {
    position: absolute; left: 0; top: 0; bottom: 0;
    background: repeating-linear-gradient(
      to right,
      currentColor 0 6px,
      transparent 6px 8px
    );
    filter: drop-shadow(0 0 4px color-mix(in oklab, currentColor 45%, transparent));
    transition: width .25s cubic-bezier(.3,.7,.4,1);
  }
  .C-gauge.tone-good { color: var(--c-good); }
  .C-gauge.tone-fair { color: var(--c-accent); }
  .C-gauge.tone-weak { color: var(--c-weak); }
  .C-strength-meta {
    /* Fixed width so the gauge length doesn't reflow when the label text
       changes (weak / fair / strong / very strong + bit count). */
    width: 180px;
    text-align: right;
    font-size: 13px;
    color: var(--c-muted-lo);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .C-strength-lbl.tone-good { color: var(--c-good); }
  .C-strength-lbl.tone-fair { color: var(--c-accent); }
  .C-strength-lbl.tone-weak { color: var(--c-weak); }
  .C-bits { color: var(--c-muted-lo); }

  .C-opt-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 0;
    cursor: pointer; user-select: none;
  }
  .C-opt-checkable input { position: absolute; opacity: 0; pointer-events: none; }
  .C-opt-l { display: inline-flex; align-items: center; gap: 12px; color: var(--c-ink-mid); }
  .C-cb { color: var(--c-accent); font-weight: 500; }
  .C-cb.on { color: var(--c-good); }
  .C-opt-name { font-size: 14px; }
  .C-opt-r { color: var(--c-muted-lo); font-size: 13px; }
  .C-opt-mid { flex: 1; padding: 0 18px; }
  .C-opt-mid input[type="range"] {
    appearance: none; width: 100%; height: 2px;
    background: color-mix(in oklab, var(--c-ink) 18%, transparent); cursor: pointer;
  }
  .C-opt-mid input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 12px; height: 12px;
    background: var(--c-accent); border: 0; cursor: pointer; border-radius: 0;
  }
  .C-opt-mid input[type="range"]::-moz-range-thumb {
    width: 12px; height: 12px; background: var(--c-accent); border: 0; cursor: pointer; border-radius: 0;
  }

  .C-divider {
    color: var(--c-rule);
    font-size: 12px;
    letter-spacing: -.04em;
    white-space: nowrap;
    overflow: hidden;
    margin: 22px 0 18px;
  }

  .C-foot {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 20px;
    flex-wrap: wrap;
  }
  .C-foot-note { color: var(--c-muted-soft); font-size: 11.5px; letter-spacing: .04em; }
`;

window.DirectionC = DirectionC;
