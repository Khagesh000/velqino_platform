"use client";

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Percent, 
  FileText, 
  X, 
  Check,
  AlertCircle
} from '../../../../utils/icons';

export default function CartSection({ 
  cart = [], 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  discount = { type: 'percentage', value: 0 },
  setDiscount,
  orderNote = '',
  setOrderNote
}) {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [customDiscountValue, setCustomDiscountValue] = useState(discount?.value || 0);
  const [customDiscountType, setCustomDiscountType] = useState(discount?.type || 'percentage');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const applyDiscountPreset = (type, val) => {
    if (setDiscount) {
      setDiscount({ type, value: val });
    }
    setCustomDiscountType(type);
    setCustomDiscountValue(val);
    setShowDiscountInput(false);
  };

  const handleCustomDiscountSave = () => {
    const num = Math.max(0, Number(customDiscountValue) || 0);
    if (setDiscount) {
      setDiscount({ type: customDiscountType, value: num });
    }
    setShowDiscountInput(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <ShoppingCart size={17} />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Current Register Cart
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
              {totalItemsCount} items
            </span>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all items from the current sale?')) {
                  clearCart();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors p-1 rounded-lg hover:bg-rose-50"
              title="Clear Cart"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1 my-2 custom-scroll">
          {cart.length === 0 ? (
            <div className="text-center py-10 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 my-2">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-2 shadow-2xs">
                <ShoppingCart size={20} />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800">No Items in Register</p>
              <p className="text-[11px] text-gray-400 mt-0.5 max-w-xs mx-auto">
                Scan a barcode or tap products from the catalog to build this customer&apos;s checkout.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const lineTotal = item.price * (item.quantity || 1);

              return (
                <div key={item.id} className="py-2.5 flex items-center gap-3 group">
                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">#</span>
                    )}
                  </div>

                  {/* Name & Pricing */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono mt-0.5">
                      <span>{item.sku}</span>
                      <span>•</span>
                      <span className="font-sans font-semibold text-gray-700">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-gray-100/90 rounded-xl p-0.5 border border-gray-200/80">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-6 h-6 rounded-lg bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
                    >
                      <Minus size={11} strokeWidth={2.5} />
                    </button>
                    
                    <span className="w-7 text-center text-xs font-extrabold text-gray-900">
                      {item.quantity || 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-6 h-6 rounded-lg bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
                    >
                      <Plus size={11} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-gray-900 min-w-[55px] text-right">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-gray-300 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                      title="Remove product"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cart Toolbar: Discount & Note */}
      {cart.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-2.5">
          {/* Quick Discount & Note Action Triggers */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Discount:</span>
              <button
                type="button"
                onClick={() => applyDiscountPreset('percentage', 0)}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors ${
                  discount.value === 0 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                0%
              </button>
              <button
                type="button"
                onClick={() => applyDiscountPreset('percentage', 5)}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors ${
                  discount.type === 'percentage' && discount.value === 5 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                5%
              </button>
              <button
                type="button"
                onClick={() => applyDiscountPreset('percentage', 10)}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors ${
                  discount.type === 'percentage' && discount.value === 10 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                10%
              </button>
              <button
                type="button"
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px]"
              >
                Custom
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <FileText size={12} />
              <span>{orderNote ? 'Edit Note' : 'Add Note'}</span>
            </button>
          </div>

          {/* Custom Discount Input Box */}
          {showDiscountInput && (
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-gray-700">Apply Custom Discount</span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCustomDiscountType('percentage')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      customDiscountType === 'percentage' ? 'bg-primary-600 text-white' : 'text-gray-500'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomDiscountType('fixed')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      customDiscountType === 'fixed' ? 'bg-primary-600 text-white' : 'text-gray-500'
                    }`}
                  >
                    ₹ Flat
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder={customDiscountType === 'percentage' ? 'e.g. 15 (%)' : 'e.g. 200 (₹)'}
                  value={customDiscountValue || ''}
                  onChange={(e) => setCustomDiscountValue(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={handleCustomDiscountSave}
                  className="px-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 shadow-2xs"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiscountInput(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Order Note Input Box */}
          {showNoteInput && (
            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-200 animate-fadeIn flex items-center gap-2">
              <input
                type="text"
                placeholder="Optional cashier note or customer instructions..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowNoteInput(false)}
                className="px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-xl hover:bg-gray-900"
              >
                Save
              </button>
            </div>
          )}

          {orderNote && !showNoteInput && (
            <p className="text-[11px] text-gray-500 bg-amber-50/70 border border-amber-200/80 px-2.5 py-1 rounded-xl">
              <strong>Note:</strong> {orderNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
