'use client';

import type { MemorableConfig } from '@/hooks/useMemorablePassword';

interface Props {
  config: MemorableConfig;
  onChange: (config: MemorableConfig) => void;
}

const OPTIONS: {
  key: keyof MemorableConfig;
  label: string;
  example: string;
}[] = [
  { key: 'useSymbols', label: 'symbols',            example: '! @ # $ % .' },
  { key: 'useDashes',  label: 'dashes/underscores',  example: '- _'         },
  { key: 'useDigits',  label: 'digits',              example: '0–9'         },
];

export default function MemorableOptions({ config, onChange }: Props) {
  const activeCount = OPTIONS.filter(({ key }) => config[key]).length;

  const toggle = (key: keyof MemorableConfig, value: boolean) => {
    if (!value && activeCount <= 1) return;
    onChange({ ...config, [key]: value });
  };

  return (
    <>
      {OPTIONS.map(({ key, label, example }) => (
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
    </>
  );
}
