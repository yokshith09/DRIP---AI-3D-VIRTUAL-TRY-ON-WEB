'use client';

import { useState } from 'react';
import { ChevronLeft, Trash2, ShoppingBag, Sparkles, Scissors, Grid, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WardrobeRail from '@/components/WardrobeRail';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/cart';
import AIFittingRoomModal from '@/components/AIFittingRoomModal';

export default function Wishlist() {
  const { addItem } = useCartStore();
  const [wishlistItems, setWishlistItems] = useState(() => {
    return PRODUCTS.filter(p => ['bh-buck-bk', 'bh-pexo-gr', 'bh-everlys-ol', 'bh-elbrus-1'].includes(p.id));
  });

  const [activeTryOnProduct, setActiveTryOnProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'rail' | 'grid'>('rail');

  const handleRemove = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: `${product.id}-default-OneSize`,
      brand: product.brand,
      name: product.name,
      price: product.priceNumber,
      originalPrice: product.originalPriceNumber,
      size: 'M',
      color: product.colors?.[0] || 'Default',
      qty: 1,
      image: product.image,
      inStock: true
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-400 block mb-1">
              PERSONAL CURATION
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-display">
              My Wishlist
            </h1>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-full border border-gray-200">
            <button
              onClick={() => setViewMode('rail')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'rail' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-drip-coral" />
              <span>3D Clothes Rail</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white border border-gray-150 text-center py-24 rounded-2xl shadow-sm">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest font-display">Your Wishlist is Empty</h3>
            <p className="text-sm text-gray-400 mt-2 font-sans">Discover curated fashion lists and tap the heart icon to save products.</p>
            <Link href="/category" className="inline-block mt-6 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Shop Collections
            </Link>
          </div>
        ) : viewMode === 'rail' ? (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <WardrobeRail
              title="Saved Pieces on the Rail"
              subtitle="Slide through your shortlisted garments. Rotate in 3D perspective to review silhouettes and fabric textures."
              badgeText="MY WISHLIST • 3D DIGITAL CLOSET"
              items={wishlistItems.map((p) => ({
                id: p.id,
                name: p.name,
                brand: p.brand,
                price: p.priceNumber || 3999,
                image: p.image,
                category: p.category || 'Wishlist',
                fabric: p.material || 'Heavyweight Cotton',
                fit: p.fit || 'Regular Box Cut',
                sizes: p.sizes || ['S', 'M', 'L', 'XL'],
              }))}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-100 hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col relative">
                
                {/* Image Container */}
                <div className="w-full aspect-[4/5] bg-gray-50 relative p-4 mb-2 overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover mix-blend-multiply opacity-90 group-hover:scale-102 transition-transform duration-500" 
                  />
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 border border-gray-100 transition-colors z-20"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded shadow-xs text-[9px] font-bold border border-gray-100 z-10">
                    {product.matchPercentage || 94}% Fit Match
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 pb-4 pt-2 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.brand}</span>
                    <h3 className="text-xs font-semibold text-gray-800 truncate mb-1 leading-snug">{product.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-black text-black">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-semibold">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-4">
                    <button 
                      onClick={() => setActiveTryOnProduct(product)}
                      className="w-full py-2 bg-gray-50 hover:bg-black hover:text-white border border-gray-150 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>AI Try-On</span>
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-2 bg-black hover:bg-gray-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />

      {activeTryOnProduct && (
        <AIFittingRoomModal 
          isOpen={!!activeTryOnProduct} 
          onClose={() => setActiveTryOnProduct(null)} 
          productImage={activeTryOnProduct.image} 
          brand={activeTryOnProduct.brand}
          name={activeTryOnProduct.name}
          price={activeTryOnProduct.priceNumber}
        />
      )}
    </main>
  );
}
