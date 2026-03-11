import React, { useState, useEffect, ChangeEvent } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { createCategory, updateCategory } from '@/modules/shop/services';
import { ICategory } from '@/modules/shop/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategory | null;
  refresh: () => void;
}

const CategoryModal = ({ isOpen, onClose, category, refresh }: ModalProps) => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setPreview(category.image);
    } else {
      setName("");
      setPreview("");
      setImage(null);
    }
  }, [category, isOpen]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Label is required");

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    setSubmitting(true);
    try {
      const res = category?._id 
        ? await updateCategory(category._id, formData) 
        : await createCategory(formData);
      
      if (res) {
        toast.success(category ? "Collection Updated" : "Collection Created");
        refresh();
        onClose();
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white w-full max-w-md rounded-[3rem] p-12 relative z-10 shadow-2xl">
          <button onClick={onClose} className="absolute top-10 right-10 text-gray-300 hover:text-black transition-colors"><X size={24} /></button>
          
          <div className="mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">{category ? 'Update' : 'New'} Collection</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Classification Details</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <label className="relative cursor-pointer w-full group">
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                {preview ? (
                  <div className="w-full h-56 rounded-[2rem] overflow-hidden border border-gray-100 relative shadow-inner bg-gray-50">
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                        <Upload className="text-white" size={32} />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-56 rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center text-gray-300 hover:bg-gray-100 hover:border-gray-200 transition-all">
                    <ImageIcon size={40} strokeWidth={1.2} className="mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Cover</span>
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Collection Label</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border-none rounded-[1.2rem] px-6 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Skin Essentials" 
              />
            </div>

            <button disabled={submitting} className="w-full bg-black text-white py-6 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10">
              {submitting ? <Loader2 className="animate-spin" size={20} /> : (category ? 'Update Collection' : 'Create Collection')}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CategoryModal;