'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuIcon, CloseIcon } from '@/components/ui';


const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-6 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10">
            <Image 
              src="/logo.png" 
              alt="LILO Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-blue-800">LILO</span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        <Link href="/" className="text-blue-700 hover:text-blue-900 font-medium">Home</Link>
        <Link href="/features" className="text-gray-600 hover:text-blue-700 font-medium">Features</Link>
        <Link href="/solutions" className="text-gray-600 hover:text-blue-700 font-medium">Solutions</Link>
        <Link href="/pricing" className="text-gray-600 hover:text-blue-700 font-medium">Pricing</Link>
        <Link href="/contact" className="text-gray-600 hover:text-blue-700 font-medium">Contact</Link>
      </div>
      
      <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Get Started
      </button>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-gray-600"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <CloseIcon size={24} />
        ) : (
          <MenuIcon size={24} />
        )}
      </button>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg absolute top-16 left-0 right-0 z-10">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-blue-700 font-medium">Home</Link>
            <Link href="/features" className="text-gray-600 font-medium">Features</Link>
            <Link href="/solutions" className="text-gray-600 font-medium">Solutions</Link>
            <Link href="/pricing" className="text-gray-600 font-medium">Pricing</Link>
            <Link href="/contact" className="text-gray-600 font-medium">Contact</Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium mt-2">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;