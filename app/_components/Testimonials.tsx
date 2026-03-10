/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import { getHomeReviews } from '@/modules/reviews/services';
import { IReview } from '@/modules/reviews/types'; 
import TestimonialSkeleton from '@/components/shared/skeleton/TestimonialSkeleton';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await getHomeReviews();
    
        if (res && Array.isArray(res.data)) {
          setReviews(res.data.slice(0, 4));
        } 
        else if (Array.isArray(res)) {
          setReviews(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header Section */}
        <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
          3940+ Happy Glowers
        </p>
        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-neutral-900 mb-16">
          Real Results, <span className="text-pink-500">Real Stories</span>
        </h2>

        {loading ? (
          <TestimonialSkeleton />
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
            }}
            breakpoints={{
              1024: { slidesPerView: 2 } 
            }}
            className="testimonial-swiper !pb-24" 
          >
            {reviews?.map((rev) => (
              <SwiperSlide key={rev._id}>
                <div className="flex flex-col md:flex-row items-center gap-8 text-left p-8 bg-[#FDFBF9] rounded-[2.5rem] border border-neutral-100 group hover:shadow-2xl hover:shadow-pink-500/5 transition-all duration-500">
                  
                  {/* User Image Area */}
                  <div className="w-32 h-32 md:w-1/3 aspect-square rounded-[2rem] overflow-hidden shadow-inner bg-white shrink-0">
                    <img 
                      src={(rev.userID as any)?.profileImage || "/assets/user-placeholder.png"} 
                      alt={(rev.userID as any)?.name || "User"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Review Content Area */}
                  <div className="flex-1">
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < rev.rating ? "fill-pink-500 text-pink-500" : "text-neutral-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-[15px] leading-relaxed mb-6 italic font-medium">
                      {rev.comment}
                    </p>
                    <div>
                      <h4 className="text-neutral-900 font-black text-lg uppercase tracking-tighter">
                        {(rev.userID as any)?.name || "Verified Glower"} 
                      </h4>
                      <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-1">Verified Experience</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Custom Styles for Pagination */}
      <style jsx global>{`
        .testimonial-swiper .swiper-pagination {
          bottom: 0px !important; 
        }
        
        .testimonial-swiper .swiper-pagination-bullet {
          background: #E5E5E5;
          opacity: 1;
          width: 6px;
          height: 6px;
          margin: 0 5px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-swiper .swiper-pagination-bullet-active {
          background: #ec4899 !important; /* Pink-500 */
          width: 30px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}