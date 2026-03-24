'use client';

import ReactionBar from './ReactionBar';
import HandoffBlock from './HandoffBlock';
import TensionBlock from './TensionBlock';

interface ClientBrief {
  scopeAndTimeline: string;
  budgetAndTerms: string;
  technicalConstraints: string;
  positioning: string;
  personality: string;
  visualDirection: string;
  openItems: string[];
}

interface BriefProps {
  clientBrief: ClientBrief;
  reactions: Record<string, string[]>;
  notes: Record<string, string>;
  onReaction: (section: string, emoji: string) => void;
  onNote: (section: string, text: string) => void;
  onSubmit: () => void;
  isFallback?: boolean;
}

const SECTIONS = [
  { key: 'handoff', num: '01', label: 'Proposed Handoff & Deliverables' },
  { key: 'scopeAndTimeline', num: '02', label: 'Scope & Timeline' },
  { key: 'budgetAndTerms', num: '03', label: 'Budget & Working Terms' },
  { key: 'technicalConstraints', num: '04', label: 'Technical Constraints & Naming' },
  { key: 'positioning', num: '05', label: 'Positioning' },
  { key: 'personality', num: '06', label: 'Personality & Design Implications' },
  { key: 'visualDirection', num: '07', label: 'Visual Direction' },
  { key: 'openItems', num: '08', label: 'Open Items' },
];

const RECOMMENDED_LAYERS = [
  {
    tag: 'Phase 1 — By April 10',
    title: 'Launch Kit',
    items: [
      'Logo suite: primary lockup, secondary variant, standalone icon — SVG master, PNG at 1x/2x/3x, white/black/transparent versions',
      'Favicon kit: 16px ICO, 32px PNG, 180px Apple touch icon, OG image 1200×630',
      'Color palette: hex, RGB, HSL, and WCAG contrast ratios — primary, secondary, neutral scales',
      'Typography system: licensed web fonts with usage rules for display, body, and UI — character set confirmed for any language requirements',
      'One-page brand cheat sheet — everything to stay on-brand at a glance',
      'Applied to April 10 deliverables: deck, landing page, mockup — whatever is confirmed needed',
    ],
    meta: [
      { label: 'Format', value: 'Figma + exported assets' },
      { label: 'Target', value: 'April 10' },
    ],
  },
  {
    tag: 'Phase 2 — After April 10',
    title: 'Ongoing Brand System',
    items: [
      'Figma board with color styles, type styles, and reusable components — structured for developer and AI tool reference',
      'Brand voice document: tone and messaging guidelines structured as both human guidelines and AI system prompt',
      'Visual descriptor language: tested phrases for describing the brand to image and UI generators reliably',
      'Curated reference image set organized by use case — photography, illustration, UI mood',
      'Do/don\'t guide readable by humans and usable as AI context',
    ],
    meta: [
      { label: 'Format', value: 'Figma board + companion doc' },
      { label: 'Target', value: 'Phase 2' },
      { label: 'Users', value: 'Founders, developers, AI tools' },
    ],
  },
];

const TRADITIONAL_LAYERS = [
  {
    tag: 'Deliverables',
    title: 'Standard Package',
    items: [
      'Logo files in standard formats: AI, EPS, SVG, PNG (white/black/transparent) delivered as a zip',
      'Brand guidelines PDF: logo usage rules, color values, typography specs, do/don\'t examples',
      'Static color swatches and type specimens as reference documents',
      'Exported asset library — no live Figma file, no component system',
      'Applied to a defined number of templates delivered as final exported files',
    ],
    meta: [
      { label: 'Format', value: 'Exported files + PDF' },
      { label: 'Figma access', value: 'Not required by client' },
      { label: 'Ongoing use', value: 'Requires a designer to extend' },
    ],
  },
];

export default function Brief({
  clientBrief,
  reactions,
  notes,
  onReaction,
  onNote,
  onSubmit,
  isFallback = false,
}: BriefProps) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="screen-enter">
      <div className="brief-date">{today}</div>
      <h1 className="brief-title">MMLABS Brand Brief</h1>

      <div className="draft-banner">
        <div className="draft-banner-label">
          {isFallback ? 'Fallback draft — AI analysis unavailable' : 'Working draft — not final'}
        </div>
        <div className="draft-banner-text">
          {isFallback
            ? 'The AI brief generation encountered an issue, so this draft was built directly from your answers. The sections below contain your raw responses organized into the brief structure. Talia will write the full strategic analysis manually. You can still react and leave notes — everything will be sent through.'
            : 'This is an analysis of your answers and our discovery conversation — not a recap of what you said, but where it all points. Read each section, react with an emoji, and leave notes where something needs correcting or more specificity. Talia will review your markup and return a finalized brief before any design work begins.'}
        </div>
      </div>

      {SECTIONS.map(section => (
        <div key={section.key} className="brief-section">
          <div className="brief-section-inner">
            <div className="brief-section-label">
              {section.num} — {section.label}
            </div>

            {section.key === 'handoff' ? (
              <div className="brief-section-content">
                <p style={{ marginBottom: '1.25rem' }}>
                  Two options below. The AI-ready system is the recommendation based on
                  how your team works and what you&rsquo;ve described needing. The
                  traditional package is included as a reference point so you can see
                  what both approaches look like.
                </p>

                <div className="rec-tag">★ Recommended for MMLABS</div>
                <HandoffBlock
                  recommended
                  title="AI-Ready Brand System"
                  subtitle="Built for founders and developers using AI tools to execute — not a static document that lives in a folder"
                  layers={RECOMMENDED_LAYERS}
                  defaultOpen
                />
                <p style={{ fontSize: '0.82rem', color: 'var(--ink3)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  This engagement includes 2–3 revision rounds per phase. If scope
                  changes significantly during the project, we&rsquo;ll revisit the
                  budget together — the goal is to keep things moving without surprises.
                </p>

                <HandoffBlock
                  title="Traditional Brand Package"
                  subtitle="Standard deliverable set — included here for reference"
                  layers={TRADITIONAL_LAYERS}
                  note="The conventional approach. Complete and professional, but assumes a designer is involved whenever new materials need to be created — not designed for self-service or AI-assisted execution."
                />
              </div>
            ) : section.key === 'openItems' ? (
              <div className="brief-section-content">
                {clientBrief.openItems.map((item, i) => (
                  <TensionBlock key={i} text={item} />
                ))}
              </div>
            ) : (
              <div className="brief-section-content">
                {clientBrief[section.key as keyof ClientBrief] as string}
              </div>
            )}

            <ReactionBar
              sectionKey={section.key}
              reactions={reactions}
              notes={notes}
              onReaction={onReaction}
              onNote={onNote}
            />
          </div>
        </div>
      ))}

      <div className="submit-box">
        <div className="submit-box-label">Done reviewing?</div>
        <div className="submit-box-text">
          Submit when you&rsquo;re ready. Talia will review your reactions and notes and
          return a finalized brief — that&rsquo;s when the real work starts.
        </div>
        <button className="btn-submit" onClick={onSubmit}>
          Submit to Talia →
        </button>
      </div>
    </div>
  );
}
