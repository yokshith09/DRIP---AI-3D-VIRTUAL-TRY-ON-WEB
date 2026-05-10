'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, ShieldCheck, Truck, Scissors, Wind, Shield } from 'lucide-react';

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">


      {/* ══════ HEADER ══════ */}
      <header className={`sticky top-0 z-[60] transition-all duration-300 flex items-center justify-between px-5 md:px-10 h-14 bg-white ${scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'}`}>
        <div className="flex items-center space-x-5">
          <button className="p-1.5 hover:bg-gray-50 rounded-md lg:hidden"><Menu className="w-5 h-5" /></button>
          <Link href="/" className="text-xl font-black tracking-tight">DRIP</Link>
        </div>
        <nav className="hidden lg:flex items-center space-x-7">
          {['MEN', 'WOMEN', 'ACCESSORIES', 'AI STUDIO'].map((item) => (
            <Link key={item} href={item === 'AI STUDIO' ? '/avatar-studio' : '/category'} className="text-[11px] font-bold tracking-[0.15em] text-gray-600 hover:text-black transition-colors">{item}</Link>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-50 rounded-md hidden md:block"><Search className="w-[18px] h-[18px] text-gray-500" /></button>
          <Link href="/profile" className="p-2 hover:bg-gray-50 rounded-md"><User className="w-[18px] h-[18px] text-gray-500" /></Link>
          <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-md">
            <ShoppingBag className="w-[18px] h-[18px] text-gray-500" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-drip-coral text-white text-[8px] rounded-full flex items-center justify-center font-bold">2</span>
          </Link>
        </div>
      </header>

      {/* ══════ PAGE HEADER ══════ */}
      <section className="bg-gray-100 py-16 md:py-24 text-center border-b border-gray-200">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 mb-4">About Us</h1>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-[11px]">The Drip Standard</p>
      </section>

      {/* ══════ THE DRIP STANDARD (ABOUT US) ══════ */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 text-center">
          <span className="inline-block text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 border border-gray-200 px-4 py-1.5 rounded-full">Our Story</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 text-gray-900 leading-[0.9]">
            TRUSTED BY 1 MILLION.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">DEFINED BY DETAILS.</span>
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mb-20 text-sm md:text-[15px]">
            We've created over 6,000 unique styles, maintaining 100% in-house quality checks. Operating through 20+ stores globally, every single piece we craft is engineered around three uncompromising pillars.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Scissors strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Precision Fits</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Engineered to drape perfectly and rigorously tested to enhance your natural silhouette.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Wind strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Breathable</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Premium, climate-responsive materials that breathe with your body throughout the day.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Shield strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Durable Build</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Constructed to outlast trends. Consistently holding form wash after wash.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ ABOUT NEWSLETTER ══════ */}
      <section className="py-24 bg-white border-t border-gray-100 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="bg-gray-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(233,69,96,0.15),_transparent_70%)]"></div>
             <div className="relative z-10">
                <span className="text-drip-coral text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">Join The Collective</span>
                <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-none">THE FUTURE IS<br />DROPPING SOON.</h2>
                <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow bg-white/5 border border-white/10 text-white px-8 py-5 rounded-full focus:outline-none focus:border-drip-coral transition-colors font-bold text-sm"
                  />
                  <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-[12px] hover:bg-drip-coral hover:text-white transition-all">
                    Subscribe
                  </button>
                </form>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em]">Early access. Exclusive drops. 100% Signal.</p>
             </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-white py-12 px-5 md:px-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-4">
              <Link href="/" className="text-2xl font-black tracking-tighter mb-4 block">DRIP</Link>
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed mb-6 max-w-xs">
                The pinnacle of digital fashion and urban utility. Redefining style through AI and premium craftsmanship.
              </p>
              <div className="flex space-x-5">
                {['Instagram', 'Twitter', 'TikTok'].map(s => (
                  <Link key={s} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">{s}</Link>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Join The Collective</h4>
              <p className="text-gray-500 text-[13px] font-medium mb-4">Early access. Exclusive drops. 100% Signal.</p>
              <form className="relative flex items-center">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-gray-50 border-b-2 border-gray-100 py-2 text-[13px] focus:outline-none focus:border-black transition-colors font-bold"
                />
                <button className="absolute right-0 text-[10px] font-black uppercase tracking-widest hover:text-drip-coral transition-all">Sign Up</button>
              </form>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Menu</h4>
                <ul className="space-y-2">
                  {['Men', 'Women', 'Accessories'].map(link => (
                    <li key={link}><Link href="#" className="text-gray-500 text-[13px] hover:text-black transition-colors font-semibold">{link}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2">
                  {['Shipping', 'Returns', 'Stores', 'Contact', 'About Us'].map(link => (
                    <li key={link}><Link href={link === 'About Us' ? '/about' : '#'} className="text-gray-500 text-[13px] hover:text-black transition-colors font-semibold">{link}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
              &copy; 2026 DRIP FASHION INC.
            </p>
            <div className="flex space-x-12">
              {['Privacy', 'Terms', 'Cookies'].map(link => (
                <Link key={link} href="#" className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-black transition-colors">{link}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </main>
  );
}
