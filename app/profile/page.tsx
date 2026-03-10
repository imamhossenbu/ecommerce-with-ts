/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { User, Package, Camera, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile,  changePassword } from '@/modules/auth/services';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getUserOrders } from '@/modules/order/services';

// Reusable Components
import InputField from './_components/InputField';
import SelectField from './_components/SelectField';
import { handleLogout } from '../../lib/axios';
import { useAuth } from '@/hooks/useAuth';

const MyAccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const { user, logout, setUser } = useAuth();

  return (
    <div className="bg-white min-h-screen pb-20 pt-40">
      <div className="site-container">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[42px] font-medium text-[#1A1A1A] mb-10 tracking-tight"
        >
          My Account
        </motion.h1>

        {/* Navigation Tabs with Subtle Background */}
        <div className="inline-flex p-1 bg-gray-50 rounded-full gap-2 mb-16 border border-gray-100">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User size={16} />} 
            label="Profile" 
          />
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
            icon={<Package size={16} />} 
            label="Order History" 
          />
        </div>

        {/* Animated Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' ? (
              <ProfileTab user={user} setUser={setUser} logout={logout} />
            ) : (
              <OrderHistoryTab />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Sub-component: Profile Tab ---
const ProfileTab: React.FC<{ user: any; setUser: any; logout: any }> = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage || null);
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'Bangladesh'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'Bangladesh'
      });
      setImagePreview(user.profileImage);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      data.append('name', fullName);
      
      Object.keys(formData).forEach(key => {
        if(!['firstName', 'lastName', 'email'].includes(key)) {
          data.append(key, (formData as any)[key] || "");
        }
      });
      
      if (selectedFile) data.append('image', selectedFile);

      for (const pair of data.entries()) {
  console.log(pair[0], pair[1]);
}


      const res = await updateProfile(data);
      if (res?.success) {
        setUser(res.data);
        toast.success(res.message || "Profile updated successfully!");
        setSelectedFile(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return toast.error("Please fill all password fields");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    setLoading(true);
    try {
      const res = await changePassword({
  oldPassword: passwordData.currentPassword, 
  newPassword: passwordData.newPassword
});
      if (res.success) {
        toast.success("Password updated successfully!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px]">
       <section className="mb-16">
          <h2 className="text-[20px] font-medium mb-8">User Information</h2>
          <div className="relative w-[110px] h-[110px] mb-10 group">
            <img 
               src={imagePreview || "/default-avatar.png"} 
               className="w-full h-full rounded-full object-cover border border-gray-100 shadow-sm" 
               alt="Profile" 
            />
            <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Camera size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InputField label="First name" value={formData.firstName} onChange={(v)=>setFormData({...formData, firstName: v})} />
            <InputField label="Last name" value={formData.lastName} onChange={(v)=>setFormData({...formData, lastName: v})} />
            <InputField label="Email" value={formData.email} disabled />
            <InputField label="Phone" value={formData.phone} onChange={(v)=>setFormData({...formData, phone: v})} />
            <div className="md:col-span-2">
               <button type="submit" disabled={loading} className="bg-black text-white px-8 py-2.5 text-[13px] font-medium rounded-full flex items-center gap-2 hover:opacity-90 transition-all">
                 {loading && <Loader2 size={14} className="animate-spin" />} Update Profile
               </button>
            </div>
          </form>
       </section>

       <section className="mb-16">
          <h2 className="text-[20px] font-medium mb-8">Shipping Address</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <InputField label="Street Address" value={formData.address} onChange={(v)=>setFormData({...formData, address: v})} full />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="City" value={formData.city} onChange={(v)=>setFormData({...formData, city: v})} />
              <SelectField label="State" options={['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal']} value={formData.state} onChange={(v)=>setFormData({...formData, state: v})} />
              <InputField label="ZIP Code" value={formData.zipCode} onChange={(v)=>setFormData({...formData, zipCode: v})} />
            </div>
            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-2.5 text-[13px] font-medium rounded-full hover:opacity-90 transition-all">
              Update Shipping Address
            </button>
          </form>
       </section>

       <section className="mb-16">
          <h2 className="text-[20px] font-medium mb-8 border-t pt-12">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Current Password" type="password" value={passwordData.currentPassword} onChange={(v)=>setPasswordData({...passwordData, currentPassword: v})} />
            <InputField label="New Password" type="password" value={passwordData.newPassword} onChange={(v)=>setPasswordData({...passwordData, newPassword: v})} />
            <InputField label="Confirm Password" type="password" value={passwordData.confirmPassword} onChange={(v)=>setPasswordData({...passwordData, confirmPassword: v})} />
            <div className="md:col-span-3">
              <button type="submit" disabled={loading} className="bg-black text-white px-8 py-2.5 text-[13px] font-medium rounded-full hover:opacity-90 transition-all">
                Change Password
              </button>
            </div>
          </form>
          
          <div className="pt-12 mt-12 border-t">
            <button type="button" onClick={handleLogout} className="text-red-500 border border-red-200 px-8 py-2 rounded-full text-[13px] font-medium hover:bg-red-50 transition-colors">
              Log Out
            </button>
          </div>
       </section>
    </div>
  );
};

// --- Sub-component: Order History Tab ---
const OrderHistoryTab: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUserOrders().then(res => {
      if (res?.success) setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center font-medium"><Loader2 className="animate-spin mx-auto text-gray-400" /></div>;

  return (
    <div className="space-y-6 max-w-[1000px]">
      {orders.length === 0 ? (
        <p className="text-gray-500 py-10">No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={order._id} 
            className="border border-[#E5E5E5] rounded-xl p-8 hover:border-black transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                <h4 className="text-[18px] font-medium text-[#1A1A1A]">#{order.transactionId?.toUpperCase().slice(-8)}</h4>
                <p className="text-[#757575] text-[14px] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold text-green-600 uppercase mb-1">Delivered</p>
                <p className="text-[20px] font-bold text-[#1A1A1A]">৳{order.totalAmount}</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/order-details/${order.transactionId}`)}
              className="w-full py-3 border border-[#1A1A1A] rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 group-hover:bg-black group-hover:text-white transition-all"
            >
              View Details <ChevronRight size={16} />
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
};

// Helper Component: Tab Button
const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 ${
      active ? 'bg-black text-white shadow-lg' : 'bg-transparent text-[#1A1A1A] hover:bg-gray-100'
    }`}
  >
    {icon} {label}
  </button>
);

export default MyAccountPage;