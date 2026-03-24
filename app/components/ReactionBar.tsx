'use client';

import { useState, useEffect } from 'react';

interface ReactionBarProps {
  sectionKey: string;
  reactions: Record<string, string[]>;
  notes: Record<string, string>;
  onReaction: (section: string, emoji: string) => void;
  onNote: (section: string, text: string) => void;
}

const EMOJIS = ['❤️', '‼️', '👎', '❓'];
const NOTE_PROMPTS: Record<string, string> = {
  '👎': "What's off about this?",
  '❓': 'What needs clarification?',
};

export default function ReactionBar({ sectionKey, reactions, notes, onReaction, onNote }: ReactionBarProps) {
  const active = reactions[sectionKey] || [];
  const noteText = notes[sectionKey] || '';
  const [noteOpen, setNoteOpen] = useState(false);
  const [localNote, setLocalNote] = useState(noteText);
  const [saved, setSaved] = useState(false);

  const needsNote = active.includes('👎') || active.includes('❓');

  useEffect(() => {
    if (needsNote) setNoteOpen(true);
  }, [needsNote]);

  useEffect(() => {
    setLocalNote(noteText);
  }, [noteText]);

  const handleToggleEmoji = (emoji: string) => {
    onReaction(sectionKey, emoji);
    if ((emoji === '👎' || emoji === '❓') && active.includes(emoji)) {
      // Deselecting a note-required emoji
      const otherNoteEmoji = emoji === '👎' ? '❓' : '👎';
      if (!active.includes(otherNoteEmoji)) {
        setNoteOpen(false);
      }
    }
  };

  const handleSave = () => {
    onNote(sectionKey, localNote);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const placeholder = active.includes('👎')
    ? NOTE_PROMPTS['👎']
    : active.includes('❓')
    ? NOTE_PROMPTS['❓']
    : '';

  return (
    <div>
      <div className="reaction-bar">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            type="button"
            className={`reaction-btn${active.includes(emoji) ? ' on' : ''}`}
            onClick={() => handleToggleEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
        <button
          type="button"
          className="note-toggle"
          onClick={() => !needsNote && setNoteOpen(!noteOpen)}
        >
          + note
        </button>
      </div>
      {(noteOpen || needsNote) && (
        <div className="note-area">
          <textarea
            value={localNote}
            onChange={e => setLocalNote(e.target.value)}
            placeholder={placeholder || 'Add a note...'}
          />
          {saved ? (
            <div className="note-saved">Saved</div>
          ) : (
            <button type="button" className="note-save" onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
}
