import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const Button = ({ 
  children, variant = 'primary', size = 'md', isLoading, leftIcon, className = '', ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-tight transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-600",
    secondary: "bg-black text-white hover:bg-gray-800",
    outline: "border-2 border-gray-100 hover:border-pink-500 hover:text-pink-500",
    ghost: "bg-transparent hover:bg-gray-50",
    danger: "bg-red-50 text-red-500 hover:bg-red-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-[12px]",
    lg: "px-8 py-4 text-[14px]",
    icon: "p-2 rounded-full"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};

export default Button;