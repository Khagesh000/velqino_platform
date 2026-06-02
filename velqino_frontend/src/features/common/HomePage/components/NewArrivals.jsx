"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Sparkles, ChevronRight } from '../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/redux/wholesaler/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductCard = memo(({ product, index, wishlistIds = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(() => {
  const productId = Number(product?.id);
  const isInWishlist = wishlistIds?.includes(productId);
  return isInWishlist || false;
});
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  // Calculate if product is new (less than 7 days old)
  const isNewProduct = () => {
  return true; // Always show NEW badge for all products
};

  useEffect(() => {
    const productId = Number(product?.id);
    setIsWishlist(wishlistIds?.includes(productId) || false);
  }, [wishlistIds, product?.id]);


  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
        selected_size: '',
        selected_color: ''
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistClick = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isWishlist;
    setIsWishlist(newState);
    try {
      if (isWishlist) {
        await removeFromWishlist(product.id).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      setIsWishlist(!newState);
      toast.error(error?.data?.message || 'Please login to add to wishlist');
    }
  };

  return (
    <div
  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  style={{ animationDelay: `${index * 0.05}s` }}
>
  <div className="relative aspect-square overflow-hidden bg-gray-100">
    <Link href={`/product/productlistingpage?product_id=${product.id}`}>
      <div className="relative w-full h-full">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={product.image || product.primary_image || product.images?.[0]?.image || '/images/products/placeholder.jpg'}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => { e.target.src = '/images/products/placeholder.jpg' }}
        />
      </div>
    </Link>
    
    {/* New Badge */}
    {isNewProduct() && (
      <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-10">
        <Sparkles size={10} />
        <span>NEW</span>
      </div>
    )}
    
    {/* Wishlist Button */}
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleWishlistClick(e, product);
      }}
      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-20"
    >
      <Heart size={16} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
    </button>
    
    {/* Quick View */}
    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 z-10 ${
      isHovered ? 'opacity-100' : 'opacity-0'
    }`}>
      <Link href={`/product/productlistingpage?product_id=${product.id}`}>
        <button className="bg-white text-primary-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-950 hover:text-primary-500 transition-all duration-300 cursor-pointer">
          Quick View
        </button>
      </Link>
    </div>
  </div>

  <div className="p-3">
    <Link href={`/product/productlistingpage?product_id=${product.id}`}>
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1 hover:text-primary-600 transition-colors">
        {product.name}
      </h3>
    </Link>
    
    <div className="flex items-center gap-1 mb-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
      <span className="text-xs text-gray-500">(New)</span>
    </div>

    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg font-bold text-primary-600">₹{product.display_price || product.price}</span>
      {product.retail_price > product.price && (
        <span className="text-xs text-gray-400 line-through">₹{product.retail_price}</span>
      )}
    </div>

    <button
      onClick={(e) => handleAddToCart(e, product)}
      disabled={isAddingToCart}
      className="w-full py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
    >
      <ShoppingCart size={14} />
      <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
    </button>
  </div>
</div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function NewArrivals({ products = [], loading = false, wishlistIds = [] }) {
  const [visibleProducts, setVisibleProducts] = useState([]);

  

  useEffect(() => {
    if (products.length > 0 && visibleProducts.length === 0) {
      setVisibleProducts(products.slice(0, 6));
      const timer = setTimeout(() => {
        setVisibleProducts(products);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [products, visibleProducts.length]);

  if (loading) {
    return <SectionPlaceholder height="h-80" />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="new-arrivals-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={24} className="text-primary-500" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              New <span className="text-primary-500">Arrivals</span>
            </h2>
          </div>
          <p className="text-sm text-gray-500">Fresh from the collection. Be the first to shop!</p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} wishlistIds={wishlistIds} />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/product/productlistingpage?season=new"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-950 hover:text-primary-500 transition-all duration-300 group"
          >
            <span>Shop New Arrivals</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}