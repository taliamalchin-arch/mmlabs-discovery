'use client';

import Chip from './Chip';
import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (key: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Screen3({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="screen-enter">
      <div className="section-header">
        <span>Technical Details &amp; Naming</span>
        <span>3 of 6</span>
      </div>

      <div className="q-group">
        <div className="q-label">
          Do you have other sub-brands or separate products in the MMLABS family?
        </div>
        <div className="q-hint">
          My sense is that MMLABS is the parent company with separate product lines
          underneath — I want to understand what&rsquo;s established, what&rsquo;s in
          consideration, and what&rsquo;s still unnamed. Affects the full logo and naming
          hierarchy.
        </div>
        <Chip
          options={[
            'One name — MMLABS is everything for now',
            'Separate products exist or are planned',
            'Not decided yet',
          ]}
          selected={data.subBrands || ''}
          onSelect={v => onChange('subBrands', v)}
        />
        <textarea
          placeholder="List any product or sub-brand names you have in mind, even if rough or tentative..."
          value={data.subBrandsNote || ''}
          onChange={e => onChange('subBrandsNote', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Does MM stand for something — or what do you want it to represent?
        </div>
        <div className="q-hint">
          Right now MM doesn&rsquo;t have a fixed meaning, which is actually an opportunity.
          This is something we can work through together from a brand strategy angle — but
          I want to know if you have instincts or directions you&rsquo;re already drawn to.
        </div>
        <textarea
          placeholder="e.g. we've thought about ___. Or: no idea yet, open to anything. Or: it should feel like ___..."
          value={data.mmMeaning || ''}
          onChange={e => onChange('mmMeaning', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          When someone hears or sees MMLABS — what do you want them to immediately think
          or feel?
        </div>
        <div className="q-hint">
          Doesn&rsquo;t need to be literal. Think about category, feeling, or the kind of
          company it signals you are.
        </div>
        <textarea
          placeholder="We want people to think ___ / feel ___ / assume we're a company that ___"
          value={data.brandPerception || ''}
          onChange={e => onChange('brandPerception', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">Where does the product live?</div>
        <div className="q-hint">
          Affects type scale, spacing, and which visual treatments are practical to
          implement.
        </div>
        <Chip
          options={[
            'Web — desktop',
            'Web — mobile',
            'iOS app',
            'Android app',
            'Nothing built yet',
          ]}
          selected={data.platforms || []}
          onSelect={v => onChange('platforms', v)}
          multi
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Does it need to support languages other than English?
        </div>
        <div className="q-hint">
          Directly affects typeface selection — many fonts don&rsquo;t support full
          character sets for Spanish, Chinese, Arabic, and others.
        </div>
        <Chip
          options={[
            'English only for now',
            'Yes — multilingual is part of the product',
            'Not sure yet',
          ]}
          selected={data.languages || ''}
          onSelect={v => onChange('languages', v)}
        />
        <input
          type="text"
          placeholder="If multilingual — which languages matter most?"
          value={data.languagesNote || ''}
          onChange={e => onChange('languagesNote', e.target.value)}
        />
      </div>

      <div className="q-group">
        <div className="q-label">
          Is there anything currently built that the visual system needs to map onto?
        </div>
        <Chip
          options={[
            'Greenfield — nothing yet',
            'Wireframes or flows exist',
            'Prototype or staging build',
            'Live product to reskin',
          ]}
          selected={data.existingBuild || ''}
          onSelect={v => onChange('existingBuild', v)}
        />
        <input
          type="text"
          placeholder="Link or description of what exists, if anything..."
          value={data.existingBuildNote || ''}
          onChange={e => onChange('existingBuildNote', e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn-g" onClick={onBack}>← Back</button>
        <button className="btn-p" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}
