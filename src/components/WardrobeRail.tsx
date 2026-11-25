'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, X, Check, Eye } from 'lucide-react';
import AIFittingRoomModal from '@/components/AIFittingRoomModal';

export interface WardrobeRailItem {
  id: string;
  name: string;
  brand?: string;
  price: number;
  image: string;
  category?: string;
  fabric?: string;
  fit?: string;
  description?: string;
  sizes?: string[];
}

export const DEFAULT_RAIL_GARMENTS: WardrobeRailItem[] = [
  {
    id: 'rail-01',
    name: 'Winged Skull Heavy Tee',
    brand: 'DRIP Capsule',
    price: 3999,
    image: 'https://framerusercontent.com/images/mOiYfn8C8BorwpCf2SKzwJ1Fc.png',
    category: 'T-Shirt',
    fabric: '280 GSM Heavy Combed Cotton',
    fit: 'Boxy Drop-Shoulder Silhouette',
    description: 'Custom vintage wash with discharge screen print on chest and spine. Double-needle stitched hems with reinforced ribbed collar.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'rail-02',
    name: 'Heavy Blank Tee — Black',
    brand: 'DRIP Essentials',
    price: 2999,
    image: 'https://framerusercontent.com/images/7ZPmOTAm8aN6KqmpAOX2tbenA.png',
    category: 'T-Shirt',
    fabric: '300 GSM Organic Raw Jersey',
    fit: 'Relaxed Architectural Cut',
    description: 'Pure obsidian black heavyweight tee crafted from ring-spun Aegean cotton. Pre-shrunk with seamless side construction.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'rail-03',
    name: 'Heavy Blank Tee — White',
    brand: 'DRIP Essentials',
    price: 2999,
    image: 'https://framerusercontent.com/images/XgAwJZBGbMpiJ6beGTJL8E5Y8.png',
    category: 'T-Shirt',
    fabric: '300 GSM Organic Raw Jersey',
    fit: 'Relaxed Architectural Cut',
    description: 'Optic chalk white heavyweight tee. Features thick 1.25" neck ribbing and ultra-dense weave with zero transparency.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'rail-04',
    name: 'Sudiv Longsleeve',
    brand: 'DRIP Atelier',
    price: 4499,
    image: 'https://framerusercontent.com/images/jQcQKAjMewevAdo0ql3iyMfyo.png',
    category: 'Longsleeve',
    fabric: '260 GSM Slub Interlock Cotton',
    fit: 'Elongated Dropped Sleeve',
    description: 'Minimalist typography hit across forearm sleeves with tonal embroidered monogram on center chest.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'rail-05',
    name: 'Rose & Chain Washed Tee',
    brand: 'DRIP Capsule',
    price: 4299,
    image: 'https://framerusercontent.com/images/h1wkJGqABL4amKwPFdrNS6NVT4.png',
    category: 'T-Shirt',
    fabric: '280 GSM Pigment Dyed Cotton',
    fit: 'Streetwear Boxy Fit',
    description: 'Subtle washed black patina with high-definition botanical chain illustration rendered in cracked oil-based ink.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'rail-06',
    name: 'Heirloom Varsity Bomber',
    brand: 'DRIP Outerwear',
    price: 19999,
    image: 'https://framerusercontent.com/images/1rcXWbeX9D2gUgXYBs5PTRupVLk.png',
    category: 'Outerwear',
    fabric: 'Melton Wool Body & Leather Sleeves',
    fit: 'Tailored Bomber Volume',
    description: 'Heirloom quality varsity jacket with heavy chenille patches, quilted satin thermal lining, and gunmetal snap buttons.',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'rail-07',
    name: 'No Restocks Thermal Longsleeve',
    brand: 'DRIP Capsule',
    price: 4699,
    image: 'https://framerusercontent.com/images/J2K7FZRbPk54Zt13Wny5pxuFY4c.png',
    category: 'Longsleeve',
    fabric: '290 GSM Waffle Thermal Cotton',
    fit: 'Layered Box Silhouette',
    description: 'Limited 1-of-100 capsule release. Thermal ribbed texture with raw finished hemline and reflective sleeve tag.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'rail-08',
    name: 'Arch Logo Heavy Hoodie',
    brand: 'DRIP Atelier',
    price: 7999,
    image: 'https://framerusercontent.com/images/KOrZaFOfdfSYAu70EycZ1M4C9nY.png',
    category: 'Hoodie',
    fabric: '450 GSM Heavy French Terry Cotton',
    fit: 'Oversized Double-Layer Hood',
    description: 'Archival collegiate branding distressed across the chest. Hidden kangaroo pouch phone sleeve and custom silver eyelets.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'rail-09',
    name: 'Barbed Heart Mineral Tee',
    brand: 'DRIP Capsule',
    price: 3999,
    image: 'https://framerusercontent.com/images/5QLS6LbJoHJjmfpBhXz8szFCU.png',
    category: 'T-Shirt',
    fabric: '280 GSM Mineral Wash Cotton',
    fit: 'Loose Modern Street Cut',
    description: 'Acid-mineral treatment creating unique tonal variations per garment. Distressed barbed wire vector embroidery.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'rail-10',
    name: 'Obsidian Two-Way Zip Hoodie',
    brand: 'DRIP Outerwear',
    price: 8299,
    image: 'https://framerusercontent.com/images/IjLsR8l1VL4J0FKMMbld88eYY.png',
    category: 'Hoodie',
    fabric: '420 GSM Brushed Cotton Fleece',
    fit: 'Slight Crop Boxy Fit',
    description: 'Two-way heavy gauge YKK silver zipper. Ultra-plush fleece interior with clean dropped shoulders and seamless wrist cuffs.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

interface WardrobeRailProps {
  items?: WardrobeRailItem[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  compact?: boolean;
  onSelectForTryOn?: (item: WardrobeRailItem) => void;
}

export default function WardrobeRail({
  items = DEFAULT_RAIL_GARMENTS,
  title = 'Digital Wardrobe Rail',
  subtitle = 'Slide along the chrome rail to inspect garment cuts, drape angles, and fabric compositions.',
  badgeText = '3D CLOTHES RAIL • ATELIER CLOSET',
  compact = false,
  onSelectForTryOn,
}: WardrobeRailProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [tryOnItem, setTryOnItem] = useState<WardrobeRailItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const addToCart = useCartStore((s) => s.addItem);

  const safeItems = items.length > 0 ? items : DEFAULT_RAIL_GARMENTS;
  const activeGarment = safeItems[Math.min(activeIndex, safeItems.length - 1)];

  useEffect(() => {
    if (activeGarment.sizes && activeGarment.sizes.length > 0) {
      setSelectedSize(activeGarment.sizes[0]);
    } else {
      setSelectedSize('M');
    }
  }, [activeIndex, activeGarment]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) {
        if (e.key === 'Escape') setModalOpen(false);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % safeItems.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, safeItems.length]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${activeGarment.id}-${selectedSize}`,
      brand: activeGarment.brand || 'DRIP Atelier',
      name: activeGarment.name,
      price: activeGarment.price,
      image: activeGarment.image,
      size: selectedSize,
      color: 'Standard',
      qty: 1,
      inStock: true,
    });
    showToast(`Added ${activeGarment.name} (${selectedSize}) to Bag • ₹${activeGarment.price.toLocaleString()}`);
  };

  const handleOpenTryOn = (item: WardrobeRailItem) => {
    if (onSelectForTryOn) {
      onSelectForTryOn(item);
    } else {
      setTryOnItem(item);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = e.clientX - dragStartX;
    if (diff > 45) {
      setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
    } else if (diff < -45) {
      setActiveIndex((prev) => (prev + 1) % safeItems.length);
    }
  };

  return (
    <div className={`relative w-full bg-[#fbfbfb] text-[#151413] flex flex-col justify-between overflow-hidden select-none font-sans ${compact ? 'py-6' : 'py-10 md:py-14'}`}>
      {/* Background Soft Studio Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#f7f7f8] to-[#ececed] pointer-events-none" />

      <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6 md:px-12 flex flex-col justify-between flex-1">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 font-bold">
                {badgeText}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-md font-sans">
              {subtitle}
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-baseline gap-1 font-mono text-2xl font-black text-black">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-gray-300 text-lg">/</span>
            <span className="text-gray-400 text-lg">{String(safeItems.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* 3D Rail Canvas */}
        <div
          className="relative w-full my-4 flex-1 flex flex-col justify-center items-center min-h-[380px] md:min-h-[440px] cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ perspective: '1400px', perspectiveOrigin: '50% 28%' }}
        >
          {/* Ceiling Suspension Rods */}
          <div className="absolute top-0 left-[18%] w-[1.5px] h-16 bg-gradient-to-b from-gray-300 to-gray-500 shadow-sm" />
          <div className="absolute top-0 right-[18%] w-[1.5px] h-16 bg-gradient-to-b from-gray-300 to-gray-500 shadow-sm" />

          {/* Chrome Rail Tube */}
          <div className="relative w-full max-w-[1200px] h-3.5 mb-3">
            {/* Left Wall Mount */}
            <div className="absolute -left-3 -top-1.5 w-6 h-6 rounded-sm bg-gradient-to-r from-gray-700 via-gray-400 to-gray-800 shadow-lg border border-gray-500 flex items-center justify-center z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 border border-gray-400" />
            </div>

            {/* Tube with Specular Chrome Gradient */}
            <div
              className="w-full h-full rounded-full shadow-md relative z-20"
              style={{
                background:
                  'linear-gradient(180deg, #ffffff 0%, #d8d8d8 22%, #8c8c92 48%, #4a4a50 52%, #b5b5bc 78%, #ffffff 100%)',
                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12)',
              }}
            >
              <div className="absolute top-[2px] left-2 right-2 h-[1px] bg-white/90 rounded-full blur-[0.5px]" />
            </div>

            {/* Right Wall Mount */}
            <div className="absolute -right-3 -top-1.5 w-6 h-6 rounded-sm bg-gradient-to-r from-gray-800 via-gray-400 to-gray-700 shadow-lg border border-gray-500 flex items-center justify-center z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 border border-gray-400" />
            </div>

            {/* Rail Ambient Shadow */}
            <div className="absolute top-10 left-[8%] right-[8%] h-6 bg-black/10 blur-xl rounded-full pointer-events-none" />
          </div>

          {/* 3D Garments Rack Array */}
          <div className="relative w-full max-w-[1100px] h-[340px] md:h-[390px] flex items-center justify-center">
            {safeItems.map((garment, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;

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
                translateX = offset * 90 - 35;
                translateZ = offset * 24 - 35;
                rotateY = -74;
                scale = 0.94;
                opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.18);
              } else {
                translateX = offset * 90 + 35;
                translateZ = -offset * 24 - 35;
                rotateY = 74;
                scale = 0.94;
                opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.18);
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
                    <svg width="34" height="32" viewBox="0 0 36 34" fill="none" className="drop-shadow-sm">
                      <path
                        d="M18 2 C13 2 11 6 11 10 C11 14 14 16 17 17 L18 20"
                        stroke="#888"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 32 L18 20 L33 32 Z"
                        stroke="#afafb6"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Garment Image */}
                  <div className="relative w-[260px] md:w-[310px] h-[310px] md:h-[360px] flex items-center justify-center group">
                    <img
                      src={garment.image}
                      alt={garment.name}
                      draggable={false}
                      className={`w-full h-full object-contain filter transition-all duration-300 ${
                        isCenter
                          ? 'drop-shadow-[0_20px_28px_rgba(0,0,0,0.22)]'
                          : 'drop-shadow-[0_10px_14px_rgba(0,0,0,0.12)] brightness-95 group-hover:brightness-105'
                      }`}
                    />

                    {isCenter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalOpen(true);
                        }}
                        className="absolute bottom-5 bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Specs</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floor Shadow */}
          <div className="w-[380px] h-8 bg-black/15 blur-2xl rounded-full -mt-2 pointer-events-none" />
        </div>

        {/* Dock Controls */}
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-5 pt-5 border-t border-gray-200">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              {activeGarment.category || 'Atelier'} • {activeGarment.fabric || 'Heavyweight Cotton'}
            </span>
            <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-black mt-0.5 font-display">
              {activeGarment.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-base md:text-lg font-bold font-mono text-black">
                ₹{activeGarment.price.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold tracking-wider">
                READY TO WEAR
              </span>
            </div>
          </div>

          {/* Actions & Arrows */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-300 rounded-full p-1 shadow-sm">
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length)
                }
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-gray-200" />
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % safeItems.length)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleOpenTryOn(activeGarment)}
              className="px-5 py-3 border border-black hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-drip-coral" />
              <span>Try On</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Inspect Piece</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inspect & Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-[#f4f4f4] p-8 flex items-center justify-center relative">
              <img
                src={activeGarment.image}
                alt={activeGarment.name}
                className="w-full h-64 md:h-80 object-contain drop-shadow-xl"
              />
              <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-black text-white px-2 py-1 rounded">
                PIECE {String(activeIndex + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                      {activeGarment.brand || 'DRIP Atelier'}
                    </span>
                    <h4 className="text-xl font-black uppercase text-black font-display mt-0.5">
                      {activeGarment.name}
                    </h4>
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
                    ₹{activeGarment.price.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {activeGarment.description || 'Engineered with high-density architectural weave and clean finished hems.'}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">FABRIC</span>
                    <span className="font-semibold text-gray-900">{activeGarment.fabric || 'Combed Cotton 300 GSM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">FIT SPEC</span>
                    <span className="font-semibold text-gray-900">{activeGarment.fit || 'Relaxed Box Cut'}</span>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                    Select Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(activeGarment.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
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
                  <span>Add to Bag • ₹{activeGarment.price.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => {
                    setModalOpen(false);
                    handleOpenTryOn(activeGarment);
                  }}
                  className="w-full py-3 bg-gray-100 text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-drip-coral" />
                  <span>Try On in 3D Fitting Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Try-On Modal */}
      {tryOnItem && (
        <AIFittingRoomModal
          isOpen={true}
          onClose={() => setTryOnItem(null)}
          productImage={tryOnItem.image}
          brand={tryOnItem.brand || 'DRIP Atelier'}
          name={tryOnItem.name}
          price={tryOnItem.price}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] bg-black text-white text-xs font-mono py-2.5 px-6 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
