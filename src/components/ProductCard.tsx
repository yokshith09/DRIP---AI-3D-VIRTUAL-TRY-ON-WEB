import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  price: string;
  category?: string;
  subcategory?: string;
  originalPrice?: string;
  rating: string | number;
  reviews: string | number;
  image: string;
  isNew?: boolean;
  matchPercentage?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col bg-white border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
      {/* Image Area */}
      <div className="w-full aspect-[4/5] bg-gray-50 relative p-4 mb-2">
        <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-300 hover:text-drip-coral z-20 transition-colors" aria-label="Add to wishlist">
          <Heart className="w-4 h-4" />
        </button>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded shadow-sm flex items-center space-x-1 z-20 font-sans text-[10px] border border-gray-100">
          <Star className="w-3 h-3 fill-black text-black" />
          <span className="font-bold text-gray-800">{product.rating}</span>
          <span className="text-gray-400">| {product.reviews}</span>
        </div>

        {product.isNew && (
          <div className="absolute top-0 left-0 bg-drip-navy text-white text-[9px] font-bold px-2 py-1 z-20 uppercase tracking-widest">
            New Arrival
          </div>
        )}

        <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
      </div>

      {/* Product Info */}
      <div className="px-4 pb-2 flex-grow flex flex-col">
        <h4 className="text-[10px] font-black text-black uppercase tracking-widest mb-1">{product.brand}</h4>
        <p className="text-[13px] font-medium text-gray-600 leading-snug line-clamp-2 h-9 mb-2">{product.name}</p>
        
        <div className="mt-auto flex items-center space-x-2 pb-4">
          <span className="text-sm font-black text-black">{product.price}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through font-medium">{product.originalPrice}</span>}
        </div>
      </div>

      {/* AI Fit Hint Overlay (Visible on hover) */}
      <div className="absolute top-2 right-2 hidden group-hover:block transition-all z-30">
        <div className="bg-drip-green/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest shadow-sm">
          {product.matchPercentage || 92}% Match
        </div>
      </div>
    </Link>
  );
}
