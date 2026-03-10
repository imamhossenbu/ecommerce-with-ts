'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from "@/public/shared/logo.png";

interface NavLink {
  name: string;
  href: string;
  hasDropdown: boolean;
  items?: string[];
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  openDropdown: string | null;
  setOpenDropdown: (val: string | null) => void;
}

export default function MobileDrawer({ isOpen, onClose, navLinks, openDropdown, setOpenDropdown }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm lg:hidden" />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 left-0 w-[280px] h-full bg-white z-[70] p-6 lg:hidden">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <Image src={logoImg} alt="Logo" className="w-[100px]" />
              <button onClick={onClose} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button>
            </div>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.name} className="border-b border-gray-50 last:border-0">
                  <div className="flex justify-between items-center py-4" onClick={() => link.hasDropdown && setOpenDropdown(openDropdown === link.name ? null : link.name)}>
                    <Link href={link.href} onClick={!link.hasDropdown ? onClose : undefined} className="text-[13px] font-black uppercase text-black">{link.name}</Link>
                    {link.hasDropdown && <ChevronDown size={18} className={`${openDropdown === link.name ? 'rotate-180' : ''} transition-transform`} />}
                  </div>
                  {link.hasDropdown && openDropdown === link.name && (
                    <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} className="pl-4 pb-2 bg-pink-50/30 rounded-lg overflow-hidden">
                      {(link.items || []).map((item: string) => (
                        <li key={item}><Link href={`/shop?category=${item.toLowerCase()}`} onClick={onClose} className="py-3 px-4 text-[11px] font-bold text-gray-600 block uppercase">{item}</Link></li>
                      ))}
                    </motion.ul>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}