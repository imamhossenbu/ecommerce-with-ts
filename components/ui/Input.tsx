import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = ({ icon, className = '', ...props }: InputProps) => {
  return (
    <div className="relative w-full">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input 
        className={`w-full bg-gray-50 border border-gray-100 rounded-full py-2 ${icon ? 'pl-11' : 'px-5'} pr-5 text-sm outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500/50 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;