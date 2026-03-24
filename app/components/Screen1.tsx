'use client';

import Chip from './Chip';
import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (key: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Screen1({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="screen-enter">
      <div className="section-header">
        <span>Deadlines &amp; Scope</span>
        <span>1 of 6</span>
      </div>

      <div className="q-group">
        <div className="q-label">
          April 10 — is that still the hard deadline for the incubator submission?
        </div>
        <div className="q-hint">Just confirming, since this sets everything else.</div>
        <Chip
          options={[
            'Yes — April 10 is locked',
            "It's shifted — new date below",
            'No hard deadline right now',
          ]}
          selected={data.deadline || ''}
          onSelect={v => onChange('deadline', v)}
        />
        <input
          type="text"
          placeholder="If the date has changed or there's more context..."
          value={data.deadlineNote || ''}
          onChange={e => onChange('deadlineNote', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          What actually needs to exist and look on-brand by that date?
        </div>
        <div className="q-hint">
          Not everything you want eventually — just what&rsquo;s required for the submission.
        </div>
        <Chip
          options={[
            'Pitch deck',
            'Landing page',
            'Product mockup or screenshot',
            'Logo only',
            'Social presence',
            'Demo or animation',
          ]}
          selected={data.phase1Deliverables || []}
          onSelect={v => onChange('phase1Deliverables', v)}
          multi
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Beyond the submission — what does the full brand system need to cover eventually?
        </div>
        <Chip
          options={[
            'Full website',
            'Product UI skin',
            'Marketing assets',
            'Brand guidelines doc',
            'Email and comms templates',
            'Motion or animation direction',
            'Print or physical',
          ]}
          selected={data.phase2Deliverables || []}
          onSelect={v => onChange('phase2Deliverables', v)}
          multi
        />
      </div>

      <div className="btn-row">
        <button className="btn-g" onClick={onBack}>← Back</button>
        <button className="btn-p" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}
