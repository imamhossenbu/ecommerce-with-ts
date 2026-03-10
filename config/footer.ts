import { Instagram, Facebook, Globe } from 'lucide-react';

export const footerConfig = {
  about: "Seoul Mirage is your gateway to authentic Korean skincare. We bring the best of Seoul's beauty secrets to your doorstep.",
  socials: [
    { name: 'Web', href: '#', icon: Globe },
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
  ],
  sections: [
    {
      title: "Shop",
      links: [
        { name: 'All Products', href: '/shop' },
        { name: 'Bestsellers', href: '/shop?filter=bestsellers' },
        { name: 'New Arrivals', href: '/shop?filter=new-arrivals' },
      ]
    },
    {
      title: "About",
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Shipping & Returns', href: '/shipping' },
        { name: 'Privacy Policy', href: '/privacy' },
      ]
    }
  ]
};