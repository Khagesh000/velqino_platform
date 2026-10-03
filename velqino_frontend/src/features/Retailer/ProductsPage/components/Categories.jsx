'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Search, 
  Package, 
  Check, 
  X,
  Grid,
  Sparkles
} from '../../../../utils/icons';
import { toast } from 'react-toastify';
import { useCreateCategoryMutation } from '@/redux/wholesaler/slices/categoriesSlice';

export default function Categories({ categories = [], onSelectCategory, selectedCategory, onRefresh }) {
  const [mounted, setMounted] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggleExpand = (categoryId) => {
    if (expandedNodes.includes(categoryId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== categoryId));
    } else {
      setExpandedNodes([...expandedNodes, categoryId]);
    }
  };

  const handleAddCategory = async (e) => {
    e?.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Please enter category name');
      return;
    }
    
    try {
      await createCategory({ name: newCategoryName.trim() }).unwrap();
      toast.success(`Category "${newCategoryName}" created successfully`);
      setNewCategoryName('');
      setShowAddModal(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add category');
    }
  };

  const filterCategories = (cats, query) => {
    if (!query) return cats;
    return cats.filter(cat => {
      const matches = cat.name.toLowerCase().includes(query.toLowerCase());
      const childrenMatch = filterCategories(cat.children || [], query);
      if (childrenMatch.length > 0) return true;
      return matches;
    });
  };

  const filteredCategories = filterCategories(categories, searchQuery);
  const totalCategoryProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

  const renderCategoryTree = (cats, level = 0) => {
    return cats.map(category => {
      const isSelected = selectedCategory === category.id;
      const hasChildren = category.children?.length > 0;
      const isExpanded = expandedNodes.includes(category.id);

      return (
        <div key={category.id} className="space-y-1">
          <div
            onClick={() => onSelectCategory?.(category.id)}
            style={{ paddingLeft: `${level * 14 + 10}px` }}
            className={`
              group flex items-center justify-between py-2 pr-2.5 rounded-xl cursor-pointer transition-all duration-150
              ${isSelected 
                ? 'bg-primary-50 text-primary-900 font-bold border border-primary-200/90 shadow-2xs' 
                : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
              }
            `}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(category.id);
                  }}
                  className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-600' : 'bg-gray-300'}`} />
                </span>
              )}
              
              <span className="text-xs truncate">
                {category.name}
              </span>
            </div>
            
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
              isSelected 
                ? 'bg-primary-200/80 text-primary-900' 
                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
            }`}>
              {category.productCount ?? 0}
            </span>
          </div>

          {/* Subcategories */}
          {hasChildren && isExpanded && (
            <div className="space-y-0.5 pl-2 border-l border-gray-100">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
            <FolderTree size={16} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            Categories
          </h3>
          <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {categories.length}
          </span>
        </div>

        <button 
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-1.5 text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100/80 rounded-xl transition-all border border-primary-200"
          title="Create New Category"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
      
      {/* Category Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Filter categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* "All Categories" Root Option */}
      <div
        onClick={() => onSelectCategory?.(null)}
        className={`
          flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-150
          ${!selectedCategory 
            ? 'bg-primary-600 text-white font-bold shadow-2xs' 
            : 'text-gray-700 hover:bg-gray-100/80'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Grid size={14} className={!selectedCategory ? 'text-white' : 'text-gray-400'} />
          <span className="text-xs font-bold">All Products</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          !selectedCategory ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {totalCategoryProducts || 'All'}
        </span>
      </div>

      {/* Categories Tree Container */}
      <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <Package size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs text-gray-500 font-medium">No matching categories</p>
          </div>
        ) : (
          renderCategoryTree(filteredCategories)
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                  <FolderTree size={16} />
                </span>
                <h3 className="text-sm font-bold text-gray-900">New Category</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)} 
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Wear, Summer Tops"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}