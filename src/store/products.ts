import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/types';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: STATIC_PRODUCTS,
      
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      
      updateProduct: (id, updated) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updated } : p)
      })),
      
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),
      
      resetProducts: () => set({ products: STATIC_PRODUCTS })
    }),
    {
      name: 'drip-products-catalog-v5',
      merge: (persistedState: any, currentState) => {
        // Ensure static runway and catalog products are always up to date
        const persistedProducts = persistedState?.products || [];
        const staticMap = new Map(STATIC_PRODUCTS.map(p => [p.id, p]));
        
        // Merge persisted custom/imported products with updated static catalog
        const customProducts = persistedProducts.filter((p: Product) => !staticMap.has(p.id));
        return {
          ...currentState,
          products: [...STATIC_PRODUCTS, ...customProducts],
        };
      }
    }
  )
);
