'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import PasswordGate from './PasswordGate';
import Screen0 from './Screen0';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import Screen6 from './Screen6';
import Loading from './Loading';
import Brief from './Brief';
import Confirmation from './Confirmation';
import { FormData } from './types';

type View = 'quiz' | 'loading' | 'brief' | 'confirmation';

interface ClientBrief {
  scopeAndTimeline: string;
  budgetAndTerms: string;
  technicalConstraints: string;
  positioning: string;
  personality: string;
  visualDirection: string;
  openItems: string[];
}

interface SavedState {
  view: View;
  screen: number;
  formData: FormData;
  clientBrief: ClientBrief | null;
  designerBrief: string;
  reactions: Record<string, string[]>;
  notes: Record<string, string>;
}

const STEP_LABELS = [
  '',
  'Deadlines & Scope',
  'Budget & Working Terms',
  'Technical Details & Naming',
  'Visual Direction',
  'Brand Personality',
  'Optional Details',
];

async function saveStateToServer(state: SavedState) {
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  } catch (err) {
    console.error('Failed to save state to server:', err);
  }
}

async function loadStateFromServer(): Promise<SavedState | null> {
  try {
    const res = await fetch('/api/state');
    const data = await res.json();
    if (data.state) {
      return typeof data.state === 'string' ? JSON.parse(data.state) : data.state;
    }
    return null;
  } catch (err) {
    console.error('Failed to load state from server:', err);
    return null;
  }
}

function buildFallbackBrief(data: FormData): ClientBrief {
  const deadline = data.deadline || 'Not specified';
  const phase1 = Array.isArray(data.phase1Deliverables) ? data.phase1Deliverables.join(', ') : 'Not specified';
  const phase2 = Array.isArray(data.phase2Deliverables) ? data.phase2Deliverables.join(', ') : 'Not specified';
  const budget = (data.budget as string) || 'Not provided';
  const brandUsers = Array.isArray(data.brandUsers) ? data.brandUsers.join(', ') : 'Not specified';
  const signoff = (data.signoff as string) || 'Not specified';
  const subBrands = (data.subBrands as string) || 'Not addressed';
  const mmMeaning = (data.mmMeaning as string) || 'Still open';
  const platforms = Array.isArray(data.platforms) ? data.platforms.join(', ') : 'Not specified';
  const languages = (data.languages as string) || 'Not specified';
  const critterCommitment = (data.critterCommitment as string) || 'Not specified';
  const characterRole = (data.characterRole as string) || 'Not specified';
  const pair1 = data.pair1 === 'left' ? 'Calm & trusted' : data.pair1 === 'right' ? 'Sharp & impressive' : 'Not selected';
  const pair2 = data.pair2 === 'left' ? 'Warm & safe' : data.pair2 === 'right' ? 'Clear & efficient' : 'Not selected';
  const pair3 = data.pair3 === 'left' ? 'Quiet confidence' : data.pair3 === 'right' ? 'Visible ambition' : 'Not selected';
  const pair4 = data.pair4 === 'left' ? 'Minimal & airy' : data.pair4 === 'right' ? 'Rich & textured' : 'Not selected';
  const threeWords = (data.threeWords as string) || 'Not provided';

  return {
    scopeAndTimeline: `Deadline status: ${deadline}. Phase 1 deliverables needed by submission: ${phase1}. Phase 2 scope: ${phase2}.`,
    budgetAndTerms: `Budget: ${budget}. Brand system users: ${brandUsers}. Sign-off: ${signoff}. Working preferences: ${(data.workingPrefs as string) || 'Not specified'}.`,
    technicalConstraints: `Sub-brand situation: ${subBrands}. ${data.subBrandsNote ? 'Notes: ' + data.subBrandsNote + '. ' : ''}MM meaning: ${mmMeaning}. Platforms: ${platforms}. Language support: ${languages}. Existing build: ${(data.existingBuild as string) || 'Not specified'}.`,
    positioning: `Brand perception goal: ${(data.brandPerception as string) || 'Not specified'}. The founding story — Sam and Alvin building AI for people like their own parents — is the brand's strongest differentiator. Three-word feeling: ${threeWords}. Full positioning recommendation will come from Talia directly.`,
    personality: `Lawyer experience: ${pair1}. Client experience: ${pair2}. Brand energy: ${pair3}. Visual density: ${pair4}. These pair choices define the design system's register — Talia will analyze the tensions and implications in the finalized brief.`,
    visualDirection: `Critter/character commitment: ${critterCommitment}. Character role if included: ${characterRole}. Visual avoidance: Notion, pencil-line hand-drawn${data.visualAvoid ? ', ' + data.visualAvoid : ''}. Color preferences: ${(data.colorPrefs as string) || 'Not specified'}. Type preferences: ${(data.fontPrefs as string) || 'Not specified'}.`,
    openItems: [
      'Strategic analysis is in progress and will be included in the finalized brief',
      budget === 'Not provided' ? 'Budget has not been provided — this blocks scope confirmation' : 'Budget alignment with scope needs confirmation',
      mmMeaning === 'Still open' ? 'MM meaning is undefined — this is a strategic naming decision that affects the entire identity system' : 'MM naming direction needs finalization',
    ],
  };
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [screen, setScreen] = useState(0);
  const [view, setView] = useState<View>('quiz');
  const [formData, setFormData] = useState<FormData>({});
  const [clientBrief, setClientBrief] = useState<ClientBrief | null>(null);
  const [designerBrief, setDesignerBrief] = useState('');
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loadingDone, setLoadingDone] = useState(false);
  const [error, setError] = useState('');

  // Check auth + restore state from server on mount
  useEffect(() => {
    const init = async () => {
      const wasAuthed = sessionStorage.getItem('mm-auth') === 'true';
      if (wasAuthed) {
        setAuthed(true);
        setRestoring(true);
        await restoreFromServer();
        setRestoring(false);
      }
      setHydrated(true);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const restoreFromServer = async () => {
    const saved = await loadStateFromServer();
    if (saved) {
      setView(saved.view);
      setScreen(saved.screen);
      setFormData(saved.formData);
      setClientBrief(saved.clientBrief);
      setDesignerBrief(saved.designerBrief);
      setReactions(saved.reactions);
      setNotes(saved.notes);
    }
  };

  // Debounced save to server whenever state changes
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!hydrated || !authed || restoring) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveStateToServer({ view, screen, formData, clientBrief, designerBrief, reactions, notes });
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [hydrated, authed, view, screen, formData, clientBrief, designerBrief, reactions, notes]);

  const totalScreens = 7;
  const progress = view === 'quiz'
    ? (screen / totalScreens) * 100
    : view === 'loading'
    ? 100
    : 0;

  const onChange = useCallback((key: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const goNext = () => {
    window.scrollTo(0, 0);
    setScreen(s => s + 1);
  };

  const goBack = () => {
    window.scrollTo(0, 0);
    if (screen > 0) setScreen(s => s - 1);
  };

  const handleGenerateBrief = async () => {
    window.scrollTo(0, 0);
    setView('loading');
    setLoadingDone(false);
    setError('');

    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('API returned error:', res.status, data);
        throw new Error(data.details || data.error || `API error ${res.status}`);
      }

      if (!data.clientBrief) {
        console.error('API response missing clientBrief:', data);
        throw new Error('Response missing client brief data');
      }

      setClientBrief(data.clientBrief);
      setDesignerBrief(data.designerBrief || '');
      setLoadingDone(true);

      setTimeout(() => {
        window.scrollTo(0, 0);
        setView('brief');
      }, 800);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Brief generation failed:', message);
      setError(message);

      setClientBrief(buildFallbackBrief(formData));
      setDesignerBrief('[Brief generation failed: ' + message + ']. Raw form data has been preserved and will be submitted to Talia with your reactions.');
      setLoadingDone(true);

      setTimeout(() => {
        window.scrollTo(0, 0);
        setView('brief');
      }, 800);
    }
  };

  const handleReaction = (section: string, emoji: string) => {
    setReactions(prev => {
      const current = prev[section] || [];
      if (current.includes(emoji)) {
        return { ...prev, [section]: current.filter(e => e !== emoji) };
      }
      return { ...prev, [section]: [...current, emoji] };
    });
  };

  const handleNote = (section: string, text: string) => {
    setNotes(prev => ({ ...prev, [section]: text }));
  };

  const handleBriefSubmit = async () => {
    const sectionNames: Record<string, string> = {
      scopeAndTimeline: 'Scope & Timeline',
      budgetAndTerms: 'Budget & Working Terms',
      technicalConstraints: 'Technical Constraints & Naming',
      handoff: 'Proposed Handoff & Deliverables',
      positioning: 'Positioning',
      personality: 'Personality & Design Implications',
      visualDirection: 'Visual Direction',
      openItems: 'Open Items',
    };

    const lines: string[] = [];
    for (const [key, name] of Object.entries(sectionNames)) {
      const emojis = reactions[key] || [];
      const note = notes[key] || '';
      if (emojis.length > 0 || note) {
        lines.push(`${name}: [${emojis.join(' ')}]${note ? ` — ${note}` : ''}`);
      }
    }

    const payload: Record<string, string | string[] | undefined> = {
      _subject: 'MMLABS brief ready for review',
      reactions_summary: lines.join('\n'),
      designer_brief: `--- DESIGNER BRIEF (PRIVATE) ---\n\n${designerBrief}`,
      ...formData,
    };

    try {
      await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (submitErr) {
      console.error('Formspree submission failed:', submitErr);
    }

    window.scrollTo(0, 0);
    setView('confirmation');
  };

  // Don't render until hydration is done to avoid flash
  if (!hydrated || restoring) return null;

  if (!authed) {
    return <PasswordGate onUnlock={async () => {
      setRestoring(true);
      setAuthed(true);
      await restoreFromServer();
      setRestoring(false);
    }} />;
  }

  const stepLabel = view === 'quiz' && screen > 0 ? STEP_LABELS[screen] : '';

  return (
    <>
      {view === 'quiz' && screen > 0 && (
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      )}

      <nav className="nav">
        <div className="nav-brand">MMLABS × Brand Discovery</div>
        {stepLabel && <div className="nav-step">{stepLabel}</div>}
      </nav>

      <div className="wrap">
        {view === 'quiz' && screen === 0 && <Screen0 onNext={goNext} />}
        {view === 'quiz' && screen === 1 && (
          <Screen1 data={formData} onChange={onChange} onNext={goNext} onBack={goBack} />
        )}
        {view === 'quiz' && screen === 2 && (
          <Screen2 data={formData} onChange={onChange} onNext={goNext} onBack={goBack} />
        )}
        {view === 'quiz' && screen === 3 && (
          <Screen3 data={formData} onChange={onChange} onNext={goNext} onBack={goBack} />
        )}
        {view === 'quiz' && screen === 4 && (
          <Screen4 data={formData} onChange={onChange} onNext={goNext} onBack={goBack} />
        )}
        {view === 'quiz' && screen === 5 && (
          <Screen5 data={formData} onChange={onChange} onNext={goNext} onBack={goBack} />
        )}
        {view === 'quiz' && screen === 6 && (
          <Screen6
            data={formData}
            onChange={onChange}
            onSubmit={handleGenerateBrief}
            onBack={goBack}
          />
        )}
        {view === 'loading' && <Loading done={loadingDone} error={error} />}
        {view === 'brief' && clientBrief && (
          <Brief
            clientBrief={clientBrief}
            reactions={reactions}
            notes={notes}
            onReaction={handleReaction}
            onNote={handleNote}
            onSubmit={handleBriefSubmit}
            isFallback={!!error}
          />
        )}
        {view === 'confirmation' && (
          <Confirmation onBackToBrief={() => { window.scrollTo(0, 0); setView('brief'); }} />
        )}
      </div>
    </>
  );
}
