/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/modules/shop/services'; 
import toast from 'react-hot-toast';
import { IProduct } from '@/modules/shop/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;    // এটি একটি ফাংশন হবে
    product: IProduct | null; // সেফটির জন্য null হ্যান্ডেল করা ভালো
    refresh: () => void;    // এটিও একটি ফাংশন
}

const DeleteModal = ({ isOpen, onClose, product, refresh }: Props) => {
  const [deleting, setDeleting] = useState(false);

const handleDelete = async () => {
    if (!product?._id) return;
    
    setDeleting(true);
    try {
      const res = await deleteProduct(product._id);
      
      if (res?.data?.success ) { 
        toast.success(res?.data?.message  || "Product deleted successfully");
        refresh(); 
        onClose(); 
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-200">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} strokeWidth={2.5} />
        </div>
        
        <h3 className="text-2xl font-black text-center mb-2 text-gray-900 uppercase tracking-tighter">Confirm Deletion</h3>
        <p className="text-sm text-gray-500 text-center mb-10 px-4 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-gray-900 underline underline-offset-4 decoration-red-200">{product?.name}</span>? 
          This will remove all associated data permanently.
        </p>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <><Trash2 size={16} /> Delete Now</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;