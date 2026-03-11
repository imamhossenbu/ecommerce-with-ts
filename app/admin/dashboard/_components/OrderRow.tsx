import React from 'react';
import { Clock, Truck, CheckCircle, Package, XCircle } from 'lucide-react';


interface StatusStyle {
  color: string;
  icon: React.ReactNode;
}


interface OrderRowProps {
  orderId: string;
  customer: string;
  amount: number | string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
}

const OrderRow = ({ orderId, customer, amount, status }: OrderRowProps) => {
  
  const statusConfig: Record<string, StatusStyle> = {
    Processing: {
      color: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <Clock size={18} className="text-amber-500" />,
    },
    Shipped: {
      color: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <Truck size={18} className="text-blue-500" />, 
    },
    Delivered: {
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <CheckCircle size={18} className="text-emerald-500" />,
    },
    Cancelled: {
      color: "bg-red-50 text-red-600 border-red-100",
      icon: <XCircle size={18} className="text-red-500" />,
    }
  };

  // স্ট্যাটাস না মিললে ডিফল্ট হিসেবে 'Processing' স্টাইল দেখাবে
  const config = statusConfig[status] || statusConfig.Processing;

  return (
    <div className="flex items-center justify-between py-4 group hover:bg-gray-50/80 px-4 rounded-2xl transition-all border border-transparent hover:border-gray-100">
      <div className="flex items-center gap-4">
        {/* আইকন কন্টেইনার */}
        <div className={`w-11 h-11 ${config.color.split(' ')[0]} rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
           {config.icon}
        </div>
        
        <div>
          <p className="font-bold text-[14px] text-gray-900 tracking-tight uppercase">
            ORD-{orderId}
          </p>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            {customer}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-black text-[15px] text-gray-900 mb-1">
          ৳{Number(amount).toLocaleString()}
        </p>
        <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-[0.1em] ${config.color} border`}>
          {status || 'Pending'}
        </span>
      </div>
    </div>
  );
};

export default OrderRow;