'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Truck, ShieldCheck, Crown, Scissors, Wind, Settings, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RunwayStage from '../components/RunwayStage';
import WardrobeRail from '../components/WardrobeRail';
import AIFittingRoomModal from '../components/AIFittingRoomModal';
import { useProductStore } from '../store/products';

const SectionHeading = ({ title, subtitle, align = 'left' }: { title: string; subtitle?: string; align?: 'left' | 'center' }) => (
  <div className={`mb-8 md:mb-12 ${align === 'center' ? 'text-center' : ''}`}>
    {subtitle && (
      <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
        {subtitle}
      </span>
    )}
    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black leading-tight font-display">
      {title}
    </h2>
  </div>
);

const NewLaunchedContainer = ({
  title,
  desc,
  img,
  href,
  category,
}: {
  title: string;
  desc: string;
  img: string;
  href: string;
  category?: string;
}) => (
  <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-3xl overflow-hidden group bg-black shadow-lg border border-gray-100">
    <Image
      src={img}
      alt={title}
      fill
      className="object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center p-6 md:p-10">
      <div className="max-w-md">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center space-x-2 text-drip-coral text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-drip-coral/15 py-1.5 px-3 rounded-full border border-drip-coral/30">
            <Sparkles className="w-3 h-3" /> <span>Just Dropped</span>
          </span>
          {category && (
            <span className="bg-white text-black text-[10px] font-mono font-bold uppercase tracking-[0.25em] py-1.5 px-4 rounded-full shadow-lg">
              {category}
            </span>
          )}
        </div>
        <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-3 font-display">
          {title}
        </h3>
        <p className="text-gray-300 text-xs md:text-sm font-medium mb-6 leading-relaxed drop-shadow-md line-clamp-2">
          {desc}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral hover:text-white transition-all shadow-lg"
        >
          <span>Explore Drop</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { products } = useProductStore();
  const [isMounted, setIsMounted] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MENS_PRODUCTS = isMounted ? products.filter((p) => p.category === 'mens' && p.subcategory !== 'Sneakers').slice(0, 4) : [];
  const WOMENS_PRODUCTS = isMounted ? products.filter((p) => p.category === 'womens').slice(0, 4) : [];

  return (
    <main className="min-h-screen bg-[#fafafa] font-sans text-gray-900 selection:bg-black selection:text-white">
      <Navbar />

      {/* ══════ HERO: SPATIAL 3D RUNWAY STAGE ══════ */}
      <section className="relative w-full border-b border-[#e4e4e4] bg-white">
        <RunwayStage
          title="Try the Look."
          subtitle="Six looks, styled head to toe. Explore the turning 3D ring, isolate a look, or tap a pin to inspect and try on the piece."
          badgeText="3D SPATIAL RUNWAY • LIVE OUTFIT CAROUSEL"
          onTryOnPiece={(prod) => {
            setTryOnProduct({
              id: prod.id,
              name: prod.name,
              brand: prod.vendor,
              price: prod.price,
              image: prod.image,
            });
          }}
        />
      </section>

      {/* ══════ BRAND MARQUEE BANNER ══════ */}
      <div className="bg-[#151413] text-[#FAF4EE] py-3 px-4 border-y border-black overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-8 text-[10px] font-mono tracking-[0.25em] uppercase font-bold">
          <span>DRIP ATELIER 2026</span>
          <span>•</span>
          <span>COMPUTATIONAL 3D VIRTUAL DRAPING</span>
          <span>•</span>
          <span>ARCHITECTURAL HEAVYWEIGHT STREETWEAR</span>
          <span>•</span>
          <span>SPATIAL RUNWAY &amp; DIGITAL CLOTHES RAIL</span>
          <span>•</span>
          <span>DRIP ATELIER 2026</span>
          <span>•</span>
          <span>COMPUTATIONAL 3D VIRTUAL DRAPING</span>
          <span>•</span>
          <span>ARCHITECTURAL HEAVYWEIGHT STREETWEAR</span>
        </div>
      </div>

      {/* ══════ SECTION 2: DIGITAL WARDROBE RAIL (Sudiv Clothes Rail) ══════ */}
      <section className="relative w-full border-b border-[#e4e4e4]">
        <WardrobeRail
          title="Atelier Clothes Rail"
          subtitle="Slide along the chrome boutique rail to inspect garment cuts, drape angles, and fabric compositions."
          badgeText="DIGITAL WARDROBE • CHROME RAIL PERSPECTIVE"
          onSelectForTryOn={(garment) => {
            setTryOnProduct({
              id: garment.id,
              name: garment.name,
              brand: garment.brand || 'DRIP Atelier',
              price: garment.price,
              image: garment.image,
            });
          }}
        />
      </section>

      {/* ══════ SECTION 3: LATEST DROPS ══════ */}
      <section className="py-20 md:py-28 bg-white border-b border-[#e4e4e4]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading title="LATEST DROPS" subtitle="Fresh Arrivals" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <NewLaunchedContainer
              category="MEN"
              title="URBAN UTILITY"
              desc="Technical fabrics and architectural street volume. Engineered for high-density movement and tactile durability."
              img="/images/hero/cat-men-jackets.png"
              href="/collections/mens"
            />
            <NewLaunchedContainer
              category="WOMEN"
              title="MODERN MINIMALIST"
              desc="Clean silhouettes and drape dynamics. Setting a high-contrast standard for contemporary daily suiting."
              img="/images/hero/latest-women-drop.png"
              href="/collections/womens"
            />
          </div>
        </div>
      </section>

      {/* ══════ SECTION 4: BRAND IDENTITY & VIRTUAL TRY-ON ══════ */}
      <section className="py-24 md:py-32 bg-[#151413] text-white relative overflow-hidden border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-drip-coral text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-6 border border-drip-coral/30 px-4 py-1.5 rounded-full bg-drip-coral/10">
                ATELIER PHILOSOPHY
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-8 font-display">
                100% VIRTUAL TRY-ON.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                  AI COLOR MATCHING.
                </span>
              </h2>
              <div className="space-y-5 text-gray-400 font-sans leading-relaxed max-w-xl text-sm md:text-base">
                <p>
                  DRIP converges computational spatial design, generative draping, and obsessive heavy textile engineering. Every piece is constructed around architectural box silhouettes that hold their form in motion.
                </p>
                <p>
                  Experience precision sizing with our built-in virtual fitting room. Drape any catalog garment over your personal silhouette and calibrate tones against your Style DNA instantly.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <Link
                  href="/avatar-studio"
                  className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral hover:text-white transition-all shadow-xl inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-drip-coral" />
                  <span>Launch AI Atelier</span>
                </Link>
                <Link
                  href="/profile/locker"
                  className="px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:border-white transition-colors"
                >
                  <span>Open 3D Locker</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
                <Image
                  src="/images/hero/brand-materials.png"
                  alt="Craftsmanship"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
                    Virtual Draping
                  </span>
                </div>
              </div>
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden translate-y-8 border border-white/10 bg-gray-900 shadow-2xl">
                <Image
                  src="/images/hero/cat-sneakers.png"
                  alt="Innovation"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
                    Style DNA Formulation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 5: SHOP MEN'S ══════ */}
      <section className="py-20 md:py-28 bg-white border-b border-[#e4e4e4]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading title="SHOP MEN'S" subtitle="Curated Catalog" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {MENS_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p as any} onTryOn={setTryOnProduct} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/collections/mens"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-colors shadow-lg"
            >
              <span>Explore Men&apos;s Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 6: SHOP WOMEN'S ══════ */}
      <section className="py-20 md:py-28 bg-[#fafafa] border-b border-[#e4e4e4]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading title="SHOP WOMEN'S" subtitle="Curated Catalog" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {WOMENS_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p as any} onTryOn={setTryOnProduct} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/collections/womens"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-drip-coral transition-colors shadow-lg"
            >
              <span>Explore Women&apos;s Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ══════ VIRTUAL FITTING ROOM MODAL ══════ */}
      {tryOnProduct && (
        <AIFittingRoomModal
          isOpen={true}
          onClose={() => setTryOnProduct(null)}
          productImage={tryOnProduct.image}
          brand={tryOnProduct.brand}
          name={tryOnProduct.name}
          price={tryOnProduct.priceNumber || tryOnProduct.price}
        />
      )}
    </main>
  );
}
