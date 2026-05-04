"use client"

import React, { useState, useEffect } from 'react'
import { FolderTree, ChevronRight, ChevronDown, Plus, Edit, Trash2, Search, Package, TrendingUp } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/Categories.scss'

export default function Categories({ onSelectCategory, selectedCategory }) {
  const [mounted, setMounted] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState([1])
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredCategory, setHoveredCategory] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const categories = [
    { 
      id: 1, name: 'Electronics', slug: 'electronics', productCount: 45, 
      children: [
        { id: 11, name: 'Mobile Phones', slug: 'mobile-phones', productCount: 12, children: [] },
        { id: 12, name: 'Laptops', slug: 'laptops', productCount: 8, children: [] },
        { id: 13, name: 'Audio', slug: 'audio', productCount: 15, 
          children: [
            { id: 131, name: 'Headphones', slug: 'headphones', productCount: 7, children: [] },
            { id: 132, name: 'Speakers', slug: 'speakers', productCount: 5, children: [] }
          ] 
        }
      ]
    },
    { id: 2, name: 'Clothing', slug: 'clothing', productCount: 78, 
      children: [
        { id: 21, name: 'Men', slug: 'men', productCount: 32, children: [] },
        { id: 22, name: 'Women', slug: 'women', productCount: 46, children: [] }
      ]
    },
    { id: 3, name: 'Home Decor', slug: 'home-decor', productCount: 23, children: [] },
    { id: 4, name: 'Fitness', slug: 'fitness', productCount: 34, children: [] },
    { id: 5, name: 'Stationery', slug: 'stationery', productCount: 18, children: [] },
  ]

  const handleToggleExpand = (categoryId) => {
    if (expandedNodes.includes(categoryId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== categoryId))
    } else {
      setExpandedNodes([...expandedNodes, categoryId])
    }
  }

  const filterCategories = (cats, query) => {
    if (!query) return cats
    return cats.filter(cat => {
      const matches = cat.name.toLowerCase().includes(query.toLowerCase())
      const childrenMatch = filterCategories(cat.children || [], query)
      if (childrenMatch.length > 0) {
        cat.children = childrenMatch
        return true
      }
      return matches
    }).map(cat => ({ ...cat }))
  }

  const filteredCategories = filterCategories([...categories], searchQuery)

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0)

  const renderCategoryTree = (cats, level = 0) => {
    return cats.map(category => (
      <div key={category.id}>
        <div
          className={`category-item ${hoveredCategory === category.id ? 'bg-gray-50' : ''} ${
            selectedCategory === category.id ? 'bg-primary-50 border-l-primary-500' : ''
          }`}
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <div 
            className="flex items-center justify-between py-2 px-2 cursor-pointer rounded-lg transition-all"
            onClick={() => onSelectCategory?.(category.id)}
          >
            <div className="flex items-center gap-2 flex-1">
              {category.children?.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleExpand(category.id)
                  }}
                  className="p-0.5 text-gray-400 hover:text-gray-600"
                >
                  {expandedNodes.includes(category.id) ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <span className="w-5" />
              )}
              
              <FolderTree size={14} className="text-gray-400" />
              
              <span className={`text-sm font-medium ${selectedCategory === category.id ? 'text-primary-600' : 'text-gray-700'}`}>
                {category.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{category.productCount}</span>
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(category.productCount / totalProducts) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {expandedNodes.includes(category.id) && category.children?.length > 0 && (
          <div className="category-children">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="categories bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderTree size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Categories</h3>
          </div>
          <button className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
            <Plus size={14} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Categories Tree */}
      <div className="p-2 max-h-[400px] overflow-y-auto custom-scroll">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <FolderTree size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No categories found</p>
          </div>
        ) : (
          renderCategoryTree(filteredCategories)
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={12} className="text-gray-400" />
            <span className="text-xs text-gray-600">Total Categories</span>
            <span className="text-xs font-semibold text-gray-900">{categories.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={10} className="text-green-500" />
            <span className="text-[10px] text-gray-500">+2 this month</span>
          </div>
        </div>
      </div>
    </div>
  )
}