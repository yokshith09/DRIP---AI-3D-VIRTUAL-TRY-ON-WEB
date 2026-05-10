import { NextResponse } from 'next/server';
import { PRODUCTS } from '../../../data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  let filtered = PRODUCTS;
  if (category) {
    filtered = filtered.filter(p => p.category === category.toLowerCase());
  }
  if (subcategory) {
    filtered = filtered.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
  }

  return NextResponse.json({ products: filtered });
}
