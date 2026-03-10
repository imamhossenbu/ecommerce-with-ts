/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from 'react';
import CategoryCard from '@/components/shared/CategoryCard';
import CategorySkeleton from '@/components/shared/skeleton/CategorySkeleton'; 
import { getCategories } from '@/modules/shop/services';

export default function CategorySection() {

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#F9F1F1]"> 
      <div className="site-container">
        <h2 className="text-[22px] md:text-[26px] font-medium text-primary mb-10">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            <CategorySkeleton cards={4} />
          ) : (
            categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))
          )}
        </div>

        {!loading && categories.length === 0 && (
          <p className="text-center text-secondary py-10">No categories found.</p>
        )}
      </div>
    </section>
  );
}