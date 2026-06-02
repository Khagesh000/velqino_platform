"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, MessageCircle, Eye, GitCompare, X, Clock } from '../../../../utils/icons';
import Link from 'next/link';

export default function FloatingElements({ allProducts = [] }) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

 useEffect(() => {
  const stored = localStorage.getItem('recentlyViewed');
  if (stored && allProducts.length > 0) {
    try {
      const ids = JSON.parse(stored);
      const matchedProducts = ids
        .map(id => allProducts.find(p => p.id === id))
        .filter(p => p)
        .slice(0, 5);
      setRecentProducts(matchedProducts);
    } catch (e) {
      setRecentProducts([]);
    }
  }
}, [allProducts]);

  // Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].id) {
            setRecentProducts(parsed.slice(0, 5));
          } else {
            setRecentProducts([]);
          }
        } catch (e) {
          setRecentProducts([]);
        }
      } else {
        setRecentProducts([]);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openChat = () => {
    window.open('https://wa.me/911234567890?text=Hello! I need assistance.', '_blank');
  };

  const removeFromCompare = (productId) => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const updated = compareList.filter(id => id !== productId);
    localStorage.setItem('compareList', JSON.stringify(updated));
    setShowCompare(false);
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentProducts([]);
    setShowRecentlyViewed(false);
  };

  const getImageUrl = (product) => {
    return product?.image || product?.primary_image || product?.images?.[0]?.image || '/images/placeholder.jpg';
  };

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-10 h-10 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-fadeInUp"
          aria-label="Back to top"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* WhatsApp/Chat Support Button */}
      <button
        onClick={openChat}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-10 h-10 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-fadeInUp"
        style={{ bottom: showBackToTop ? '80px' : '20px' }}
        aria-label="Chat support"
      >
        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Recently Viewed Widget - Collapsible */}
      {recentProducts.length > 0 && (
        <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${showRecentlyViewed ? 'translate-x-0' : '-translate-x-64'}`}>
          <button
            onClick={() => setShowRecentlyViewed(!showRecentlyViewed)}
            className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-10 bg-primary-500 text-white rounded-r-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
          >
            <Eye size={16} />
          </button>
          <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-primary-500 text-white px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span className="text-sm font-medium">Recently Viewed</span>
              </div>
              <button onClick={clearRecentlyViewed} className="text-white/80 hover:text-white text-xs">
                Clear
              </button>
            </div>
            <div className="p-2 space-y-2 max-h-80 overflow-y-auto custom-scroll">
              {recentProducts.map((product, index) => (
                <Link
                  key={product?.id || `recent-${index}`}
                  href={`/product/productlistingpage?product_id=${product.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs flex-shrink-0">
                    <img 
                      src={getImageUrl(product)} 
                      alt={product?.name || 'Product'} 
                      className="w-full h-full object-cover rounded-md" 
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{product?.name || 'Product'}</p>
                    <p className="text-[10px] text-primary-600">₹{product?.price || 0}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compare Products Widget */}
      {showCompare && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-slideUp">
          <div className="bg-primary-500 text-white px-3 py-2 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare size={14} />
              <span className="text-sm font-medium">Compare Products</span>
            </div>
            <button onClick={() => setShowCompare(false)} className="text-white/80 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-500 text-center">No products added to compare</p>
            <button className="w-full mt-2 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
              Browse Products
            </button>
          </div>
        </div>
      )}

      {/* Styles for animations and custom scroll */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </>
  );
}