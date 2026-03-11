import React from 'react';
import { LucideIcon } from 'lucide-react'; 


interface StatCardProps {
  title: string;
  value: string | number | undefined; 
  icon: LucideIcon; 
  color?: string;
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
    <div className="bg-white px-6 py-10 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-lg hover:translate-y-[-2px] duration-300">
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