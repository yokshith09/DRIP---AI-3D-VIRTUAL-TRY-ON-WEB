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
    id: 'bh-buck-bk',
    name: 'BUCK-BK Premium Tee',
    brand: 'The Bear House',
    price: 1699,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/TSH-BUCK-BK_1.webp?v=1782989758',
    category: 'Shirts',
    fabric: 'Cotton Premium Blend',
    fit: 'Slim Fit',
    description: 'Engineered with signature premium cotton blend for structured modern drape and daily durability.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'bh-pexo-gr',
    name: 'PEXO-GR Minimalist Knit',
    brand: 'The Bear House',
    price: 1724,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/SWE-PEXO-GR_1.jpg?v=1770992487',
    category: 'Shirts',
    fabric: 'Cotton Premium Blend',
    fit: 'Slim Fit',
    description: 'Minimalist knit silhouette tailored with high-density ribbing and versatile tonal palette.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'bh-jase',
    name: 'JASE Heavy Overshirt',
    brand: 'The Bear House',
    price: 1839,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/SWE-JASE-MC_1.jpg?v=1761908501',
    category: 'Shirts',
    fabric: 'Cotton Premium Blend',
    fit: 'Slim Fit',
    description: 'Refined overshirt with clean stitch details and dual-needle construction.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'bh-everlys-ol',
    name: 'EVERLYS-OL Articulated Cargo',
    brand: 'The Bear House',
    price: 2599,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/CAR-EVERLYS-OL_1.webp?v=1781682098',
    category: 'Pants',
    fabric: 'Stretch Twill Canvas',
    fit: 'Slim Fit',
    description: 'Functional utility cargo featuring articulated knees, deep stash pockets, and tailored taper.',
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    id: 'bh-serene-mb',
    name: 'SERENE-MB Indigo Denim',
    brand: 'The Bear House',
    price: 2599,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/DNM-SERENE-MB_1.webp?v=1781855065',
    category: 'Jeans',
    fabric: '14.5oz Japanese Selvedge',
    fit: 'Slim Fit',
    description: 'Authentic medium-blue indigo wash crafted from ring-spun denim with custom copper hardware.',
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    id: 'bh-elbrus-1',
    name: 'ELBRUS Leather Low',
    brand: 'The Bear House',
    price: 2799,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/SHO-ELBRUS-CR-CREAM_7.jpg?v=1762341563',
    category: 'Sneakers',
    fabric: 'Full-Grain Leather & EVA Foam',
    fit: 'Regular',
    description: 'Streamlined low-profile trainer featuring sculpted lightweight midsole and padded collar.',
    sizes: ['40', '41', '42', '43', '44'],
  },
  {
    id: 'bh-trap-cr',
    name: 'TRAP-CR Tactical Cotton Shirt',
    brand: 'The Bear House',
    price: 1699,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/TBH-TRAP-CR_2.jpg?v=1780322449',
    category: 'Shirts',
    fabric: 'Cotton Premium Blend',
    fit: 'Slim Fit',
    description: 'Contemporary collar construction in crisp off-white cotton with refined micro-texture.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'bh-phyro-mr',
    name: 'PHYRO-MR Trail High',
    brand: 'The Bear House',
    price: 3999,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/SHO-PHYRO-MR_7.jpg?v=1768827618',
    category: 'Sneakers',
    fabric: 'Nubuck & High-Traction Rubber',
    fit: 'Regular',
    description: 'Technical high-top silhouette with rugged lugged outsole and ergonomic heel counter.',
    sizes: ['40', '41', '42', '43', '44'],
  },
  {
    id: 'bh-jerem-gr',
    name: 'JEREM-GR Structured Fleece',
    brand: 'The Bear House',
    price: 1839,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/SWE-JEREM-GR_1.jpg?v=1769684862',
    category: 'Shirts',
    fabric: 'Cotton Premium Blend',
    fit: 'Slim Fit',
    description: 'Minimalist sage green sweat layer crafted from combed cotton fleece.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'bh-lupo-bk',
    name: 'LUPO-BK Polar Overshirt',
    brand: 'The Bear House',
    price: 1899,
    image: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/TBH-LUPO-BK-M_1.jpg?v=1782819489',
    category: 'Shirts',
    fabric: 'Polar Fleece 360 GSM',
    fit: 'Slim Fit',
    description: 'Plush polar fleece zip-overshirt engineered for cold-weather streetwear layering.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
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
