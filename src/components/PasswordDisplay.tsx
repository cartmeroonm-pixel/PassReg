'use client';

import { useState } from 'react';

interface Props {
  password: string;
  onRegenerate: () => void;
  memo?: React.ReactNode;
}

export default function PasswordDisplay({ password, onRegenerate, memo }: Props) {
  const [copied,  setCopied]  = useState(false);
  const [visible, setVisible] = useState(true);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      {/* HOOK[password] + HOOK[hide-toggle] */}
      <div className="C-pw-wrap">
        <span className="C-prompt-mini">»</span>
        <div className={`C-pw${!visible ? ' hide' : ''}`}>
          {!visible
            ? '•'.repeat(Math.max(password.length, 1))
            : (password || '—')}
        </div>
        <button className="C-eye" onClick={() => setVisible(v => !v)}>
          {visible ? 'hide' : 'show'}
        </button>
      </div>

      {/* HOOK[memo] — renders between password and buttons */}
      {memo}

      {/* HOOK[copy] + HOOK[regen] */}
      <div className="C-actions">
        <button
          className={`C-bracket${copied ? ' hot' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '[ ✓ copied ]' : '[ ⎘ copy ]'}
        </button>
        <button className="C-bracket" onClick={onRegenerate}>
          [ ↻ new ]
        </button>
      </div>
    </>
  );
}
