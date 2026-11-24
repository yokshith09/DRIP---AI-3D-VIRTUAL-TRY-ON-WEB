/**
 * Seed script to push static catalog products to Supabase
 * Usage: npx jiti src/scripts/seed-products.ts
 */

import { PRODUCTS } from '../data/products';
import { createClient } from '@supabase/supabase-js';

async function seedProducts() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log(`Starting migration of ${PRODUCTS.length} products to Supabase...`);

  const records = PRODUCTS.map((p) => ({
    id: p.id,
    category: p.category,
    subcategory: p.subcategory,
    name: p.name,
    brand: p.brand,
    price: p.price,
    original_price: p.originalPrice,
    price_number: p.priceNumber,
    original_price_number: p.originalPriceNumber,
    rating: p.rating,
    reviews: p.reviews,
    image: p.image,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    fit: p.fit,
    material: p.material,
    tags: p.tags,
    body_shape_suitable: p.bodyShapeSuitable,
    skin_tone_suitable: p.skinToneSuitable,
    stock: p.stock,
    is_new: p.isNew,
  }));

  // Upsert in batches of 50
  for (let i = 0; i < records.length; i += 50) {
    const batch = records.slice(i, i + 50);
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`Batch ${i / 50 + 1} error:`, error.message);
    } else {
      console.log(`Batch ${i / 50 + 1} synced (${batch.length} products)`);
    }
  }

  console.log('Product catalog seed complete!');
}

seedProducts().catch(console.error);
