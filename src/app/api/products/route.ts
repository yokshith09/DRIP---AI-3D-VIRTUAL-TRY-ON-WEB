import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  try {
    // Attempt database-backed query from Supabase (Phase 4)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      let query = supabase.from('products').select('*');

      if (category) {
        query = query.eq('category', category.toLowerCase());
      }
      if (subcategory) {
        query = query.ilike('subcategory', subcategory);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map database columns to Product shape
        const mappedProducts = data.map((item: any) => ({
          id: item.id,
          category: item.category,
          subcategory: item.subcategory,
          name: item.name,
          brand: item.brand,
          price: item.price,
          originalPrice: item.original_price || item.price,
          priceNumber: Number(item.price_number),
          originalPriceNumber: Number(item.original_price_number || item.price_number),
          rating: Number(item.rating || 4.5),
          reviews: item.reviews || '0',
          image: item.image,
          images: Array.isArray(item.images) ? item.images : [item.image],
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          colors: Array.isArray(item.colors) ? item.colors : [],
          fit: item.fit || '',
          material: item.material || '',
          tags: Array.isArray(item.tags) ? item.tags : [],
          bodyShapeSuitable: Array.isArray(item.body_shape_suitable) ? item.body_shape_suitable : [],
          skinToneSuitable: Array.isArray(item.skin_tone_suitable) ? item.skin_tone_suitable : [],
          stock: Number(item.stock || 50),
          isNew: Boolean(item.is_new),
          matchPercentage: 85,
        }));

        return NextResponse.json({ products: mappedProducts, source: 'database' });
      }
    }
  } catch (dbErr: any) {
    console.warn('[API PRODUCTS] Database query warning, falling back to static catalog:', dbErr.message);
  }

  // Fallback to static catalog
  let filtered = PRODUCTS;
  if (category) {
    filtered = filtered.filter(p => p.category === category.toLowerCase());
  }
  if (subcategory) {
    filtered = filtered.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
  }

  return NextResponse.json({ products: filtered, source: 'static' });
}
