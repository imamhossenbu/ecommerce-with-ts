'use client';

import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Menu, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import logoImg from "../../public/shared/logo.png";
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { handleLogout } from '@/modules/auth/utils';
import SearchBar from './SearchBar';
import MobileDrawer from './MobileDrawer';
import NavLink from './NavLink';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const { user } = useAuth();
  const { cartItems } = useCart();
  const pathname = usePathname();

  const totalCartItems = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Skincare', hasDropdown: true, items: ['Cleansers', 'Toners', 'Essences'], href: '/shop' },
    { name: 'Collections', hasDropdown: true, items: ['Hydration', 'Brightening'], href: '/collections' },
    { name: 'About', hasDropdown: false, items: [], href: '/about' },
    { name: 'Contact', hasDropdown: false, items: [], href: '/contact' },
  ];

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-md py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        
        {/* LEFT: LOGO & MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-1 text-black" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <Link href="/" className="block w-[80px] md:w-[110px]">
            <Image src={logoImg} alt="Seoul Mirage" priority />
          </Link>
        </div>

        {/* CENTER: DESKTOP LINKS */}
    <ul className="hidden lg:flex items-center gap-8">
  {navLinks.map((link) => {
    const active = pathname === link.href;

    return (
      <li key={link.name} className="relative group py-2">

        <NavLink href={link.href} isActive={active}>
          {link.name}
          {link.hasDropdown && (
            <ChevronDown 
              size={14} 
              className="group-hover:rotate-180 transition-transform duration-300 ml-1" 
            />
          )}
        </NavLink>

        {link.hasDropdown && (
          <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <div className="bg-white border border-gray-100 shadow-xl p-5 min-w-[200px] flex flex-col gap-3 rounded-xl">
              {link.items?.map((item) => (
                <Link 
                  key={item} 
                  href={`/shop?category=${item.toLowerCase()}`} 
                  className="text-[12px] font-bold text-gray-600 hover:text-pink-500 transition-colors uppercase tracking-tight"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </li>
    );
  })}
</ul>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-4 md:gap-6 text-black">
          <SearchBar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />

          {/* USER MENU */}
        <div 
  className="relative" 
  onMouseEnter={() => typeof window !== 'undefined' && window.innerWidth > 1024 && setIsUserMenuOpen(true)} 
  onMouseLeave={() => typeof window !== 'undefined' && window.innerWidth > 1024 && setIsUserMenuOpen(false)}
>
  {/* User Toggle Button */}
  <button 
    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
    className="pt-3 hover:text-pink-500 transition-colors focus:outline-none"
  >
    {user?.profileImage ? (
      <img 
        src={user.profileImage} 
        className="w-7 h-7 rounded-full object-cover border border-pink-100" 
        alt="User Profile" 
      />
    ) : (
      <User size={20} strokeWidth={1.5} />
    )}
  </button>

  {/* Dropdown Menu */}
  <AnimatePresence>
    {isUserMenuOpen && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 10 }} 
        className="absolute right-0 mt-2 bg-white shadow-2xl border border-gray-100 min-w-[200px] rounded-2xl py-2 z-[100] overflow-hidden"
      >
        {user ? (
  <>
   
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/30">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Welcome</p>
      <p className="text-[12px] font-bold text-gray-800 truncate">{user.name}</p>
    </div>
    
    <Link 
      href={user.role === 'admin' ? '/admin/dashboard' : '/profile'} 
      onClick={() => setIsUserMenuOpen(false)}
      className="flex items-center gap-3 px-5 py-3 text-[11px] font-black uppercase text-black hover:bg-gray-50 hover:text-pink-500 transition-colors tracking-tight"
    >
      <UserCircle size={16} /> 
      {user.role === 'admin' ? 'Admin Panel' : 'My Account'}
    </Link>
    <button 
      onClick={() => {
        handleLogout();
        setIsUserMenuOpen(false);
      }} 
      className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1 uppercase tracking-tight"
    >
      <LogOut size={16} /> Logout
    </button>
  </>
) : (
  <div className="flex flex-col">
    <Link 
      href="/signin" 
      onClick={() => setIsUserMenuOpen(false)}
      className="px-5 py-3 text-[11px] font-black uppercase text-black hover:bg-gray-50 hover:text-pink-500 transition-colors tracking-tight"
    >
      Sign In
    </Link>
    
    <Link 
      href="/signup" 
      onClick={() => setIsUserMenuOpen(false)}
      className="px-5 py-3 text-[11px] font-black uppercase text-black hover:bg-gray-50 hover:text-pink-500 transition-colors tracking-tight"
    >
      Sign Up
    </Link>
  </div>
)}
      </motion.div>
    )}
  </AnimatePresence>
</div>
          {/* CART */}
          <Link href="/cart" className="relative pt-1 group">
            <ShoppingBag size={20} />
            {totalCartItems > 0 && <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalCartItems}</span>}
          </Link>
        </div>
      </div>

      {/* MOBILE DRAWER COMPONENT */}
      <MobileDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        navLinks={navLinks} 
        openDropdown={openMobileDropdown}
        setOpenDropdown={setOpenMobileDropdown}
      />
    </nav>
  );
}