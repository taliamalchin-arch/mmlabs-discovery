'use client';

import { useState } from 'react';

interface ConfirmationProps {
  onBackToBrief: () => void;
}

export default function Confirmation({ onBackToBrief }: ConfirmationProps) {
  const [availability, setAvailability] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendAvailability = async () => {
    if (!availability.trim()) return;
    setSending(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: 'MMLABS — call request',
          availability,
        }),
      });
      setSent(true);
    } catch {
      // Silently fail — not critical
    }
    setSending(false);
  };

  return (
    <div className="screen-enter">
      <h1 className="confirm-heading">Sent.</h1>
      <p className="confirm-body">
        Talia has been notified and will review your notes. You&rsquo;ll hear back within
        48 hours with a finalized brief before anything is designed.
      </p>

      <hr className="confirm-divider" />

      <div className="confirm-small-label">Need to talk it through?</div>
      <p className="confirm-text">
        If anything in the brief felt unclear or you&rsquo;d like to discuss it before
        the final proposal, leave your availability below and Talia will be in touch.
        Otherwise she&rsquo;ll review everything and reach out with next steps.
      </p>

      {!sent ? (
        <>
          <textarea
            placeholder="Your availability over the next few days — e.g. Thursday afternoon, Friday morning..."
            value={availability}
            onChange={e => setAvailability(e.target.value)}
            style={{ marginBottom: '0.75rem' }}
          />
          <button
            className="btn-g"
            onClick={handleSendAvailability}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send availability →'}
          </button>
        </>
      ) : (
        <p className="confirm-inline">Got it — Talia will follow up.</p>
      )}

      <div>
        <button className="back-link" onClick={onBackToBrief}>
          ← Read the brief again
        </button>
      </div>
    </div>
  );
}
