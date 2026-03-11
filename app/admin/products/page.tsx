/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Search, MoreVertical, ChevronLeft, ChevronRight, Filter, ChevronDown } from 'lucide-react';

import { getProducts, getCategories } from '@/modules/shop/services'; 
import ProductModal from './_components/ProductModal';
import DeleteModal from './_components/DeleteModal';
import { IProduct } from '@/modules/shop/types';

// ১. ক্যাটাগরির জন্য ইন্টারফেস
interface ICategory {
  _id: string;
  name: string;
}

const AdminProducts = () => {
  // useState এর টাইপ ডিফাইন করার সঠিক নিয়ম
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        page,
        limit,
        search,
        category: selectedCategory
      });
      
      // Axios response logic
      const data = res.data?.data || res.data || res;
      if (res) {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(res.data?.totalPages || res.totalPages || 1);
        setTotalProducts(res.data?.totalProducts || res.totalProducts || 0);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesList = async () => {
    try {
      const res = await getCategories();
      const catData = res.data?.data || res.data || res;
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error("Category Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [page, search, selectedCategory]);

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Inventory</h2>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total {totalProducts} Products Available</p>
        </div>
        <button 
          onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
          className="bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Add Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[1.2rem] text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 focus:bg-white focus:border-pink-200 transition-all font-bold text-gray-700"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={16} />
            <select 
              className="w-full pl-10 pr-10 py-4 bg-gray-50/50 border border-transparent rounded-[1.2rem] text-[11px] font-black text-gray-500 uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-pink-500" size={40} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching Products...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full pt-10 border-collapse min-w-250">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-b border-gray-50 bg-gray-50/30">
                  <th className="px-8 py-6 text-center">ID</th>
                  <th className="px-4 py-6">Product</th>
                  <th className="px-4 py-6">Category</th>
                  <th className="px-4 py-6">Price</th>
                  <th className="px-4 py-6">Stock</th>
                  <th className="px-4 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 text-[10px] font-black text-gray-300 text-center">
                      #{product._id.slice(-5).toUpperCase()}
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm flex-shrink-0">
                          <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="max-w-[200px]">
                           <p className="text-sm font-black text-gray-900 truncate leading-tight">{product.name}</p>
                           <p className="text-[10px] font-bold text-gray-400 truncate mt-1 italic">{product.straight_up || 'No tagline set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                       <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-tight">
                        {(product.categoryID as any)?.name || "N/A"}
                       </span>
                    </td>
                    <td className="px-4 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-900">৳{product.salePrice}</span>
                          {product.regularPrice > product.salePrice && (
                            <span className="text-[10px] font-bold text-gray-400 line-through">৳{product.regularPrice}</span>
                          )}
                       </div>
                    </td>
                    <td className="px-4 py-6 text-sm font-black text-gray-700">{product.stock}</td>         
                    <td className="px-4 py-6">
                      <StatusBadge stock={product.stock as number} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="relative group/action inline-block">
                        <button className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-100">
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 w-40 z-30 opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all scale-95 group-hover/action:scale-100 origin-top-right">
                            <button onClick={() => handleEdit(product)} className="w-full px-5 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-pink-50 text-gray-600 flex items-center gap-3 transition-colors">
                                <Edit size={14} className="text-pink-500" /> Edit Product
                            </button>
                            <div className="my-1 border-t border-gray-50"></div>
                            <button onClick={() => handleDeleteClick(product)} className="w-full px-5 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-red-50 text-red-500 flex items-center gap-3 transition-colors">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="text-center py-32">
                        <div className="flex flex-col items-center opacity-20">
                           <Search size={48} />
                           <p className="mt-4 font-black uppercase text-xs tracking-widest">No products matching your search</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-auto px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Page <span className="text-gray-900">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-3">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button 
                      key={index + 1}
                      onClick={() => setPage(index + 1)}
                      className={`w-10 h-10 flex items-center justify-center font-black rounded-xl text-xs transition-all ${page === index + 1 ? 'bg-black text-white shadow-lg' : 'hover:bg-white text-gray-400 border border-transparent hover:border-gray-100'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(prev => prev + 1)}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
            </div>
        </div>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} refresh={fetchProducts} />
      <DeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} product={selectedProduct} refresh={fetchProducts} />
    </div>
  );
};

// StatusBadge Props Type
const StatusBadge = ({ stock }: { stock: number }) => {
    if (stock === 0) return <span className="px-3 py-1.5 bg-red-50 text-red-500 text-[9px] font-black uppercase rounded-lg border border-red-100 tracking-tighter">Out of Stock</span>;
    if (stock <= 10) return <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-[9px] font-black uppercase rounded-lg border border-orange-100 tracking-tighter">Low Stock</span>;
    return <span className="px-3 py-1.5 bg-green-50 text-green-700 text-[9px] font-black uppercase rounded-lg border border-green-100 tracking-tighter">In Stock</span>;
};

export default AdminProducts;