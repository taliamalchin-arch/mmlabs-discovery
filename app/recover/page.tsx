'use client';

import { useState, useEffect, useCallback } from 'react';

/* ── Types ── */

interface StorageEntry {
  location: string;
  key: string;
  value: string;
}

interface ReconstructedField {
  fieldName: string;
  label: string;
  category: string;
  reconstructedValue: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  alternatives?: string[];
  reasoning: string;
  briefExcerpt: string;
  editedValue?: string;
}

interface UnknownField {
  briefExcerpt: string;
  possibleMeaning: string;
}

/* ── Helpers ── */

function confidenceColor(c: string) {
  if (c === 'HIGH') return 'var(--green)';
  if (c === 'MEDIUM') return 'var(--warn)';
  return 'var(--accent)';
}

function confidenceBg(c: string) {
  if (c === 'HIGH') return 'var(--green-bg)';
  if (c === 'MEDIUM') return 'var(--warn-bg)';
  return '#fff5f0';
}

function buildQueryString(fields: ReconstructedField[]): string {
  const params = new URLSearchParams();
  for (const f of fields) {
    const val = f.editedValue ?? f.reconstructedValue;
    if (val) params.set(f.fieldName, val);
  }
  return params.toString();
}

function buildPlainText(fields: ReconstructedField[]): string {
  let text = 'MMLABS BRAND DISCOVERY — RECONSTRUCTED ANSWERS\n';
  text += `Generated: ${new Date().toISOString()}\n\n`;
  let currentCategory = '';
  for (const f of fields) {
    if (f.category !== currentCategory) {
      currentCategory = f.category;
      text += `\n═══ ${currentCategory} ═══\n\n`;
    }
    const val = f.editedValue ?? f.reconstructedValue;
    text += `${f.label}: ${val}\n`;
    text += `  Confidence: ${f.confidence}\n`;
    text += `  Source: "${f.briefExcerpt}"\n\n`;
  }
  return text;
}

function buildJSON(fields: ReconstructedField[]) {
  const result: Record<string, string> = {};
  for (const f of fields) {
    result[f.fieldName] = f.editedValue ?? f.reconstructedValue;
  }
  return result;
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Component ── */

export default function RecoverPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  // Job 1 state
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [storageEntries, setStorageEntries] = useState<StorageEntry[]>([]);
  const [redisData, setRedisData] = useState<unknown>(null);
  const [redisError, setRedisError] = useState('');
  const [formspreeData, setFormspreeData] = useState<unknown>(null);
  const [formspreeError, setFormspreeError] = useState('');
  const [urlState, setUrlState] = useState('');

  // Job 2 state
  const [briefText, setBriefText] = useState('');
  const [reconstructing, setReconstructing] = useState(false);
  const [fields, setFields] = useState<ReconstructedField[]>([]);
  const [unknownFields, setUnknownFields] = useState<UnknownField[]>([]);
  const [reconstructError, setReconstructError] = useState('');

  // Job 3 state
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateResult, setRegenerateResult] = useState<{
    clientBrief: unknown;
    designerBrief: string;
  } | null>(null);
  const [regenerateError, setRegenerateError] = useState('');

  /* ── Auth ── */

  const handleAuth = async () => {
    // Verify password against server
    const res = await fetch('/api/recover/redis', {
      method: 'POST',
      headers: { 'x-recovery-password': password },
    });
    if (res.status === 401) {
      setAuthError('Incorrect password');
      setTimeout(() => setAuthError(''), 1500);
      return;
    }
    setAuthed(true);
  };

  /* ── Job 1: Cache & Storage Search ── */

  const scanClientStorage = useCallback(() => {
    const entries: StorageEntry[] = [];

    // localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) || '';
      // Show everything — the spec says don't filter
      entries.push({ location: 'localStorage', key, value: value.slice(0, 2000) });
    }

    // sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      const value = sessionStorage.getItem(key) || '';
      entries.push({ location: 'sessionStorage', key, value: value.slice(0, 2000) });
    }

    // Cookies
    if (document.cookie) {
      document.cookie.split(';').forEach((c) => {
        const [key, ...rest] = c.trim().split('=');
        entries.push({ location: 'cookie', key: key.trim(), value: rest.join('=') });
      });
    }

    // URL
    const urlInfo: string[] = [];
    if (window.location.search) urlInfo.push(`Query: ${window.location.search}`);
    if (window.location.hash) urlInfo.push(`Hash: ${window.location.hash}`);
    if (urlInfo.length > 0) {
      setUrlState(urlInfo.join('\n'));
    }

    return entries;
  }, []);

  const scanIndexedDB = useCallback(async () => {
    const entries: StorageEntry[] = [];
    if (!('indexedDB' in window)) return entries;

    try {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        entries.push({
          location: 'IndexedDB',
          key: `Database: ${db.name}`,
          value: `version: ${db.version}`,
        });
      }
    } catch {
      entries.push({ location: 'IndexedDB', key: '(status)', value: 'Not accessible or empty' });
    }
    return entries;
  }, []);

  const scanServiceWorkerCache = useCallback(async () => {
    const entries: StorageEntry[] = [];
    if (!('caches' in window)) return entries;

    try {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        for (const req of keys) {
          entries.push({
            location: `ServiceWorker Cache: ${name}`,
            key: req.url,
            value: '(cached response)',
          });
        }
      }
    } catch {
      // no-op
    }
    return entries;
  }, []);

  const runFullScan = useCallback(async () => {
    setScanning(true);
    setScanComplete(false);

    // Client-side scans
    const clientEntries = scanClientStorage();
    const idbEntries = await scanIndexedDB();
    const swEntries = await scanServiceWorkerCache();
    setStorageEntries([...clientEntries, ...idbEntries, ...swEntries]);

    // Server-side: Redis
    try {
      const res = await fetch('/api/recover/redis', {
        method: 'POST',
        headers: { 'x-recovery-password': password },
      });
      const data = await res.json();
      if (data.found) {
        setRedisData(data.data);
      } else if (data.error) {
        setRedisError(data.error);
      } else {
        setRedisError('No data found in Redis');
      }
    } catch (err) {
      setRedisError(err instanceof Error ? err.message : 'Redis fetch failed');
    }

    // Server-side: Formspree
    try {
      const res = await fetch('/api/recover/formspree', {
        method: 'POST',
        headers: { 'x-recovery-password': password },
      });
      const data = await res.json();
      if (data.error) {
        setFormspreeError(data.error);
      } else {
        setFormspreeData(data);
      }
    } catch (err) {
      setFormspreeError(err instanceof Error ? err.message : 'Formspree fetch failed');
    }

    setScanning(false);
    setScanComplete(true);
  }, [password, scanClientStorage, scanIndexedDB, scanServiceWorkerCache]);

  useEffect(() => {
    if (authed) runFullScan();
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Return to filled form ── */

  const handleReturnToForm = async () => {
    if (!redisData || typeof redisData !== 'object') return;

    const state = redisData as Record<string, unknown>;
    // Update Redis state: keep all formData but switch view to quiz, screen 1
    const updatedState = {
      ...state,
      view: 'quiz',
      screen: 1,
    };

    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState),
      });
      // Set auth so the main app will restore from Redis
      sessionStorage.setItem('mm-auth', 'true');
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to update state:', err);
    }
  };

  /* ── Job 2: Reconstruction ── */

  const handleReconstruct = async () => {
    setReconstructing(true);
    setReconstructError('');
    setFields([]);
    setUnknownFields([]);

    try {
      const res = await fetch('/api/recover/reconstruct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recovery-password': password,
        },
        body: JSON.stringify({ briefText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setFields(data.fields || []);
      setUnknownFields(data.unknownFields || []);
    } catch (err) {
      setReconstructError(err instanceof Error ? err.message : 'Reconstruction failed');
    }

    setReconstructing(false);
  };

  const updateField = (index: number, value: string) => {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], editedValue: value };
      return next;
    });
  };

  /* ── Job 3: Regenerate Brief ── */

  const handleRegenerate = async () => {
    setRegenerating(true);
    setRegenerateError('');
    setRegenerateResult(null);

    const formData = buildJSON(fields);

    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setRegenerateResult(data);
    } catch (err) {
      setRegenerateError(err instanceof Error ? err.message : 'Regeneration failed');
    }

    setRegenerating(false);
  };

  /* ── Export ── */

  const exportPlainText = () => {
    download(buildPlainText(fields), 'mmlabs-reconstructed-answers.txt', 'text/plain');
  };

  const exportJSON = () => {
    download(
      JSON.stringify(buildJSON(fields), null, 2),
      'mmlabs-reconstructed-answers.json',
      'application/json'
    );
  };

  const exportQuizURL = () => {
    const qs = buildQueryString(fields);
    const url = `${window.location.origin}/?${qs}`;
    navigator.clipboard.writeText(url);
    alert('Quiz URL copied to clipboard');
  };

  /* ── Render: Password Gate ── */

  if (!authed) {
    return (
      <div className="recover-gate">
        <div className="recover-gate-inner">
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', marginBottom: 8 }}>
            Recovery Tool
          </h1>
          <p style={{ color: 'var(--ink2)', marginBottom: 20, fontSize: '0.85rem' }}>
            Internal tool — enter recovery password
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--r)',
              background: 'var(--white)',
              fontFamily: 'var(--sans)',
              fontSize: '0.95rem',
              marginBottom: 12,
            }}
            autoFocus
          />
          {authError && (
            <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: 12 }}>
              {authError}
            </p>
          )}
          <button className="btn-p" onClick={handleAuth} style={{ width: '100%' }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  /* ── Render: Main Tool ── */

  return (
    <div className="recover-page">
      <div className="recover-header">
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem' }}>
          MMLABS Recovery &amp; Reconstruction
        </h1>
        <p style={{ color: 'var(--ink2)', fontSize: '0.85rem', marginTop: 4 }}>
          Search browser storage, reconstruct answers from brief text, regenerate briefs
        </p>
      </div>

      {/* ═══════ JOB 1: CACHE SEARCH ═══════ */}
      <section className="recover-section">
        <h2 className="recover-section-title">1 — Cache &amp; Storage Search</h2>

        {scanning && <p className="recover-status">Scanning all storage locations…</p>}

        {scanComplete && (
          <>
            {/* Client-side storage */}
            <div className="recover-subsection">
              <h3 className="recover-subsection-title">Browser Storage</h3>
              {storageEntries.length === 0 ? (
                <p className="recover-empty">No entries found in localStorage, sessionStorage, cookies, IndexedDB, or service worker cache.</p>
              ) : (
                <div className="recover-entries">
                  {storageEntries.map((e, i) => (
                    <div key={i} className="recover-entry">
                      <span className="recover-entry-location">{e.location}</span>
                      <span className="recover-entry-key">{e.key}</span>
                      <pre className="recover-entry-value">{e.value}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* URL state */}
            {urlState && (
              <div className="recover-subsection">
                <h3 className="recover-subsection-title">URL State</h3>
                <pre className="recover-entry-value">{urlState}</pre>
              </div>
            )}

            {/* Redis */}
            <div className="recover-subsection">
              <h3 className="recover-subsection-title">Server State (Upstash Redis)</h3>
              {redisError ? (
                <p className="recover-empty">{redisError}</p>
              ) : redisData ? (
                <>
                  <pre className="recover-entry-value recover-entry-value-large">
                    {JSON.stringify(redisData, null, 2)}
                  </pre>
                  <button
                    className="btn-submit"
                    onClick={handleReturnToForm}
                    style={{ marginTop: 12 }}
                  >
                    Return to filled form
                  </button>
                </>
              ) : (
                <p className="recover-empty">No data found</p>
              )}
            </div>

            {/* Formspree */}
            <div className="recover-subsection">
              <h3 className="recover-subsection-title">Formspree Submissions</h3>
              {formspreeError ? (
                <p className="recover-empty">{formspreeError}</p>
              ) : formspreeData ? (
                <pre className="recover-entry-value recover-entry-value-large">
                  {JSON.stringify(formspreeData, null, 2)}
                </pre>
              ) : (
                <p className="recover-empty">No data found</p>
              )}
            </div>

            <button
              className="btn-g"
              onClick={runFullScan}
              style={{ marginTop: 12 }}
            >
              Re-scan
            </button>
          </>
        )}
      </section>

      {/* ═══════ JOB 2: RECONSTRUCTION ═══════ */}
      <section className="recover-section">
        <h2 className="recover-section-title">2 — Reverse Engineer from Brief Text</h2>
        <p style={{ color: 'var(--ink2)', fontSize: '0.85rem', marginBottom: 12 }}>
          Paste the generated brief text below. The AI will work backwards to reconstruct the
          most likely original quiz answers.
        </p>

        <textarea
          value={briefText}
          onChange={(e) => setBriefText(e.target.value)}
          placeholder="Paste the full brief text here — client brief, designer brief, or both…"
          rows={10}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid var(--border2)',
            borderRadius: 'var(--r)',
            background: 'var(--white)',
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />

        <button
          className="btn-p"
          onClick={handleReconstruct}
          disabled={reconstructing || briefText.trim().length < 50}
          style={{ marginTop: 12 }}
        >
          {reconstructing ? 'Reconstructing…' : 'Reconstruct Answers'}
        </button>

        {reconstructError && (
          <p style={{ color: 'var(--accent)', marginTop: 12, fontSize: '0.85rem' }}>
            {reconstructError}
          </p>
        )}

        {/* Reconstruction results */}
        {fields.length > 0 && (
          <div className="recover-results">
            <h3 className="recover-subsection-title" style={{ marginTop: 20, marginBottom: 16 }}>
              Reconstructed Answers
            </h3>

            {(() => {
              let currentCategory = '';
              return fields.map((f, i) => {
                const showCategory = f.category !== currentCategory;
                if (showCategory) currentCategory = f.category;
                return (
                  <div key={i}>
                    {showCategory && (
                      <h4 className="recover-category">{f.category}</h4>
                    )}
                    <div className="recover-field-row">
                      <div className="recover-field-left">
                        <div className="recover-field-header">
                          <span className="recover-field-label">{f.label}</span>
                          <span
                            className="recover-confidence"
                            style={{
                              color: confidenceColor(f.confidence),
                              background: confidenceBg(f.confidence),
                            }}
                          >
                            {f.confidence}
                          </span>
                        </div>
                        <input
                          className="recover-field-input"
                          value={f.editedValue ?? f.reconstructedValue}
                          onChange={(e) => updateField(i, e.target.value)}
                        />
                        {f.alternatives && f.alternatives.length > 0 && (
                          <div className="recover-alternatives">
                            <span style={{ color: 'var(--ink3)', fontSize: '0.75rem' }}>
                              Alternatives:{' '}
                            </span>
                            {f.alternatives.map((alt, j) => (
                              <button
                                key={j}
                                className="recover-alt-btn"
                                onClick={() => updateField(i, alt)}
                              >
                                {alt}
                              </button>
                            ))}
                          </div>
                        )}
                        {f.reasoning && (
                          <p className="recover-reasoning">{f.reasoning}</p>
                        )}
                      </div>
                      <div className="recover-field-right">
                        <p className="recover-excerpt">&ldquo;{f.briefExcerpt}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}

            {unknownFields.length > 0 && (
              <>
                <h4 className="recover-category" style={{ marginTop: 24 }}>
                  UNKNOWN / UNMAPPED FIELDS
                </h4>
                {unknownFields.map((u, i) => (
                  <div key={i} className="recover-field-row">
                    <div className="recover-field-left">
                      <p style={{ fontSize: '0.85rem', color: 'var(--ink2)' }}>
                        {u.possibleMeaning}
                      </p>
                    </div>
                    <div className="recover-field-right">
                      <p className="recover-excerpt">&ldquo;{u.briefExcerpt}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Export buttons */}
            <div className="recover-export-bar">
              <button className="btn-g" onClick={exportPlainText}>
                Export .txt
              </button>
              <button className="btn-g" onClick={exportJSON}>
                Export .json
              </button>
              <button className="btn-g" onClick={exportQuizURL}>
                Copy quiz URL
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ═══════ JOB 3: REGENERATE BRIEF ═══════ */}
      {fields.length > 0 && (
        <section className="recover-section">
          <h2 className="recover-section-title">3 — Regenerate Brief</h2>
          <p style={{ color: 'var(--ink2)', fontSize: '0.85rem', marginBottom: 12 }}>
            Send the confirmed answers back through the brief generation pipeline to produce
            fresh client and designer briefs.
          </p>

          <button
            className="btn-submit"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? 'Regenerating…' : 'Regenerate Both Briefs'}
          </button>

          {regenerateError && (
            <p style={{ color: 'var(--accent)', marginTop: 12, fontSize: '0.85rem' }}>
              {regenerateError}
            </p>
          )}

          {regenerateResult && (
            <div style={{ marginTop: 20 }}>
              <div className="recover-subsection">
                <h3 className="recover-subsection-title">Client Brief</h3>
                <pre className="recover-entry-value recover-entry-value-large">
                  {JSON.stringify(regenerateResult.clientBrief, null, 2)}
                </pre>
              </div>
              <div className="recover-subsection">
                <h3 className="recover-subsection-title">Designer Brief</h3>
                <pre className="recover-entry-value recover-entry-value-large" style={{ whiteSpace: 'pre-wrap' }}>
                  {regenerateResult.designerBrief}
                </pre>
              </div>
              <div className="recover-export-bar">
                <button
                  className="btn-g"
                  onClick={() =>
                    download(
                      JSON.stringify(regenerateResult, null, 2),
                      'mmlabs-regenerated-briefs.json',
                      'application/json'
                    )
                  }
                >
                  Export briefs .json
                </button>
                <button
                  className="btn-g"
                  onClick={() =>
                    download(
                      `CLIENT BRIEF\n${JSON.stringify(regenerateResult.clientBrief, null, 2)}\n\n\nDESIGNER BRIEF\n${regenerateResult.designerBrief}`,
                      'mmlabs-regenerated-briefs.txt',
                      'text/plain'
                    )
                  }
                >
                  Export briefs .txt
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
