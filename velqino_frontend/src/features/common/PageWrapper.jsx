"use client";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import Navbar from './Navbar';
import Footer from './HomePage/Components/Footer';

export default function PageWrapper({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Use useLayoutEffect instead of useEffect for immediate measurement
  useLayoutEffect(() => {
    // Wait for next frame to ensure navbar is fully rendered
    const measureNavbar = () => {
      // Try multiple selectors to find the navbar
      const navbar = document.querySelector('nav') || 
                     document.querySelector('.navbar') || 
                     document.querySelector('[class*="sticky"]');
      
      console.log('🔍 Found navbar:', navbar);
      
      if (navbar) {
        const height = navbar.offsetHeight;
        console.log('📏 Navbar height:', height);
        
        if (height > 10) {
          setNavbarHeight(height);
        } else {
          // If height is too small, try again after a short delay
          setTimeout(() => {
            const retryHeight = navbar.offsetHeight;
            console.log('📏 Retry navbar height:', retryHeight);
            setNavbarHeight(retryHeight > 10 ? retryHeight : 80);
          }, 100);
        }
      } else {
        // Fallback height for different screen sizes
        const fallbackHeight = window.innerWidth < 768 ? 64 : 80;
        console.log('⚠️ Navbar not found, using fallback height:', fallbackHeight);
        setNavbarHeight(fallbackHeight);
      }
    };

    measureNavbar();
    
    // Also measure on window resize
    window.addEventListener('resize', measureNavbar);
    return () => window.removeEventListener('resize', measureNavbar);
  }, []);

  console.log('🎨 Rendering PageWrapper with paddingTop:', navbarHeight);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Navbar />
      <div style={{ paddingTop: `${navbarHeight}px` }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}