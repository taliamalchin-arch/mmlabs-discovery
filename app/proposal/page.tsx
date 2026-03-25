'use client';

import { useState, useEffect } from 'react';
import './proposal.css';

export default function ProposalPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Signature state
  const [taliaSignature, setTaliaSignature] = useState('');
  const [clientSignature, setClientSignature] = useState('');
  const [clientDate, setClientDate] = useState('');
  const [taliaError, setTaliaError] = useState(false);
  const [clientError, setClientError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('proposal-auth');
    if (stored === 'true') setUnlocked(true);
  }, []);

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '032326') {
      sessionStorage.setItem('proposal-auth', 'true');
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleSubmit = async () => {
    const tErr = !taliaSignature.trim();
    const cErr = !clientSignature.trim();
    setTaliaError(tErr);
    setClientError(cErr);
    if (tErr || cErr) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: 'Perebel proposal signed',
          talia_signature: taliaSignature,
          client_signature: clientSignature,
          client_date: clientDate,
          signed_at: new Date().toLocaleString(),
          proposal_version: 'March 25, 2026',
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
    setSubmitting(false);
  };

  if (!mounted) return null;

  // Password gate
  if (!unlocked) {
    return (
      <div className="proposal-gate screen-enter">
        <div className="proposal-gate-inner">
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', marginBottom: '1.5rem' }}>
            Enter password
          </div>
          <form onSubmit={handlePassword}>
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              style={{ marginBottom: '0.75rem' }}
            />
            {error && (
              <p className="proposal-gate-error">Incorrect password</p>
            )}
            <button type="submit" className="btn-p" style={{ width: '100%' }}>
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter">
      {/* Nav */}
      <nav className="nav">
        <span className="nav-brand">Perebel × Brand Proposal</span>
        <span className="nav-step">March 25, 2026</span>
      </nav>

      <div className="wrap">
        {/* Header */}
        <div className="proposal-header">
          <div className="proposal-eyebrow">Brand Identity Proposal</div>
          <h1 className="proposal-title">Perebel</h1>
          <p className="proposal-prepared">Prepared by Talia Malchin — March 25, 2026</p>
        </div>

        {/* Scope of Work */}
        <section className="proposal-section">
          <div className="proposal-section-label">Scope of Work</div>
          <div className="proposal-section-body">
            <div className="proposal-deliverable">
              <div className="proposal-deliverable-title">1. Logo Suite</div>
              <ul className="proposal-list">
                <li>Primary wordmark</li>
                <li>Secondary lockup</li>
                <li>Standalone icon</li>
                <li>SVG master
                  <ul className="proposal-list-nested">
                    <li>PNG 1x / 2x / 3x, white, black, and transparent versions</li>
                  </ul>
                </li>
                <li>Favicon kit
                  <ul className="proposal-list-nested">
                    <li>16px ICO, 32px PNG, 180px Apple touch icon</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="proposal-deliverable">
              <div className="proposal-deliverable-title">2. Color Palette</div>
              <ul className="proposal-list">
                <li>Primary palette: 2 to 3 hero colors</li>
                <li>Secondary palette: supporting tones</li>
                <li>Neutral scale: backgrounds, surfaces, typography</li>
                <li>Accent color</li>
                <li>Hex, RGB, HSL, and CMYK values for all colors</li>
                <li>WCAG AA contrast ratios for primary text and background combinations</li>
                <li>Usage rules</li>
              </ul>
            </div>

            <div className="proposal-deliverable">
              <div className="proposal-deliverable-title">3. Typography System</div>
              <ul className="proposal-list">
                <li>Display / heading typeface</li>
                <li>Body / UI typeface</li>
                <li>Type hierarchy: headings, subheadings, body, captions, UI labels</li>
                <li>Usage rules and minimum sizes</li>
                <li>Web font licensing confirmed</li>
                <li>Fallback stack included</li>
              </ul>
            </div>

            <div className="proposal-deliverable">
              <div className="proposal-deliverable-title">4. Brand Cheat Sheet</div>
              <ul className="proposal-list">
                <li>Logo variants and minimum sizes</li>
                <li>Color palette with values</li>
                <li>Type hierarchy</li>
                <li>Do / don&rsquo;t examples</li>
                <li>Delivered as PDF and editable Figma frame</li>
              </ul>
            </div>

            <p className="proposal-exclusion">
              <em>Not included: pitch deck, landing page, social assets, motion or animation, product UI, Figma component library, MMLABS parent brand, brand voice document, website. All Phase 2.</em>
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="proposal-section">
          <div className="proposal-section-label">Timeline</div>
          <div className="proposal-section-body">
            {/* Calendar */}
            <div className="proposal-calendar">
              <div className="cal-grid">
                {/* Day headers */}
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div key={d} className="cal-day-header">{d}</div>
                ))}

                {/* Row 1: March 23 (Sun) - March 29 (Sat) */}
                {/* Mar 23, 24 empty */}
                <div className="cal-cell cal-empty" />
                <div className="cal-cell cal-empty" />
                {/* Mar 25 Tue - Week 1 */}
                <div className="cal-cell cal-week1">
                  <div className="cal-week-label cal-week1-text">Week 1</div>
                  <span className="cal-day-num cal-week1-text">25</span>
                  <span className="cal-pill cal-pill-kickoff">Kickoff</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">26</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">27</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">28</span>
                  <span className="cal-pill cal-pill-locked">Directional confirmation</span>
                </div>
                <div className="cal-cell cal-week1 cal-weekend">
                  <span className="cal-day-num cal-week1-text">29</span>
                </div>

                {/* Row 2: March 30 (Sun) - April 5 (Sat) */}
                <div className="cal-cell cal-week1 cal-weekend">
                  <span className="cal-day-num cal-week1-text">30</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">31</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">1</span>
                  <span className="cal-pill cal-pill-options">Options presented</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">2</span>
                  <span className="cal-pill cal-pill-feedback">Round 1 feedback due</span>
                </div>
                <div className="cal-cell cal-week1">
                  <span className="cal-day-num cal-week1-text">3</span>
                  <span className="cal-pill cal-pill-locked">Direction locked</span>
                </div>
                <div className="cal-cell cal-week2">
                  <div className="cal-week-label cal-week2-text">Week 2</div>
                  <span className="cal-day-num cal-week2-text">4</span>
                </div>
                <div className="cal-cell cal-week2 cal-weekend">
                  <span className="cal-day-num cal-week2-text">5</span>
                </div>

                {/* Row 3: April 6 (Sun) - April 12 (Sat) */}
                <div className="cal-cell cal-week2 cal-weekend">
                  <span className="cal-day-num cal-week2-text">6</span>
                </div>
                <div className="cal-cell cal-week2">
                  <span className="cal-day-num cal-week2-text">7</span>
                </div>
                <div className="cal-cell cal-week2">
                  <span className="cal-day-num cal-week2-text">8</span>
                  <span className="cal-pill cal-pill-delivery">Full delivery</span>
                </div>
                <div className="cal-cell cal-week2">
                  <span className="cal-day-num cal-week2-text">9</span>
                  <span className="cal-pill cal-pill-feedback">Round 2 open</span>
                </div>
                <div className="cal-cell cal-week2">
                  <span className="cal-day-num cal-week2-text">10</span>
                  <span className="cal-pill cal-pill-feedback">Round 2 closes</span>
                </div>
                <div className="cal-cell cal-week2">
                  <span className="cal-day-num cal-week2-text">11</span>
                  <span className="cal-pill cal-pill-delivery">Final checks</span>
                </div>
                <div className="cal-cell cal-week2 cal-weekend">
                  <span className="cal-day-num cal-week2-text">12</span>
                  <span className="cal-pill cal-pill-kickoff">Hard deadline</span>
                </div>
              </div>

              {/* Legend */}
              <div className="cal-legend">
                <div className="cal-legend-item">
                  <span className="cal-swatch" style={{ background: '#e1f5ee', border: '1px solid #9fe1cb' }} />
                  Week 1
                </div>
                <div className="cal-legend-item">
                  <span className="cal-swatch" style={{ background: '#eef2ff', border: '1px solid #bbc5f0' }} />
                  Week 2
                </div>
                <div className="cal-legend-item">
                  <span className="cal-swatch" style={{ background: '#ef9f27' }} />
                  Feedback due
                </div>
                <div className="cal-legend-item">
                  <span className="cal-swatch" style={{ background: '#7f77dd' }} />
                  Direction locked
                </div>
                <div className="cal-legend-item">
                  <span className="cal-swatch" style={{ background: '#0f0e0d' }} />
                  Kickoff / deadline
                </div>
              </div>
            </div>

            {/* Written Timeline */}
            <div className="proposal-timeline-entries">
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">March 25 — Kickoff</span>
                <span className="proposal-timeline-desc">Work begins. Visual territory references shared within 48 hours for gut check and directional confirmation.</span>
              </div>
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">March 25 to April 1 — Week 1</span>
                <span className="proposal-timeline-desc">Logo exploration, color directions, and typeface pairings developed. Options presented as a mix-and-match system with a suggested full package combination. Delivered by end of day April 1.</span>
              </div>
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">April 2 — Revision Round 1</span>
                <span className="proposal-timeline-desc">Consolidated feedback due. Goal: select a direction. One document or a short call.</span>
              </div>
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">April 3 — Direction Confirmation</span>
                <span className="proposal-timeline-desc">Any significant revision or between-two-options adjustment resolved. Direction locked by end of day April 3.</span>
              </div>
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">April 4 to April 8 — Week 2</span>
                <span className="proposal-timeline-desc">Full system built out. Cheat sheet designed. All files packaged. Full delivery by end of day April 8.</span>
              </div>
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">April 9 to April 10 — Final Checks and QA</span>
                <span className="proposal-timeline-desc">Sam and Alvin apply deliverables, Talia stands by for extra guidance/QA/filling in missing pieces.</span>
              </div>
              <div className="proposal-timeline-entry">
                <span className="proposal-timeline-date">April 12 — Hard Deadline</span>
                <span className="proposal-timeline-desc">Everything delivered, approved, and in hand.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investment */}
        <section className="proposal-section">
          <div className="proposal-section-label">Investment</div>
          <div className="proposal-section-body">
            <div className="proposal-fee">$600</div>
            <p className="proposal-fee-note">Flat fee. Payment in full upon final delivery.</p>
          </div>
        </section>

        {/* Terms */}
        <section className="proposal-section">
          <div className="proposal-section-label">Terms</div>
          <div className="proposal-section-body">
            <p className="proposal-terms">
              Full ownership transfers to MMLABS / Perebel upon payment. All fonts confirmed licensed before delivery.
            </p>
          </div>
        </section>

        {/* Agreement */}
        <section className="proposal-section" style={{ borderBottom: 'none' }}>
          <div className="proposal-section-label">Agreement</div>
          <div className="proposal-section-body">
            <p className="proposal-agreement-intro">
              By signing below, both parties agree to the scope, timeline, investment, and terms outlined in this proposal.
            </p>

            {!submitted ? (
              <>
                <div className="proposal-sig-row">
                  {/* Block 1 — Talia */}
                  <div className="proposal-sig-block">
                    <div className="proposal-sig-name">Talia Malchin</div>
                    <div className="proposal-sig-role">Designer &amp; Art Director</div>
                    <input
                      type="text"
                      placeholder="Type full name to sign"
                      value={taliaSignature}
                      onChange={e => { setTaliaSignature(e.target.value); setTaliaError(false); }}
                    />
                    {taliaSignature && (
                      <div className="proposal-sig-preview">{taliaSignature}</div>
                    )}
                    {taliaError && (
                      <div className="proposal-sig-error">Signature required</div>
                    )}
                    <div className="proposal-sig-date-fixed">March 25, 2026</div>
                  </div>

                  {/* Block 2 — Client */}
                  <div className="proposal-sig-block">
                    <div className="proposal-sig-name">Sam Bamigboye / Alvin Chen</div>
                    <div className="proposal-sig-role">MMLABS / Perebel</div>
                    <input
                      type="text"
                      placeholder="Type full name to sign"
                      value={clientSignature}
                      onChange={e => { setClientSignature(e.target.value); setClientError(false); }}
                    />
                    {clientSignature && (
                      <div className="proposal-sig-preview">{clientSignature}</div>
                    )}
                    {clientError && (
                      <div className="proposal-sig-error">Signature required</div>
                    )}
                    <input
                      type="text"
                      placeholder="Date"
                      value={clientDate}
                      onChange={e => setClientDate(e.target.value)}
                      style={{ marginTop: '0.5rem' }}
                    />
                  </div>
                </div>

                <button
                  className="btn-submit proposal-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit signed proposal →'}
                </button>

                {submitError && (
                  <p className="proposal-submit-error">
                    Something went wrong — please email taliamalchin@gmail.com directly.
                  </p>
                )}
              </>
            ) : (
              <div className="proposal-confirmed">
                <div className="proposal-confirmed-label">Signed and submitted</div>
                <div className="proposal-confirmed-text">
                  Talia has been notified and will confirm receipt and next steps shortly.
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
