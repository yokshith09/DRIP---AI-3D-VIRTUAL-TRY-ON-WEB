'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

// --- Types & Data ---
export interface RunwayProduct {
  id: string;
  name: string;
  vendor: string;
  price: number;
  image: string;
  url: string;
  optionsName: string;
  options: string[];
  variants: { id: number; available: boolean; option: string }[];
  tag?: string;
}

export interface RunwayLook {
  index: number;
  name: string;
  subtitle: string;
  modelSrc640: string;
  modelSrc1080: string;
  bundlePrice: number;
  discountPrice: number;
  products: RunwayProduct[];
  pins: { id: number; left: number; top: number; product: RunwayProduct }[];
}

const RUNWAY_PRODUCTS: Record<string, RunwayProduct> = {
  aj12: {
    id: 'tatum-5-orbit-copy',
    name: 'Air Jordan 12 Retro',
    vendor: 'Nikey | Password: 1',
    price: 149,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit-copy',
    optionsName: 'Shoe size',
    options: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015167025457, available: true, option: '40' },
      { id: 57015167058225, available: true, option: '41' },
      { id: 57015167090993, available: true, option: '42' },
      { id: 57015167123761, available: true, option: '43' },
      { id: 57015167156529, available: true, option: '44' },
      { id: 57015167189297, available: true, option: '45' },
      { id: 57015167222065, available: true, option: '46' },
    ],
  },
  tshirt: {
    id: 'tshirt',
    name: 'Tshirt',
    vendor: 'Nike',
    price: 199,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/tshirt',
    optionsName: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56835911582001, available: true, option: 'S' },
      { id: 56835911614769, available: true, option: 'L' },
      { id: 56835911647537, available: true, option: 'M' },
      { id: 56835911680305, available: true, option: 'XL' },
    ],
  },
  sweatshirt: {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    vendor: 'Nike',
    price: 199,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/sweatshirt',
    optionsName: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56835806396721, available: true, option: 'S' },
      { id: 56835806429489, available: true, option: 'L' },
      { id: 56835806462257, available: true, option: 'M' },
      { id: 56835806495025, available: true, option: 'XL' },
    ],
  },
  tatum5: {
    id: 'tatum-5-orbit',
    name: 'Tatum 5 Orbit',
    vendor: 'Nikey | Password: 1',
    price: 149,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit',
    optionsName: 'Shoe size',
    options: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015166730545, available: true, option: '40' },
      { id: 57015166763313, available: true, option: '41' },
      { id: 57015166796081, available: true, option: '42' },
      { id: 57015166828849, available: true, option: '43' },
      { id: 57015166861617, available: true, option: '44' },
      { id: 57015166894385, available: true, option: '45' },
      { id: 57015166927153, available: true, option: '46' },
    ],
  },
  hoodieBlack: {
    id: 'hoodie-black',
    name: 'Hoodie Black',
    vendor: 'Nike',
    price: 199,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie-black.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/hoodie-black',
    optionsName: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836251681073, available: true, option: 'S' },
      { id: 56836251713841, available: true, option: 'L' },
      { id: 56836251746609, available: true, option: 'M' },
      { id: 56836251779377, available: true, option: 'XL' },
    ],
    tag: 'New',
  },
  sweatshirtPlus: {
    id: 'sweatshirt-plus',
    name: 'Sweatshirt Plus',
    vendor: 'Nike',
    price: 199,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt-plus.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/sweatshirt-plus',
    optionsName: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836143743281, available: true, option: 'S' },
      { id: 56836143776049, available: true, option: 'L' },
      { id: 56836143808817, available: true, option: 'M' },
      { id: 56836143841585, available: true, option: 'XL' },
    ],
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie',
    vendor: 'Nike',
    price: 199,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/hoodie',
    optionsName: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836002185521, available: true, option: 'S' },
      { id: 56836002218289, available: true, option: 'L' },
      { id: 56836002251057, available: true, option: 'M' },
      { id: 56836002283825, available: true, option: 'XL' },
    ],
  },
  luka5: {
    id: 'air-jordan-12-retro-copy',
    name: 'Luka 5',
    vendor: 'Nikey | Password: 1',
    price: 149,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-air-jordan-12-retro-copy.webp',
    url: 'https://nike-makknzjs.myshopify.com/products/air-jordan-12-retro-copy',
    optionsName: 'Shoe size',
    options: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015176364337, available: true, option: '40' },
      { id: 57015176397105, available: true, option: '41' },
      { id: 57015176429873, available: true, option: '42' },
      { id: 57015176462641, available: true, option: '43' },
      { id: 57015176495409, available: true, option: '44' },
      { id: 57015176528177, available: true, option: '45' },
      { id: 57015176560945, available: true, option: '46' },
    ],
  },
};

const RUNWAY_LOOKS: RunwayLook[] = [
  {
    index: 0,
    name: 'The City Edit',
    subtitle: 'A charcoal knit and easy denim.',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
    bundlePrice: 547.0,
    discountPrice: 492.3,
    products: [RUNWAY_PRODUCTS.aj12, RUNWAY_PRODUCTS.tshirt, RUNWAY_PRODUCTS.sweatshirt],
    pins: [
      { id: 1, left: 47, top: 27, product: RUNWAY_PRODUCTS.aj12 },
      { id: 2, left: 48, top: 58, product: RUNWAY_PRODUCTS.tshirt },
      { id: 3, left: 45, top: 96, product: RUNWAY_PRODUCTS.sweatshirt },
    ],
  },
  {
    index: 1,
    name: 'Gallery Opening',
    subtitle: 'A clean white tee and relaxed denim.',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
    bundlePrice: 547.0,
    discountPrice: 492.3,
    products: [RUNWAY_PRODUCTS.tatum5, RUNWAY_PRODUCTS.hoodieBlack, RUNWAY_PRODUCTS.tshirt],
    pins: [
      { id: 1, left: 50, top: 28, product: RUNWAY_PRODUCTS.tatum5 },
      { id: 2, left: 48, top: 58, product: RUNWAY_PRODUCTS.hoodieBlack },
      { id: 3, left: 45, top: 88, product: RUNWAY_PRODUCTS.tshirt },
    ],
  },
  {
    index: 2,
    name: 'Gallery Opening',
    subtitle: 'Olive knitwear. A grounded palette.',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-4.webp',
    bundlePrice: 547.0,
    discountPrice: 492.3,
    products: [RUNWAY_PRODUCTS.sweatshirtPlus, RUNWAY_PRODUCTS.tatum5, RUNWAY_PRODUCTS.tshirt],
    pins: [
      { id: 1, left: 50, top: 28, product: RUNWAY_PRODUCTS.sweatshirtPlus },
      { id: 2, left: 48, top: 58, product: RUNWAY_PRODUCTS.tatum5 },
      { id: 3, left: 45, top: 88, product: RUNWAY_PRODUCTS.tshirt },
    ],
  },
  {
    index: 3,
    name: 'Studio Day',
    subtitle: 'Black, white and laid-back denim.',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
    bundlePrice: 547.0,
    discountPrice: 492.3,
    products: [RUNWAY_PRODUCTS.hoodieBlack, RUNWAY_PRODUCTS.aj12, RUNWAY_PRODUCTS.tshirt],
    pins: [
      { id: 1, left: 50, top: 28, product: RUNWAY_PRODUCTS.hoodieBlack },
      { id: 2, left: 48, top: 58, product: RUNWAY_PRODUCTS.aj12 },
      { id: 3, left: 45, top: 88, product: RUNWAY_PRODUCTS.tshirt },
    ],
  },
  {
    index: 4,
    name: 'Studio Day',
    subtitle: 'Burgundy layers. A tailored perspective.',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-3-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-3.webp',
    bundlePrice: 547.0,
    discountPrice: 492.3,
    products: [RUNWAY_PRODUCTS.sweatshirt, RUNWAY_PRODUCTS.tatum5, RUNWAY_PRODUCTS.tshirt],
    pins: [
      { id: 1, left: 50, top: 28, product: RUNWAY_PRODUCTS.sweatshirt },
      { id: 2, left: 48, top: 58, product: RUNWAY_PRODUCTS.tatum5 },
      { id: 3, left: 45, top: 88, product: RUNWAY_PRODUCTS.tshirt },
    ],
  },
  {
    index: 5,
    name: 'Studio Day',
    subtitle: 'A grey crew and your favourite denim.',
    modelSrc640: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    modelSrc1080: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-2.webp',
    bundlePrice: 547.0,
    discountPrice: 492.3,
    products: [RUNWAY_PRODUCTS.hoodie, RUNWAY_PRODUCTS.luka5, RUNWAY_PRODUCTS.tshirt],
    pins: [
      { id: 1, left: 50, top: 28, product: RUNWAY_PRODUCTS.hoodie },
      { id: 2, left: 48, top: 58, product: RUNWAY_PRODUCTS.luka5 },
      { id: 3, left: 45, top: 88, product: RUNWAY_PRODUCTS.tshirt },
    ],
  },
];

export default function Runway3D() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomedLook, setZoomedLook] = useState<RunwayLook | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [hotCard, setHotCard] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [stylingBag, setStylingBag] = useState<any[]>([]);

  const addToCart = useCartStore((state) => state.addItem);

  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef<number>(0);
  const curRef = useRef<number>(0);
  const velRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; t: number; time: number } | null>(null);
  const lastVelRef = useRef<{ x: number; time: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const engagedRef = useRef<boolean>(false);

  // Initialize styling bag from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('runway-styling-bag-v3');
      if (raw) setStylingBag(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const saveBag = (items: any[]) => {
    setStylingBag(items);
    try {
      localStorage.setItem('runway-styling-bag-v3', JSON.stringify(items));
    } catch (_) {}
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const activeLook = RUNWAY_LOOKS[activeIdx];

  // 3D Ring Animation Engine
  const renderAll = useCallback(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const W = stage.clientWidth || 800;
    const H = stage.clientHeight || 600;
    const isPhone = window.innerWidth <= 749;

    const cur = curRef.current;
    const fs = isPhone ? 1.0 : 1.08;

    if (!isPhone) {
      // 3D Ring mode math (Desktop)
      const cx = 0.5 * W;
      const R = 0.62 * W;
      const P = 1.65 * W;
      const floor = H - 34;
      const horizon = 0.36 * H;
      const step = (2 * Math.PI) / 12;

      for (let a = 0; a < 12; a++) {
        const el = bodyRefs.current[a];
        if (!el) continue;

        let phi = ((a - cur) * step) % (2 * Math.PI);
        if (phi <= -Math.PI) phi += 2 * Math.PI;
        if (phi > Math.PI) phi -= 2 * Math.PI;

        const z = R * (1 - Math.cos(phi));
        const persp = P / (P + z);
        const sl = Math.abs(phi) / step;
        const scale = persp * (1 + (fs - 1) * Math.max(0, Math.min(1, 1 - sl)));
        const x = cx + R * Math.sin(phi) * persp;
        const feet = horizon + (floor - horizon) * persp;
        const bottom = H - feet;
        const blur = sl <= 1 ? 1.8 * sl : Math.min(1.8 + (sl - 1) * 2, 6.5);
        let opacity = Math.max(0, Math.min(1, (Math.cos(phi) + 0.55) / 0.3));

        // When front figure is at rest, hero takes its spot
        const isStill = Math.abs(velRef.current) < 0.001;
        if (isStill && sl < 0.02) {
          opacity = 0;
        }

        const zIndex = Math.round(scale * 1000);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${(-bottom).toFixed(1)}px, 0) translateX(-50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = zIndex.toString();
        el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
        el.style.filter = blur <= 0.05 ? '' : `blur(${blur.toFixed(1)}px)`;
      }
    } else {
      // Classic mode math (Phone)
      const ax = 0.3, ay = 22, sx = 0.32, sy = 22, sr = 0.76, ex = 0.55;
      for (let a = 0; a < 12; a++) {
        const el = bodyRefs.current[a];
        if (!el) continue;
        let k = (a - cur) % 12;
        if (k < 0) k += 12;

        let x, bottom, scale, opacity, blur, zIndex;
        if (k < 0) {
          const e = Math.min(-k, 1.4);
          x = W * (ax - ex * e);
          bottom = ay - 22 * e;
          scale = 1 + 0.14 * e;
          opacity = Math.max(0, 1 - 1.05 * e);
          blur = 4 * Math.min(e, 1);
          zIndex = 1100;
        } else {
          x = W * (ax + sx * k);
          bottom = ay + sy * k;
          scale = Math.pow(sr, k);
          opacity = k <= 3 ? 1 - 0.13 * k : Math.max(0, 0.61 * (4 - k));
          blur = Math.min(0.9 * k, 3.2);
          zIndex = 1000 - Math.round(10 * k);
        }

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${(-bottom).toFixed(1)}px, 0) translateX(-50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = zIndex.toString();
        el.style.filter = blur <= 0.05 ? '' : `blur(${blur.toFixed(1)}px)`;
      }
    }
  }, []);

  const kick = useCallback(() => {
    if (rafRef.current) return;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.034, (now - lastTime) / 1000);
      lastTime = now;

      // Spring parameters (Balanced: K=95, C=19.49)
      const K = 95;
      const C = 19.49;
      const subSteps = 3;
      const h = dt / subSteps;

      for (let s = 0; s < subSteps; s++) {
        const acc = -K * (curRef.current - targetRef.current) - C * velRef.current;
        velRef.current += acc * h;
        curRef.current += velRef.current * h;
      }

      renderAll();

      const diff = Math.abs(curRef.current - targetRef.current);
      const v = Math.abs(velRef.current);

      if (diff <= 0.0005 && v <= 0.0005 && !isDraggingRef.current) {
        curRef.current = targetRef.current;
        velRef.current = 0;
        renderAll();
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [renderAll]);

  const moveTo = useCallback((t: number) => {
    targetRef.current = t;
    const norm = (Math.round(t) % 6 + 6) % 6;
    setActiveIdx(norm);
    kick();
  }, [kick]);

  const nextLook = useCallback(() => {
    moveTo(Math.round(targetRef.current) + 1);
  }, [moveTo]);

  const prevLook = useCallback(() => {
    moveTo(Math.round(targetRef.current) - 1);
  }, [moveTo]);

  // Autoplay cycle
  useEffect(() => {
    if (!isPlaying || engagedRef.current || zoomedLook) {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      return;
    }

    autoTimerRef.current = setTimeout(() => {
      nextLook();
    }, 5000);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [isPlaying, activeIdx, nextLook, zoomedLook]);

  // Pointer Drag & Swipe Handling
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDraggingRef.current = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY, t: targetRef.current, time: Date.now() };
      lastVelRef.current = [{ x: e.clientX, time: Date.now() }];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      if (!isDraggingRef.current) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > 1.2 * Math.abs(dy)) {
          isDraggingRef.current = true;
          engagedRef.current = true;
          setIsPlaying(false);
        }
      }

      if (isDraggingRef.current) {
        lastVelRef.current.push({ x: e.clientX, time: Date.now() });
        if (lastVelRef.current.length > 5) lastVelRef.current.shift();
        const unit = Math.max(120, 0.3 * (stage.clientWidth || 800));
        targetRef.current = dragStartRef.current.t - dx / unit;
        kick();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        const dx = e.clientX - dragStartRef.current.x;
        const first = lastVelRef.current[0] || { x: e.clientX, time: Date.now() - 1 };
        const last = lastVelRef.current[lastVelRef.current.length - 1] || first;
        const vx = (last.x - first.x) / Math.max(1, last.time - first.time);
        const from = Math.round(dragStartRef.current.t);
        const unit = Math.max(120, 0.3 * (stage.clientWidth || 800));

        let i = Math.round(targetRef.current - vx * 160 / unit);
        if (i === from && Math.abs(vx) > 0.3) {
          i = from + (vx > 0 ? -1 : 1);
        }
        moveTo(i);
      }
      dragStartRef.current = null;
    };

    stage.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      stage.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [kick, moveTo]);

  // Inertial Custom Cursor
  useEffect(() => {
    const stage = stageRef.current;
    const cursor = cursorRef.current;
    if (!stage || !cursor || window.matchMedia('(hover: none)').matches) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let active = false;

    const onEnter = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      curX = targetX = e.clientX - rect.left;
      curY = targetY = e.clientY - rect.top;
      cursor.style.opacity = '1';
      active = true;
    };

    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const onLeave = () => {
      cursor.style.opacity = '0';
      active = false;
    };

    const updateCursor = () => {
      if (active) {
        curX += (targetX - curX) * 0.18;
        curY += (targetY - curY) * 0.18;
        cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }
      requestAnimationFrame(updateCursor);
    };

    stage.addEventListener('mouseenter', onEnter);
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    const frame = requestAnimationFrame(updateCursor);

    return () => {
      stage.removeEventListener('mouseenter', onEnter);
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Window resize handler
  useEffect(() => {
    const onResize = () => {
      renderAll();
      kick();
    };
    window.addEventListener('resize', onResize);
    renderAll();
    return () => window.removeEventListener('resize', onResize);
  }, [renderAll, kick]);

  // Single item add handler
  const handleAddPiece = (prod: RunwayProduct) => {
    engagedRef.current = true;
    setIsPlaying(false);
    const size = selectedSizes[prod.id] || prod.options[0];
    const key = `${prod.id}-${size}`;

    // Add to DRIP Zustand Cart
    addToCart({
      id: prod.id,
      brand: prod.vendor,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      size: size,
      color: 'Default',
      qty: 1,
      inStock: true,
    });

    // Add to styling bag
    const currentBag = [...stylingBag];
    const exist = currentBag.find((x) => x.id === prod.id && x.size === size);
    if (exist) {
      exist.quantity = Math.min(20, exist.quantity + 1);
    } else {
      currentBag.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        size: size,
        image: prod.image,
        url: prod.url,
        quantity: 1,
      });
    }
    saveBag(currentBag);

    setAddedItems((prev) => ({ ...prev, [prod.id]: true }));
    showToast(`Saved ${prod.name} (${size}) to styling bag`);
  };

  // Bundle Add Handler
  const handleAddFullLook = () => {
    engagedRef.current = true;
    setIsPlaying(false);
    activeLook.products.forEach((prod) => {
      handleAddPiece(prod);
    });
    showToast(`Full Look — ${activeLook.name} ($${activeLook.discountPrice.toFixed(2)}) added to bag!`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-88px)] min-h-[580px] bg-white text-[#151413] flex flex-col overflow-hidden select-none font-sans">
      {/* 3D Runway Stage & Aside Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] w-full h-full flex-1">
        {/* Left Column: Stage, Head, Controls */}
        <div className="relative flex flex-col h-full bg-white overflow-hidden border-r border-[#e4e4e4]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-8 pt-8 pb-2 z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white rounded-full text-[9px] font-mono tracking-widest uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                RUNWAY 3D • TRY THE LOOK
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#151413] m-0">
                Try the Look.
              </h1>
              <p className="text-xs text-[#66625c] mt-1 font-medium">
                Six looks, styled head to toe. Explore the turning 3D ring, isolate a look, or tap a pin to inspect the piece.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBagOpen(true)}
                className="relative px-4 py-2 border border-[#c8c8c8] hover:border-black rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Styling Bag</span>
                <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono flex items-center justify-center">
                  {stylingBag.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </button>
            </div>
          </div>

          {/* 3D Turning Ring Stage */}
          <div
            ref={stageRef}
            className="relative flex-1 w-full min-h-0 cursor-grab active:cursor-grabbing overflow-hidden"
          >
            {/* 12 Ring Bodies (6 Originals + 6 Clones) */}
            <div className="absolute inset-0 pointer-events-auto">
              {Array.from({ length: 12 }).map((_, i) => {
                const look = RUNWAY_LOOKS[i % 6];
                return (
                  <div
                    key={i}
                    ref={(el) => { bodyRefs.current[i] = el; }}
                    className="absolute left-0 bottom-0 origin-bottom will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    {/* Shadow */}
                    <div className="absolute left-[58%] bottom-0 w-[150%] h-[9%] min-h-[14px] -translate-x-1/2 translate-y-1/2 blur-[2px] rounded-full bg-[radial-gradient(closest-side,rgba(20,16,12,0.3),transparent_75%)] pointer-events-none" />
                    {/* Figure */}
                    <div className="relative h-[480px] md:h-[560px] aspect-[9/16]">
                      <img
                        src={look.modelSrc640}
                        alt={look.name}
                        className="w-full h-full object-contain object-bottom pointer-events-none select-none"
                        loading={i < 6 ? 'eager' : 'lazy'}
                      />
                      <button
                        onClick={() => moveTo(i)}
                        className="absolute inset-0 z-10 cursor-pointer"
                        aria-label={`Jump to ${look.name}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Front Hero & Pins Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 flex justify-center items-end pb-8">
              <div className="relative h-[480px] md:h-[560px] aspect-[9/16] pointer-events-auto">
                <img
                  src={activeLook.modelSrc1080}
                  alt={activeLook.name}
                  className="w-full h-full object-contain object-bottom select-none"
                />

                {/* Inspect Zoom Button */}
                <button
                  onClick={() => setZoomedLook(activeLook)}
                  className="absolute inset-0 z-10 cursor-zoom-in"
                  title="View look details"
                />

                {/* Numbered Pins */}
                {activeLook.pins.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => {
                      setHotCard(pin.id);
                      setOpenPickerId(pin.product.id);
                    }}
                    style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  >
                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-black font-mono font-bold text-xs shadow-lg border border-black/10 group-hover:scale-125 group-hover:bg-black group-hover:text-white transition-all">
                      {pin.id}
                      <span className="absolute inset-0 rounded-full border border-white animate-ping opacity-75" />
                    </span>
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/90 text-white text-[11px] font-medium tracking-wide py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                      {pin.product.name} • ${pin.product.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inertial Drag / View Cursor */}
            <div
              ref={cursorRef}
              className="absolute left-0 top-0 -ml-10 -mt-10 w-20 h-20 rounded-full border border-black/30 bg-white/30 backdrop-blur-md flex items-center justify-center text-[10px] font-mono tracking-widest uppercase pointer-events-none z-50 opacity-0 transition-opacity duration-200"
            >
              Drag
            </div>
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-[#e4e4e4] bg-white z-10">
            <button
              onClick={prevLook}
              className="w-10 h-10 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-sm transition-all cursor-pointer"
              title="Previous look"
            >
              &larr;
            </button>

            {/* Ticks 01-06 */}
            <div className="flex items-center gap-2 flex-1 max-w-md mx-6">
              {RUNWAY_LOOKS.map((look, idx) => (
                <button
                  key={idx}
                  onClick={() => moveTo(idx)}
                  className={`flex-1 h-8 flex flex-col justify-center gap-1 transition-all text-left cursor-pointer ${
                    idx === activeIdx ? 'text-black font-bold' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  <div className="w-full h-0.5 bg-gray-200 relative overflow-hidden rounded-full">
                    <div
                      className={`absolute inset-0 bg-black transition-all ${
                        idx === activeIdx
                          ? isPlaying
                            ? 'animate-[rw-fill_5s_linear_infinite]'
                            : 'w-full'
                          : idx < activeIdx
                          ? 'w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono">
                    0{idx + 1} {idx === activeIdx && <span className="hidden md:inline font-sans ml-1">• {look.name}</span>}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-xs font-mono transition-all cursor-pointer"
                title={isPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
              <button
                onClick={nextLook}
                className="w-10 h-10 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-sm transition-all cursor-pointer"
                title="Next look"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: "In This Look" Panel */}
        <div className="flex flex-col h-full bg-[#FAF9F7] overflow-y-auto border-l border-[#e4e4e4]">
          <div className="p-6 border-b border-[#e4e4e4] flex items-baseline justify-between bg-white">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-[#151413]">
                In This Look
              </h2>
              <span className="text-xs font-mono text-gray-500">
                0{activeIdx + 1} • {activeLook.name}
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest font-mono bg-gray-100 px-2.5 py-1 rounded-full text-gray-700">
              3 Pieces
            </span>
          </div>

          {/* Garments List */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {activeLook.products.map((prod, pIdx) => {
              const isAdded = addedItems[prod.id];
              const isHot = hotCard === pIdx + 1;
              const isPickerOpen = openPickerId === prod.id;
              const currentSize = selectedSizes[prod.id] || prod.options[0];

              return (
                <div
                  key={prod.id}
                  className={`p-4 rounded-xl border bg-white transition-all shadow-sm ${
                    isHot ? 'border-black ring-1 ring-black' : 'border-[#e4e4e4] hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-1" />
                      <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono flex items-center justify-center font-bold">
                        {pIdx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400">{prod.vendor}</span>
                        {prod.tag && (
                          <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">
                            {prod.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 truncate mt-0.5">{prod.name}</h3>
                      <p className="text-xs font-mono font-bold text-gray-700 mt-1">${prod.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => setOpenPickerId(isPickerOpen ? null : prod.id)}
                          className="text-[11px] font-mono underline underline-offset-2 text-gray-600 hover:text-black cursor-pointer"
                        >
                          Size: {currentSize} ▾
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddPiece(prod)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isAdded
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-black text-white hover:bg-drip-coral shadow'
                      }`}
                      title="Add garment to bag"
                    >
                      {isAdded ? '✓' : '+'}
                    </button>
                  </div>

                  {/* Size Options Picker */}
                  {isPickerOpen && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      <span className="w-full text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                        Select {prod.optionsName}:
                      </span>
                      {prod.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedSizes((prev) => ({ ...prev, [prod.id]: opt }));
                            setOpenPickerId(null);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
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
          <div className="p-6 bg-white border-t border-[#e4e4e4] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 block">Complete The Look</span>
                <span className="text-[11px] text-gray-500 font-medium">Bundle all 3 pieces & save 10%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through mr-2 font-mono">
                  ${activeLook.bundlePrice.toFixed(2)}
                </span>
                <span className="text-lg font-black font-mono text-black">
                  ${activeLook.discountPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddFullLook}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add Full Look to Bag</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomedLook && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Look 0{zoomedLook.index + 1}</span>
              <h2 className="text-2xl font-black uppercase text-black">{zoomedLook.name}</h2>
            </div>
            <button
              onClick={() => setZoomedLook(null)}
              className="w-12 h-12 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 p-6 overflow-hidden">
            <div className="relative h-full max-h-[80vh] aspect-[9/16]">
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
                  <span className="text-xs font-mono text-gray-600">${pin.product.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Styling Bag Modal */}
      {bagOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-black">Your Styling Bag</h3>
                <p className="text-xs text-gray-500">Shortlisted items saved from the Runway 3D session.</p>
              </div>
              <button
                onClick={() => setBagOpen(false)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {stylingBag.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">Your styling bag is empty. Explore looks and add pieces.</p>
              ) : (
                stylingBag.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white rounded p-1 border" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                        <span className="text-[11px] font-mono text-gray-500">Size: {item.size} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => {
                          const updated = stylingBag.filter((_, i) => i !== idx);
                          saveBag(updated);
                        }}
                        className="text-gray-400 hover:text-red-500 text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {stylingBag.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Subtotal</span>
                  <span className="font-mono">${stylingBag.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <Link
                  href="/cart"
                  className="block w-full py-3 bg-black text-white text-center text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-colors"
                >
                  Proceed to DRIP Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-black text-white text-xs font-mono py-2.5 px-6 rounded-full shadow-2xl animate-fade-in-up">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
