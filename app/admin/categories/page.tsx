/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCategories, deleteCategory } from '@/modules/shop/services';
import { ICategory } from '@/modules/shop/types';
import CategoryTable from './_components/CategoryTable';
import CategoryModal from './_components/CategoryModal';
import Swal from 'sweetalert2';

export default function Categories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      const data = res.data?.data || res.data || res;
      if (res) setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleEdit = (cat: ICategory) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };





const handleDelete = async (id: string) => {

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this category!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#000000', 
    cancelButtonColor: '#e35807',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-[2rem] font-sans',
      confirmButton: 'rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest',
      cancelButton: 'rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500'
    }
  });

  if (result.isConfirmed) {
    try {
      Swal.showLoading();
      
      const res = await deleteCategory(id);
      
      const isSuccess = res.data?.success || res.success || res;

      if (isSuccess) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Category has been removed.',
          icon: 'success',
          confirmButtonColor: '#000000',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl px-6 py-3 text-xs font-black uppercase'
          }
        });
        fetchCategories();
      }
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || "Something went wrong",
        icon: 'error',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'rounded-[2rem]'
        }
      });
    }
  }
};
  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Collections</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Manage store classification</p>
        </div>
        <button 
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="bg-black text-white px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> New Collection
        </button>
      </div>

      <CategoryTable 
        categories={categories} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={selectedCategory} 
        refresh={fetchCategories} 
      />
    </div>
  );
}