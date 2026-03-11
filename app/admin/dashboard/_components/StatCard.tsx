import React from 'react';
import { LucideIcon } from 'lucide-react'; // LucideIcon টাইপটি ইমপোর্ট করুন

// ১. প্রপস ইন্টারফেস ডিফাইন করা
interface StatCardProps {
  title: string;
  value: string | number | undefined; // ডাইনামিক ভ্যালুর জন্য
  icon: LucideIcon; // এখানে LucideIcon টাইপটি ব্যবহার করুন
  color?: string; // অপশনাল প্রপস
  bgColor?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "text-[#B0264F]", 
  bgColor = "bg-rose-50" 
}: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-lg hover:translate-y-[-2px] duration-300">
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
          {title}
        </p>
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
          {value ?? "---"} 
        </h3>
      </div>
      
      <div className={`p-3.5 ${bgColor} rounded-2xl flex items-center justify-center`}>
        <Icon size={22} className={color} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default StatCard;