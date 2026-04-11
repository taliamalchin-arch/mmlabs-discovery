'use client';

import { useState, useEffect } from 'react';
import './perebel.css';

// ── Configuration ──
const IS_INTERNAL = true;

type AssetStatus = 'ready' | 'missing';
type AssetType = 'download' | 'link';

interface Asset {
  section: string;
  subsection: string;
  label: string;
  description: string;
  filename?: string;
  folder?: string;
  url?: string;
  status: AssetStatus;
  type: AssetType;
}

const ASSETS: Asset[] = [
  // Logo Suite — Primary Wordmark (25 files: 5 color variants × 5 formats each)
  ...Array.from(['cordovan', 'sky', 'cream', 'black', 'white']).flatMap(color => {
    const colorCap = color.charAt(0).toUpperCase() + color.slice(1);
    const filePrefix = `Perebel_Wordmark_${colorCap}`;
    return [
      {
        section: 'Logo Suite',
        subsection: 'Primary Wordmark',
        label: `Primary Wordmark — ${colorCap}, SVG`,
        description: color === 'cordovan' ? 'Full-color version for digital use' :
                     color === 'black' ? 'Single-color version for versatile use' :
                     color === 'white' ? 'Inverse version for dark backgrounds' :
                     `${colorCap} accent color for digital use`,
        filename: `${filePrefix}.svg`,
        folder: `/perebel/logos/wordmark/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Primary Wordmark',
        label: `Primary Wordmark — ${colorCap}, PDF`,
        description: color === 'cordovan' ? 'Full-color version for print' :
                     color === 'black' ? 'Single-color version for print' :
                     color === 'white' ? 'Inverse version for print' :
                     `${colorCap} accent color for print`,
        filename: `${filePrefix}.pdf`,
        folder: `/perebel/logos/wordmark/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Primary Wordmark',
        label: `Primary Wordmark — ${colorCap}, PNG 1×`,
        description: 'Standard resolution for web',
        filename: `${filePrefix}_1x.png`,
        folder: `/perebel/logos/wordmark/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Primary Wordmark',
        label: `Primary Wordmark — ${colorCap}, PNG 2×`,
        description: 'High-resolution for retina displays',
        filename: `${filePrefix}_2x.png`,
        folder: `/perebel/logos/wordmark/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Primary Wordmark',
        label: `Primary Wordmark — ${colorCap}, PNG 3×`,
        description: 'Ultra-high resolution for large displays',
        filename: `${filePrefix}_3x.png`,
        folder: `/perebel/logos/wordmark/${color}/`,
        status: 'ready',
        type: 'download',
      },
    ] as Asset[];
  }),

  // Logo Suite — Secondary Lockup (25 files: 5 color variants × 5 formats each)
  ...Array.from(['cordovan', 'sky', 'cream', 'black', 'white']).flatMap(color => {
    const colorCap = color.charAt(0).toUpperCase() + color.slice(1);
    const filePrefix = `Perebel_Lockup_${colorCap}`;
    return [
      {
        section: 'Logo Suite',
        subsection: 'Secondary Lockup',
        label: `Secondary Lockup — ${colorCap}, SVG`,
        description: color === 'cordovan' ? 'Full-color version for digital use' :
                     color === 'black' ? 'Single-color version for versatile use' :
                     color === 'white' ? 'Inverse version for dark backgrounds' :
                     `${colorCap} accent color for digital use`,
        filename: `${filePrefix}.svg`,
        folder: `/perebel/logos/lockup/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Secondary Lockup',
        label: `Secondary Lockup — ${colorCap}, PDF`,
        description: color === 'cordovan' ? 'Full-color version for print' :
                     color === 'black' ? 'Single-color version for print' :
                     color === 'white' ? 'Inverse version for print' :
                     `${colorCap} accent color for print`,
        filename: `${filePrefix}.pdf`,
        folder: `/perebel/logos/lockup/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Secondary Lockup',
        label: `Secondary Lockup — ${colorCap}, PNG 1×`,
        description: 'Standard resolution for web',
        filename: `${filePrefix}_1x.png`,
        folder: `/perebel/logos/lockup/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Secondary Lockup',
        label: `Secondary Lockup — ${colorCap}, PNG 2×`,
        description: 'High-resolution for retina displays',
        filename: `${filePrefix}_2x.png`,
        folder: `/perebel/logos/lockup/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Secondary Lockup',
        label: `Secondary Lockup — ${colorCap}, PNG 3×`,
        description: 'Ultra-high resolution for large displays',
        filename: `${filePrefix}_3x.png`,
        folder: `/perebel/logos/lockup/${color}/`,
        status: 'ready',
        type: 'download',
      },
    ] as Asset[];
  }),

  // Logo Suite — Standalone Icon (25 files: 5 color variants × 5 formats each)
  ...Array.from(['cordovan', 'sky', 'cream', 'black', 'white']).flatMap(color => {
    const colorCap = color.charAt(0).toUpperCase() + color.slice(1);
    const filePrefix = `Perebel_Icon_${colorCap}`;
    return [
      {
        section: 'Logo Suite',
        subsection: 'Standalone Icon',
        label: `Standalone Icon — ${colorCap}, SVG`,
        description: color === 'cordovan' ? 'Full-color version for digital use' :
                     color === 'black' ? 'Single-color version for versatile use' :
                     color === 'white' ? 'Inverse version for dark backgrounds' :
                     `${colorCap} accent color for digital use`,
        filename: `${filePrefix}.svg`,
        folder: `/perebel/logos/icon/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Standalone Icon',
        label: `Standalone Icon — ${colorCap}, PDF`,
        description: color === 'cordovan' ? 'Full-color version for print' :
                     color === 'black' ? 'Single-color version for print' :
                     color === 'white' ? 'Inverse version for print' :
                     `${colorCap} accent color for print`,
        filename: `${filePrefix}.pdf`,
        folder: `/perebel/logos/icon/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Standalone Icon',
        label: `Standalone Icon — ${colorCap}, PNG 1×`,
        description: 'Standard resolution for web',
        filename: `${filePrefix}_1x.png`,
        folder: `/perebel/logos/icon/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Standalone Icon',
        label: `Standalone Icon — ${colorCap}, PNG 2×`,
        description: 'High-resolution for retina displays',
        filename: `${filePrefix}_2x.png`,
        folder: `/perebel/logos/icon/${color}/`,
        status: 'ready',
        type: 'download',
      },
      {
        section: 'Logo Suite',
        subsection: 'Standalone Icon',
        label: `Standalone Icon — ${colorCap}, PNG 3×`,
        description: 'Ultra-high resolution for large displays',
        filename: `${filePrefix}_3x.png`,
        folder: `/perebel/logos/icon/${color}/`,
        status: 'ready',
        type: 'download',
      },
    ] as Asset[];
  }),

  // Logo Suite — Favicon Kit
  {
    section: 'Logo Suite',
    subsection: 'Favicon Kit',
    label: 'Favicon — 32px PNG',
    description: 'Standard favicon for modern browsers',
    filename: 'perebel-favicon-32.png',
    folder: '/perebel/logos/favicons/',
    status: 'ready',
    type: 'download',
  },
  {
    section: 'Logo Suite',
    subsection: 'Favicon Kit',
    label: 'Favicon — 180px PNG (Apple Touch Icon)',
    description: 'Home screen icon for iOS devices',
    filename: 'perebel-favicon-appletouch180.png',
    folder: '/perebel/logos/favicons/',
    status: 'ready',
    type: 'download',
  },

  // Color Palette
  {
    section: 'Color Palette',
    subsection: 'Color Palette',
    label: 'Color Palette — Reference Sheet',
    description: 'All swatch names, Hex / RGB / HSL / CMYK values, and usage rules',
    url: 'https://www.figma.com/design/eCrqp1mAACuRGffSc0Btc5/Perebel?node-id=139-582&t=mwDaMLfl8Nk0mZXn-11',
    status: 'ready',
    type: 'link',
  },

  // Typography System
  {
    section: 'Typography System',
    subsection: 'Serif',
    label: 'EB Garamond',
    description: 'Classic serif typeface with variable and static weights. Includes OTF, TTF, and web formats.',
    filename: 'perebel-fonts-ebgaramond.zip',
    folder: '/perebel/typography/',
    status: 'ready',
    type: 'download',
  },
  {
    section: 'Typography System',
    subsection: 'Sans-Serif',
    label: 'General Sans',
    description: 'Contemporary sans-serif with full weight range. Includes OTF, TTF, WEB, and variable font formats.',
    filename: 'perebel-fonts-generalsans.zip',
    folder: '/perebel/typography/',
    status: 'ready',
    type: 'download',
  },

  // Brand Cheat Sheet
  {
    section: 'Brand Cheat Sheet',
    subsection: 'Brand Cheat Sheet',
    label: 'Brand Cheat Sheet — PDF',
    description: 'One-page reference: logo variants, color palette, type hierarchy, do / don\'t examples',
    filename: 'perebel-brand-cheatsheet.pdf',
    folder: '/perebel/',
    status: 'ready',
    type: 'download',
  },
  {
    section: 'Brand Cheat Sheet',
    subsection: 'Brand Cheat Sheet',
    label: 'Brand Cheat Sheet — Figma',
    description: 'Editable Figma frame with full brand system details',
    url: 'https://www.figma.com/design/eCrqp1mAACuRGffSc0Btc5/Perebel?node-id=138-309&t=mwDaMLfl8Nk0mZXn-1',
    status: 'ready',
    type: 'link',
  },
];

export default function PerebelPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('perebel-auth');
    if (stored === 'true') setUnlocked(true);
  }, []);

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Set your password here
    if (password === '032326') {
      sessionStorage.setItem('perebel-auth', 'true');
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const downloadSection = async (section: string) => {
    const JSZip = (await import('jszip')).default;
    const sectionAssets = displayAssets.filter(a => a.section === section && a.type === 'download');

    if (sectionAssets.length === 0) return;

    const zip = new JSZip();

    for (const asset of sectionAssets) {
      if (asset.filename && asset.folder) {
        try {
          const response = await fetch(asset.folder + asset.filename);
          const blob = await response.blob();
          const path = `${section}/${asset.folder.split('/').slice(-2, -1)[0]}/${asset.filename}`;
          zip.file(path, blob);
        } catch (err) {
          console.error(`Failed to download ${asset.filename}`, err);
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${section.toLowerCase().replace(/\s+/g, '-')}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  if (!unlocked) {
    return (
      <div className="pb-gate">
        <div className="pb-gate-inner">
          <form onSubmit={handlePassword}>
            <h2 className="pb-title">Perebel Brand Assets</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r)',
                fontFamily: 'var(--sans)',
              }}
            />
            <button type="submit" className="btn-p" style={{ width: '100%' }}>
              Unlock
            </button>
            {error && <div className="pb-gate-error">Incorrect password</div>}
          </form>
        </div>
      </div>
    );
  }

  const displayAssets = IS_INTERNAL ? ASSETS : ASSETS.filter(a => a.status === 'ready');
  const sections = Array.from(new Set(displayAssets.map(a => a.section)));

  const readyCount = ASSETS.filter(a => a.status === 'ready').length;
  const totalCount = ASSETS.length;
  const progressPercent = (readyCount / totalCount) * 100;

  return (
    <div className="screen-enter">
      <nav className="nav">
        <span className="nav-brand">Perebel × Brand Delivery</span>
        {IS_INTERNAL && <span className="pb-internal-badge">Internal</span>}
        <span className="nav-step">April 2026</span>
      </nav>

      <div className="wrap">
        <button
          onClick={() => window.location.href = '/api/download-perebel'}
          style={{
            width: '100%',
            padding: '1.5rem',
            marginBottom: '2rem',
            backgroundColor: '#4B700E',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--r)',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a5609')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4B700E')}
        >
          ↓ Download All Assets
        </button>

        <div className="pb-header">
          <div className="pb-eyebrow">Brand Delivery</div>
          <h1 className="pb-title">Perebel</h1>
          <p className="pb-subtitle">
            {IS_INTERNAL
              ? `Export checklist — ${readyCount} of ${totalCount} assets ready`
              : 'Your brand files are ready to download.'}
          </p>
          {IS_INTERNAL && (
            <div className="pb-progress-bar">
              <div className="pb-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          )}
        </div>

        {sections.map(section => {
          const sectionAssets = displayAssets.filter(a => a.section === section);
          const downloadableAssets = sectionAssets.filter(a => a.type === 'download');
          const linkAssets = sectionAssets.filter(a => a.type === 'link');
          const subsections = Array.from(new Set(sectionAssets.map(a => a.subsection)));
          const isExpanded = expandedSections[section] ?? false;

          return (
            <section className="pb-section" key={section}>
              <div className="pb-section-label">{section}</div>
              <div className="pb-section-body">
                <div className="pb-section-header">
                  <button
                    className="pb-section-toggle"
                    onClick={() => toggleSection(section)}
                  >
                    {isExpanded ? '−' : '+'} {section}
                  </button>
                  {IS_INTERNAL && downloadableAssets.length > 0 && (
                    <button
                      className="pb-download-all-btn"
                      onClick={() => downloadSection(section)}
                    >
                      Download all
                    </button>
                  )}
                  {IS_INTERNAL && downloadableAssets.length === 0 && linkAssets.length > 0 && (
                    <a
                      className="pb-download-all-btn"
                      href={linkAssets[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      Open in Figma ↗
                    </a>
                  )}
                </div>

                {isExpanded && subsections.map(subsection => {
                  const subsectionAssets = sectionAssets.filter(a => a.subsection === subsection);
                  return (
                    <div key={subsection}>
                      {subsections.length > 1 && (
                        <div className="pb-subsection-header">{subsection}</div>
                      )}
                      {subsectionAssets.map(asset => (
                        <div
                          key={asset.filename || asset.url}
                          className={`pb-asset-row ${asset.status === 'missing' ? 'missing' : ''}`}
                        >
                          <div className="pb-asset-info">
                            <div className="pb-asset-label">{asset.label}</div>
                            <div className="pb-asset-desc">{asset.description}</div>
                            {asset.label === 'Color Palette — Reference Sheet' && (
                              <div className="pb-color-swatches">
                                <div className="pb-swatch" style={{ backgroundColor: '#2B0000' }}><span>Cordovan<br/>#2B0000<br/>rgb(43, 0, 0)<br/>hsl(0°, 100%, 8%)<br/>C=0% M=100% Y=100% K=83%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#631300' }}><span>Auburn<br/>#631300<br/>rgb(99, 19, 0)<br/>hsl(12°, 100%, 19%)<br/>C=0% M=81% Y=100% K=61%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#e8843a' }}><span>Poppy<br/>#e8843a<br/>rgb(232, 132, 58)<br/>hsl(26°, 79%, 57%)<br/>C=0% M=43% Y=75% K=9%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#edb750' }}><span>Sunlight<br/>#edb750<br/>rgb(237, 183, 80)<br/>hsl(39°, 81%, 62%)<br/>C=0% M=23% Y=66% K=7%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#4B700E' }}><span>Grass<br/>#4B700E<br/>rgb(75, 112, 14)<br/>hsl(83°, 78%, 25%)<br/>C=33% M=0% Y=88% K=56%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#3a7a96' }}><span>Ocean<br/>#3a7a96<br/>rgb(58, 122, 150)<br/>hsl(198°, 44%, 41%)<br/>C=61% M=19% Y=0% K=41%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#95c2d4' }}><span>Sky<br/>#95c2d4<br/>rgb(149, 194, 212)<br/>hsl(197°, 42%, 71%)<br/>C=30% M=8% Y=0% K=17%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#dccba9' }}><span>Sand<br/>#dccba9<br/>rgb(220, 203, 169)<br/>hsl(40°, 42%, 76%)<br/>C=0% M=8% Y=23% K=14%</span></div>
                                <div className="pb-swatch" style={{ backgroundColor: '#f4f0e2' }}><span>Cream<br/>#f4f0e2<br/>rgb(244, 240, 226)<br/>hsl(47°, 45%, 92%)<br/>C=0% M=2% Y=7% K=4%</span></div>
                              </div>
                            )}
                            {IS_INTERNAL && asset.folder && asset.filename && (
                              <div className="pb-asset-path">{asset.folder}{asset.filename}</div>
                            )}
                          </div>
                          <div className="pb-asset-action">
                            {IS_INTERNAL && (
                              <span className={`pb-status ${asset.status}`}>
                                {asset.status === 'ready' ? 'Ready' : 'Pending'}
                              </span>
                            )}
                            {asset.status === 'ready' && asset.type === 'download' && asset.folder && asset.filename && (
                              <a
                                className="pb-download-btn"
                                href={asset.folder + asset.filename}
                                download
                              >
                                Download
                              </a>
                            )}
                            {asset.status === 'ready' && asset.type === 'link' && asset.url && (
                              <a
                                className="pb-download-btn"
                                href={asset.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open in Figma ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
