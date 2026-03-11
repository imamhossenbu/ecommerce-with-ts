import { Edit, Trash2 } from 'lucide-react';
import { ICategory } from '@/modules/shop/types';
import Image from 'next/image';

interface TableProps {
  categories: ICategory[];
  loading: boolean;
  onEdit: (cat: ICategory) => void;
  onDelete: (id: string) => void;
}

const CategoryTable = ({ categories, loading, onEdit, onDelete }: TableProps) => {
  // Skeleton Row Component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-6 px-8">
        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100" />
      </td>
      <td className="p-6">
        <div className="h-4 w-32 bg-gray-100 rounded-md" />
      </td>
      <td className="p-6 px-8">
        <div className="flex justify-end gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl" />
          <div className="w-12 h-12 bg-gray-50 rounded-2xl" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Visual</th>
              <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Collection Name</th>
              <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
            
              <>
                {[...Array(10)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-32 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  No Collections Found
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6 px-8">
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative">
                      {/* Next.js Image Component */}
                      <Image 
                        src={cat.image} 
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{cat.name}</span>
                  </td>
                  <td className="p-6 px-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => onEdit(cat)} 
                        className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(cat._id)} 
                        className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;