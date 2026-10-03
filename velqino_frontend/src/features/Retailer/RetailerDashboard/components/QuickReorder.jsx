"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Package, 
  Truck, 
  Check, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from '../../../../utils/icons';

export default function QuickReorder({ data = [], isLoading }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const items = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i.id));
    }
  };

  const selectedTotalUnits = useMemo(() => {
    return items
      .filter(i => selectedIds.includes(i.id))
      .reduce((sum, i) => sum + Number(i.suggestedQty || 20), 0);
  }, [items, selectedIds]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-44 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const getUrgencyBadge = (urgency = '') => {
    const u = urgency.toLowerCase();
    if (u === 'critical') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          Critical
        </span>
      );
    }
    if (u === 'medium' || u === 'urgent') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Urgent
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Suggested
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Zap size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Procurement Assistant</h3>
              <p className="text-xs text-gray-500">Automated factory restock recommendations</p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 self-start sm:self-auto"
            >
              {selectedIds.length === items.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {/* Selected Items Action Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-200/80 flex items-center justify-between text-xs animate-fadeIn">
            <div>
              <span className="font-bold text-primary-900">
                {selectedIds.length} items selected
              </span>
              <span className="text-primary-600 ml-2 font-medium">
                ({selectedTotalUnits} suggested units)
              </span>
            </div>

            <Link
              href="/product/productlistingpage"
              className="px-3 py-1.5 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-2xs"
            >
              Order from Mills
            </Link>
          </div>
        )}

        {/* Reorder Suggestions List */}
        {items.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400 shadow-2xs">
              <Package size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No Reorder Needed</p>
            <p className="text-xs text-gray-500 mt-0.5">Inventory levels are sufficient across active SKUs.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`
                    p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-3
                    ${isSelected 
                      ? 'bg-primary-50/40 border-primary-400 shadow-xs' 
                      : 'bg-white border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50'
                    }
                  `}
                >
                  {/* Selection Checkbox */}
                  <div className={`
                    w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
                    ${isSelected 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
                      />
                    ) : (
                      <Package size={18} className="text-gray-400" />
                    )}
                  </div>

                  {/* Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      {getUrgencyBadge(item.urgency)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono text-gray-400 text-[11px]">{item.sku}</span>
                      <span className="font-bold text-primary-700">
                        Suggested: +{item.suggestedQty || 20} pcs
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-400">
          Factory lot pricing available
        </span>
        <Link 
          href="/product/productlistingpage" 
          className="font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          <span>Source Wholesale Lots</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
