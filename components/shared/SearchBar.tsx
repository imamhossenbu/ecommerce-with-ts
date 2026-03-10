'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import { IProduct } from '@/modules/shop/types';
import { getProducts } from '@/modules/shop/services';

interface SearchBarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function SearchBar({ isOpen, setIsOpen }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        const productList = Array.isArray(data) ? data : (data?.data || []);
        setAllProducts(productList);
      } catch (error) {
        setAllProducts([]);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      const timer = setTimeout(() => {
        if (Array.isArray(allProducts)) {
          const filtered = allProducts.filter(p => 
            p.name?.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 5);
          setResults(filtered);
        }
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, allProducts]);

  const handleProductClick = (id: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/product/${id}`);
  };

  return (
    <div className="flex items-center">
      {/* --- DESKTOP SEARCH --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }} 
            animate={{ width: 220, opacity: 1 }} 
            exit={{ width: 0, opacity: 0 }} 
            className="mr-2 hidden lg:block relative"
          >
            <Input 
              autoFocus
              placeholder="Search products..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={loading ? <Loader2 size={14} className="animate-spin text-pink-500" /> : null}
            />
            
            {/* Desktop Results */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 w-full bg-white shadow-2xl mt-2 rounded-xl border border-gray-100 overflow-hidden z-[100]"
                >
                  {results.map(p => (
                    <div key={p._id} onClick={() => handleProductClick(p._id!)} className="p-3 flex items-center gap-3 hover:bg-pink-50 cursor-pointer group">
                      <img src={p.images?.[0] || p.thumbnail} className="w-10 h-10 rounded-md object-cover" alt="" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[11px] font-bold truncate text-gray-800">{p.name}</span>
                        <span className="text-[10px] text-pink-500 font-black">${p.salePrice}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SEARCH TOGGLE BUTTON --- */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setQuery(""); }} 
        className="hover:text-pink-500 transition-colors pt-1"
      >
        {isOpen ? <X size={20} /> : <Search size={20} strokeWidth={1.5} />}
      </button>

      {/* --- MOBILE SEARCH PANEL (Navbar এর ঠিক নিচে আসবে) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4">
              <Input 
                autoFocus
                placeholder="Search for skincare..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={loading ? <Loader2 size={16} className="animate-spin text-pink-500" /> : <Search size={16} />}
              />
              
              {/* Mobile Results */}
              {results.length > 0 && (
                <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pb-2">
                  {results.map(p => (
                    <div 
                      key={p._id} 
                      onClick={() => handleProductClick(p._id!)}
                      className="flex items-center gap-4 p-2 bg-gray-50 rounded-xl active:bg-pink-50"
                    >
                      <img src={p.images?.[0] || p.thumbnail} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">{p.name}</span>
                        <span className="text-[10px] text-pink-500 font-black">${p.salePrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}