'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, X, Check, Eye } from 'lucide-react';

export interface WardrobeGarment {
  id: string;
  index: number;
  name: string;
  priceEur: number;
  priceInr: number;
  image: string;
  category: string;
  fabric: string;
  fit: string;
  description: string;
  sizes: string[];
}

export const WARDROBE_GARMENTS: WardrobeGarment[] = [
  {
    id: 'wardrobe-01',
    index: 0,
    name: 'Winged Skull Tee',
    priceEur: 48,
    priceInr: 3999,
    image: 'https://framerusercontent.com/images/mOiYfn8C8BorwpCf2SKzwJ1Fc.png',
    category: 'T-Shirt',
    fabric: '280 GSM Heavy Combed Cotton',
    fit: 'Boxy Drop-Shoulder Oversized',
    description: 'Custom vintage wash with discharge screen print on chest and spine. Double-needle stitched hems with reinforced ribbed collar.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'wardrobe-02',
    index: 1,
    name: 'Heavy Blank Tee — Black',
    priceEur: 38,
    priceInr: 2999,
    image: 'https://framerusercontent.com/images/7ZPmOTAm8aN6KqmpAOX2tbenA.png',
    category: 'T-Shirt',
    fabric: '300 GSM Organic Raw Jersey',
    fit: 'Relaxed Architectural Cut',
    description: 'Pure obsidian black heavyweight tee crafted from ring-spun Aegean cotton. Pre-shrunk with seamless side construction.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'wardrobe-03',
    index: 2,
    name: 'Heavy Blank Tee — White',
    priceEur: 38,
    priceInr: 2999,
    image: 'https://framerusercontent.com/images/XgAwJZBGbMpiJ6beGTJL8E5Y8.png',
    category: 'T-Shirt',
    fabric: '300 GSM Organic Raw Jersey',
    fit: 'Relaxed Architectural Cut',
    description: 'Optic chalk white heavyweight tee. Features thick 1.25" neck ribbing and ultra-dense weave with zero transparency.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'wardrobe-04',
    index: 3,
    name: 'Sudiv Longsleeve',
    priceEur: 55,
    priceInr: 4499,
    image: 'https://framerusercontent.com/images/jQcQKAjMewevAdo0ql3iyMfyo.png',
    category: 'Longsleeve',
    fabric: '260 GSM Slub Interlock Cotton',
    fit: 'Elongated Dropped Sleeve',
    description: 'Minimalist typography hit across forearm sleeves with tonal embroidered monogram on center chest.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'wardrobe-05',
    index: 4,
    name: 'Rose & Chain Tee',
    priceEur: 52,
    priceInr: 4299,
    image: 'https://framerusercontent.com/images/h1wkJGqABL4amKwPFdrNS6NVT4.png',
    category: 'T-Shirt',
    fabric: '280 GSM Pigment Dyed Cotton',
    fit: 'Streetwear Boxy Fit',
    description: 'Subtle washed black patina with high-definition botanical chain illustration rendered in cracked oil-based ink.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'wardrobe-06',
    index: 5,
    name: 'Varsity Jacket',
    priceEur: 240,
    priceInr: 19999,
    image: 'https://framerusercontent.com/images/1rcXWbeX9D2gUgXYBs5PTRupVLk.png',
    category: 'Outerwear',
    fabric: 'Melton Wool Body & Full-Grain Leather Sleeves',
    fit: 'Tailored Bomber Volume',
    description: 'Heirloom quality varsity jacket with heavy chenille patches, quilted satin thermal lining, and gunmetal snap buttons.',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'wardrobe-07',
    index: 6,
    name: 'No Restocks Longsleeve',
    priceEur: 58,
    priceInr: 4699,
    image: 'https://framerusercontent.com/images/J2K7FZRbPk54Zt13Wny5pxuFY4c.png',
    category: 'Longsleeve',
    fabric: '290 GSM Waffle Thermal Cotton',
    fit: 'Layered Box Silhouette',
    description: 'Limited 1-of-100 capsule release. Thermal ribbed texture with raw finished hemline and reflective sleeve tag.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'wardrobe-08',
    index: 7,
    name: 'Arch Logo Hoodie',
    priceEur: 95,
    priceInr: 7999,
    image: 'https://framerusercontent.com/images/KOrZaFOfdfSYAu70EycZ1M4C9nY.png',
    category: 'Hoodie',
    fabric: '450 GSM Heavy French Terry Cotton',
    fit: 'Oversized Double-Layer Hood',
    description: 'Archival collegiate branding distressed across the chest. Hidden kangaroo pouch phone sleeve and custom silver eyelets.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'wardrobe-09',
    index: 8,
    name: 'Barbed Heart Tee',
    priceEur: 48,
    priceInr: 3999,
    image: 'https://framerusercontent.com/images/5QLS6LbJoHJjmfpBhXz8szFCU.png',
    category: 'T-Shirt',
    fabric: '280 GSM Mineral Wash Cotton',
    fit: 'Loose Modern Street Cut',
    description: 'Acid-mineral treatment creating unique tonal variations per garment. Distressed barbed wire vector embroidery.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'wardrobe-10',
    index: 9,
    name: 'Black Zip Hoodie',
    priceEur: 98,
    priceInr: 8299,
    image: 'https://framerusercontent.com/images/IjLsR8l1VL4J0FKMMbld88eYY.png',
    category: 'Hoodie',
    fabric: '420 GSM Brushed Cotton Fleece',
    fit: 'Slight Crop Boxy Fit',
    description: 'Two-way heavy gauge YKK silver zipper. Ultra-plush fleece interior with clean dropped shoulders and seamless wrist cuffs.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export default function WardrobeRack() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);

  const addToCart = useCartStore((s) => s.addItem);
  const itemsInCart = useCartStore((s) => s.items);

  const activeItem = WARDROBE_GARMENTS[activeIndex];

  // Set default size on item change
  useEffect(() => {
    if (activeItem.sizes.length > 0) {
      setSelectedSize(activeItem.sizes[0]);
    }
  }, [activeIndex, activeItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) {
        if (e.key === 'Escape') setModalOpen(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % WARDROBE_GARMENTS.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + WARDROBE_GARMENTS.length) % WARDROBE_GARMENTS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${activeItem.id}-${selectedSize}`,
      brand: 'DRIP Atelier',
      name: activeItem.name,
      price: activeItem.priceInr,
      image: activeItem.image,
      size: selectedSize,
      color: 'Standard',
      qty: 1,
      inStock: true,
    });
    showToast(`Added ${activeItem.name} (${selectedSize}) to Bag • ₹${activeItem.priceInr.toLocaleString()}`);
  };

  // Drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = e.clientX - dragStartX;
    if (diff > 50) {
      setActiveIndex((prev) => (prev - 1 + WARDROBE_GARMENTS.length) % WARDROBE_GARMENTS.length);
    } else if (diff < -50) {
      setActiveIndex((prev) => (prev + 1) % WARDROBE_GARMENTS.length);
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] bg-[#fbfbfb] text-[#151413] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Ambience & Studio Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#f5f5f7] to-[#ebebeb] pointer-events-none" />

      {/* Top Banner Marquee */}
      <div className="relative z-20 w-full bg-[#151413] text-[#f7f7f7] py-2 px-4 overflow-hidden border-b border-black">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-8 text-[10px] font-mono tracking-[0.25em] uppercase font-bold">
          <span>DRIP DIGITAL WARDROBE</span>
          <span>•</span>
          <span>SUDIV CAPSULE COLLECTION 2026</span>
          <span>•</span>
          <span>HEAVYWEIGHT ARCHITECTURAL STREETWEAR</span>
          <span>•</span>
          <span>INTERACTIVE CHROME RAIL PERSPECTIVE</span>
          <span>•</span>
          <span>DRIP DIGITAL WARDROBE</span>
          <span>•</span>
          <span>SUDIV CAPSULE COLLECTION 2026</span>
          <span>•</span>
          <span>HEAVYWEIGHT ARCHITECTURAL STREETWEAR</span>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-16 pt-8 pb-12 max-w-[1700px] mx-auto w-full">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-gray-500 font-bold">
                CLOTHES RAIL 3D • ARCHIVE
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black font-display">
              Wardrobe Rail
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-md font-sans">
              Slide along the chrome rail to inspect garment cuts, drape angles, and fabric compositions.
            </p>
          </div>

          {/* Quick Counter & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1 font-mono text-2xl font-black text-black">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-gray-300 text-lg">/</span>
              <span className="text-gray-400 text-lg">{String(WARDROBE_GARMENTS.length).padStart(2, '0')}</span>
            </div>
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full border border-gray-300 hover:border-black bg-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              {itemsInCart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {itemsInCart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* 3D Interactive Rail Stage */}
        <div
          className="relative w-full my-6 flex-1 flex flex-col justify-center items-center min-h-[460px] cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ perspective: '1400px', perspectiveOrigin: '50% 30%' }}
        >
          {/* Ceiling Suspension Wires */}
          <div className="absolute top-0 left-[15%] w-[1.5px] h-20 bg-gradient-to-b from-gray-400 to-gray-600 shadow-sm" />
          <div className="absolute top-0 right-[15%] w-[1.5px] h-20 bg-gradient-to-b from-gray-400 to-gray-600 shadow-sm" />

          {/* Realistic Chrome Rail Bar */}
          <div className="relative w-full max-w-[1300px] h-4 mb-4">
            {/* Left Bracket / Mount */}
            <div className="absolute -left-3 -top-1.5 w-6 h-7 rounded-sm bg-gradient-to-r from-gray-600 via-gray-400 to-gray-800 shadow-lg border border-gray-500 flex items-center justify-center z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 border border-gray-400" />
            </div>

            {/* The Horizontal Metallic Tube */}
            <div
              className="w-full h-full rounded-full shadow-md relative z-20"
              style={{
                background:
                  'linear-gradient(180deg, #fcfcfc 0%, #e2e2e2 20%, #8c8c92 48%, #4a4a50 52%, #b5b5bc 78%, #ffffff 100%)',
                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              {/* Specular Highlight Streak */}
              <div className="absolute top-[2px] left-2 right-2 h-[1px] bg-white/90 rounded-full blur-[0.5px]" />
            </div>

            {/* Right Bracket / Mount */}
            <div className="absolute -right-3 -top-1.5 w-6 h-7 rounded-sm bg-gradient-to-r from-gray-800 via-gray-400 to-gray-600 shadow-lg border border-gray-500 flex items-center justify-center z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 border border-gray-400" />
            </div>

            {/* Rail Floor Ambient Shadow */}
            <div className="absolute top-12 left-[5%] right-[5%] h-8 bg-black/10 blur-xl rounded-full pointer-events-none" />
          </div>

          {/* Garments Carousel Container */}
          <div className="relative w-full max-w-[1200px] h-[380px] md:h-[430px] flex items-center justify-center">
            {WARDROBE_GARMENTS.map((garment, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;

              // Compute 3D physics positioning
              // Center item: rotateY(0), full scale, center
              // Left items: negative X offset, rotateY(-74deg), angled along rail
              // Right items: positive X offset, rotateY(74deg), angled along rail
              let translateX = 0;
              let translateZ = 0;
              let rotateY = 0;
              let opacity = 1;
              let scale = 1;
              let zIndex = 50 - Math.abs(offset) * 3;

              if (isCenter) {
                translateX = 0;
                translateZ = 60;
                rotateY = 0;
                scale = 1.08;
                opacity = 1;
                zIndex = 60;
              } else if (offset < 0) {
                // Stacked to the left
                translateX = offset * 95 - 40;
                translateZ = offset * 25 - 40;
                rotateY = -74;
                scale = 0.94;
                opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.18);
              } else {
                // Stacked to the right
                translateX = offset * 95 + 40;
                translateZ = -offset * 25 - 40;
                rotateY = 74;
                scale = 0.94;
                opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.18);
              }

              return (
                <div
                  key={garment.id}
                  onClick={() => setActiveIndex(idx)}
                  className="absolute top-0 flex flex-col items-center transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Metal Hanger Hook */}
                  <div className="relative -mt-2 mb-0 flex flex-col items-center pointer-events-none">
                    {/* The Hook Curvature */}
                    <svg width="36" height="34" viewBox="0 0 36 34" fill="none" className="drop-shadow-sm">
                      <path
                        d="M18 2 C13 2 11 6 11 10 C11 14 14 16 17 17 L18 20"
                        stroke="#999"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Triangular Hanger Frame */}
                      <path
                        d="M3 32 L18 20 L33 32 Z"
                        stroke="#b0b0b8"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Garment Cutout Image */}
                  <div className="relative w-[280px] md:w-[330px] h-[340px] md:h-[390px] flex items-center justify-center group">
                    <img
                      src={garment.image}
                      alt={garment.name}
                      draggable={false}
                      className={`w-full h-full object-contain filter transition-all duration-300 ${
                        isCenter
                          ? 'drop-shadow-[0_24px_32px_rgba(0,0,0,0.22)]'
                          : 'drop-shadow-[0_12px_16px_rgba(0,0,0,0.15)] brightness-95 group-hover:brightness-105'
                      }`}
                    />

                    {/* Quick Inspect Pill on Hover (Center Item) */}
                    {isCenter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalOpen(true);
                        }}
                        className="absolute bottom-6 bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Fit</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floor Shadow Under Garments */}
          <div className="w-[420px] h-10 bg-black/15 blur-2xl rounded-full -mt-2 pointer-events-none" />
        </div>

        {/* Bottom Details & Controls Dock */}
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-200">
          {/* Active Garment Typography */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              {activeItem.category} • {activeItem.fabric}
            </span>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-black mt-0.5 font-display">
              {activeItem.name}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-lg md:text-xl font-bold font-mono text-black">
                €{activeItem.priceEur}
              </span>
              <span className="text-xs font-mono text-gray-400">/</span>
              <span className="text-sm font-mono text-gray-500 font-semibold">
                ₹{activeItem.priceInr.toLocaleString()}
              </span>
              <span className="ml-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold tracking-wider">
                IN STOCK
              </span>
            </div>
          </div>

          {/* Navigation Buttons & Availability CTA */}
          <div className="flex items-center gap-3">
            {/* Arrow Nav */}
            <div className="flex items-center bg-white border border-gray-300 rounded-full p-1 shadow-sm">
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + WARDROBE_GARMENTS.length) % WARDROBE_GARMENTS.length)
                }
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black cursor-pointer"
                aria-label="Previous item"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-5 bg-gray-200" />
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % WARDROBE_GARMENTS.length)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black cursor-pointer"
                aria-label="Next item"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Inspect / See Availability Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>See Availability</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Hotkey Guide Indicator */}
        <div className="mt-4 text-center">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            Press &larr; &rarr; keys to browse • Click or drag to slide • Esc to close
          </span>
        </div>
      </div>

      {/* Inspect / Availability Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row">
            {/* Modal Image Left */}
            <div className="w-full md:w-1/2 bg-[#f4f4f4] p-8 flex items-center justify-center relative">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-full h-64 md:h-80 object-contain drop-shadow-xl"
              />
              <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-black text-white px-2 py-1 rounded">
                ITEM {String(activeItem.index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Modal Details Right */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                      {activeItem.category}
                    </span>
                    <h3 className="text-xl font-black uppercase text-black font-display mt-0.5">
                      {activeItem.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-black">
                    €{activeItem.priceEur}
                  </span>
                  <span className="text-xs font-mono text-gray-400">/</span>
                  <span className="text-sm font-mono text-gray-600 font-semibold">
                    ₹{activeItem.priceInr.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">FABRIC</span>
                    <span className="font-semibold text-gray-900">{activeItem.fabric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">FIT SPEC</span>
                    <span className="font-semibold text-gray-900">{activeItem.fit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">RUN</span>
                    <span className="text-amber-600 font-bold font-mono">LIMITED • NO RESTOCKS</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                    Select Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-black text-white font-bold'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ₹{activeItem.priceInr.toLocaleString()}</span>
                </button>

                <Link
                  href="/avatar-studio"
                  className="w-full py-3 bg-gray-100 text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Sparkles className="w-4 h-4 text-drip-coral" />
                  <span>Try On in AI Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] bg-black text-white text-xs font-mono py-2.5 px-6 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
