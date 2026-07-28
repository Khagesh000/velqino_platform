"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, Eye, GitCompare, X, Clock, ChevronRight } from '../../../../utils/icons';
import Link from 'next/link';

export default function FloatingElements({ allProducts = [] }) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

  // Load recently viewed products
  const loadRecentProducts = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;

      if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0]?.id) {
        setRecentProducts(parsed.slice(0, 6));
      } else if (allProducts.length > 0) {
        const matched = parsed
          .map(id => allProducts.find(p => p.id === id))
          .filter(Boolean)
          .slice(0, 6);
        setRecentProducts(matched);
      }
    } catch {
      setRecentProducts([]);
    }
  };

  useEffect(() => {
    loadRecentProducts();
  }, [allProducts]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorage = () => loadRecentProducts();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [allProducts]);

  // Back to top on scroll
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const openWhatsApp = () => {
    window.open('https://wa.me/911234567890?text=Hello! I need assistance.', '_blank');
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentProducts([]);
    setShowRecentlyViewed(false);
  };

  const getImageUrl = (product) => {
    return product?.primary_image
      || product?.image
      || product?.images?.[0]?.image
      || '/images/placeholder.jpg';
  };

  return (
    <>
      {/* ── Back to Top ── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-20 right-4 sm:right-6 z-[9999] w-11 h-11 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          style={{ animation: 'fadeInUp 0.3s ease-out' }}
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* ── WhatsApp Chat (ALWAYS VISIBLE) ── */}
      <div className="fixed right-4 sm:right-6 z-[9999]" style={{ bottom: '20px' }}>
        <button
          onClick={openWhatsApp}
          aria-label="WhatsApp support"
          className="w-11 h-11 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* ── Recently Viewed Side Panel ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 transition-transform duration-300 ease-in-out">
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${showRecentlyViewed ? '0px' : '-256px'})` }}
        >
          <div className="w-64 bg-white rounded-r-2xl shadow-2xl border border-l-0 border-gray-100 overflow-hidden flex flex-col max-h-[65vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-primary-500 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-white/80" />
                <span className="text-sm font-semibold text-white">Recently Viewed</span>
                {recentProducts.length > 0 && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {recentProducts.length}
                  </span>
                )}
              </div>
              <button
                onClick={clearRecentlyViewed}
                className="text-white/70 hover:text-white text-xs font-medium hover:bg-white/10 px-2 py-0.5 rounded-lg transition-all"
              >
                Clear
              </button>
            </div>

            {/* Product List */}
            {recentProducts.length > 0 ? (
              <div className="overflow-y-auto flex-1 p-2 space-y-1.5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
              >
                {recentProducts.map((product, index) => (
                  <Link
                    key={product?.id || index}
                    href={`/product/productlistingpage?product_id=${product.id}`}
                    onClick={() => setShowRecentlyViewed(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        src={getImageUrl(product)}
                        alt={product?.name || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                        {product?.name || 'Product'}
                      </p>
                      <p className="text-xs font-bold text-primary-600">
                        ₹{product?.price?.toLocaleString() || 0}
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-primary-400 flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Eye size={18} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 font-medium">No recently viewed products</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Products you view will appear here</p>
              </div>
            )}

            {/* Footer */}
            {recentProducts.length > 0 && (
              <div className="border-t border-gray-100 px-3 py-2 flex-shrink-0">
                <Link
                  href="/product/productlistingpage"
                  onClick={() => setShowRecentlyViewed(false)}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1 transition-colors"
                >
                  View All Products
                  <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Toggle Tab */}
          <button
            onClick={() => setShowRecentlyViewed(!showRecentlyViewed)}
            className="absolute -right-9 top-1/2 -translate-y-1/2 w-9 h-16 bg-primary-500 hover:bg-primary-600 text-white rounded-r-xl flex flex-col items-center justify-center gap-1 shadow-lg transition-all hover:w-10 group"
            aria-label="Toggle recently viewed"
          >
            <Eye size={14} className="group-hover:scale-110 transition-transform" />
            {recentProducts.length > 0 && (
              <span className="text-[9px] font-bold bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">
                {recentProducts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Compare Widget ── */}
      {showCompare && (
        <div
          className="fixed bottom-6 right-20 z-[9999] w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-primary-500">
            <div className="flex items-center gap-2">
              <GitCompare size={14} className="text-white" />
              <span className="text-sm font-semibold text-white">Compare Products</span>
            </div>
            <button
              onClick={() => setShowCompare(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-all"
            >
              <X size={14} />
            </button>
          </div>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <GitCompare size={18} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 font-medium mb-3">No products added to compare</p>
            <Link
              href="/product/productlistingpage"
              className="block w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}