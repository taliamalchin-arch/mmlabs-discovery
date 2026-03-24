'use client';

import Chip from './Chip';
import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (key: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Screen4({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="screen-enter">
      <div className="section-header">
        <span>Visual Direction</span>
        <span>4 of 6</span>
      </div>

      <div className="screen-intro-hint">
        Locking in decisions, not brainstorming. The visual territory is already taking
        shape — these questions make it more specific.
      </div>

      <div className="q-group">
        <div className="q-label">
          You mentioned paint and ink splashes and &ldquo;little critters.&rdquo; How
          committed are you to including that direction?
        </div>
        <div className="q-hint">
          Worth being honest — a character-led brand is a significant commitment that
          changes the whole system. There are directions that don&rsquo;t involve
          characters at all.
        </div>
        <Chip
          options={[
            'Very committed — this feels core to the brand',
            'Open to it but want to see alternatives first',
            "It was a loose idea — happy to explore other directions",
          ]}
          selected={data.critterCommitment || ''}
          onSelect={v => onChange('critterCommitment', v)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          If a character is included — what role do you see it playing?
        </div>
        <div className="q-hint">
          A mascot makes the brand approachable and memorable but shapes everything
          downstream. One specific direction: a character to represent the AI agent
          itself — the face of the product&rsquo;s intelligence. That&rsquo;s a meaningful
          distinction from a pure brand mascot.
        </div>
        <Chip
          options={[
            'The face of the brand — mascot, front and center',
            "The AI agent — represents the product's intelligence",
            "Situational — shows up in specific moments, not everywhere",
            "Decorative texture — adds life but isn't a brand character",
          ]}
          selected={data.characterRole || ''}
          onSelect={v => onChange('characterRole', v)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">Anything to add to the visual avoidance list?</div>
        <div className="q-hint">
          <strong>Already confirmed: Notion, pencil-line hand-drawn aesthetic.</strong>
        </div>
        <textarea
          placeholder="Also avoid..."
          value={data.visualAvoid || ''}
          onChange={e => onChange('visualAvoid', e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn-g" onClick={onBack}>← Back</button>
        <button className="btn-p" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}
