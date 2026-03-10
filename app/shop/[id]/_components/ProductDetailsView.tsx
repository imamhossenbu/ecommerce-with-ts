/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect, MouseEvent } from 'react';
import { Star, Minus, Plus, ZoomIn, Heart, ArrowRight } from 'lucide-react';
import { getProductById, getProducts } from '@/modules/shop/services'; 
import toast from 'react-hot-toast';
import ProductCard from '@/components/shared/ProductCard'
import ProductReviews from './ProductReview';
import ProductSkeleton from '@/components/shared/skeleton/ProductSkeleton';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import type { IProduct } from '@/modules/shop/types';

interface ProductDetailsViewProps {
  id: string;
}

export default function ProductDetailsView({ id }: ProductDetailsViewProps) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [activeImg, setActiveImg] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        if (res.success) {
          setProduct(res.data);
          setActiveImg(res.data.thumbnail); 
        }
      } catch (err: any) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.categoryID) {
      const fetchRelated = async () => {
        try {
          
          const catId = typeof product.categoryID === 'object' ? (product.categoryID as any)._id : product.categoryID;
          
          const res = await getProducts({ 
            category: catId, 
            limit: 5 
          });
          
          if (res.success && Array.isArray(res.data)) {
            setRelatedProducts(res.data.filter((p: IProduct) => p._id !== id).slice(0, 4));
          }
        } catch (err) {
          console.error("Related products fetch failed");
        }
      };
      fetchRelated();
    }
  }, [product, id]);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} item(s) added to bag`);
    }
  };

  if (loading) return <ProductSkeleton />;

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-neutral-400 font-bold uppercase tracking-widest">Product not found</p>
      <Link href="/shop" className="text-pink-500 font-bold uppercase text-xs underline">Back to Shop</Link>
    </div>
  );

  const allImages = [product.thumbnail, ...(product.images || [])];

  return (
    <section className="pb-20 pt-30 bg-white">
      <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          <div className="relative flex-1 bg-[#FDFBF9] aspect-square overflow-hidden group rounded-3xl border border-neutral-100">
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <button className="absolute bottom-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl text-neutral-400 hover:text-pink-500 transition-colors">
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Thumbnails List */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
            {allImages.map((img, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveImg(img)}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 cursor-pointer overflow-hidden transition-all bg-[#FDFBF9] shrink-0 ${activeImg === img ? 'border-pink-500 shadow-lg shadow-pink-500/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {product.isBestseller && (
                <span className="bg-pink-500 text-white text-[9px] px-3 py-1 rounded-full uppercase font-black tracking-[0.2em] shadow-lg shadow-pink-500/20">
                  Bestseller
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                  Only {product.stock} left in stock
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 leading-none italic uppercase tracking-tighter">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-pink-500 text-pink-500" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-l border-neutral-200 pl-4">
                {product.totalReviews}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-neutral-900 tracking-tighter italic">${product.salePrice}</span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xl text-neutral-300 line-through decoration-pink-500/20">${product.regularPrice}</span>
            )}
          </div>

          {/* Details & Lowdown */}
          <div className="space-y-6 pt-8 border-t border-neutral-100">
            <div className="space-y-3">
              <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-neutral-400">The Straight Up</h4>
              <p className="text-neutral-600 leading-relaxed text-sm italic font-medium">
                {product.straight_up || product.description}
              </p>
            </div>

            {product.lowdown && product.lowdown.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-neutral-400">The Lowdown</h4>
                <ul className="space-y-2">
                  {product.lowdown.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-600 text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-neutral-50 rounded-2xl p-1 border border-neutral-100">
              <button 
                onClick={() => quantity > 1 && setQuantity(v => v - 1)} 
                className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-neutral-400 hover:text-neutral-900"
              >
                <Minus size={18} />
              </button>
              <span className="px-6 font-black text-sm w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(v => v + 1)} 
                className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-neutral-400 hover:text-neutral-900"
              >
                <Plus size={18} />
              </button>
            </div>

            <button 
              type='button'
              onClick={handleAddToCart}
              className="flex-1 bg-neutral-900 text-white h-[60px] rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-neutral-900/10"
            >
              Add to Cart
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-[60px] h-[60px] border border-neutral-100 rounded-2xl flex items-center justify-center hover:bg-pink-50 hover:border-pink-100 text-neutral-400 hover:text-pink-500 transition-all">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

    <div className="mt-32">
        <ProductReviews 
          productId={product._id as string} 
          avgRating={product.avgRating || 0} 
          totalReviews={product.totalReviews || 0} 
        />
      </div>

      {/* Related Products */}
      <div className=" site-container border-t border-neutral-50 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12">
          <div className="text-center md:text-left">
            <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Curated for you</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-neutral-900">
              Hand picked <span className="text-pink-500">Glow</span>
            </h2>
          </div>
          <Link 
            href="/shop" 
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors group"
          >
            Explore All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))
          ) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-neutral-50 aspect-[4/5] rounded-[2rem]"></div>
                <div className="h-4 bg-neutral-50 w-3/4 rounded-full mx-auto md:mx-0"></div>
              </div>
            ))
          )}
        </div>
      </div>

 
    </section>
  );
}