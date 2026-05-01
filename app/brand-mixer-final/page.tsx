'use client';

import { useState } from 'react';
import '../brand-mixer/brand-mixer.css';

/* ── Locked-in final values (Palette 1 from brand-mixer) ── */

const PALETTE = {
  name: 'Perebel — Final',
  light: '#f4f0e2',     // Cream
  lightAlt: '#dccba9',  // Sand
  dark: '#2B0000',      // Cordovan
  darkAlt: '#8a2c11',   // Auburn
  accent1: '#95c2d4',   // Sky
  accent2: '#3a7a96',   // Ocean
  accent3: '#edb750',   // Sunlight
  accent4: '#e8843a',   // Poppy
};

const TYPE_SYSTEM = {
  name: 'Garamond × General Sans',
  display: "'EB Garamond', Garamond, Georgia, serif",
  ui: "'General Sans', system-ui, sans-serif",
  trackingHeadline: '-0.02em',
  trackingSuper: '0.14em',
  superWeight: 500,
  displayName: 'Garamond',
  uiName: 'General Sans',
};

const VIEWS = ['Hero', 'Card', 'Marketing'] as const;
type View = (typeof VIEWS)[number];

/* ── Contrast helper ── */

function contrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#000' : '#fff';
}

/* ── BrandLogo — renders logo D inline as SVG with dynamic color ── */

function BrandLogo({ height, color, invert }: { height: number; color: string; invert?: boolean }) {
  return (
    <svg
      className={`bm-brand-logo ${invert ? 'bm-brand-logo--invert' : ''}`}
      width="300"
      height="384"
      viewBox="0 0 300 384"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height, width: 'auto' }}
    >
      <path d="M150 0C232.843 0 300 67.1573 300 150V384H0V150C0 67.1573 67.1573 0 150 0ZM170 244C164.477 244 160 248.477 160 254V334C160 339.523 164.477 344 170 344H250C255.523 344 260 339.523 260 334V254C260 248.477 255.523 244 250 244H170Z" fill={color} />
    </svg>
  );
}

/* ── Swatch strip ── */

function SwatchStrip({ palette, small }: { palette: typeof PALETTE; small?: boolean }) {
  const swatches = [
    { hex: palette.light, label: 'light' },
    { hex: palette.lightAlt, label: 'lightAlt' },
    { hex: palette.accent1, label: 'accent1' },
    { hex: palette.accent2, label: 'accent2' },
    { hex: palette.accent3, label: 'accent3' },
    { hex: palette.accent4, label: 'accent4' },
    { hex: palette.darkAlt, label: 'darkAlt' },
    { hex: palette.dark, label: 'dark' },
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
        <span className="bm-tag">Priority</span>
      </div>
    </div>
  );
}

/* ── Hero view ── */

function HeroView({ palette, logoColor, dark, onToggleDark }: { palette: typeof PALETTE; logoColor: string; dark: boolean; onToggleDark: (v: boolean) => void }) {
  const wordmarkColor = dark ? palette.light : palette.dark;
  return (
    <div className={`bm-hero ${dark ? 'bm-hero--dark' : ''}`}>
      <nav className="bm-hero-nav">
        <div className="bm-hero-nav-left">
          <BrandLogo color={logoColor} height={32} invert={dark} />
          <span className="bm-hero-wordmark" style={{ color: wordmarkColor, fontSize: '1.75em', marginTop: '4.8px' }}>Perebel</span>
        </div>
        <div className="bm-hero-nav-links">
          <span>Product</span>
          <span>Pricing</span>
          <span>Sign in</span>
          <div className="bm-hero-theme-toggle">
            <button
              type="button"
              className={`bm-chip ${!dark ? 'bm-chip--type-active' : ''}`}
              onClick={() => onToggleDark(false)}
            >
              Light
            </button>
            <button
              type="button"
              className={`bm-chip ${dark ? 'bm-chip--type-active' : ''}`}
              onClick={() => onToggleDark(true)}
            >
              Dark
            </button>
          </div>
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
          <CaseCard dark={dark} />
        </div>
      </div>
      <SwatchStrip palette={palette} />
    </div>
  );
}

/* ── Card stack view ── */

function CardStackView({ palette, typeSystem, logoColor }: { palette: typeof PALETTE; typeSystem: typeof TYPE_SYSTEM; logoColor: string }) {
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
              <BrandLogo color={logoColor} height={48} invert={card.dark} />
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

function MarketingView({ logoColor, palette }: { logoColor: string; palette: typeof PALETTE }) {
  const wordmarkColor = palette.light;
  return (
    <div className="bm-marketing-wrap">
      <div className="bm-marketing">
        <div className="bm-mktg-top-left">
          <BrandLogo color={logoColor} height={56} invert />
          <div className="bm-mktg-wordmark" style={{ color: wordmarkColor, fontSize: '1.75em', display: 'flex', alignItems: 'center' }}>Perebel</div>
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
            <div className="bm-mktg-cta" style={{ color: contrastColor(palette.lightAlt) }}>Get early access</div>
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
  const [heroDark, setHeroDark] = useState(false);

  const logoColor = PALETTE.dark;

  return (
    <div
      className="bm-page bm-page--p1"
      style={{
        '--color-light': PALETTE.light,
        '--color-light-alt': PALETTE.lightAlt,
        '--color-dark': PALETTE.dark,
        '--color-dark-alt': PALETTE.darkAlt,
        '--color-accent-1': PALETTE.accent1,
        '--color-accent-2': PALETTE.accent2,
        '--color-accent-3': PALETTE.accent3,
        '--color-accent-4': PALETTE.accent4,
        '--font-display': TYPE_SYSTEM.display,
        '--font-ui': TYPE_SYSTEM.ui,
        '--tracking-headline': TYPE_SYSTEM.trackingHeadline,
        '--tracking-super': TYPE_SYSTEM.trackingSuper,
        '--super-weight': String(TYPE_SYSTEM.superWeight),
      } as React.CSSProperties}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap"
      />

      <div className="bm-toolbar">
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
      </div>

      {view === 'Hero' && <HeroView palette={PALETTE} logoColor={logoColor} dark={heroDark} onToggleDark={setHeroDark} />}
      {view === 'Card' && <CardStackView palette={PALETTE} typeSystem={TYPE_SYSTEM} logoColor={logoColor} />}
      {view === 'Marketing' && <MarketingView palette={PALETTE} logoColor={logoColor} />}

      <style jsx>{`
        :global(.bm-toolbar) {
          justify-content: center !important;
        }
      `}</style>
    </div>
  );
}
