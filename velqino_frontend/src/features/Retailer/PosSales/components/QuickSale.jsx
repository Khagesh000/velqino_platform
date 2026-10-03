"use client";

import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Scan, 
  Plus, 
  Check, 
  Package, 
  Sparkles, 
  X, 
  Tag, 
  Filter,
  CheckCircle,
  AlertCircle
} from '../../../../utils/icons';
import { useGetRetailerProductsQuery } from '@/redux/retailer/slices/retailerProductsSlice';

export default function QuickSale({ 
  cart = [], 
  onAddToCart, 
  searchQuery = '', 
  setSearchQuery,
  activeCategory = 'All',
  setActiveCategory
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const searchInputRef = useRef(null);

  // Ingest real products from RTK Query catalog slice
  const { data: apiResponse, isLoading, isError } = useGetRetailerProductsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  // Extract products directly from backend response:
  // Backend returns: { status: "success", data: { products: [ ... ] } }
  const products = useMemo(() => {
    const rawList = apiResponse?.data?.products 
      || apiResponse?.products 
      || (Array.isArray(apiResponse?.data) ? apiResponse?.data : []);

    if (!Array.isArray(rawList)) return [];

    return rawList.map((p, idx) => {
      // Primary Cloudinary image URL from backend response
      const imageSrc = p.primary_image 
        || p.image 
        || p.image_url 
        || p.images?.[0]?.image 
        || p.images?.[0]?.image_url 
        || null;

      const price = Number(p.display_price ?? p.price ?? p.selling_price ?? p.retail_price ?? 0);
      const stock = Number(p.stock ?? p.stock_quantity ?? p.currentStock ?? 0);
      const category = p.category_name || p.category || 'General';

      return {
        id: p.id || idx + 1,
        name: p.name || p.slug || `Product #${p.id || idx + 1}`,
        sku: p.sku || `SKU-${p.id || idx + 1}`,
        price,
        stock,
        category,
        barcode: p.barcode || p.sku || '',
        image: imageSrc
      };
    });
  }, [apiResponse]);

  // Extract unique categories dynamically from real backend products
  const categories = useMemo(() => {
    const unique = new Set(['All']);
    products.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return Array.from(unique);
  }, [products]);

  // Filter products by search query and active category
  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (activeCategory && activeCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  // Handle barcode simulation scan
  const handleScanProduct = (code) => {
    const matched = products.find(p => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
    if (matched) {
      handleItemClick(matched);
      setShowScanner(false);
      setSearchQuery('');
    } else {
      alert(`Barcode ${code} not found in inventory.`);
    }
  };

  const handleItemClick = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
      setRecentlyAddedId(product.id);
      setTimeout(() => setRecentlyAddedId(null), 700);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-6 shadow-2xs flex flex-col h-full">
      {/* Search & Barcode Toolbar */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <Search 
              size={18} 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by product name, SKU or barcode... (F2)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Barcode Scanner Toggle */}
          <button
            type="button"
            onClick={() => setShowScanner(!showScanner)}
            className={`
              p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 font-bold text-xs
              ${showScanner 
                ? 'bg-primary-600 text-white border-primary-600 shadow-xs' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }
            `}
            title="Toggle Barcode Camera Scanner"
          >
            <Scan size={18} />
            <span className="hidden sm:inline">Scanner</span>
          </button>
        </div>

        {/* Barcode Camera Simulation Viewfinder */}
        {showScanner && (
          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 text-white relative animate-fadeIn shadow-lg">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-emerald-400">Barcode Optical Sensor Active</span>
              </div>
              <button 
                onClick={() => setShowScanner(false)} 
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Viewfinder Target */}
            <div className="relative h-28 bg-gray-950/80 rounded-xl border border-gray-700 flex items-center justify-center overflow-hidden">
              <div className="w-48 h-16 border-2 border-primary-500/80 rounded-lg flex items-center justify-center relative">
                {/* Laser scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-sm shadow-rose-500 animate-pulse" />
                <span className="text-[11px] text-gray-400 tracking-wider">Point barcode here</span>
              </div>
            </div>

            {/* Quick Demo Scan Buttons from Real Products */}
            {products.length > 0 && (
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span className="text-[11px]">Quick Barcode Simulation:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {products.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleScanProduct(p.sku)}
                      className="px-2 py-1 bg-gray-800 hover:bg-primary-600 hover:text-white text-gray-300 rounded-lg text-[10px] font-mono transition-colors"
                    >
                      Scan {p.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Pills Bar */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-600 text-white shadow-2xs scale-102' 
                      : 'bg-gray-100 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Catalog Grid Container */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-[360px] max-h-[580px] custom-scroll">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse p-3 flex flex-col justify-between">
                <div className="h-24 bg-gray-200 rounded-xl" />
                <div className="space-y-2 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State when store has no products */
          <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-2xs mb-3">
              <Package size={26} />
            </div>
            <h4 className="text-base font-bold text-gray-900">No Products in Inventory</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Your store catalog is currently empty. Add products in Retailer Inventory to start processing sales through this register.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search Results */
          <div className="h-full flex flex-col items-center justify-center text-center py-14 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-2xs mb-3">
              <Search size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-800">No Inventory Items Match</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              No products found matching &ldquo;{searchQuery}&rdquo;. Try another SKU, product name, or select &ldquo;All&rdquo; categories.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-colors"
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const inCartItem = cart.find((i) => i.id === product.id);
              const isOut = product.stock <= 0;
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOut && handleItemClick(product)}
                  className={`
                    group relative rounded-2xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between
                    ${isOut 
                      ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed' 
                      : isJustAdded
                        ? 'border-primary-500 bg-primary-50/40 scale-102 shadow-md'
                        : 'bg-white border-gray-200/80 hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5'
                    }
                  `}
                >
                  {/* Top Thumbnail & Active Badge */}
                  <div>
                    <div className="relative w-full h-28 sm:h-32 rounded-xl bg-gray-100 overflow-hidden mb-2.5 flex items-center justify-center">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                          }}
                        />
                      ) : (
                        <Package size={28} className="text-gray-400" />
                      )}

                      {/* Stock Pill Badge */}
                      <span className={`
                        absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs backdrop-blur-xs
                        ${isOut 
                          ? 'bg-rose-100/90 text-rose-800' 
                          : product.stock < 10 
                            ? 'bg-amber-100/90 text-amber-800' 
                            : 'bg-emerald-100/90 text-emerald-800'
                        }
                      `}>
                        {isOut ? 'Out of stock' : `${product.stock} in stock`}
                      </span>

                      {/* Cart Quantity Badge if already added */}
                      {inCartItem && inCartItem.quantity > 0 && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                          {inCartItem.quantity}
                        </span>
                      )}
                    </div>

                    {/* Title & SKU */}
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                      {product.sku}
                    </p>
                  </div>

                  {/* Price & Fast Add Action */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-black text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isOut}
                      className={`
                        w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200
                        ${isOut 
                          ? 'bg-gray-100 text-gray-400' 
                          : isJustAdded 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white shadow-2xs'
                        }
                      `}
                    >
                      {isJustAdded ? <Check size={14} /> : <Plus size={14} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Catalog Footer Stats */}
      {products.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <span>Showing {filteredProducts.length} of {products.length} inventory items</span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <Sparkles size={13} className="text-primary-600" />
            <span>Tap item to add to register</span>
          </span>
        </div>
      )}
    </div>
  );
}
