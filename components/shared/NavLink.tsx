import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ href, children, isActive }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className={`relative text-[13px] font-bold uppercase transition-colors px-1 flex items-center gap-1 ${isActive ? 'text-pink-500' : 'text-black hover:text-pink-500'}`}
    >
      {children}
      {isActive && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-pink-500"
        />
      )}
    </Link>
  );
};

export default NavLink;