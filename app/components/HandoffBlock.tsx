'use client';

import { useState } from 'react';

interface Layer {
  tag: string;
  title: string;
  items: string[];
  meta: { label: string; value: string }[];
}

interface HandoffBlockProps {
  recommended?: boolean;
  title: string;
  subtitle: string;
  layers: Layer[];
  note?: string;
  defaultOpen?: boolean;
}

export default function HandoffBlock({
  recommended = false,
  title,
  subtitle,
  layers,
  note,
  defaultOpen = false,
}: HandoffBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`handoff-block${recommended ? ' recommended' : ''}`}>
      <div className="handoff-header" onClick={() => setOpen(!open)}>
        <div>
          <div className="handoff-title">{title}</div>
          <div className="handoff-subtitle">{subtitle}</div>
        </div>
        <div className="handoff-toggle">
          {open ? 'Hide ▲' : 'Show ▼'}
        </div>
      </div>
      {open && (
        <div className="handoff-body">
          {note && <div className="handoff-note">{note}</div>}
          {layers.map((layer, i) => (
            <div key={i} className="handoff-layer">
              <span className="layer-tag">{layer.tag}</span>
              <div className="layer-title">{layer.title}</div>
              <ul className="layer-items">
                {layer.items.map((item, j) => (
                  <li key={j} className="layer-item">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {layer.meta.length > 0 && (
                <div className="layer-meta">
                  {layer.meta.map((m, k) => (
                    <div key={k} className="meta-item">
                      <strong>{m.label}</strong>
                      {m.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
