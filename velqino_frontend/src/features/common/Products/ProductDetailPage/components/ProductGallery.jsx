"use client";

import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const scrollRef = useRef(null);

  const images = product?.images?.map((img, idx) => ({
    id: idx,
    url: `${BASE_IMAGE_URL}${img.image}`,
    alt: product.name,
    loading: idx === 0 ? "eager" : "lazy"
  })) || [];

  if (images.length === 0) {
    images.push({ id: 0, url: '/images/placeholder.jpg', alt: product?.name || 'Product' });
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const scrollThumbnails = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -120 : 120,
      behavior: 'smooth'
    });
  };

  const goNext = () => setSelectedImage(prev => (prev + 1) % images.length);
  const goPrev = () => setSelectedImage(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className="sticky top-24 space-y-3">

      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
        <img
          src={images[selectedImage]?.url}
          alt={images[selectedImage]?.alt}
          className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          style={{
            transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            transition: isZoomed ? 'transform-origin 0s' : 'transform 0.3s ease'
          }}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => { setIsZoomed(false); setZoomPosition({ x: 50, y: 50 }); }}
          onMouseMove={handleMouseMove}
          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product?.is_new && (
            <span className="bg-primary-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">NEW</span>
          )}
          {product?.discount > 0 && (
            <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm z-10 pointer-events-none">
            {selectedImage + 1} / {images.length}
          </div>
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft size={16} className="text-gray-700" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <ChevronRight size={16} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:scale-110 transition-all"
          >
            <ZoomIn size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Zoom hint */}
        {!isZoomed && (
          <div className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Hover to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative">
          {images.length > 4 && (
            <button
              onClick={() => scrollThumbnails('left')}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-primary-300 hover:shadow-md transition-all"
            >
              <ChevronLeft size={13} className="text-gray-600" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto pb-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200
                  ${selectedImage === index
                    ? 'border-primary-500 shadow-md shadow-primary-100 scale-105'
                    : 'border-gray-200 hover:border-primary-300 hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              </button>
            ))}
          </div>

          {images.length > 4 && (
            <button
              onClick={() => scrollThumbnails('right')}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-primary-300 hover:shadow-md transition-all"
            >
              <ChevronRight size={13} className="text-gray-600" />
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <img
            src={images[selectedImage]?.url}
            alt={images[selectedImage]?.alt}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}