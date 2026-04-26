'use client';

import { useState } from 'react';
import './brand-mixer.css';

/* ── Data ── */

const PALETTES = [
  {
    name: 'Palette 1',
    light: '#f0e8e0', primary: '#2a1a1a', mid1: '#e0dece',
    mid2: '#adbcc0', dark: '#7e4040', accent: '#e06048',
  },
  {
    name: 'Palette 2',
    light: '#e8e2da', primary: '#3a5666', mid1: '#bab28a',
    mid2: '#96a6b4', dark: '#181828', accent: '#F75360',
  },
  {
    name: 'Palette 3',
    light: '#EFEFEF', primary: '#262928', mid1: '#C3D2E4',
    mid2: '#B8B4B4', dark: '#071857', accent: '#ECF170',
  },
  {
    name: 'Palette 4',
    light: '#f0eee0', primary: '#0e1226', mid1: '#bab2c2',
    mid2: '#ba9236', dark: '#4a4e34', accent: '#3254ae',
  },
];

const TYPES = [
  {
    name: 'Sentient × Public Sans',
    display: "'Sentient', Georgia, serif",
    ui: "'Public Sans', system-ui, sans-serif",
    trackingHeadline: '-0.03em',
    trackingSuper: '0.12em',
    superWeight: 500,
    displayName: 'Sentient',
    uiName: 'Public Sans',
  },
  {
    name: 'Source Serif 4 × Geist',
    display: "'Source Serif 4', Georgia, serif",
    ui: "'Geist', system-ui, sans-serif",
    trackingHeadline: '-0.03em',
    trackingSuper: '0.2em',
    superWeight: 600,
    displayName: 'Source Serif 4',
    uiName: 'Geist',
  },
  {
    name: 'Karma × General Sans',
    display: "'Karma', Georgia, serif",
    ui: "'General Sans', system-ui, sans-serif",
    trackingHeadline: '-0.02em',
    trackingSuper: '0.12em',
    superWeight: 500,
    displayName: 'Karma',
    uiName: 'General Sans',
  },
  {
    name: 'Gambarino × IBM Plex Sans',
    display: "'Gambarino', Georgia, serif",
    ui: "'IBM Plex Sans', system-ui, sans-serif",
    trackingHeadline: '0em',
    trackingSuper: '0.12em',
    superWeight: 600,
    displayName: 'Gambarino',
    uiName: 'IBM Plex Sans',
  },
];

const LOGOS = [
  { name: 'Mark A', src: '/logos/perebel-mark-a.svg' },
  { name: 'Mark B', src: '/logos/perebel-mark-b.svg' },
  { name: 'Mark C', src: '/logos/perebel-mark-c.svg' },
  { name: 'Mark D', src: '/logos/perebel-mark-d.svg' },
];

const VIEWS = ['Hero', 'Card', 'Marketing'] as const;
type View = (typeof VIEWS)[number];

/* ── Contrast helper ── */

function contrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#000' : '#fff';
}

/* ── BrandLogo — renders logo as <img> to preserve multi-color detail ── */

function BrandLogo({ src, height, invert }: { src: string; height: number; invert?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`bm-brand-logo ${invert ? 'bm-brand-logo--invert' : ''}`}
      src={src}
      alt=""
      style={{ height, width: 'auto' }}
    />
  );
}

/* ── Swatch strip ── */

function SwatchStrip({ palette, small }: { palette: typeof PALETTES[0]; small?: boolean }) {
  const swatches = [
    { hex: palette.light, label: 'light' },
    { hex: palette.primary, label: 'primary' },
    { hex: palette.mid1, label: 'mid1' },
    { hex: palette.mid2, label: 'mid2' },
    { hex: palette.dark, label: 'dark' },
    { hex: palette.accent, label: 'accent' },
  ];

  function contrastColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#000' : '#fff';
  }

  return (
    <div className={`bm-swatch-strip ${small ? 'bm-swatch-strip--small' : ''}`}>
      {swatches.map((s) => (
        <div
          key={s.label}
          className="bm-swatch-tile"
          style={{ background: s.hex, color: contrastColor(s.hex) }}
        >
          {s.hex}
        </div>
      ))}
    </div>
  );
}

/* ── Case card ── */

function CaseCard({ dark }: { dark?: boolean }) {
  const variant = dark ? 'bm-case-card--dark' : 'bm-case-card--light';
  return (
    <div className={`bm-case-card ${variant}`}>
      <div className="bm-case-top">
        <span className="bm-case-id">Case #2047</span>
        <span className="bm-case-badge">Pending review</span>
      </div>
      <div className="bm-case-name">Ortega, M.</div>
      <div className="bm-case-form">Form I-485 &middot; Adjustment of Status</div>
      <div className="bm-progress-track">
        <div className="bm-progress-fill" />
      </div>
      <div className="bm-progress-label">67% complete &middot; 4 of 6 documents</div>
      <div className="bm-case-tags">
        <span className="bm-tag">Filed</span>
        <span className="bm-tag">Reviewed</span>
        <span className="bm-tag">I-485</span>
      </div>
    </div>
  );
}

/* ── Hero view ── */

function HeroView({ palette, logoSrc }: { palette: typeof PALETTES[0]; logoSrc: string }) {
  return (
    <div className="bm-hero">
      <nav className="bm-hero-nav">
        <div className="bm-hero-nav-left">
          <BrandLogo src={logoSrc} height={32} />
          <span className="bm-hero-wordmark">Perebel</span>
        </div>
        <div className="bm-hero-nav-links">
          <span>Product</span>
          <span>Pricing</span>
          <span>Sign in</span>
        </div>
      </nav>
      <div className="bm-hero-content">
        <div className="bm-hero-super">Immigration Case Management</div>
        <h1 className="bm-hero-headline">
          Your firm&rsquo;s entire operating layer&nbsp;&mdash; from intake to outcome.
        </h1>
        <p className="bm-hero-body">
          Perebel handles case management, client onboarding, billing, document
          processing, and smart automation&nbsp;&mdash; so your team focuses on the law.
        </p>
        <button type="button" className="bm-hero-cta">Get early access</button>
        <div className="bm-hero-card-wrap">
          <CaseCard />
        </div>
      </div>
      <SwatchStrip palette={palette} />
    </div>
  );
}

/* ── Card stack view ── */

function CardStackView({ palette, typeSystem, logoSrc }: { palette: typeof PALETTES[0]; typeSystem: typeof TYPES[0]; logoSrc: string }) {
  const cards: { label: string; dark: boolean }[] = [
    { label: 'Light', dark: false },
    { label: 'Dark', dark: true },
  ];

  return (
    <div className="bm-card-stack">
      <div className="bm-card-grid">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bm-stack-card ${card.dark ? 'bm-stack-card--dark' : 'bm-stack-card--light'}`}
          >
            <div className="bm-stack-card-label">{card.label}</div>
            <div className="bm-stack-logo">
              <BrandLogo
                src={logoSrc}
                height={48}
                invert={card.dark}
              />
            </div>
            <CaseCard dark={card.dark} />
            <SwatchStrip palette={palette} small />
            <div className="bm-type-label">
              {typeSystem.displayName} &middot; {typeSystem.uiName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Marketing view ── */

function MarketingView({ logoSrc, palette }: { logoSrc: string; palette: typeof PALETTES[0] }) {
  return (
    <div className="bm-marketing-wrap">
      <div className="bm-marketing">
        <div className="bm-mktg-top-left">
          <BrandLogo src={logoSrc} height={56} invert />
          <div className="bm-mktg-wordmark">Perebel</div>
        </div>
        <div className="bm-mktg-body">
          <h2 className="bm-mktg-headline">
            Built for immigration law.
            <br />
            Powered by AI.
          </h2>
          <p className="bm-mktg-sub">
            Case management, client onboarding, billing, document processing, and smart
            automation&nbsp;&mdash; all in one platform.
          </p>
        </div>
        <div className="bm-mktg-bottom">
          <div>
            <div className="bm-mktg-cta" style={{ color: contrastColor(palette.accent) }}>Get early access</div>
            <div className="bm-mktg-url">perebel.ai</div>
          </div>
          <div className="bm-mktg-card">
            <CaseCard dark />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function BrandMixerPage() {
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [typeIdx, setTypeIdx] = useState(0);
  const [logoIdx, setLogoIdx] = useState(0);
  const [view, setView] = useState<View>('Hero');

  const palette = PALETTES[paletteIdx];
  const typeSystem = TYPES[typeIdx];
  const logoSrc = LOGOS[logoIdx].src;

  return (
    <div
      className="bm-page"
      style={{
        '--color-light': palette.light,
        '--color-primary': palette.primary,
        '--color-mid1': palette.mid1,
        '--color-mid2': palette.mid2,
        '--color-dark': palette.dark,
        '--color-accent': palette.accent,
        '--font-display': typeSystem.display,
        '--font-ui': typeSystem.ui,
        '--tracking-headline': typeSystem.trackingHeadline,
        '--tracking-super': typeSystem.trackingSuper,
        '--super-weight': String(typeSystem.superWeight),
      } as React.CSSProperties}
    >
      {/* Toolbar */}
      <div className="bm-toolbar">
        <div className="bm-logo-picker">
          <span className="bm-selector-label">Logo</span>
          {LOGOS.map((l, i) => (
            <button
              type="button"
              key={l.name}
              className={`bm-logo-thumb ${i === logoIdx ? 'bm-logo-thumb--active' : ''}`}
              onClick={() => setLogoIdx(i)}
              title={l.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.name} />
            </button>
          ))}
        </div>

        <div className="bm-selector">
          <span className="bm-selector-label">Palette</span>
          {PALETTES.map((p, i) => (
            <button
              type="button"
              key={p.name}
              className={`bm-chip ${i === paletteIdx ? 'bm-chip--palette-active' : ''}`}
              onClick={() => setPaletteIdx(i)}
            >
              P{i + 1}
            </button>
          ))}
        </div>

        <div className="bm-selector">
          <span className="bm-selector-label">Type</span>
          {TYPES.map((t, i) => (
            <button
              type="button"
              key={t.name}
              className={`bm-chip ${i === typeIdx ? 'bm-chip--type-active' : ''}`}
              onClick={() => setTypeIdx(i)}
            >
              T{i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="bm-view-toggle">
        {VIEWS.map((v) => (
          <button
            type="button"
            key={v}
            className={`bm-view-btn ${v === view ? 'bm-view-btn--active' : ''}`}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Views */}
      {view === 'Hero' && <HeroView palette={palette} logoSrc={logoSrc} />}
      {view === 'Card' && <CardStackView palette={palette} typeSystem={typeSystem} logoSrc={logoSrc} />}
      {view === 'Marketing' && <MarketingView logoSrc={logoSrc} palette={palette} />}
    </div>
  );
}
