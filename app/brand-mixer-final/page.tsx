'use client';

import { useState } from 'react';
import '../brand-mixer-display/brand-mixer.css';

/* ── Locked-in final values ── */

const PALETTE = {
  name: 'Palette 3',
  light: '#EFEFEF',
  primary: '#262928',
  mid1: '#C3D2E4',
  mid2: '#B8B4B4',
  dark: '#071857',
  accent: '#ECF170',
  super: '#071857',
};

const TYPE_SYSTEM = {
  name: 'Karma × General Sans',
  display: "'Karma', Georgia, serif",
  ui: "'General Sans', system-ui, sans-serif",
  trackingHeadline: '-0.02em',
  trackingSuper: '0.12em',
  superWeight: 500,
  displayName: 'Karma',
  uiName: 'General Sans',
};

const LOGO_SRC = '/logos/perebel-mark-d.svg';

const VIEWS = ['Hero', 'Card', 'Marketing'] as const;
type View = (typeof VIEWS)[number];

/* ── Contrast helper ── */

function contrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#000' : '#fff';
}

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

function SwatchStrip({ palette, small }: { palette: typeof PALETTE; small?: boolean }) {
  const swatches = [
    { hex: palette.light, label: 'light' },
    { hex: palette.primary, label: 'primary' },
    { hex: palette.mid1, label: 'mid1' },
    { hex: palette.mid2, label: 'mid2' },
    { hex: palette.dark, label: 'dark' },
    { hex: palette.accent, label: 'accent' },
  ];
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

function HeroView({ palette, logoSrc }: { palette: typeof PALETTE; logoSrc: string }) {
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

function CardStackView({ palette, typeSystem, logoSrc }: { palette: typeof PALETTE; typeSystem: typeof TYPE_SYSTEM; logoSrc: string }) {
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
              <BrandLogo src={logoSrc} height={48} invert={card.dark} />
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

function MarketingView({ logoSrc, palette }: { logoSrc: string; palette: typeof PALETTE }) {
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

export default function BrandMixerFinalPage() {
  const [view, setView] = useState<View>('Hero');

  return (
    <div
      className="bm-page"
      style={{
        '--color-light': PALETTE.light,
        '--color-primary': PALETTE.primary,
        '--color-mid1': PALETTE.mid1,
        '--color-mid2': PALETTE.mid2,
        '--color-dark': PALETTE.dark,
        '--color-accent': PALETTE.accent,
        '--color-super': PALETTE.super ?? PALETTE.accent,
        '--font-display': TYPE_SYSTEM.display,
        '--font-ui': TYPE_SYSTEM.ui,
        '--tracking-headline': TYPE_SYSTEM.trackingHeadline,
        '--tracking-super': TYPE_SYSTEM.trackingSuper,
        '--super-weight': String(TYPE_SYSTEM.superWeight),
      } as React.CSSProperties}
    >
      <div className="bmf-toolbar">
        <div className="bmf-view-toggle">
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
      </div>

      {view === 'Hero' && <HeroView palette={PALETTE} logoSrc={LOGO_SRC} />}
      {view === 'Card' && <CardStackView palette={PALETTE} typeSystem={TYPE_SYSTEM} logoSrc={LOGO_SRC} />}
      {view === 'Marketing' && <MarketingView palette={PALETTE} logoSrc={LOGO_SRC} />}

      <style jsx>{`
        .bmf-toolbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #e0e0e0;
        }
        .bmf-view-toggle {
          display: flex;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
