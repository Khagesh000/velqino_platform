"use client";

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './HomePage/components/Footer';

export default function PageWrapper({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(80);

  useEffect(() => {
    const measureNavbar = () => {
      const navbar = document.querySelector('nav') || 
                     document.querySelector('.navbar') || 
                     document.querySelector('[class*="sticky"]');
      if (navbar) {
        const height = navbar.offsetHeight;
        if (height > 10) {
          setNavbarHeight(height);
        }
      }
    };

    measureNavbar();
    const timer = setTimeout(measureNavbar, 60);
    window.addEventListener('resize', measureNavbar);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureNavbar);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-1 w-full" style={{ paddingTop: `${navbarHeight}px` }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
