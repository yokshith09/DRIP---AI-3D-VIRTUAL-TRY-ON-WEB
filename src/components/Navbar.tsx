'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '../store/cart';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-[60] w-full flex flex-col">
      {/* Portfolio Showcase Disclaimer Alert Bar */}
      <div className="bg-[#7A0C16] text-[#FAF4EE] text-[9px] md:text-[10px] py-1.5 px-4 text-center font-bold uppercase tracking-wider flex items-center justify-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E94560] animate-ping shrink-0"></span>
        <span>
          Portfolio Showcase Prototype &bull; AI Try-On, AI Chat, and Locker Carts are fully functional &bull; Real Payments Disabled
        </span>
      </div>

      <header className={`transition-all duration-300 flex items-center justify-between px-5 md:px-10 h-[72px] bg-white/95 backdrop-blur-md ${scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'}`}>
        <div className="flex items-center space-x-5">
          <button className="p-1.5 hover:bg-gray-50 rounded-md lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="text-2xl font-display font-black tracking-tight text-drip-navy">
            DRIP
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-6">
          {[
            { label: 'MEN', href: '/collections/mens' },
            { label: 'WOMEN', href: '/collections/womens' },
            { label: 'ACCESSORIES', href: '/collections/accessories' },
            { label: 'RUNWAY', href: '/runway', badge: '3D' },
            { label: 'WARDROBE', href: '/wardrobe', badge: 'RAIL' },
            { label: 'BRAND MANUAL', href: '/brand-manual' },
            { label: 'AI STUDIO', href: '/avatar-studio' },
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className={`text-[13px] font-sans font-medium transition-colors flex items-center gap-1.5 ${
                item.badge
                  ? 'text-black font-semibold'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded tracking-widest uppercase font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-50 rounded-md hidden md:block">
            <Search className="w-[18px] h-[18px] text-gray-500" />
          </button>
          <Link href="/profile" className="p-2 hover:bg-gray-50 rounded-md">
            <User className="w-[18px] h-[18px] text-gray-500" />
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-md">
            <ShoppingBag className="w-[18px] h-[18px] text-gray-500" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-drip-coral text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>
    </div>
  );
}
