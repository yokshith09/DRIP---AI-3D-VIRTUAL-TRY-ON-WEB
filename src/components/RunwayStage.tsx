'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Eye, Sparkles, ShoppingBag, Check, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import AIFittingRoomModal from '@/components/AIFittingRoomModal';

export interface RunwayProductItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  image: string;
  optionsName: string;
  options: string[];
  fabric?: string;
}

export interface RunwayOutfitLook {
  index: number;
  name: string;
  subtitle: string;
  modelSrc640: string;
  modelSrc1080: string;
  bundlePrice: number;
  discountPrice: number;
  products: RunwayProductItem[];
  pins: { id: number; left: number; top: number; product: RunwayProductItem }[];
}

export const DRIP_RUNWAY_LOOKS: RunwayOutfitLook[] = [
  {
    index: 0,
    name: 'The City Edit',
    subtitle: 'Streetwear tailored for nocturnal transit',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
    bundlePrice: 12997,
    discountPrice: 11697,
    products: [
      {
        id: 'dr-knit-01',
        name: 'Charcoal Crew Knit',
        vendor: 'DRIP Atelier',
        price: 3999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
        optionsName: 'Size',
        options: ['S', 'M', 'L', 'XL'],
        fabric: '420 GSM Merino Wool Blend',
      },
      {
        id: 'dr-denim-01',
        name: 'Raw Light-Blue Denim',
        vendor: 'DRIP Atelier',
        price: 3999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
        optionsName: 'Waist',
        options: ['30', '32', '34', '36'],
        fabric: '14.5oz Japanese Selvedge',
      },
      {
        id: 'dr-snk-01',
        name: 'Orbit Low Titanium',
        vendor: 'DRIP Footwear',
        price: 4999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
        optionsName: 'Shoe Size',
        options: ['41', '42', '43', '44', '45'],
        fabric: 'Full-Grain Leather & EVA Foam',
      },
    ],
    pins: [
      {
        id: 1,
        left: 48,
        top: 26,
        product: {
          id: 'dr-knit-01',
          name: 'Charcoal Crew Knit',
          vendor: 'DRIP Atelier',
          price: 3999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
          optionsName: 'Size',
          options: ['S', 'M', 'L', 'XL'],
        },
      },
      {
        id: 2,
        left: 54,
        top: 58,
        product: {
          id: 'dr-denim-01',
          name: 'Raw Light-Blue Denim',
          vendor: 'DRIP Atelier',
          price: 3999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
          optionsName: 'Waist',
          options: ['30', '32', '34', '36'],
        },
      },
      {
        id: 3,
        left: 44,
        top: 86,
        product: {
          id: 'dr-snk-01',
          name: 'Orbit Low Titanium',
          vendor: 'DRIP Footwear',
          price: 4999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
          optionsName: 'Shoe Size',
          options: ['41', '42', '43', '44', '45'],
        },
      },
    ],
  },
  {
    index: 1,
    name: 'Gallery Opening',
    subtitle: 'Architectural minimalism with structured volume',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
    bundlePrice: 12997,
    discountPrice: 11697,
    products: [
      {
        id: 'dr-tee-02',
        name: 'Monolith Heavyweight Tee',
        vendor: 'DRIP Atelier',
        price: 2999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
        optionsName: 'Size',
        options: ['S', 'M', 'L', 'XL'],
        fabric: '300 GSM Organic Raw Jersey',
      },
      {
        id: 'dr-pant-02',
        name: 'Pleated Flannel Trousers',
        vendor: 'DRIP Atelier',
        price: 4499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
        optionsName: 'Waist',
        options: ['30', '32', '34', '36'],
        fabric: 'Italian Wool Twill Blend',
      },
      {
        id: 'dr-snk-02',
        name: 'Air Jordan 12 Retro',
        vendor: 'DRIP Footwear',
        price: 5499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
        optionsName: 'Shoe Size',
        options: ['40', '41', '42', '43', '44', '45'],
        fabric: 'Quilted Leather & Carbon Shank',
      },
    ],
    pins: [
      {
        id: 1,
        left: 50,
        top: 28,
        product: {
          id: 'dr-tee-02',
          name: 'Monolith Heavyweight Tee',
          vendor: 'DRIP Atelier',
          price: 2999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
          optionsName: 'Size',
          options: ['S', 'M', 'L', 'XL'],
        },
      },
      {
        id: 2,
        left: 48,
        top: 60,
        product: {
          id: 'dr-pant-02',
          name: 'Pleated Flannel Trousers',
          vendor: 'DRIP Atelier',
          price: 4499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
          optionsName: 'Waist',
          options: ['30', '32', '34', '36'],
        },
      },
      {
        id: 3,
        left: 52,
        top: 88,
        product: {
          id: 'dr-snk-02',
          name: 'Air Jordan 12 Retro',
          vendor: 'DRIP Footwear',
          price: 5499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
          optionsName: 'Shoe Size',
          options: ['40', '41', '42', '43', '44', '45'],
        },
      },
    ],
  },
  {
    index: 2,
    name: 'Weekend Studio',
    subtitle: 'Relaxed fleece layers with high-density ribbing',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-4.webp',
    bundlePrice: 13997,
    discountPrice: 12597,
    products: [
      {
        id: 'dr-hoodie-03',
        name: 'Oversized Raw Hoodie',
        vendor: 'DRIP Atelier',
        price: 4499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
        optionsName: 'Size',
        options: ['S', 'M', 'L', 'XL'],
        fabric: '450 GSM Heavy French Terry',
      },
      {
        id: 'dr-denim-03',
        name: 'Vintage Washed Cargo',
        vendor: 'DRIP Atelier',
        price: 3999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
        optionsName: 'Waist',
        options: ['30', '32', '34', '36'],
        fabric: 'Ripstop Cotton Drill',
      },
      {
        id: 'dr-snk-03',
        name: 'Tatum 5 Orbit High',
        vendor: 'DRIP Footwear',
        price: 5499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
        optionsName: 'Shoe Size',
        options: ['41', '42', '43', '44', '45'],
        fabric: 'Nubuck & Technical Mesh',
      },
    ],
    pins: [
      {
        id: 1,
        left: 48,
        top: 25,
        product: {
          id: 'dr-hoodie-03',
          name: 'Oversized Raw Hoodie',
          vendor: 'DRIP Atelier',
          price: 4499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
          optionsName: 'Size',
          options: ['S', 'M', 'L', 'XL'],
        },
      },
      {
        id: 2,
        left: 55,
        top: 56,
        product: {
          id: 'dr-denim-03',
          name: 'Vintage Washed Cargo',
          vendor: 'DRIP Atelier',
          price: 3999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
          optionsName: 'Waist',
          options: ['30', '32', '34', '36'],
        },
      },
      {
        id: 3,
        left: 46,
        top: 86,
        product: {
          id: 'dr-snk-03',
          name: 'Tatum 5 Orbit High',
          vendor: 'DRIP Footwear',
          price: 5499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
          optionsName: 'Shoe Size',
          options: ['41', '42', '43', '44', '45'],
        },
      },
    ],
  },
  {
    index: 3,
    name: 'Evening Atelier',
    subtitle: 'Sharp monochromatic tailoring with contrast stitching',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
    bundlePrice: 13997,
    discountPrice: 12597,
    products: [
      {
        id: 'dr-knit-04',
        name: 'Technical Mock-Neck Zip',
        vendor: 'DRIP Atelier',
        price: 4499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
        optionsName: 'Size',
        options: ['S', 'M', 'L', 'XL'],
        fabric: 'Bonded Scuba Fleece',
      },
      {
        id: 'dr-denim-04',
        name: 'Deep Obsidian Straight Cut',
        vendor: 'DRIP Atelier',
        price: 3999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
        optionsName: 'Waist',
        options: ['30', '32', '34', '36'],
        fabric: 'Overdyed 13oz Dark Indigo Denim',
      },
      {
        id: 'dr-snk-04',
        name: 'Air Jordan 12 Retro Dark',
        vendor: 'DRIP Footwear',
        price: 5499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
        optionsName: 'Shoe Size',
        options: ['40', '41', '42', '43', '44'],
        fabric: 'Matte Leather',
      },
    ],
    pins: [
      {
        id: 1,
        left: 49,
        top: 26,
        product: {
          id: 'dr-knit-04',
          name: 'Technical Mock-Neck Zip',
          vendor: 'DRIP Atelier',
          price: 4499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
          optionsName: 'Size',
          options: ['S', 'M', 'L', 'XL'],
        },
      },
      {
        id: 2,
        left: 52,
        top: 60,
        product: {
          id: 'dr-denim-04',
          name: 'Deep Obsidian Straight Cut',
          vendor: 'DRIP Atelier',
          price: 3999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
          optionsName: 'Waist',
          options: ['30', '32', '34', '36'],
        },
      },
      {
        id: 3,
        left: 48,
        top: 88,
        product: {
          id: 'dr-snk-04',
          name: 'Air Jordan 12 Retro Dark',
          vendor: 'DRIP Footwear',
          price: 5499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
          optionsName: 'Shoe Size',
          options: ['40', '41', '42', '43', '44'],
        },
      },
    ],
  },
  {
    index: 4,
    name: 'Modern Utility',
    subtitle: 'Tactical weatherproofing meets architectural proportion',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-2.webp',
    bundlePrice: 13297,
    discountPrice: 11967,
    products: [
      {
        id: 'dr-tee-05',
        name: 'Technical Pocket Shell',
        vendor: 'DRIP Atelier',
        price: 3499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
        optionsName: 'Size',
        options: ['S', 'M', 'L', 'XL'],
        fabric: 'Water-Repellent DWR Nylon',
      },
      {
        id: 'dr-pant-05',
        name: 'Articulated Knee Cargos',
        vendor: 'DRIP Atelier',
        price: 4299,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
        optionsName: 'Waist',
        options: ['30', '32', '34', '36'],
        fabric: 'Stretch Twill Canvas',
      },
      {
        id: 'dr-snk-05',
        name: 'Tatum 5 Orbit Stealth',
        vendor: 'DRIP Footwear',
        price: 5499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
        optionsName: 'Shoe Size',
        options: ['41', '42', '43', '44', '45'],
        fabric: 'Carbon Mesh',
      },
    ],
    pins: [
      {
        id: 1,
        left: 50,
        top: 27,
        product: {
          id: 'dr-tee-05',
          name: 'Technical Pocket Shell',
          vendor: 'DRIP Atelier',
          price: 3499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
          optionsName: 'Size',
          options: ['S', 'M', 'L', 'XL'],
        },
      },
      {
        id: 2,
        left: 52,
        top: 59,
        product: {
          id: 'dr-pant-05',
          name: 'Articulated Knee Cargos',
          vendor: 'DRIP Atelier',
          price: 4299,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
          optionsName: 'Waist',
          options: ['30', '32', '34', '36'],
        },
      },
      {
        id: 3,
        left: 47,
        top: 87,
        product: {
          id: 'dr-snk-05',
          name: 'Tatum 5 Orbit Stealth',
          vendor: 'DRIP Footwear',
          price: 5499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
          optionsName: 'Shoe Size',
          options: ['41', '42', '43', '44', '45'],
        },
      },
    ],
  },
  {
    index: 5,
    name: 'Transitional Layer',
    subtitle: 'Modular warmth calibrated for all seasons',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-3-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-3.webp',
    bundlePrice: 13997,
    discountPrice: 12597,
    products: [
      {
        id: 'dr-knit-06',
        name: 'Heavy Half-Zip Fleece',
        vendor: 'DRIP Atelier',
        price: 4499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
        optionsName: 'Size',
        options: ['S', 'M', 'L', 'XL'],
        fabric: 'Polar Fleece 360 GSM',
      },
      {
        id: 'dr-denim-06',
        name: 'Relaxed Ecru Carpenter Pant',
        vendor: 'DRIP Atelier',
        price: 3999,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
        optionsName: 'Waist',
        options: ['30', '32', '34', '36'],
        fabric: '100% Unbleached Heavy Cotton',
      },
      {
        id: 'dr-snk-06',
        name: 'Air Jordan 12 Retro Ecru',
        vendor: 'DRIP Footwear',
        price: 5499,
        image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
        optionsName: 'Shoe Size',
        options: ['40', '41', '42', '43', '44', '45'],
        fabric: 'Full-Grain Leather',
      },
    ],
    pins: [
      {
        id: 1,
        left: 50,
        top: 25,
        product: {
          id: 'dr-knit-06',
          name: 'Heavy Half-Zip Fleece',
          vendor: 'DRIP Atelier',
          price: 4499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
          optionsName: 'Size',
          options: ['S', 'M', 'L', 'XL'],
        },
      },
      {
        id: 2,
        left: 49,
        top: 58,
        product: {
          id: 'dr-denim-06',
          name: 'Relaxed Ecru Carpenter Pant',
          vendor: 'DRIP Atelier',
          price: 3999,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
          optionsName: 'Waist',
          options: ['30', '32', '34', '36'],
        },
      },
      {
        id: 3,
        left: 51,
        top: 87,
        product: {
          id: 'dr-snk-06',
          name: 'Air Jordan 12 Retro Ecru',
          vendor: 'DRIP Footwear',
          price: 5499,
          image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
          optionsName: 'Shoe Size',
          options: ['40', '41', '42', '43', '44', '45'],
        },
      },
    ],
  },
];

interface RunwayStageProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  compact?: boolean;
  onTryOnPiece?: (product: RunwayProductItem) => void;
}

export default function RunwayStage({
  title = 'Try the Look.',
  subtitle = 'Six looks, styled head to toe. Explore the turning 3D ring, isolate a look, or tap a pin to inspect the piece.',
  badgeText = '3D SPATIAL RUNWAY • LIVE OUTFIT CAROUSEL',
  compact = false,
  onTryOnPiece,
}: RunwayStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomedLook, setZoomedLook] = useState<RunwayOutfitLook | null>(null);
  const [activePin, setActivePin] = useState<{ id: number; product: RunwayProductItem } | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [directTryOnProduct, setDirectTryOnProduct] = useState<any>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addToCart = useCartStore((s) => s.addItem);

  const looks = DRIP_RUNWAY_LOOKS;
  const activeLook = looks[currentIndex];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Autoplay
  useEffect(() => {
    if (!isPlaying) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }
    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % looks.length);
    }, 5000);
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPlaying, looks.length]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + looks.length) % looks.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % looks.length);
  };

  // Add individual piece
  const handleAddPiece = (prod: RunwayProductItem) => {
    const size = selectedSizes[prod.id] || prod.options[0];
    addToCart({
      id: `${prod.id}-${size}`,
      brand: prod.vendor,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      size: size,
      color: 'Default',
      qty: 1,
      inStock: true,
    });
    showToast(`Added ${prod.name} (${size}) to Bag • ₹${prod.price.toLocaleString('en-IN')}`);
  };

  // Bundle full look
  const handleAddFullLook = () => {
    activeLook.products.forEach((prod) => {
      handleAddPiece(prod);
    });
    showToast(`Full Look — ${activeLook.name} (₹${activeLook.discountPrice.toLocaleString('en-IN')}) added to bag!`);
  };

  // Trigger Try-On
  const handleTryOn = (prod: RunwayProductItem) => {
    if (onTryOnPiece) {
      onTryOnPiece(prod);
    } else {
      setDirectTryOnProduct({
        id: prod.id,
        name: prod.name,
        brand: prod.vendor,
        price: prod.price,
        image: prod.image,
      });
    }
  };

  return (
    <div className={`relative w-full bg-white text-[#151413] flex flex-col overflow-hidden select-none font-sans ${compact ? 'min-h-[520px]' : 'min-h-[640px] md:min-h-[720px]'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] w-full flex-1">
        
        {/* Left Column: 3D Stage */}
        <div className="relative flex flex-col h-full bg-white overflow-hidden border-r border-[#e4e4e4]">
          {/* Header Row */}
          <div className="flex items-center justify-between px-6 md:px-10 pt-6 pb-2 z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[9px] font-mono tracking-widest uppercase mb-2 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {badgeText}
              </div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black m-0 font-display">
                {title}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-md font-sans">
                {subtitle}
              </p>
            </div>

            {/* Lightbox Trigger */}
            <button
              onClick={() => setZoomedLook(activeLook)}
              className="px-3.5 py-2 border border-gray-300 hover:border-black rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Expand Look in Lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inspect Look</span>
            </button>
          </div>

          {/* 3D Ring Stage Canvas */}
          <div
            ref={stageRef}
            className="relative flex-1 w-full flex items-center justify-center overflow-hidden min-h-[420px] md:min-h-[500px]"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
            onPointerDown={(e) => {
              isPointerDownRef.current = true;
              startXRef.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (!isPointerDownRef.current) return;
              isPointerDownRef.current = false;
              const diff = e.clientX - startXRef.current;
              if (diff > 50) handlePrev();
              else if (diff < -50) handleNext();
            }}
          >
            {/* Stage Soft Vignette & Floor Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.03)_100%)] pointer-events-none" />

            {/* Figures on Turning 3D Ring */}
            <div className="relative w-full max-w-[900px] h-full flex items-center justify-center">
              {looks.map((look, idx) => {
                const total = looks.length;
                let offset = (idx - currentIndex) % total;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const isCenter = offset === 0;

                // 3D Ring Trigonometric positioning
                const angle = (offset * (360 / total) * Math.PI) / 180;
                const radiusX = 380;
                const radiusZ = 300;
                const posX = Math.sin(angle) * radiusX;
                const posZ = Math.cos(angle) * radiusZ - radiusZ;

                const scale = Math.max(0.68, 1 + posZ / 600);
                const opacity = Math.max(0.18, 1 + posZ / 400);
                const blur = isCenter ? 0 : Math.min(8, Math.abs(offset) * 2.5);
                const zIndex = 50 + Math.round(posZ);

                return (
                  <div
                    key={look.name}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className="absolute top-0 bottom-0 flex flex-col items-center justify-end pb-4 transition-all duration-700 ease-out cursor-pointer group"
                    style={{
                      transform: `translate3d(${posX}px, 0, ${posZ}px) scale(${scale})`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      zIndex,
                    }}
                  >
                    {/* Model Cutout Image */}
                    <div className="relative h-[380px] md:h-[460px] aspect-[9/16] flex items-end justify-center">
                      <img
                        src={look.modelSrc640}
                        alt={look.name}
                        draggable={false}
                        className={`h-full w-full object-contain object-bottom transition-all duration-300 ${
                          isCenter
                            ? 'drop-shadow-[0_24px_38px_rgba(0,0,0,0.24)]'
                            : 'drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]'
                        }`}
                      />

                      {/* Interactive Pinned Garment Hotspots (Center figure only) */}
                      {isCenter &&
                        look.pins.map((pin) => (
                          <div
                            key={pin.id}
                            style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-40 group/pin"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePin(activePin?.id === pin.id ? null : pin);
                            }}
                          >
                            {/* Pin Pulsing Dot */}
                            <div className="relative flex items-center justify-center">
                              <span className="w-7 h-7 rounded-full bg-black/90 text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                {pin.id}
                              </span>
                              <span className="absolute w-7 h-7 rounded-full bg-drip-coral animate-ping opacity-40 pointer-events-none" />
                            </div>

                            {/* Pin Detail Popup */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-9 hidden group-hover/pin:flex flex-col bg-black text-white p-3 rounded-2xl shadow-2xl w-52 z-50 animate-fade-in border border-white/20">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                PINNED PIECE
                              </span>
                              <h4 className="text-xs font-bold leading-tight mt-0.5">{pin.product.name}</h4>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                                <span className="font-mono text-xs font-bold">₹{pin.product.price.toLocaleString('en-IN')}</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTryOn(pin.product);
                                    }}
                                    className="px-2 py-1 bg-drip-coral text-white rounded text-[9px] font-mono uppercase font-bold hover:bg-white hover:text-black transition-colors"
                                  >
                                    Try On
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddPiece(pin.product);
                                    }}
                                    className="px-2 py-1 bg-white text-black rounded text-[9px] font-mono uppercase font-bold hover:bg-emerald-400 transition-colors"
                                  >
                                    + Bag
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Floor Contact Shadow */}
                    <div className="w-40 h-6 bg-black/20 blur-md rounded-full -mt-2 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pacing & Progress Dock */}
          <div className="flex items-center justify-between px-6 md:px-10 py-4 border-t border-[#e4e4e4] bg-white z-10">
            {/* 01-06 Progress Indicator */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-black">
                0{currentIndex + 1}
              </span>
              <div className="flex gap-1.5">
                {looks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(i);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-8 bg-black' : 'w-2 bg-gray-200 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-gray-400">
                / 0{looks.length}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 text-[10px] font-mono uppercase rounded-full border border-gray-200 hover:border-black transition-colors cursor-pointer"
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: In This Look & Outfit Bundling */}
        <div className="flex flex-col h-full bg-[#fafafa] border-t lg:border-t-0 border-[#e4e4e4]">
          {/* Look Header */}
          <div className="p-6 md:p-8 border-b border-[#e4e4e4] bg-white">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
              LOOK 0{activeLook.index + 1} • IN THIS EDIT
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black font-display">
              {activeLook.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-sans">{activeLook.subtitle}</p>
          </div>

          {/* Garments List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
            {activeLook.products.map((prod, idx) => {
              const currentSize = selectedSizes[prod.id] || prod.options[0];
              const isPickerOpen = openPickerId === prod.id;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl p-4 border border-[#e4e4e4] shadow-sm hover:border-black transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`/product/${prod.id}`} className="w-16 h-20 bg-gray-50 rounded-xl relative overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 hover:border-black transition-colors">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain p-1"
                      />
                      <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black text-white text-[8px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono uppercase text-gray-400 block">
                        {prod.vendor}
                      </span>
                      <Link href={`/product/${prod.id}`} className="hover:underline">
                        <h4 className="text-xs font-bold text-black truncate uppercase tracking-wider">
                          {prod.name}
                        </h4>
                      </Link>
                      {prod.fabric && (
                        <p className="text-[10px] text-gray-400 truncate">{prod.fabric}</p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black font-mono text-black">₹{prod.price.toLocaleString('en-IN')}</span>
                        <button
                          onClick={() => setOpenPickerId(isPickerOpen ? null : prod.id)}
                          className="text-[10px] font-mono text-gray-500 underline uppercase cursor-pointer"
                        >
                          Size: {currentSize}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => handleTryOn(prod)}
                        className="p-2 rounded-full border border-gray-200 hover:border-black bg-gray-50 hover:bg-black hover:text-white transition-all cursor-pointer"
                        title="Try On Piece"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-drip-coral" />
                      </button>
                      <button
                        onClick={() => handleAddPiece(prod)}
                        className="p-2 rounded-full bg-black text-white hover:bg-drip-coral transition-all cursor-pointer"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Size Options Dropdown */}
                  {isPickerOpen && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                      <span className="w-full text-[9px] font-mono uppercase text-gray-400 mb-1">
                        Choose {prod.optionsName}:
                      </span>
                      {prod.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedSizes((prev) => ({ ...prev, [prod.id]: opt }));
                            setOpenPickerId(null);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                            currentSize === opt
                              ? 'bg-black text-white font-bold'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bundle Discount Footer */}
          <div className="p-6 md:p-8 bg-white border-t border-[#e4e4e4] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black block">
                  Complete The Look
                </span>
                <span className="text-[11px] text-gray-500 font-medium">Bundle all pieces &amp; save 10%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through mr-2 font-mono">
                  ₹{activeLook.bundlePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xl font-black font-mono text-black">
                  ₹{activeLook.discountPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddFullLook}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Full Look to Bag</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomedLook && (
        <div className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                Look 0{zoomedLook.index + 1}
              </span>
              <h2 className="text-2xl font-black uppercase text-black font-display">
                {zoomedLook.name}
              </h2>
            </div>
            <button
              onClick={() => setZoomedLook(null)}
              className="w-10 h-10 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-base cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 p-6 overflow-hidden">
            <div className="relative h-full max-h-[75vh] aspect-[9/16]">
              <img
                src={zoomedLook.modelSrc1080}
                alt={zoomedLook.name}
                className="w-full h-full object-contain object-bottom"
              />
              {zoomedLook.pins.map((pin) => (
                <div
                  key={pin.id}
                  style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/10 shadow-xl"
                >
                  <span className="w-5 h-5 rounded-full bg-black text-white font-mono text-[10px] flex items-center justify-center font-bold">
                    {pin.id}
                  </span>
                  <span className="text-xs font-bold text-gray-900">{pin.product.name}</span>
                  <span className="text-xs font-mono text-gray-600">₹{pin.product.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Direct Try-On Modal */}
      {directTryOnProduct && (
        <AIFittingRoomModal
          isOpen={true}
          onClose={() => setDirectTryOnProduct(null)}
          productImage={directTryOnProduct.image}
          brand={directTryOnProduct.brand}
          name={directTryOnProduct.name}
          price={directTryOnProduct.price}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] bg-black text-white text-xs font-mono py-2.5 px-6 rounded-full shadow-2xl animate-fade-in-up flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
