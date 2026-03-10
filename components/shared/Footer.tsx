'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import logoImg from "@/public/shared/logo.png"; 
import { footerConfig } from '@/config/footer';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-6 w-[110px]">
              <Image src={logoImg} alt="Seoul Mirage" className="object-contain" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              {footerConfig.about}
            </p>
            <div className="flex gap-5">
              {footerConfig.socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="text-gray-400 hover:text-pink-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Sections (Shop & About) */}
          {footerConfig.sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-500 hover:text-pink-500 hover:pl-2 transition-all duration-300 text-sm font-medium inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-[12px]">
          <p>© {new Date().getFullYear()} Seoul Mirage. All rights reserved.</p>
          <div className="flex gap-6 font-bold uppercase tracking-tighter">
            <Link href="/terms" className="hover:text-pink-500">Terms</Link>
            <Link href="/cookies" className="hover:text-pink-500">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}