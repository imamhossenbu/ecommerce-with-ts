/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, Package, Truck, Info } from 'lucide-react';
import { getOrderDetailsByTranId } from '@/modules/order/services';
import { useRouter, useParams } from 'next/navigation'; 
import { IOrder, IOrderItem } from '@/modules/order/types';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailsPage: React.FC = () => {
  const params = useParams(); 
  const orderId = params.id as string; 
  console.log(orderId)
  const router = useRouter(); 
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'shipping'>('summary');

  const getEstimatedDate = (dateString: string | undefined): string => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 3); 
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    if (orderId) {
   
      getOrderDetailsByTranId(orderId)
        .then(res => {
          if (res.success) setOrder(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDF0E1]">
      <Loader2 className="animate-spin text-black" size={32} />
    </div>
  );

  if (!order) return (
    <div className="text-center pt-40 py-20 font-bold bg-[#FDF0E1] h-screen">
      Order not found!
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF0E1] pt-40 pb-20">
      <div className="max-w-[900px] mx-auto px-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[14px] font-bold mb-8 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={16} /> BACK TO ACCOUNT
        </button>

        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-[24px] md:text-[32px] font-bold mb-2 uppercase tracking-tight">
                  Order {order.transactionId?.slice(-8)}
                </h1>
                <p className="text-gray-500 text-[14px]">
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                  order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {order.orderStatus}
                </span>
                <span className="text-[12px] font-medium text-gray-400">Payment: {order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-8 md:px-12 pt-6 gap-8">
            <TabButton 
              label="Summary" 
              active={activeTab === 'summary'} 
              onClick={() => setActiveTab('summary')} 
              icon={<Package size={14} />}
            />
            <TabButton 
              label="Shipping" 
              active={activeTab === 'shipping'} 
              onClick={() => setActiveTab('shipping')} 
              icon={<Truck size={14} />}
            />
          </div>

          <div className="p-8 md:p-12 pt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  <div>
                    <h3 className="text-[14px] font-bold uppercase tracking-widest text-gray-400 mb-6">Order Items</h3>
                    <div className="space-y-6">
                      {order.items?.map((item: IOrderItem, idx: number) => (
                        <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-6 last:border-0">
                          <div className="flex gap-6 items-center">
                            <div className="w-20 h-20 bg-gray-50 flex-shrink-0">
                                <img src={item.image || "/placeholder.png"} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div>
                              <h4 className="font-bold text-[15px]">{item.name}</h4>
                              <p className="text-gray-400 text-[13px]">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-[18px]">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <SummaryRow label="Subtotal" value={order.totalAmount - (order.shippingFee || 0)} />
                    <SummaryRow label="Shipping" value={order.shippingFee || 0} />
                    <div className="flex justify-between pt-6 border-t border-black">
                      <span className="text-[18px] font-bold uppercase tracking-wider">Total</span>
                      <span className="text-[24px] font-bold">৳{order.totalAmount}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-12"
                >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <section className="space-y-4">
                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 border-b pb-2">Shipping Address</h3>
                        <div className="text-gray-700 space-y-1 text-[15px] leading-relaxed">
                          <p className="font-bold text-black text-[16px]">
                            {order.customerInfo.firstName} {order.customerInfo.lastName}
                          </p>
                          <p>{order.customerInfo.email}</p>
                          <p>{order.customerInfo.phone}</p>
                          <p className="pt-2">{order.customerInfo.address}</p>
                          <p>{order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}</p>
                          <p className="uppercase tracking-wide">{order.customerInfo.country}</p>
                        </div>
                      </section>

                      <section className="space-y-8">
                        <div className="space-y-4">
                           <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 border-b pb-2">Delivery Method</h3>
                           <p className="text-gray-700 font-medium">Standard Shipping (3-5 Business Days)</p>
                        </div>

                        <div className="space-y-4">
                           <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 border-b pb-2">Tracking Details</h3>
                           <div className="space-y-3">
                              <div className="flex justify-between text-[14px]">
                                <span className="text-gray-500">Transaction ID:</span>
                                <span className="font-mono font-bold uppercase">{order.transactionId}</span>
                              </div>
                              <div className="flex justify-between text-[14px]">
                                <span className="text-gray-500">Est. Delivery:</span>
                                <span className="font-bold">{getEstimatedDate(order.createdAt)}</span>
                              </div>
                           </div>
                        </div>
                      </section>
                   </div>
                   
                   <div className="p-4 bg-blue-50 rounded-sm flex gap-3 items-start">
                      <Info className="text-blue-500 shrink-0" size={18} />
                      <p className="text-[13px] text-blue-700 leading-snug">
                        Note: For any issues with your delivery, please contact our support with your transaction ID for faster assistance.
                      </p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for better organization ---

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 pb-4 text-[12px] font-bold uppercase tracking-widest transition-all relative ${
      active ? 'text-black' : 'text-gray-300 hover:text-gray-500'
    }`}
  >
    {icon} {label}
    {active && (
      <motion.div 
        layoutId="activeTabUnderline"
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
      />
    )}
  </button>
);

const SummaryRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between text-gray-600 text-[15px]">
    <span>{label}</span>
    <span className="font-bold text-black">৳{value.toFixed(2)}</span>
  </div>
);

export default OrderDetailsPage;