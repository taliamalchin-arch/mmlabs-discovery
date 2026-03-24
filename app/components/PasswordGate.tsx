'use client';

import { useState } from 'react';

interface PasswordGateProps {
  onUnlock: () => void;
}

const CORRECT_HASH = '032326';

export default function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_HASH) {
      sessionStorage.setItem('mm-auth', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 1.5rem' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          MMLABS × Brand Discovery
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink3)', lineHeight: 1.65, marginBottom: '2rem' }}>
          Enter the access code to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Access code"
            autoFocus
            style={{
              marginBottom: '0.75rem',
              textAlign: 'center',
              fontSize: '1.1rem',
              letterSpacing: '0.15em',
              borderColor: error ? 'var(--accent)' : undefined,
            }}
          />
          {error && (
            <p style={{ fontSize: '0.78rem', color: 'var(--accent)', marginBottom: '0.75rem', textAlign: 'center' }}>
              Incorrect code
            </p>
          )}
          <button
            type="submit"
            className="btn-p"
            style={{ width: '100%' }}
          >
            Enter →
          </button>
        </form>
      </div>
    </div>
  );
}
