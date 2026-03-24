'use client';

import Chip from './Chip';
import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (key: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Screen2({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="screen-enter">
      <div className="section-header">
        <span>Budget &amp; Working Terms</span>
        <span>2 of 6</span>
      </div>

      <div className="q-group">
        <div className="q-label">What budget are you working with for brand design?</div>
        <div className="q-hint">
          No ranges — just tell me what you&rsquo;re thinking. This helps make sure scope
          and deliverables are realistic on both sides.
        </div>
        <textarea
          placeholder="We're thinking around $___. Or: we're flexible and open to a proposal."
          value={data.budget || ''}
          onChange={e => onChange('budget', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Who on your team will be using the brand system day-to-day?
        </div>
        <div className="q-hint">
          Shapes how the handoff is packaged — a developer needs different files than
          someone using AI tools to generate assets.
        </div>
        <Chip
          options={[
            'Developers',
            'Non-designers using AI tools',
            'In-house or contracted designers',
            'Founders doing it themselves',
          ]}
          selected={data.brandUsers || []}
          onSelect={v => onChange('brandUsers', v)}
          multi
        />
      </div>

      <div className="q-group">
        <div className="q-label">Who has final sign-off on brand decisions?</div>
        <div className="q-hint">
          Knowing who&rsquo;s in the room affects how revisions and approvals work.
        </div>
        <input
          type="text"
          placeholder="e.g. Sam and Alvin together, or one person specifically"
          value={data.signoff || ''}
          onChange={e => onChange('signoff', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Any constraints or preferences around how we work together?
        </div>
        <div className="q-hint">
          Revision rounds, communication style, feedback format, availability.
        </div>
        <textarea
          placeholder="e.g. we prefer async, two feedback rounds, files in Figma not PDFs..."
          value={data.workingPrefs || ''}
          onChange={e => onChange('workingPrefs', e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn-g" onClick={onBack}>← Back</button>
        <button className="btn-p" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}
