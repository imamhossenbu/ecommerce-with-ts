import React, { ReactNode } from 'react';

interface ITableHeader {
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  headers: ITableHeader[];
  children: ReactNode;
}

export const Table = ({ headers, children }: TableProps) => (
  <div className="overflow-x-auto custom-scrollbar bg-white rounded-[2rem] border border-gray-100 shadow-sm">
    <table className="w-full border-collapse min-w-[1000px]">
      <thead>
        <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 bg-gray-50/30">
          {headers.map((header, index) => (
            <th 
              key={index} 
              className={`px-8 py-6 ${
                header.align === 'center' ? 'text-center' : 
                header.align === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {children}
      </tbody>
    </table>
  </div>
);


type StatusType = 
  | 'paid' | 'pending' | 'failed' | 'cancelled' 
  | 'delivered' | 'shipped' | 'processing' | 'canceled';

interface StatusBadgeProps {
  status: string | StatusType;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {

  const styles: Record<string, string> = {
    paid: 'bg-green-50 text-green-600 border-green-100',
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    failed: 'bg-red-50 text-red-600 border-red-100',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-100',
    
    delivered: 'bg-green-600 text-white',
    shipped: 'bg-blue-600 text-white',
    processing: 'bg-purple-600 text-white',
    canceled: 'bg-red-600 text-white',
  };

  const normalizedStatus = status?.toLowerCase() || 'pending';
  
  return (
    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border inline-block ${styles[normalizedStatus] || 'bg-gray-100 text-gray-400 border-gray-200'}`}>
      {status}
    </span>
  );
};