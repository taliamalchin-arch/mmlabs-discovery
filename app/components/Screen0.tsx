'use client';

interface Screen0Props {
  onNext: () => void;
}

export default function Screen0({ onNext }: Screen0Props) {
  return (
    <div className="screen-enter">
      <div className="intro-eyebrow">Brand Identity Discovery</div>
      <h1 className="intro-heading">
        Let&rsquo;s fill in the<br />
        <i>gaps.</i>
      </h1>
      <p className="intro-p">
        We&rsquo;ve already talked — this isn&rsquo;t starting from scratch.
        These questions lock in the operational details before design begins:
        deadlines, scope, budget, and the technical specifics that will actually
        affect execution.
      </p>
      <p className="intro-p">
        Takes about 8 minutes. At the end, a working brief will be generated —
        not a recap of your answers, but an analysis of where things stand and
        what the plan is. You&rsquo;ll read through it, react, and leave notes
        before it&rsquo;s finalized.
      </p>
      <div style={{ marginTop: '2.5rem' }}>
        <button className="btn-p" onClick={onNext}>
          Let&rsquo;s go →
        </button>
      </div>
    </div>
  );
}
