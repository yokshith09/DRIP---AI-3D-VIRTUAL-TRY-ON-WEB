'use client';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/products';
import { Product } from '@/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Trash2, Plus, LogOut, Package, Search, Tag, Settings, SlidersHorizontal, Sparkles, Check, Edit2, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProductStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  // View mode
  const [viewMode, setViewMode] = useState<'catalog' | 'users'>('catalog');
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Edit Mode state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  
  // Form fields for adding product
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<'mens' | 'womens' | 'accessories'>('mens');
  const [subcategory, setSubcategory] = useState<'Shirts' | 'Jeans' | 'Pants' | 'Sneakers' | 'Accessories'>('Shirts');
  const [fit, setFit] = useState('Relaxed Fit');
  const [material, setMaterial] = useState('Premium Cotton');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Authentication logic via Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@drip.com') {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (viewMode === 'users') {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await fetch('/api/admin/users');
          const data = await res.json();
          if (data.users) {
             setUsers(data.users);
          }
        } catch (err) {
          console.error('Failed to fetch users', err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [viewMode]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  // Add or Edit Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !price || !image) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseInt(price.replace(/[^\d]/g, ''), 10) || 1999;
    const originalPriceNum = Math.round(priceNum * 1.25);

    if (editingProductId) {
      updateProduct(editingProductId, {
        category,
        subcategory,
        name,
        brand,
        price: `₹ ${priceNum.toLocaleString('en-IN')}`,
        originalPrice: `₹ ${originalPriceNum.toLocaleString('en-IN')}`,
        priceNumber: priceNum,
        originalPriceNumber: originalPriceNum,
        image,
        images: [image],
        fit,
        material
      });
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        cancelEdit();
      }, 1500);
      return;
    }

    const newProduct: Product = {
      id: `admin-added-${Date.now()}`,
      category,
      subcategory,
      name,
      brand,
      price: `₹ ${priceNum.toLocaleString('en-IN')}`,
      originalPrice: `₹ ${originalPriceNum.toLocaleString('en-IN')}`,
      priceNumber: priceNum,
      originalPriceNumber: originalPriceNum,
      rating: 4.8,
      reviews: '12',
      image,
      images: [image],
      sizes: subcategory === 'Sneakers' ? ['UK 7', 'UK 8', 'UK 9', 'UK 10'] : ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey'],
      fit,
      material,
      tags: [subcategory.toLowerCase(), 'admin-listed', brand.toLowerCase()],
      bodyShapeSuitable: ['rectangle', 'inverted-triangle', 'hourglass'],
      skinToneSuitable: ['warm', 'cool', 'neutral'],
      stock: 30,
      isNew: true,
      matchPercentage: 90
    };

    addProduct(newProduct);
    setFormSuccess(true);

    // Reset Form
    setName('');
    setBrand('');
    setPrice('');
    setImage('');
    setFit('Relaxed Fit');
    setMaterial('Premium Cotton');

    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setBrand(prod.brand);
    setPrice(prod.priceNumber.toString());
    setImage(prod.image);
    setCategory(prod.category as any);
    setSubcategory(prod.subcategory as any);
    setFit(prod.fit || '');
    setMaterial(prod.material || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setName('');
    setBrand('');
    setPrice('');
    setImage('');
    setFit('Relaxed Fit');
    setMaterial('Premium Cotton');
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Are you sure you want to delete "${prodName}" from the store database?`)) {
      deleteProduct(id);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter ? p.subcategory === activeCategoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const shirtsCount = products.filter(p => p.subcategory === 'Shirts').length;
  const jeansCount = products.filter(p => p.subcategory === 'Jeans').length;
  const pantsCount = products.filter(p => p.subcategory === 'Pants').length;
  const sneakersCount = products.filter(p => p.subcategory === 'Sneakers').length;
  const accCount = products.filter(p => p.subcategory === 'Accessories').length;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF4EE] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-[#7A0C16] font-bold uppercase tracking-[0.25em] animate-pulse block">Verifying Admin Access...</span>
            <div className="w-12 h-0.5 bg-[#7A0C16] mx-auto animate-bounce"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F7] font-sans text-gray-900">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-5 md:px-12 pt-10 pb-20 space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-150 pb-6 gap-4">
          <div>
            <span className="text-[10px] text-[#7A0C16] font-black uppercase tracking-[0.3em]">Atelier Control Center</span>
            <h1 className="text-3xl font-display font-bold text-gray-900 leading-none mt-1">Admin Curation Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('catalog')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'catalog' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Store Catalog
              </button>
              <button
                onClick={() => setViewMode('users')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 ${viewMode === 'users' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Users & Credits</span>
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {viewMode === 'catalog' ? (
          <>
            {/* Database Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { label: 'Shirts & Polos', filterValue: 'Shirts', count: shirtsCount },
            { label: 'Jeans Denim', filterValue: 'Jeans', count: jeansCount },
            { label: 'Cargo & Pants', filterValue: 'Pants', count: pantsCount },
            { label: 'Sneakers Shoes', filterValue: 'Sneakers', count: sneakersCount },
            { label: 'Accessories', filterValue: 'Accessories', count: accCount }
          ].map((stat, i) => {
            const isActive = activeCategoryFilter === stat.filterValue;
            const bgClass = isActive ? 'bg-drip-navy text-white ring-2 ring-black' : 'bg-white border border-gray-150 text-black hover:border-black';
            return (
              <button 
                key={i} 
                onClick={() => setActiveCategoryFilter(isActive ? null : stat.filterValue)}
                className={`p-5 rounded-2xl shadow-xs ${bgClass} flex flex-col justify-between h-28 text-left transition-all cursor-pointer`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{stat.label}</span>
                <span className="text-2xl font-display font-bold leading-none">{stat.count} items</span>
              </button>
            );
          })}
        </div>

        {/* Main Content split: Form vs Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Creator Form */}
          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm h-fit space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center border-b border-gray-100 pb-3">
              {editingProductId ? <Edit2 className="w-4 h-4 mr-1 text-[#7A0C16]" /> : <Plus className="w-4 h-4 mr-1 text-[#7A0C16]" />}
              <span>{editingProductId ? 'Edit Listing' : 'Add New Product'}</span>
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-black bg-white"
                  >
                    <option value="mens">Men's Wear</option>
                    <option value="womens">Women's Wear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Subcategory</label>
                  <select 
                    value={subcategory} 
                    onChange={(e) => setSubcategory(e.target.value as any)}
                    className="w-full border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-black bg-white"
                  >
                    <option value="Shirts">Shirts &amp; Tops</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Pants">Pants &amp; Cargos</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Product Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Linen Shirt"
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Brand *</label>
                  <input 
                    type="text" 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. The Bear House"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Price (INR) *</label>
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1999"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Image URL *</label>
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://cdn.shopify.com/..."
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Fit Description</label>
                  <input 
                    type="text" 
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="e.g. Relaxed Fit"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Material Composition</label>
                  <input 
                    type="text" 
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. 100% Linen Blend"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {formSuccess && (
                <div className="bg-drip-green/10 text-drip-green border border-drip-green/20 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 animate-pulse">
                  <Check className="w-4 h-4" /> <span>Product Added Successfully!</span>
                </div>
              )}

              <div className="flex space-x-2">
                {editingProductId && (
                  <button 
                    type="button"
                    onClick={cancelEdit}
                    className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold tracking-widest uppercase text-xs transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit"
                  className={`${editingProductId ? 'w-2/3' : 'w-full'} py-3.5 bg-black hover:bg-drip-coral text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-colors shadow-sm`}
                >
                  {editingProductId ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>

            <button 
              onClick={() => {
                if (confirm('Reset catalog back to initial scraped listings? This clears admin additions.')) {
                  resetProducts();
                }
              }}
              className="w-full text-center text-gray-400 hover:text-red-500 font-bold uppercase tracking-wider text-[9px] pt-2"
            >
              Reset Database to Defaults
            </button>
          </div>

          {/* Listings Table */}
          <div className="lg:col-span-2 bg-white border border-gray-150 p-6 rounded-3xl shadow-sm space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center">
                <Package className="w-4 h-4 mr-1 text-[#7A0C16]" />
                <span>Store Catalog Listings ({filteredProducts.length})</span>
              </h3>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog products..."
                  className="w-full border border-gray-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-y-auto max-h-[500px] border border-gray-100 rounded-2xl hide-scrollbar">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-xs uppercase tracking-wider font-bold">
                  No products match search queries
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="p-4">Item Thumbnail</th>
                      <th className="p-4">Brand &amp; Name</th>
                      <th className="p-4">Subcategory</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="w-10 h-12 bg-gray-50 border border-gray-100 rounded-lg relative overflow-hidden">
                            <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-800">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{prod.brand}</span>
                          <span className="truncate max-w-[200px] block">{prod.name}</span>
                        </td>
                        <td className="p-4 font-bold uppercase tracking-wider text-gray-500 text-[10px]">
                          {prod.subcategory}
                        </td>
                        <td className="p-4 font-black text-black">
                          {prod.price}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEdit(prod)}
                              className="p-2 border border-gray-200 hover:border-black text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                              title="Edit listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="p-2 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

        </div>
        </>
        ) : (
          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm space-y-6 min-h-[500px]">
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-[#7A0C16]" />
                  <span>Registered Users & Credits</span>
                </h3>
             </div>
             
             {loadingUsers ? (
                <div className="flex items-center justify-center h-64 text-gray-400 font-bold uppercase tracking-wider text-xs">
                   Loading Users...
                </div>
             ) : (
                <div className="overflow-y-auto max-h-[600px] border border-gray-100 rounded-2xl hide-scrollbar">
                   <table className="w-full text-left border-collapse text-xs">
                      <thead>
                         <tr className="bg-gray-50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="p-4">User ID</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-center">Try-Ons Used</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150">
                         {users.length === 0 ? (
                            <tr>
                               <td colSpan={4} className="p-10 text-center text-gray-400 font-bold uppercase tracking-wider">No users found</td>
                            </tr>
                         ) : (
                            users.map(u => (
                               <tr key={u.id} className="hover:bg-gray-50/50">
                                  <td className="p-4 font-mono text-gray-500 text-[10px]">{u.id.split('-')[0]}...</td>
                                  <td className="p-4 font-bold text-gray-800">{u.email}</td>
                                  <td className="p-4 text-gray-500 font-medium">{new Date(u.created_at).toLocaleDateString()}</td>
                                  <td className="p-4 text-center">
                                     <span className={`px-2 py-1 rounded-md font-black ${u.tryons_used >= 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {u.tryons_used} / 2
                                     </span>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             )}
          </div>
        )}

      </div>

      <Footer />
    </main>
  );
}
