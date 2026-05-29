'use client';

interface Props {
  entropy: number;
}

type Tone = 'weak' | 'fair' | 'good';

function getTone(entropy: number): Tone {
  if (entropy < 40) return 'weak';
  if (entropy < 60) return 'fair';
  return 'good';
}

function getLabel(entropy: number): string {
  if (entropy < 40)  return 'weak';
  if (entropy < 60)  return 'fair';
  if (entropy < 80)  return 'strong';
  if (entropy < 110) return 'very strong';
  return 'super strong';
}

const MAX_ENTROPY = 128;

export default function StrengthIndicator({ entropy }: Props) {
  const tone  = getTone(entropy);
  const ratio = Math.min(entropy / MAX_ENTROPY, 1);
  const label = getLabel(entropy);

  return (
    <div>
      {/* Full-width gauge bar */}
      <div className={`C-gauge tone-${tone}`} style={{ width: '100%' }}>
        <div
          className="C-gauge-fill"
          style={{ width: `${(ratio * 100).toFixed(1)}%` }}
        />
      </div>
      {/* Label below the bar */}
      <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--c-muted-lo)' }}>
        <span className={`C-strength-lbl tone-${tone}`}>{label}</span>
        <span className="C-bits"> · ~{entropy.toFixed(0)} bits</span>
      </p>
    </div>
  );
}
