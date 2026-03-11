/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, CreditCard, 
  Loader2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

import { getAdminStats } from '@/services/admin'; 
import StatCard from './_components/StatCard';
import OrderRow from './_components/OrderRow';
import {IDashboardData} from '@/modules/order/types'

const PIE_COLORS = ['#B0264F', '#D9A15B', '#631B31', '#F2C94C'];

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await getAdminStats(); 
        if (statsData) {
          setData(statsData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#B0264F] mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[12px]">Syncing Data...</p>
      </div>
    );
  }

  const hasSalesData = data?.salesData && data.salesData.length > 0;
  
  const categoryData = data?.categoryStats || [
    { name: 'Default', value: 100 },
  ];

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans text-gray-900">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Dashboard</h1>
          <p className="text-xs text-gray-400 font-bold">Welcome back, Imam!</p>
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full">
          Update: {new Date().toLocaleDateString('en-GB')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Revenue" 
          value={`৳${data?.stats?.totalRevenue?.toLocaleString()}`} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Orders" 
          value={data?.stats?.totalOrders?.toString() || "0"} 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="Customers" 
          value={data?.stats?.totalCustomers?.toString() || "0"} 
          icon={Users} 
        />
        <StatCard 
          title="Avg. Value" 
          value={`৳${data?.stats?.avgOrderValue?.toFixed(2)}`} 
          icon={CreditCard} 
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Sales Overview */}
        <ChartContainer title="Sales Overview" subtitle="Monthly Revenue Distribution">
          {hasSalesData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.salesData} margin={{ left: 20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" width={40} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#B0264F" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          ) : <NoDataPlaceholder />}
        </ChartContainer>

        {/* Revenue Trend */}
        <ChartContainer title="Revenue Trend" subtitle="Revenue Growth Over Time">
          {hasSalesData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B0264F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#B0264F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#B0264F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <NoDataPlaceholder />}
        </ChartContainer>

        {/* Sales by Category */}
        <ChartContainer title="Category Stats" subtitle="Performance by category">
          <div className="flex-1 relative h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                <span className="text-lg font-black text-[#B0264F]">100%</span>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-10">
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-8 uppercase tracking-tighter">Recent Orders</h2>
          <div className="space-y-2">
            {data?.recentOrders?.map((order) => (
              <OrderRow 
                key={order._id}
                orderId={order.transactionId?.toUpperCase().slice(-6)}
                customer={`${order.customerInfo.firstName} ${order.customerInfo.lastName}`}
                amount={order.totalAmount}
                status={order.orderStatus}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-8 uppercase tracking-tighter">Top Products</h2>
          <div className="space-y-6">
            {data?.topProducts?.map((product) => (
              <div key={product._id} className="flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                   <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={product.thumbnail || "/placeholder.png"} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className="font-bold text-sm leading-tight group-hover:text-[#B0264F] transition-colors">{product.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Best Seller</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-sm">৳{product.salePrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const ChartContainer: React.FC<{ title: string, subtitle?: string, children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-96 flex flex-col">
    <div className="mb-4">
      <h3 className="font-extrabold text-sm uppercase tracking-widest">{title}</h3>
      {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{subtitle}</p>}
    </div>
    <div className="flex-1 w-full min-h-0">
      {children}
    </div>
  </div>
);

const NoDataPlaceholder = () => (
  <div className="h-full flex items-center justify-center">
    <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">No Data Available</p>
  </div>
);

export default AdminDashboard;