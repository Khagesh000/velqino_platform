"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Sparkles,
  Maximize2,
  CheckCircle,
  FileText,
  Building,
  RotateCcw,
  Package
} from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2.8);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef(null);
  const scrollRef = useRef(null);

  // Helper to resolve clean Cloudinary / backend URL
  const resolveImageUrl = (imgObj) => {
    if (!imgObj) return '/images/placeholder.jpg';
    const rawUrl = typeof imgObj === 'string' ? imgObj : imgObj.image || imgObj.url || '';
    if (!rawUrl) return '/images/placeholder.jpg';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    return `${BASE_IMAGE_URL}${rawUrl}`;
  };

  // Compile full image list
  const rawImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : product?.primary_image
      ? [{ image: product.primary_image }]
      : [];

  const images = rawImages.map((img, idx) => ({
    id: idx,
    url: resolveImageUrl(img),
    alt: product?.name || 'Wholesale Lot'
  }));

  if (images.length === 0) {
    images.push({ 
      id: 0, 
      url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80', 
      alt: product?.name || 'Wholesale Lot' 
    });
  }

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate cursor relative to container
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    
    // Percentage for background-position or transform-origin
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setCursorPos({ x, y });
    setLensPos({ x: percentX, y: percentY });
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

  const scrollThumbnails = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -120 : 120,
      behavior: 'smooth'
    });
  };

  const goNext = (e) => {
    e?.stopPropagation();
    setSelectedImage(prev => (prev + 1) % images.length);
  };

  const goPrev = (e) => {
    e?.stopPropagation();
    setSelectedImage(prev => (prev - 1 + images.length) % images.length);
  };

  const currentImg = images[selectedImage] || images[0];

  return (
    <div className="sticky top-20 flex flex-col justify-between space-y-4">
      
      {/* 1. Main Portrait Stage & Advanced Loupe Magnifier */}
      <div className="relative">
        <div 
          ref={imageContainerRef}
          className="relative aspect-[3/4] max-h-[580px] w-full bg-gradient-to-b from-[#FBF8F4] via-[#F7F2EB] to-[#F2EAE0] rounded-3xl overflow-hidden border-2 border-primary-200/90 shadow-xs group select-none flex items-center justify-center cursor-crosshair"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Base Product Image */}
          <img
            src={currentImg.url}
            alt={currentImg.alt}
            className="w-full h-full object-contain object-center p-3 transition-transform duration-150"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Advanced Lens Overlay (Visual Loupe on Image) */}
          {isZooming && (
            <div 
              className="absolute pointer-events-none rounded-2xl border-2 border-primary-600 bg-primary-600/10 shadow-lg backdrop-brightness-105 transition-opacity duration-150 z-20"
              style={{
                width: '140px',
                height: '140px',
                left: `${cursorPos.x - 70}px`,
                top: `${cursorPos.y - 70}px`,
              }}
            />
          )}

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-2 z-10 pointer-events-none">
            <span className="bg-primary-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-primary-700/60 shadow-xs flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-400" />
              <span>Authentic Factory Lot</span>
            </span>

            {product?.discount > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs self-start">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Top Right Controls: Counter & Fullscreen Modal Trigger */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
            {images.length > 1 && (
              <span className="bg-black/55 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none shadow-xs">
                {selectedImage + 1} / {images.length}
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-primary-900 flex items-center justify-center shadow-md border border-primary-200/90 transition-all hover:scale-110 cursor-pointer"
              title="Open Fullscreen View"
            >
              <Maximize2 size={13} />
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 hover:bg-white text-primary-900 rounded-full flex items-center justify-center shadow-md border border-primary-200/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
                title="Previous photo"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 hover:bg-white text-primary-900 rounded-full flex items-center justify-center shadow-md border border-primary-200/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
                title="Next photo"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Advanced Zoom Level Selector Toolbar */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <ZoomIn size={12} className="text-amber-400" />
              <span>Hover for Fabric Weave Magnifier</span>
            </div>

            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-primary-200/90 shadow-sm">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setZoomLevel(2.0); }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${zoomLevel === 2.0 ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-700'}`}
              >
                2x
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setZoomLevel(3.2); }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${zoomLevel === 3.2 ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-700'}`}
              >
                3.2x Macro
              </button>
            </div>
          </div>

        </div>

        {/* 2. Floating High-Definition Zoom Preview Box (Amazon / Luxury Flyout Zoom) */}
        {isZooming && (
          <div 
            className="hidden lg:block absolute left-full top-0 ml-4 w-[480px] h-[580px] rounded-3xl overflow-hidden border-2 border-primary-300 bg-white shadow-2xl z-40 pointer-events-none"
            style={{
              backgroundImage: `url(${currentImg.url})`,
              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute top-3 left-3 bg-primary-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary-700/60 shadow-xs flex items-center gap-1">
              <span>🔬 High-Def Fabric Weave Preview ({zoomLevel}x)</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Thumbnail Track */}
      {images.length > 1 && (
        <div className="relative pt-0.5">
          {images.length > 5 && (
            <button
              type="button"
              onClick={() => scrollThumbnails('left')}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-primary-200 rounded-full flex items-center justify-center shadow-xs hover:border-primary-400 hover:shadow-md transition-all cursor-pointer text-primary-900"
            >
              <ChevronLeft size={13} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth px-1"
          >
            {images.map((image, index) => {
              const isSelected = selectedImage === index;
              return (
                <button
                  key={image.id || index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-18 sm:w-18 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer relative bg-gradient-to-b from-[#FAF6F0] to-[#F5ECE0] p-1
                    ${isSelected
                      ? 'border-primary-600 ring-2 ring-primary-300/70 shadow-sm scale-102'
                      : 'border-primary-100 hover:border-primary-300 opacity-75 hover:opacity-100'
                    }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </button>
              );
            })}
          </div>

          {images.length > 5 && (
            <button
              type="button"
              onClick={() => scrollThumbnails('right')}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-primary-200 rounded-full flex items-center justify-center shadow-xs hover:border-primary-400 hover:shadow-md transition-all cursor-pointer text-primary-900"
            >
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* 4. Verified Mill Lot Inspection & Quality Assurance Card (Balances Height with Right Panel) */}
      <div className="p-4 bg-white rounded-2xl border-2 border-primary-100/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-primary-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
            <Building size={14} className="text-primary-700" />
            <span>Mill Lot Verification Certificate</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle size={10} />
            <span>Passed QC</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
            <span>Batch ID: <strong>{product?.sku || 'VEL-LOT-91'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
            <span>Inspection: <strong>Pre-Dispatch Certified</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Escrow Lock: <strong>Trade Guaranteed</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
            <span>Packaging: <strong>Moisture-Proof Poly</strong></span>
          </div>
        </div>
      </div>

      {/* 5. High-Resolution Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 w-11 h-11 bg-white/15 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
            title="Close Lightbox"
          >
            <X size={20} />
          </button>

          <div 
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImg.url}
              alt={currentImg.alt}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="mt-4 text-center text-white/90 text-sm font-medium">
              <span>{product?.name}</span>
              <span className="mx-2 text-white/40">•</span>
              <span>Photo {selectedImage + 1} of {images.length}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}