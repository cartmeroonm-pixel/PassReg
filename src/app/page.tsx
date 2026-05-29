'use client';

import { useState, useEffect } from 'react';
import PasswordDisplay from '@/components/PasswordDisplay';
import PasswordOptions from '@/components/PasswordOptions';
import MemorableOptions from '@/components/MemorableOptions';
import StrengthIndicator from '@/components/StrengthIndicator';
import MemorableGenerator from '@/components/MemorableGenerator';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { useMemorablePassword } from '@/hooks/useMemorablePassword';

type Mode = 'random' | 'memorable';

const DASHES = '─'.repeat(800);

export default function Home() {
  const [mode, setMode]         = useState<Mode>('random');
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn(v => !v), 540);
    return () => clearInterval(id);
  }, []);

  const random    = usePasswordGenerator();
  const memorable = useMemorablePassword();

  const password     = mode === 'random' ? random.password  : memorable.password;
  const entropy      = mode === 'random' ? random.entropy   : memorable.entropy;
  const onRegenerate = mode === 'random' ? random.generate  : memorable.generate;

  return (
    <div className="stage">
      <div className="dirC" data-accent="amber" data-rules="1">

        {/* 1. Header row */}
        <header className="C-head">
          <span className="C-prompt">
            $&nbsp;passreg&nbsp;<span className="C-flag">--generate</span>
          </span>
          <span className="C-meta">v0.1.0 · 2026</span>
        </header>

        {/* 2. Intro */}
        <section className="C-intro">
          <h1>
            PassReg
            <span className="C-cursor" data-on={cursorOn ? 'true' : 'false'}>▌</span>
          </h1>
          <p>
            A password generator that runs entirely in your browser.<br />
            No servers. No accounts. No syncing.
          </p>
        </section>

        {/* 3. Mode — NOT boxed, section rule style */}
        <div style={{ marginTop: '18px' }}>
          <div className="C-sec-head">── mode {DASHES}</div>
          <div className="C-tabs">
            {(['memorable', 'random'] as const).map((m) => (
              <button
                key={m}
                className={`C-tab${mode === m ? ' on' : ''}`}
                onClick={() => setMode(m)}
              >
                <span className="C-pre">{mode === m ? '▶' : ' '}</span>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Output box — full width */}
        <div className="box" style={{ marginTop: '20px' }}>
          <div className="rule">
            <span className="label">output</span>
            <span className="line" />
          </div>
          <PasswordDisplay
            password={password}
            onRegenerate={onRegenerate}
            memo={mode === 'memorable' ? <MemorableGenerator hint={memorable.hint} /> : null}
          />
        </div>

        {/* 5. 2-column grid: strength + options */}
        <div className="two-col-grid">
          <div className="box">
            <div className="rule">
              <span className="label">strength</span>
              <span className="line" />
            </div>
            <StrengthIndicator entropy={entropy} />
          </div>
          <div className="box">
            <div className="rule">
              <span className="label">options</span>
              <span className="line" />
            </div>
            {mode === 'random' && (
              <PasswordOptions config={random.config} onChange={random.setConfig} />
            )}
            {mode === 'memorable' && (
              <MemorableOptions config={memorable.config} onChange={memorable.setConfig} />
            )}
          </div>
        </div>

        {/* 6. Footer */}
        <footer className="C-foot" style={{ marginTop: '24px' }}>
          <div style={{ flex: 1, height: 0, borderTop: '1px solid #3a3326' }} />
          <span className="C-foot-note">crypto.getRandomValues() · open source · MIT</span>
        </footer>

        {/* SEO */}
        <section style={{ marginTop: '40px', color: '#5e5644', fontSize: '11px', lineHeight: 1.7 }}>
          <h2 style={{ fontSize: '12px', fontWeight: 500, color: '#8a7f64', marginBottom: '6px', marginTop: 0 }}>
            Free Online Password Generator — Create Strong Passwords Instantly
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            Our password generator creates truly random, strong passwords directly in your
            browser using the Web Crypto API. Every random password is assembled from your
            chosen character sets, making it virtually impossible to guess or brute-force.
            Unlike many other tools, we never transmit your password to a server.
          </p>
          <h2 style={{ fontSize: '12px', fontWeight: 500, color: '#8a7f64', marginBottom: '6px', marginTop: 0 }}>
            Memorable Password Generator — Strong Passwords You Can Actually Remember
          </h2>
          <p style={{ margin: 0 }}>
            Our memorable password mode generates a strong password you can remember without
            writing it down — three vivid English words joined by symbols and digits in an
            unpredictable order, with a mnemonic hint to help you recall the scene.
          </p>
        </section>

      </div>
    </div>
  );
}
