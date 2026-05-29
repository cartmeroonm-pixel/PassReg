'use client';

import type { PasswordConfig } from '@/hooks/usePasswordGenerator';

interface Props {
  config: PasswordConfig;
  onChange: (config: PasswordConfig) => void;
}

const CHECKBOXES: {
  key: keyof Omit<PasswordConfig, 'length'>;
  label: string;
  example: string;
}[] = [
  { key: 'uppercase', label: 'uppercase', example: 'A–Z'     },
  { key: 'lowercase', label: 'lowercase', example: 'a–z'     },
  { key: 'numbers',   label: 'digits',    example: '0–9'     },
  { key: 'symbols',   label: 'symbols',   example: '! @ # $' },
];

export default function PasswordOptions({ config, onChange }: Props) {
  const activeCount = CHECKBOXES.filter(({ key }) => config[key]).length;

  const toggle = (key: keyof Omit<PasswordConfig, 'length'>, value: boolean) => {
    if (!value && activeCount <= 1) return;
    onChange({ ...config, [key]: value });
  };

  return (
    <>
      {/* HOOK[option] — checkboxes */}
      {CHECKBOXES.map(({ key, label, example }) => (
        <label key={key} className="C-opt-row C-opt-checkable">
          <span className="C-opt-l">
            <span className={`C-cb${config[key] ? ' on' : ''}`}>
              {config[key] ? '[x]' : '[ ]'}
            </span>
            <input
              type="checkbox"
              checked={config[key]}
              onChange={(e) => toggle(key, e.target.checked)}
            />
            <span className="C-opt-name">{label}</span>
          </span>
          <span className="C-opt-r">{example}</span>
        </label>
      ))}

      {/* HOOK[length] — range row */}
      <div className="C-opt-row">
        <span className="C-opt-l">length</span>
        <span className="C-opt-mid">
          <input
            type="range"
            min={8}
            max={64}
            value={config.length}
            onChange={(e) => onChange({ ...config, length: Number(e.target.value) })}
          />
        </span>
        <span className="C-opt-r">{String(config.length).padStart(2, ' ')}</span>
      </div>
    </>
  );
}
