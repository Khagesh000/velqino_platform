"use client";

import React, { useState, useRef } from 'react';
import { ZoomIn } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const scrollRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 100;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Get images from product data
  const images = product?.images?.map((img, idx) => ({
    id: idx,
    url: `${BASE_IMAGE_URL}${img.image}`,
    alt: product.name
  })) || [];

  // If no images, use placeholder
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

  return (
    <div className="sticky top-24">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[selectedImage]?.url}
          alt={images[selectedImage]?.alt}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          }}
          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
        />
        <button className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all">
          <ZoomIn size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-primary-500 shadow-md' 
                  : 'border-gray-200 hover:border-primary-300'
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
        {/* Scroll buttons */}
        {images.length > 4 && (
          <>
            <button 
              onClick={() => scrollThumbnails('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            >
              ‹
            </button>
            <button 
              onClick={() => scrollThumbnails('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            >
              ›
            </button>
          </>
        )}
      </div>
    )}
    </div>
  );
}