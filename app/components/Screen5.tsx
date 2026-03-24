'use client';

import Pair from './Pair';
import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (key: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Screen5({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="screen-enter">
      <div className="section-header">
        <span>Brand Personality</span>
        <span>5 of 6</span>
      </div>

      <div className="screen-intro-hint">
        One from each pair. Trust your first instinct.
      </div>

      <Pair
        label="When a lawyer opens the product, it should feel..."
        left={{ title: 'Calm & trusted', sub: "A reliable tool they don't think about" }}
        right={{ title: 'Sharp & impressive', sub: 'Software that makes them look good' }}
        value={(data.pair1 as 'left' | 'right' | '') || ''}
        onChange={v => onChange('pair1', v)}
      />

      <Pair
        label="When a client (the immigrant family) opens it, it should feel..."
        left={{ title: 'Warm & safe', sub: "Like someone's got their back" }}
        right={{ title: 'Clear & efficient', sub: 'No noise, just what they need' }}
        value={(data.pair2 as 'left' | 'right' | '') || ''}
        onChange={v => onChange('pair2', v)}
      />

      <Pair
        label="Overall brand energy"
        left={{ title: 'Quiet confidence', sub: 'Does the work without needing attention' }}
        right={{ title: 'Visible ambition', sub: 'Feels like a movement, not just a product' }}
        value={(data.pair3 as 'left' | 'right' | '') || ''}
        onChange={v => onChange('pair3', v)}
      />

      <Pair
        label="Visual density"
        left={{ title: 'Minimal & airy', sub: 'Space does the work' }}
        right={{ title: 'Rich & textured', sub: 'Visual personality everywhere' }}
        value={(data.pair4 as 'left' | 'right' | '') || ''}
        onChange={v => onChange('pair4', v)}
      />

      <div className="q-group">
        <div className="q-label">
          In three words — how should someone feel the first time they see the brand?
        </div>
        <input
          type="text"
          placeholder="e.g. relieved, seen, capable"
          value={(data.threeWords as string) || ''}
          onChange={e => onChange('threeWords', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">Anything else before we build the brief?</div>
        <textarea
          placeholder="Constraints, context, things I should know going in..."
          value={(data.anythingElse as string) || ''}
          onChange={e => onChange('anythingElse', e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn-g" onClick={onBack}>← Back</button>
        <button className="btn-p" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}
