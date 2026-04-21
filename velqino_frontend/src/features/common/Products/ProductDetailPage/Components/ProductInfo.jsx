"use client";

import React, { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Zap, Check, Truck, RotateCcw, Shield, Minus, Plus, Loader2 } from '../../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { toast } from 'react-toastify';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.size || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.primary_color || 'black');
  const [isWishlist, setIsWishlist] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  // Get product data from props
  const price = product?.price || 0;
  const originalPrice = product?.compare_price || product?.price * 2;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const youSave = originalPrice - price;
  const rating = product?.rating || 4.5;
  const reviews = product?.reviews || 0;
  const stock = product?.stock || 0;
  const isInStock = stock > 0;
  const soldCount = product?.sold_count || 1245;

  // Get sizes from variants
  const sizes = product?.variants?.map(v => v.size).filter((v, i, a) => a.indexOf(v) === i) || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  // Get colors from product
  const colors = [
    { name: 'Black', value: 'black', class: 'bg-gray-900' },
    { name: 'White', value: 'white', class: 'bg-white border border-gray-300' },
    { name: 'Navy', value: 'navy', class: 'bg-blue-900' },
    { name: 'Red', value: 'red', class: 'bg-red-600' },
  ];

  const handlePinCheck = () => {
    if (pinCode.length === 6) {
      setPinMessage('✓ Delivery available to this location');
      setTimeout(() => setPinMessage(''), 3000);
    } else {
      setPinMessage('✗ Please enter valid 6-digit PIN code');
      setTimeout(() => setPinMessage(''), 3000);
    }
  };

  const handleAddToCart = async () => {
    if (!isInStock) return;
    
    try {
        await addToCart({
        product_id: product.id,
        quantity: quantity,
        selected_size: selectedSize,
        selected_color: selectedColor
        }).unwrap();
        
        toast.success(`${product.name} added to cart!`);
    } catch (error) {
        toast.error(error?.data?.message || 'Failed to add to cart');
    }
    };

  return (
    <div className="space-y-4 sm:space-y-5">
  {/* Brand */}
  <div className="text-xs sm:text-sm text-primary-600 font-semibold sm:font-medium uppercase tracking-wide">
    {product?.brand || 'Premium Brand'}
  </div>

  {/* Title */}
  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
    {product?.name}
  </h1>

  {/* Rating */}
  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
    <span className="text-xs sm:text-sm text-gray-600">{rating} ({reviews} reviews)</span>
    <span className="text-xs sm:text-sm text-green-600">| {soldCount.toLocaleString()} sold</span>
  </div>

  {/* Price */}
  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
    <span className="text-2xl sm:text-3xl font-bold text-primary-600">₹{price.toLocaleString()}</span>
    {originalPrice > price && (
      <>
        <span className="text-base sm:text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-lg">
          {discount}% OFF
        </span>
      </>
    )}
  </div>
  
  {/* You Save */}
  {youSave > 0 && (
    <div className="text-xs sm:text-sm text-green-600 bg-green-50 inline-block px-3 py-1.5 rounded-lg font-medium">
      You save: ₹{youSave.toLocaleString()}
    </div>
  )}

  {/* Size Selector */}
  {sizes.length > 0 && (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base font-medium text-gray-700">Select Size</span>
        <button className="text-xs sm:text-sm text-primary-600 hover:text-primary-700">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border font-medium text-sm transition-all ${
              selectedSize === size
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-gray-200 hover:border-primary-300 text-gray-600'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* Color Selector */}
  <div className="space-y-2 sm:space-y-3">
    <span className="text-sm sm:text-base font-medium text-gray-700">Select Color</span>
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => setSelectedColor(color.value)}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${color.class} transition-all ${
            selectedColor === color.value
              ? 'ring-2 ring-offset-2 ring-primary-500'
              : 'ring-1 ring-gray-200'
          }`}
          title={color.name}
        />
      ))}
    </div>
  </div>

  {/* Stock Status */}
  <div className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-lg ${isInStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
    <Check size={16} className="sm:w-4 sm:h-4" />
    <span className="text-sm sm:text-base font-medium">
      {isInStock ? `In Stock (${stock} units available)` : 'Out of Stock'}
    </span>
  </div>

  {/* Quantity Selector */}
  {isInStock && (
    <div className="space-y-2 sm:space-y-3">
      <span className="text-sm sm:text-base font-medium text-gray-700">Quantity</span>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary-500 transition-all"
        >
          <Minus size={14} className="sm:w-4 sm:h-4" />
        </button>
        <span className="w-10 sm:w-12 text-center font-semibold text-base sm:text-lg">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary-500 transition-all"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
        </button>
        <span className="text-xs sm:text-sm text-gray-400">(Max {stock})</span>
      </div>
    </div>
  )}

  {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-3 pt-4">
  <button 
    onClick={handleAddToCart}
    disabled={!isInStock || isAddingToCart}
    className={`flex-1 py-3 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-95 ${
      isInStock && !isAddingToCart
        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-primary-50 hover:from-primary-600 hover:to-primary-700' 
        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
    }`}
  >
    {isAddingToCart ? (
      <Loader2 size={18} className="animate-spin" />
    ) : (
      <ShoppingCart size={18} />
    )}
    <span className="font-medium">{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
  </button>
  
  <button 
    disabled={!isInStock}
    className={`flex-1 py-3 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-95 ${
      isInStock 
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700' 
        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
    }`}
  >
    <Zap size={18} />
    <span className="font-medium">Buy Now</span>
  </button>
  
  <div className="flex gap-2">
    <button
      onClick={() => setIsWishlist(!isWishlist)}
      className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-red-300 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
    >
      <Heart 
        size={18} 
        className={`transition-all duration-300 ${
          isWishlist 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-500 group-hover:text-red-500'
        }`} 
      />
    </button>
    
    <button className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 active:scale-95 group">
      <Share2 size={18} className="text-gray-500 group-hover:text-primary-500 transition-colors" />
    </button>
  </div>
</div>

  {/* Delivery Info */}
  <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-gray-100">
    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
      <Truck size={14} className="text-primary-500 sm:w-4 sm:h-4" />
      <span>Free delivery on orders above ₹999</span>
    </div>
    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
      <RotateCcw size={14} className="text-primary-500 sm:w-4 sm:h-4" />
      <span>30 days easy returns</span>
    </div>
    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
      <Shield size={14} className="text-primary-500 sm:w-4 sm:h-4" />
      <span>2 year warranty</span>
    </div>
  </div>

  {/* PIN Code Check */}
  <div className="pt-2 sm:pt-4">
    <div className="flex gap-2 sm:gap-3">
      <input
        type="text"
        placeholder="Enter PIN code"
        value={pinCode}
        onChange={(e) => setPinCode(e.target.value)}
        maxLength={6}
        className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary-500"
      />
      <button 
        onClick={handlePinCheck}
        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-500 hover:text-white transition-all text-sm sm:text-base font-medium"
      >
        Check
      </button>
    </div>
    {pinMessage && (
      <p className={`text-xs sm:text-sm mt-2 ${pinMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
        {pinMessage}
      </p>
    )}
  </div>
</div>
  );
}