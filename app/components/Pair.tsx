'use client';

interface PairProps {
  label: string;
  left: { title: string; sub: string };
  right: { title: string; sub: string };
  value: 'left' | 'right' | '';
  onChange: (value: 'left' | 'right') => void;
}

export default function Pair({ label, left, right, value, onChange }: PairProps) {
  return (
    <div className="q-group">
      <div className="q-label">{label}</div>
      <div className="pair">
        <div
          className={`pair-option${value === 'left' ? ' on' : ''}`}
          onClick={() => onChange('left')}
        >
          <div className="pl">{left.title}</div>
          <div className="ps">{left.sub}</div>
        </div>
        <div className="pair-divider">Or</div>
        <div
          className={`pair-option${value === 'right' ? ' on' : ''}`}
          onClick={() => onChange('right')}
        >
          <div className="pl">{right.title}</div>
          <div className="ps">{right.sub}</div>
        </div>
      </div>
    </div>
  );
}
