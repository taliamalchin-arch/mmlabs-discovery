'use client';

import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (key: string, value: string | string[]) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function Screen6({ data, onChange, onSubmit, onBack }: Props) {
  return (
    <div className="screen-enter">
      <div className="section-header">
        <span>Optional Details</span>
        <span>6 of 6 — optional but useful</span>
      </div>

      <div className="screen-intro-hint">
        No wrong answers. Even rough instincts here save a revision round.
      </div>

      <div className="q-group">
        <div className="q-label">
          Any colors you&rsquo;re already drawn to — or want to avoid?
        </div>
        <div className="q-hint">
          Founders almost always have strong color opinions. Even a vague instinct is
          useful.
        </div>
        <textarea
          placeholder="We like warm tones / we hate blue / nothing too corporate..."
          value={data.colorPrefs || ''}
          onChange={e => onChange('colorPrefs', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Is there a font or style of type that feels right or wrong for MMLABS?
        </div>
        <div className="q-hint">
          Doesn&rsquo;t have to be a specific name — &ldquo;clean and geometric&rdquo; or
          &ldquo;humanist and warm&rdquo; works.
        </div>
        <textarea
          placeholder="Should feel like ___ / definitely not like ___"
          value={data.fontPrefs || ''}
          onChange={e => onChange('fontPrefs', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Are there any brands in your space whose visual identity you think is doing it
          well?
        </div>
        <div className="q-hint">
          Not competitors you&rsquo;re afraid of — brands you think have solved the visual
          problem for a similar audience.
        </div>
        <textarea
          placeholder="I keep coming back to ___ because ___"
          value={data.brandInspo || ''}
          onChange={e => onChange('brandInspo', e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn-g" onClick={onBack}>← Back</button>
        <button className="btn-submit" onClick={onSubmit}>Generate brief →</button>
      </div>
    </div>
  );
}
