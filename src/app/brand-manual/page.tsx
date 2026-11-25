'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Check, 
  Copy, 
  Sparkles, 
  Grid, 
  Layers, 
  Compass, 
  Sliders, 
  Eye, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Palette,
  Type
} from 'lucide-react';

interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  cmyk: string;
  hsl: string;
  textColor: string;
  wcag: string;
}

const BRAND_COLORS: ColorSwatch[] = [
  {
    name: 'DRIP Navy',
    role: 'Primary Brand Anchor',
    hex: '#0A1128',
    rgb: '10, 17, 40',
    cmyk: '75, 58, 0, 84',
    hsl: '226°, 60%, 10%',
    textColor: '#FFFFFF',
    wcag: 'AAA (16.4:1)',
  },
  {
    name: 'DRIP Coral',
    role: 'Active Energy & Accent',
    hex: '#E94560',
    rgb: '233, 69, 96',
    cmyk: '0, 70, 59, 9',
    hsl: '350°, 79%, 59%',
    textColor: '#FFFFFF',
    wcag: 'AA (4.8:1)',
  },
  {
    name: 'Atelier Ivory',
    role: 'Surface & Canvas Base',
    hex: '#FAF4EE',
    rgb: '250, 244, 238',
    cmyk: '0, 2, 5, 2',
    hsl: '30°, 55%, 96%',
    textColor: '#151413',
    wcag: 'AAA (15.1:1)',
  },
  {
    name: 'Obsidian Black',
    role: 'Primary Typographic Text',
    hex: '#151413',
    rgb: '21, 20, 19',
    cmyk: '0, 5, 10, 92',
    hsl: '30°, 5%, 8%',
    textColor: '#FFFFFF',
    wcag: 'AAA (18.2:1)',
  },
  {
    name: 'Deep Crimson',
    role: 'Runway Warning & Header',
    hex: '#7A0C16',
    rgb: '122, 12, 22',
    cmyk: '0, 90, 82, 52',
    hsl: '355°, 82%, 26%',
    textColor: '#FFFFFF',
    wcag: 'AAA (9.2:1)',
  },
  {
    name: 'Studio Titanium',
    role: 'Subtle Dividers & Chrome',
    hex: '#8E8E93',
    rgb: '142, 142, 147',
    cmyk: '3, 3, 0, 42',
    hsl: '240°, 2%, 57%',
    textColor: '#FFFFFF',
    wcag: 'AA (4.5:1)',
  },
];

const TYPE_SCALE = [
  { level: 'Display 01', size: '56px / 3.5rem', lh: '1.05', track: '-0.03em', font: 'Cinzel / Serif Bold', usage: 'Collection launch headlines & runway titles' },
  { level: 'Display 02', size: '40px / 2.5rem', lh: '1.1', track: '-0.02em', font: 'Outfit / Sans Black', usage: 'Major section titles & hero headers' },
  { level: 'Heading 01', size: '28px / 1.75rem', lh: '1.2', track: '-0.01em', font: 'Outfit / Sans Bold', usage: 'Card titles, modal headings' },
  { level: 'Body Regular', size: '15px / 0.9375rem', lh: '1.6', track: '0.00em', font: 'Inter / Sans Regular', usage: 'Editorial paragraphs, garment narratives' },
  { level: 'Code / Metric', size: '11px / 0.6875rem', lh: '1.4', track: '+0.15em', font: 'JetBrains / Space Mono', usage: 'SKU specs, fabric weights, prices, 3D coordinates' },
  { level: 'Micro Tag', size: '9px / 0.5625rem', lh: '1.2', track: '+0.25em', font: 'Space Mono Bold', usage: 'Status badges, live indicators, limited run marks' },
];

export default function BrandManualPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [darkModeLogo, setDarkModeLogo] = useState<boolean>(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(`${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#151413] flex flex-col font-sans selection:bg-black selection:text-white">
      <Navbar />

      {/* Floating Copy Feedback Toast */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-[150] bg-black text-white text-xs font-mono py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in-up">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied {copiedText}</span>
        </div>
      )}

      {/* Brand Manual Hero Section */}
      <section className="relative w-full border-b border-gray-200 bg-white pt-16 pb-20 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Metadata Pill */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-black text-white text-[10px] font-mono tracking-[0.2em] uppercase rounded-full font-bold">
              MANUAL v2.4 • 2026
            </span>
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
              ATELIER DESIGN SYSTEM • IDENTITY CODES
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-black max-w-4xl font-display leading-[0.95] mb-6">
            DRIP Brand Identity & Manual
          </h1>

          <p className="text-base md:text-xl text-gray-600 max-w-3xl leading-relaxed font-sans mb-10">
            A codified specification for architectural streetwear, interactive 3D spatial staging,
            and computational generative draping. Every proportion, margin, chromatic token,
            and motion curve is calibrated for pure precision.
          </p>

          {/* Quick Nav Anchors */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {[
              { label: '01. Manifesto', href: '#manifesto' },
              { label: '02. Logomark', href: '#logomark' },
              { label: '03. Chromatic System', href: '#colors' },
              { label: '04. Typography', href: '#typography' },
              { label: '05. 8pt Modular Grid', href: '#grid' },
              { label: '06. 3D Spatial Staging', href: '#spatial' },
              { label: '07. Do\'s & Don\'ts', href: '#guidelines' },
            ].map((anchor) => (
              <a
                key={anchor.href}
                href={anchor.href}
                className="px-4 py-2 rounded-full border border-gray-200 hover:border-black text-xs font-mono uppercase tracking-wider text-gray-700 hover:text-black transition-colors"
              >
                {anchor.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: MANIFESTO */}
      <section id="manifesto" className="py-20 px-6 md:px-16 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
              01 • PHILOSOPHY
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-black font-display">
              The Atelier Manifesto
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6 text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="text-lg md:text-xl text-black font-medium leading-relaxed">
              Streetwear is not merely casual apparel; it is the physical architecture of contemporary culture.
              At DRIP, we merge computational geometry, digital draping, and obsessive heavy textile engineering.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-drip-coral font-bold block mb-1">
                  I. STRUCTURE
                </span>
                <p className="text-xs text-gray-600 leading-normal">
                  Every silhouette begins with structural integrity—heavy 280–450 GSM weaves with architectural box cuts that hold form.
                </p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-drip-coral font-bold block mb-1">
                  II. SPATIALITY
                </span>
                <p className="text-xs text-gray-600 leading-normal">
                  Clothes exist in three dimensions. Our digital experience prioritizes physical rails, 360° spring physics, and real draping.
                </p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-drip-coral font-bold block mb-1">
                  III. RESTRAINT
                </span>
                <p className="text-xs text-gray-600 leading-normal">
                  Zero ornamental fluff. High-contrast monochromatic palettes accented by intentional surgical hits of DRIP Coral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LOGOMARK & CLEARSPACE */}
      <section id="logomark" className="py-20 px-6 md:px-16 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
                02 • IDENTITY
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
                Logomark & Construction
              </h2>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  showGrid ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid Overlay: {showGrid ? 'ON' : 'OFF'}</span>
              </button>
              <button
                onClick={() => setDarkModeLogo(!darkModeLogo)}
                className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wider bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Theme: {darkModeLogo ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Logo Canvas */}
          <div
            className={`relative w-full aspect-[21/9] min-h-[300px] rounded-3xl border flex items-center justify-center overflow-hidden transition-colors duration-500 ${
              darkModeLogo ? 'bg-[#0A1128] border-gray-800' : 'bg-[#FAF4EE] border-gray-200'
            }`}
          >
            {/* Modular Grid Background */}
            {showGrid && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            )}

            {/* Clearspace Boundary Indicator */}
            {showGrid && (
              <div className="absolute border-2 border-dashed border-drip-coral/40 rounded-xl px-16 py-10 pointer-events-none flex items-center justify-center">
                <span className="absolute -top-3 left-6 bg-drip-coral text-white font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                  Clearspace Margin: 1X (48px)
                </span>
                <span className="absolute -bottom-3 right-6 bg-drip-coral text-white font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                  Optical Anchor
                </span>
              </div>
            )}

            {/* DRIP Wordmark */}
            <div className="relative z-10 flex flex-col items-center">
              <span
                className={`text-6xl md:text-9xl font-black tracking-tighter uppercase select-none transition-colors duration-300 font-display ${
                  darkModeLogo ? 'text-white' : 'text-[#151413]'
                }`}
              >
                DRIP
              </span>
              <span
                className={`text-xs md:text-sm font-mono tracking-[0.4em] uppercase -mt-1 font-bold ${
                  darkModeLogo ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                ATELIER ANATOMY
              </span>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="p-5 bg-[#fbfbfb] rounded-2xl border border-gray-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                MINIMUM DIGITAL SIZE
              </span>
              <span className="text-xl font-bold font-mono text-black">24px Height</span>
              <p className="text-xs text-gray-500 mt-1">
                Never render below 24px in digital viewports to preserve optical legibility of the letterforms.
              </p>
            </div>
            <div className="p-5 bg-[#fbfbfb] rounded-2xl border border-gray-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                MINIMUM PRINT SCALE
              </span>
              <span className="text-xl font-bold font-mono text-black">12mm Width</span>
              <p className="text-xs text-gray-500 mt-1">
                For woven garment tags, hangtags, metal zippers, and embossed leather patches.
              </p>
            </div>
            <div className="p-5 bg-[#fbfbfb] rounded-2xl border border-gray-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                VECTOR SOURCE CODE
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    '<svg viewBox="0 0 200 48" fill="currentColor"><text x="0" y="38" font-family="Cinzel" font-weight="900" font-size="44" letter-spacing="-1">DRIP</text></svg>',
                    'SVG Code'
                  )
                }
                className="text-xs font-mono text-drip-coral hover:underline flex items-center gap-1.5 mt-2 cursor-pointer font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw SVG Markup</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CHROMATIC SYSTEM & PALETTE */}
      <section id="colors" className="py-20 px-6 md:px-16 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
              03 • CHROMATIC CODES
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              Color Palette & Values
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Click any swatch value below to copy directly to clipboard in HEX, RGB, CMYK, or HSL format.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRAND_COLORS.map((col) => (
              <div
                key={col.hex}
                className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col transition-all hover:shadow-md"
              >
                {/* Visual Swatch Block */}
                <div
                  className="h-36 p-6 flex flex-col justify-between transition-transform duration-300 relative group"
                  style={{ backgroundColor: col.hex }}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: col.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)',
                        color: col.textColor,
                      }}
                    >
                      {col.wcag}
                    </span>
                    <button
                      onClick={() => copyToClipboard(col.hex, `${col.name} HEX`)}
                      className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
                      title="Copy HEX"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-black tracking-tight" style={{ color: col.textColor }}>
                      {col.name}
                    </h3>
                    <span className="text-xs opacity-80 font-mono" style={{ color: col.textColor }}>
                      {col.role}
                    </span>
                  </div>
                </div>

                {/* Technical Codes Table */}
                <div className="p-5 space-y-2.5 text-xs font-mono">
                  <div
                    onClick={() => copyToClipboard(col.hex, 'HEX')}
                    className="flex justify-between py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <span className="text-gray-400">HEX</span>
                    <span className="font-bold text-gray-900">{col.hex}</span>
                  </div>
                  <div
                    onClick={() => copyToClipboard(col.rgb, 'RGB')}
                    className="flex justify-between py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <span className="text-gray-400">RGB</span>
                    <span className="font-semibold text-gray-800">{col.rgb}</span>
                  </div>
                  <div
                    onClick={() => copyToClipboard(col.cmyk, 'CMYK')}
                    className="flex justify-between py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <span className="text-gray-400">CMYK</span>
                    <span className="text-gray-600">{col.cmyk}</span>
                  </div>
                  <div
                    onClick={() => copyToClipboard(col.hsl, 'HSL')}
                    className="flex justify-between py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <span className="text-gray-400">HSL</span>
                    <span className="text-gray-600">{col.hsl}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TYPOGRAPHY HIERARCHY */}
      <section id="typography" className="py-20 px-6 md:px-16 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
              04 • TYPOGRAPHIC SCALE
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              Type System & Specs
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Engineered with a high-contrast pairing between monumental display serifs and technical monospace utility.
            </p>
          </div>

          <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f4f4f4] border-b border-gray-200 text-gray-500 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="py-4 px-6">Level</th>
                    <th className="py-4 px-6">Specimen Size</th>
                    <th className="py-4 px-6">Line Height</th>
                    <th className="py-4 px-6">Letter Spacing</th>
                    <th className="py-4 px-6">Font Family</th>
                    <th className="py-4 px-6">Intended Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TYPE_SCALE.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-black">{item.level}</td>
                      <td className="py-4 px-6 text-gray-900 font-semibold">{item.size}</td>
                      <td className="py-4 px-6 text-gray-600">{item.lh}</td>
                      <td className="py-4 px-6 text-gray-600">{item.track}</td>
                      <td className="py-4 px-6 text-gray-900 font-bold">{item.font}</td>
                      <td className="py-4 px-6 text-gray-500 text-[11px] font-sans">{item.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: 8PT MODULAR GRID */}
      <section id="grid" className="py-20 px-6 md:px-16 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
              05 • SPATIAL RHYTHM
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              8pt Spatial Scale
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              All paddings, gap tokens, and margins adhere strictly to 8-pixel increments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { token: 'space-1', px: '4px', desc: 'Micro tags & icon gaps' },
              { token: 'space-2', px: '8px', desc: 'Button inner padding' },
              { token: 'space-3', px: '16px', desc: 'Standard card padding' },
              { token: 'space-4', px: '24px', desc: 'Modal gutter margins' },
              { token: 'space-5', px: '32px', desc: 'Section subheadings' },
              { token: 'space-6', px: '48px', desc: 'Layout block gaps' },
              { token: 'space-7', px: '64px', desc: 'Stage header margins' },
              { token: 'space-8', px: '96px', desc: 'Editorial breaks' },
            ].map((sp) => (
              <div key={sp.token} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 block">{sp.token}</span>
                  <span className="text-lg font-black font-mono text-black">{sp.px}</span>
                </div>
                <div
                  className="w-full bg-drip-coral/20 border border-drip-coral/40 rounded my-3"
                  style={{ height: sp.px }}
                />
                <p className="text-[10px] text-gray-500 font-sans">{sp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: 3D SPATIAL STAGING STANDARDS */}
      <section id="spatial" className="py-20 px-6 md:px-16 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
              06 • 3D RUNWAY & WARDROBE
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              3D Spatial Formulas
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Mathematical parameters governing the Runway 3D ring and Digital Clothes Rail physics engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Runway Ring Physics */}
            <div className="p-6 rounded-3xl border border-gray-200 bg-[#fbfbfb] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-drip-coral font-bold block">
                01 • RING RADIUS FORMULA
              </span>
              <div className="p-3 bg-black text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                <code>R = 0.62 * ViewportWidth</code><br />
                <code>P = 1.65 * ViewportWidth</code>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Establishes the cylindrical circular perimeter for 6 primary figures and 6 background mirrors.
                Preserves realistic foreshortening without distorting silhouette hems.
              </p>
            </div>

            {/* Spring Damping */}
            <div className="p-6 rounded-3xl border border-gray-200 bg-[#fbfbfb] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-drip-coral font-bold block">
                02 • SPRING DAMPING ENGINE
              </span>
              <div className="p-3 bg-black text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                <code>K = 95.0 (Stiffness)</code><br />
                <code>C = 19.49 (Damping = 2*sqrt(K))</code>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Critical damping prevents ringing oscillations when dragging or advancing looks.
                Follow lag factor of 0.04s per queue index simulates real fabric momentum.
              </p>
            </div>

            {/* Clothes Rail Tilt */}
            <div className="p-6 rounded-3xl border border-gray-200 bg-[#fbfbfb] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-drip-coral font-bold block">
                03 • RAIL ROTATION PERSPECTIVE
              </span>
              <div className="p-3 bg-black text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                <code>θ_rest = -74.0 deg</code><br />
                <code>θ_active = 0.0 deg</code>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Inactive garments hang angled at -74° to mirror tightly packed boutique clothing racks.
                Selecting an item smoothly interpolates rotation to 0° facing forward with drop shadow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: DO'S & DON'TS MATRIX */}
      <section id="guidelines" className="py-20 px-6 md:px-16 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 block mb-3">
              07 • GOVERNANCE
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              Brand Do&apos;s &amp; Don&apos;ts
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Strict rules safeguarding visual clarity, brand integrity, and aesthetic authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DO's Card */}
            <div className="p-8 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-gray-900 font-display">
                  Permitted Applications (Do)
                </h3>
              </div>

              <ul className="space-y-4 text-xs md:text-sm text-gray-600 font-sans">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Always maintain a minimum 1X (48px) clearspace buffer surrounding the primary DRIP wordmark.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Use high-contrast monochromatic backgrounds (Atelier Ivory `#FAF4EE` or Obsidian `#151413`).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Anchor 3D models and garments with realistic floor contact shadows and ambient occlusion.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Pair monumental serif display headlines strictly with technical monospace metadata.</span>
                </li>
              </ul>
            </div>

            {/* DON'Ts Card */}
            <div className="p-8 rounded-3xl bg-white border-2 border-red-500/30 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <X className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-gray-900 font-display">
                  Prohibited Practices (Don&apos;t)
                </h3>
              </div>

              <ul className="space-y-4 text-xs md:text-sm text-gray-600 font-sans">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>Never squish, stretch, shear, or rotate the DRIP wordmark off its horizontal baseline.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>Never place logos or primary type over busy, low-contrast photographic textures without scrims.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>Never render floating garments or unanchored models without physical hanger hooks and shadow planes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>Never mix more than two distinct font families within a single view or promotional collateral.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call-to-Actions */}
      <footer className="py-16 px-6 md:px-16 bg-[#151413] text-white">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-2xl font-black font-display tracking-tight block">DRIP ATELIER</span>
            <span className="text-xs font-mono text-gray-400 mt-1 block">
              Architectural Streetwear • Digital Wardrobe • 3D Runway Experience
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/runway"
              className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral hover:text-white transition-all shadow-lg"
            >
              Explore Runway 3D &rarr;
            </Link>
            <Link
              href="/wardrobe"
              className="px-6 py-3 bg-transparent border border-gray-600 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:border-white transition-colors"
            >
              Digital Clothes Rail &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
