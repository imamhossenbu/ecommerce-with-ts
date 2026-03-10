/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { IProduct } from '@/modules/shop/types'; 

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { _id, thumbnail, name, categoryID, salePrice, regularPrice } = product;
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    addToCart(product, 1); 
  };

  const discount = regularPrice > salePrice 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) 
    : 0;


  const categoryName = typeof categoryID === 'object' ? (categoryID as any).name : "Premium Care";

  return (
    <div
      onClick={() => router.push(`/shop/${_id}`)}
      className="group cursor-pointer bg-white overflow-hidden rounded-[2rem] border border-neutral-100/50 hover:shadow-2xl hover:shadow-pink-500/5 transition-all duration-500"
    >
      <div className="relative aspect-[4/5] bg-[#F9F7F5] overflow-hidden">
        <img 
          src={thumbnail} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full z-10 uppercase tracking-widest">
            {discount}% OFF
          </span>
        )}
        
        <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/5 z-20">
          <button
            type="button"
            onClick={handleAddToCart} 
            className="w-full bg-neutral-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.15em] shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-pink-500 active:scale-95"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-5 space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
            {categoryName}
          </p>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-pink-500 text-pink-500" />
            <span className="text-[11px] font-bold text-neutral-900">4.9</span>
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-neutral-800 line-clamp-1">
          {name}
        </h3>
        
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xl font-black text-neutral-900 tracking-tighter italic">
            ${salePrice}
          </span>
          {regularPrice > salePrice && (
            <span className="text-sm text-neutral-400 line-through decoration-pink-500/30">
              ${regularPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}