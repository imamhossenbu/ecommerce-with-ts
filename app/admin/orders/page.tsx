"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Package, AlertTriangle, CheckCircle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/modules/order/services'; 
import { Table, StatusBadge } from './_components/Table';
import toast from 'react-hot-toast';
import { IOrder } from '@/modules/order/types';


type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const AdminOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    revenue: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllOrders({ 
        page, 
        limit, 
        search, 
        status: statusFilter 
      });
      
      const apiData = result.data?.data || result.data || result;
      
      if (result) {
        setOrders(Array.isArray(apiData) ? apiData : []);
        setTotalPages(result.data?.totalPages || result.totalPages || 1);
        setTotalOrders(result.data?.totalOrders || result.totalOrders || 0);

        const apiStats = result.data?.stats || result.stats;
        if (apiStats) {
          setStats({
            total: apiStats.totalOrders || 0,
            pending: apiStats.pendingOrders || 0,
            delivered: apiStats.deliveredOrders || 0,
            revenue: apiStats.totalRevenue || 0
          });
        }
      }
    } catch (error) {
      console.error("Order Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, limit]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchOrders]);


  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      if (res) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders(); 
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const orderHeaders = [
    { label: 'Order ID' },
    { label: 'Customer' },
    { label: 'Date' },
    { label: 'Total' },
    { label: 'Payment', align: 'center' as const },
    { label: 'Status', align: 'center' as const },
    { label: 'Action', align: 'center' as const },
  ];

  return (
    <div className="space-y-6 md:space-y-8 font-sans p-2 md:p-4 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Order Management</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time store transactions</p>
        </div>
        <div className="text-[10px] font-black text-gray-500 bg-white border border-gray-100 px-5 py-2 rounded-2xl shadow-sm uppercase tracking-widest">
          Total: {totalOrders}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Orders" value={stats.total} icon={<Package size={20} />} />
        <StatCard title="Pending" value={stats.pending} icon={<AlertTriangle size={20} />} color="text-orange-500" />
        <StatCard title="Delivered" value={stats.delivered} icon={<CheckCircle size={20} />} color="text-green-500" />
        <StatCard 
          title="Revenue" 
          value={`৳${(Number(stats.revenue) || 0).toLocaleString()}`} 
          icon={<TrendingUp size={20} />} 
          color="text-pink-600" 
          isRevenue 
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2.2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search transaction id or name..." 
            className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-[1.2rem] text-sm font-bold focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all outline-none"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-3">
          <select 
            className="bg-gray-50 border-none px-6 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none cursor-pointer focus:ring-2 focus:ring-pink-100 transition-all"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-[2.5rem] border border-gray-100">
             <Loader2 className="animate-spin text-pink-500" size={40} />
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Loading Seoul Mirage Orders</span>
          </div>
        ) : (
          <>
            <Table headers={orderHeaders}>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 text-[10px] font-black text-gray-300">
                    #{order?.transactionId?.slice(-8).toUpperCase() || "N/A"}
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{order?.customerInfo?.firstName} {order?.customerInfo?.lastName}</span>
                       <span className="text-[10px] font-bold text-gray-400 italic">{order?.customerInfo?.city}</span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-[11px] font-bold text-gray-500">
                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                  </td>
                  <td className="px-4 py-6 text-sm font-black text-gray-900">
                    ৳{(Number(order?.totalAmount) || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-6 text-center">
                    <StatusBadge status={order?.paymentStatus || 'Pending'} />
                  </td>
                  <td className="px-4 py-6 text-center">
                    <StatusBadge status={order?.orderStatus || 'Processing'} />
                  </td>
                  <td className="px-8 py-6 text-center">
                    {updatingId === order._id ? (
                      <Loader2 size={16} className="animate-spin mx-auto text-pink-500" />
                    ) : (
                      <select 
                        className="bg-white border border-gray-100 text-[9px] font-black uppercase py-2 px-3 rounded-xl cursor-pointer focus:ring-2 focus:ring-pink-100 outline-none transition-all shadow-sm"
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id!, e.target.value as OrderStatus)}
                      >
                        <option value="Processing">Process</option>
                        <option value="Shipped">Ship</option>
                        <option value="Delivered">Deliver</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={orderHeaders.length} className="px-4 py-32 text-center text-gray-300 font-black uppercase text-[10px] tracking-widest">No orders matching your criteria.</td></tr>
              )}
            </Table>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Showing {totalOrders > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, totalOrders)} of {totalOrders}
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-3 border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-white shadow-sm transition-all"
                ><ChevronLeft size={18} /></button>
                
                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${page === i + 1 ? 'bg-black text-white shadow-lg scale-110' : 'hover:bg-white text-gray-400 border border-transparent hover:border-gray-100'}`}
                    >{i + 1}</button>
                  ))}
                </div>

                <button 
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(p => p + 1)}
                  className="p-3 border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-white shadow-sm transition-all"
                ><ChevronRight size={18} /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isRevenue?: boolean;
}

const StatCard = ({ title, value, icon, color = "text-gray-900", isRevenue = false }: StatCardProps) => (
  <div className="bg-white p-6 rounded-[2.2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-pink-500/5 group">
    <div className="flex justify-between items-center mb-5">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-pink-500 transition-colors">{title}</span>
        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-all">{icon}</div>
    </div>
    <div className="flex items-baseline justify-between">
        <h4 className={`text-2xl font-black tracking-tighter ${color}`}>{value}</h4>
        {isRevenue && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active</span>
          </div>
        )}
    </div>
  </div>
);

export default AdminOrders;