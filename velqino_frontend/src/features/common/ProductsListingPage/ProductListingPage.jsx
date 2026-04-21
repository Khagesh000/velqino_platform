'use client'

import React, { useState } from 'react'
import ProductTopBar from './Components/ProductTopBar'
import ProductFilters from './Components/ProductFilters'
import ProductGrid from './Components/ProductGrid'
import { X } from '../../../utils/icons'
import Navbar from '../Navbar'

export default function ProductListingPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br mt-10 from-primary-50 to-secondary-50 pt-20">
        <div className="px-4 py-4 sm:py-6 lg:px-8 xl:px-12">
          
          <div className="lg:px-8 xl:px-12">
            <ProductTopBar onMobileFilterClick={() => setShowMobileFilters(true)} />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:flex-row gap-6 mt-6">
            <div className="lg:w-80 flex-shrink-0">
              <ProductFilters />
            </div>
            <div className="flex-1">
              <ProductGrid />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mt-4">
            <ProductGrid />
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto animate-slideInRight">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-1 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <ProductFilters />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}