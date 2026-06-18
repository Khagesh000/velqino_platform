"use client";

import React, { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Zap, Check, Truck, RotateCcw, Shield, Minus, Plus, Loader2 } from '../../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { toast } from 'react-toastify';

export default function ProductInfo({ product }) {
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  const isBulkBuyer = userRole === 'retailer' || userRole === 'wholesaler';
  const minOrderQty = product?.min_order_qty || 1;

  const [quantity, setQuantity] = useState(isBulkBuyer ? minOrderQty : 1);
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
    <div className="space-y-5">

  {/* Brand */}
  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full">
    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
    <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
      {product?.brand || 'Premium Brand'}
    </span>
  </div>

  {/* Title */}
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
    {product?.name}
  </h1>

  {/* Rating */}
  <div className="flex flex-wrap items-center gap-3">
    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-lg">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
        ))}
      </div>
      <span className="text-xs font-bold text-yellow-700 ml-1">{rating}</span>
    </div>
    <span className="text-xs text-gray-500 font-medium">{reviews} reviews</span>
    <div className="w-px h-3.5 bg-gray-200" />
    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
      {soldCount.toLocaleString()} sold
    </span>
  </div>

  {/* Price */}
  <div className="flex flex-wrap items-baseline gap-3 py-4 px-4 bg-gray-50 rounded-2xl border border-gray-100">
    <span className="text-3xl sm:text-4xl font-bold text-primary-600">₹{price.toLocaleString()}</span>
    {originalPrice > price && (
      <>
        <span className="text-base text-gray-400 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
        <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
          {discount}% OFF
        </span>
      </>
    )}
    {youSave > 0 && (
      <span className="ml-auto text-xs text-green-600 font-semibold bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
        You save ₹{youSave.toLocaleString()}
      </span>
    )}
  </div>

  {/* Min Order Badge */}
  {isBulkBuyer && minOrderQty > 1 && (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-50 border border-orange-200 rounded-xl">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
      <span className="text-xs font-semibold text-orange-600">
        Minimum Order: {minOrderQty} pieces
      </span>
    </div>
  )}

  {/* Size Selector */}
  {sizes.length > 0 && (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Select Size</span>
        <button className="text-xs text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2 transition-colors">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-10 h-10 rounded-xl border-2 font-semibold text-sm transition-all duration-200
              ${selectedSize === size
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-100 scale-105'
                : 'border-gray-200 hover:border-primary-300 text-gray-600 hover:scale-105'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* Color Selector */}
  <div className="space-y-2.5">
    <span className="text-sm font-semibold text-gray-800">Select Color</span>
    <div className="flex flex-wrap gap-2.5">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => setSelectedColor(color.value)}
          title={color.name}
          className={`w-8 h-8 rounded-full ${color.class} transition-all duration-200 hover:scale-110
            ${selectedColor === color.value
              ? 'ring-2 ring-offset-2 ring-primary-500 scale-110'
              : 'ring-1 ring-gray-300 ring-offset-1'
            }`}
        />
      ))}
    </div>
  </div>

  {/* Stock Status */}
  <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${isInStock ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
    <span className="text-sm font-semibold">
      {isInStock ? `In Stock — ${stock} units available` : 'Out of Stock'}
    </span>
  </div>

  {/* Quantity Selector */}
  {isInStock && (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Quantity</span>
        {isBulkBuyer && minOrderQty > 1 && (
          <span className="text-xs text-orange-600 font-medium">Min: {minOrderQty} pcs</span>
        )}
      </div>
      <div className="flex items-center gap-0 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setQuantity(Math.max(isBulkBuyer ? minOrderQty : 1, quantity - 1))}
          disabled={quantity <= (isBulkBuyer ? minOrderQty : 1)}
          className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 border border-gray-200"
        >
          <Minus size={14} className="text-gray-700" />
        </button>
        <span className="w-12 text-center font-bold text-base text-gray-900">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          disabled={quantity >= stock}
          className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 border border-gray-200"
        >
          <Plus size={14} className="text-gray-700" />
        </button>
        <span className="text-xs text-gray-400 font-medium ml-3 mr-1">Max {stock}</span>
      </div>
    </div>
  )}

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-3 pt-2">
    <button
      onClick={handleAddToCart}
      disabled={!isInStock || isAddingToCart}
      className={`flex-1 py-3.5 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm
        ${isInStock && !isAddingToCart
          ? 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
    >
      {isAddingToCart ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
    </button>

    <button
      disabled={!isInStock}
      className={`flex-1 py-3.5 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm
        ${isInStock
          ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
    >
      <Zap size={18} />
      Buy Now
    </button>

    <div className="flex gap-2">
      <button
        onClick={() => setIsWishlist(!isWishlist)}
        className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-105
          ${isWishlist
            ? 'border-red-300 bg-red-50 text-red-500'
            : 'border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400'
          }`}
      >
        <Heart size={18} className={isWishlist ? 'fill-red-500 text-red-500' : ''} />
      </button>
      <button className="w-12 h-12 rounded-2xl border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50 flex items-center justify-center transition-all duration-200 hover:scale-105 text-gray-400 hover:text-primary-500">
        <Share2 size={18} />
      </button>
    </div>
  </div>

  {/* Delivery Info */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100">
    {[
      { icon: Truck, text: 'Free delivery above ₹999' },
      { icon: RotateCcw, text: '30 days easy returns' },
      { icon: Shield, text: '2 year warranty' },
    ].map(({ icon: Icon, text }) => (
      <div key={text} className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
          <Icon size={13} className="text-primary-600" />
        </div>
        <span className="text-xs text-gray-600 font-medium leading-tight">{text}</span>
      </div>
    ))}
  </div>

  {/* PIN Code Check */}
  <div className="pt-1">
    <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Check Delivery</p>
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-200">
      <input
        type="text"
        placeholder="Enter 6-digit PIN code"
        value={pinCode}
        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        maxLength={6}
        className="flex-1 px-3.5 py-2.5 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={handlePinCheck}
        className="flex-shrink-0 m-1.5 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-lg transition-all"
      >
        Check
      </button>
    </div>
    {pinMessage && (
      <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${pinMessage.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>
        {pinMessage}
      </p>
    )}
  </div>
</div>
  );
}
