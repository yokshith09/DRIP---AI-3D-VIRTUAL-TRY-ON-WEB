import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Sparkles } from 'lucide-react';
import { Product } from '@/data/types';

export type { Product };

export default function ProductCard({ product, onTryOn }: { product: Product; onTryOn?: (product: Product) => void }) {
  return (
    <div className="group relative flex flex-col bg-white border border-[#e4e4e4] hover:border-black hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-2xl overflow-hidden h-full">
      {/* Image Area */}
      <div className="w-full aspect-[4/5] bg-[#fbfbfb] relative p-4 mb-2 overflow-hidden">
        {/* Link for the main image area */}
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
        </Link>
        
        {/* Wishlist Button (Top-Right) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-gray-400 hover:text-drip-coral z-30 transition-colors border border-gray-100" 
          aria-label="Add to wishlist"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm flex items-center space-x-1 z-20 font-mono text-[9px] border border-gray-100">
          <Star className="w-3 h-3 fill-black text-black" />
          <span className="font-bold text-gray-900">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>

        {product.isNew && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-mono font-bold px-2.5 py-1 z-20 uppercase tracking-widest rounded-full">
            NEW DROP
          </div>
        )}

        {/* Try On Instant Button (overlay sliding up from bottom) */}
        {onTryOn && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTryOn(product);
            }}
            className="absolute inset-x-0 bottom-0 bg-black/95 text-white py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-drip-coral transition-all flex items-center justify-center space-x-2 z-20 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 duration-300 cursor-pointer shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-drip-coral fill-drip-coral animate-pulse" />
            <span>3D Virtual Try-On</span>
          </button>
        )}
      </div>

      {/* Product Info */}
      <Link href={`/product/${product.id}`} className="px-5 pb-3 flex-grow flex flex-col z-10">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">{product.brand}</span>
        <h4 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 h-9 mb-2 font-sans">{product.name}</h4>
        
        <div className="mt-auto flex items-baseline justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-black font-mono text-black">{product.price}</span>
            {product.originalPrice && <span className="text-xs text-gray-400 line-through font-mono">{product.originalPrice}</span>}
          </div>
          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
            {product.matchPercentage || 92}% Match
          </span>
        </div>
      </Link>
    </div>
  );
}
