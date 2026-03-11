/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Users, UserPlus, UserX, DollarSign, ChevronLeft, ChevronRight, MoreVertical, Trash2, UserCog, Power, Filter } from 'lucide-react';
import { getManageCustomers, updateProfileByAdmin, deleteUser } from '@/services/admin'; 
import { Table, StatusBadge } from '../orders/_components/Table';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface ICustomer {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Active' | 'Inactive';
  totalSpent: number;
  totalOrders?: number; 
}

interface ICustomerStats {
  totalMembers: number;
  totalAdmins: number;
  totalUsers: number;
  inactiveCount: number;
  avgOrderValue: number;
}

const ManageCustomers = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null); 
  
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>(""); 
  
  const [stats, setStats] = useState<ICustomerStats>({ 
    totalMembers: 0, 
    totalAdmins: 0, 
    totalUsers: 0, 
    inactiveCount: 0, 
    avgOrderValue: 0 
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getManageCustomers({ page, limit, search, status: statusFilter, role: roleFilter });
      console.log(res)
      
      if (res && res.success) {
        const apiData = res.data?.customers || [];
        setCustomers(apiData);
        
        if (res.data?.meta) {
            setTotalPages(res.data.meta.totalPages || 1);
        }

        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) { 
      console.error("Fetch Error:", err);
      toast.error("Failed to load members");
    } finally { 
      setLoading(false); 
    }
  }, [page, search, statusFilter, roleFilter, limit]);

  useEffect(() => {
    const delay = setTimeout(fetchData, 500);
    return () => clearTimeout(delay);
  }, [fetchData]);

  const handleUpdate = async (userId: string, data: any) => {
    setActiveMenu(null);
    try {
      setUpdatingId(userId);
      const res = await updateProfileByAdmin({ userId, ...data }); 
      if (res.success) {
        toast.success(res.message || "Updated Successfully");
        fetchData(); 
      }
    } catch (err) { 
      toast.error("Update failed"); 
    } finally { 
      setUpdatingId(null); 
    }
  };

  const handleDelete = async (userId: string) => {
    setActiveMenu(null);
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This member will be permanently removed!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#18181b',
      confirmButtonText: 'Yes, Delete Member',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest',
        cancelButton: 'rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500'
      }
    });

    if (result.isConfirmed) {
      try {
        setUpdatingId(userId);
        const res = await deleteUser(userId);
        if (res.success) {
          toast.success("Member deleted");
          fetchData();
        }
      } catch (err) { 
        toast.error("Delete failed"); 
      } finally { 
        setUpdatingId(null); 
      }
    }
  };

  const headers = [
    { label: 'ID' }, { label: 'Email' }, 
    { label: 'Role' }, { label: 'Total Spent' }, { label: 'Status' }, 
    { label: 'Action', align: 'center' as const }
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 font-sans max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Member Directory</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Seoul Mirage Admin Management</p>
        </div>
        <div className="text-[10px] font-black bg-white border border-gray-100 px-6 py-2.5 rounded-2xl text-gray-400 uppercase tracking-widest shadow-sm">
            Platform Total: {stats.totalMembers || 0}
        </div>
      </div>

      {/* Stats Cards - Updated with new Backend fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Members" value={stats.totalMembers} icon={<Users size={20}/>} />
        <StatCard title="Admins" value={stats.totalAdmins} icon={<UserCog size={20}/>} color="text-pink-500" />
        <StatCard title="Inactive" value={stats.inactiveCount} icon={<UserX size={20}/>} color="text-rose-500" />
        <StatCard title="Avg. Ticket" value={`৳${Math.round(stats.avgOrderValue || 0).toLocaleString()}`} icon={<DollarSign size={20}/>} color="text-green-600" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex flex-col lg:flex-row gap-5 shadow-sm items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-[1.2rem] text-sm font-bold focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all outline-none" 
            placeholder="Search by name, email or ID..." 
            value={search}
            onChange={(e) => {setSearch(e.target.value); setPage(1);}} 
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <select 
                className="flex-1 lg:w-44 bg-gray-50 border-none px-6 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                value={statusFilter}
                onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}}
            >
                <option value="">Status: All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            <select 
                className="flex-1 lg:w-44 bg-gray-50 border-none px-6 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                value={roleFilter}
                onChange={(e) => {setRoleFilter(e.target.value); setPage(1);}}
            >
                <option value="">Role: All</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
            </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[450px]">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
             <Loader2 className="animate-spin text-pink-500" size={40} />
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Accessing Database...</span>
          </div>
        ) : (
          <>
            <Table headers={headers}>
              {customers.length > 0 ? customers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 text-[10px] font-black text-gray-300 uppercase">#{user._id.slice(-6)}</td>
                  <td className="px-4 py-6 text-[11px] font-bold text-gray-500">{user.email}</td>
                  <td className="px-4">
                    <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border ${user.role === 'admin' ? 'text-pink-600 bg-pink-50 border-pink-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">৳{(user.totalSpent || 0).toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{user.totalOrders || 0} Orders</span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center"><StatusBadge status={user.status || 'Active'} /></td>

                  <td className="px-8 py-6 text-center">
                    {updatingId === user._id ? (
                        <Loader2 size={16} className="animate-spin mx-auto text-pink-500" />
                    ) : (
                        <div className="relative inline-block text-left">
                            <button 
                                onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                                className="p-3 bg-gray-50 hover:bg-black rounded-2xl transition-all text-gray-400 hover:text-white"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {activeMenu === user._id && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 z-20 py-3 overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <button 
                                            onClick={() => handleUpdate(user._id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                                            className="w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            <UserCog size={16} className="text-blue-500" /> Make {user.role === 'admin' ? 'User' : 'Admin'}
                                        </button>
                                        <button 
                                            onClick={() => handleUpdate(user._id, { status: user.status === 'Inactive' ? 'Active' : 'Inactive' })}
                                            className="w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            <Power size={16} className={user.status === 'Inactive' ? 'text-green-500' : 'text-orange-500'} /> {user.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                                        </button>
                                        <div className="my-2 border-t border-gray-50" />
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete Account
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-32 text-center text-gray-300 font-black uppercase text-[10px] tracking-widest">
                    No results found in directory
                  </td>
                </tr>
              )}
            </Table>
            
            {/* Pagination - Updated Meta usage */}
            <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
    Showing Page {page} of {totalPages}
  </span>
  
  <div className="flex items-center gap-2">
    {/* Previous Button */}
    <button 
        disabled={page === 1} 
        onClick={() => setPage(p => p - 1)} 
        className="p-3 border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-black hover:text-white shadow-sm transition-all"
    >
        <ChevronLeft size={16} />
    </button>

    {/* Page Numbers */}
    <div className="flex items-center gap-1">
      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${
              page === pageNum 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-pink-500 hover:text-pink-500'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
    </div>

    
    <button 
        disabled={page === totalPages} 
        onClick={() => setPage(p => p + 1)} 
        className="p-3 border border-gray-100 rounded-2xl disabled:opacity-20 hover:bg-black hover:text-white shadow-sm transition-all"
    >
        <ChevronRight size={16} />
    </button>
  </div>
</div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color = "text-gray-900" }: { title: string, value: string | number, icon: React.ReactNode, color?: string }) => (
  <div className="bg-white p-7 rounded-[2.2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-pink-500/5 group">
    <div className="flex justify-between items-start mb-5">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-pink-500 transition-colors">{title}</span>
      <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-all">{icon}</div>
    </div>
    <h4 className={`text-3xl font-black tracking-tighter ${color}`}>{value || 0}</h4>
  </div>
);

export default ManageCustomers;