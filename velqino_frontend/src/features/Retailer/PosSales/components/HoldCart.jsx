"use client";

import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  Plus, 
  Clock, 
  Trash2, 
  Eye, 
  X, 
  Check, 
  ArrowRight,
  ShoppingBag
} from '../../../../utils/icons';

const STORAGE_KEY = 'velqino_pos_held_carts';

export default function HoldCart({ 
  currentCart = [], 
  onLoadCart, 
  onClearCurrentCart,
  isOpen = false,
  onClose
}) {
  const [heldCarts, setHeldCarts] = useState([]);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showListModal, setShowListModal] = useState(isOpen);
  const [cartReferenceName, setCartReferenceName] = useState('');

  // Sync with prop isOpen
  useEffect(() => {
    if (isOpen !== undefined) {
      setShowListModal(isOpen);
    }
  }, [isOpen]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHeldCarts(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Held carts load error:', e);
    }
  }, []);

  const saveToStorage = (updated) => {
    setHeldCarts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleHoldCurrentCart = (e) => {
    e.preventDefault();
    if (!currentCart || currentCart.length === 0) {
      alert('Cart is empty. Add products before holding.');
      return;
    }

    const title = cartReferenceName.trim() || `Held Cart #${heldCarts.length + 1}`;
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const newHold = {
      id: Date.now(),
      name: title,
      items: [...currentCart],
      itemCount: currentCart.reduce((sum, item) => sum + (item.quantity || 1), 0),
      subtotal,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      createdAt: new Date().toISOString()
    };

    const updated = [newHold, ...heldCarts];
    saveToStorage(updated);

    if (onClearCurrentCart) {
      onClearCurrentCart();
    }

    setCartReferenceName('');
    setShowHoldModal(false);
  };

  const handleRestoreCart = (held) => {
    if (currentCart && currentCart.length > 0) {
      if (!window.confirm('Active cart contains items. Replace with this held cart?')) {
        return;
      }
    }

    if (onLoadCart) {
      onLoadCart(held.items);
    }

    // Remove from held carts
    const updated = heldCarts.filter(c => c.id !== held.id);
    saveToStorage(updated);

    setShowListModal(false);
    if (onClose) onClose();
  };

  const handleDeleteHeld = (id) => {
    const updated = heldCarts.filter(c => c.id !== id);
    saveToStorage(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all held carts?')) {
      saveToStorage([]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Archive size={17} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Hold Register Cart
              </h3>
              <p className="text-[11px] text-gray-400">Park pending sales temporarily</p>
            </div>
          </div>

          {heldCarts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowListModal(true)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full"
            >
              {heldCarts.length} Saved
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowHoldModal(true)}
            disabled={!currentCart || currentCart.length === 0}
            className={`
              py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all
              ${!currentCart || currentCart.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-2xs'
              }
            `}
          >
            <Plus size={14} />
            <span>Hold Current</span>
          </button>

          <button
            type="button"
            onClick={() => setShowListModal(true)}
            disabled={heldCarts.length === 0}
            className={`
              py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border
              ${heldCarts.length === 0 
                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-2xs'
              }
            `}
          >
            <Clock size={14} />
            <span>Retrieve ({heldCarts.length})</span>
          </button>
        </div>
      </div>

      {/* Held Carts Full Modal Drawer */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary-50 text-primary-600">
                  <Archive size={18} />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Saved Held Carts ({heldCarts.length})
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowListModal(false);
                  if (onClose) onClose();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scroll">
              {heldCarts.length === 0 ? (
                <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Archive size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No Held Carts</p>
                  <p className="text-xs text-gray-400 mt-1">Pending customer checkouts saved during register sessions will appear here.</p>
                </div>
              ) : (
                heldCarts.map((cart) => (
                  <div
                    key={cart.id}
                    className="p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-primary-300 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">{cart.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span>{cart.itemCount} items</span>
                        <span>•</span>
                        <span className="font-bold text-gray-700">₹{cart.subtotal.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>{cart.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRestoreCart(cart)}
                        className="px-3 py-1.5 rounded-xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 transition-colors shadow-2xs"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHeld(cart.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {heldCarts.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowListModal(false);
                    if (onClose) onClose();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hold Current Cart Input Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary-50 text-primary-600">
                  <Archive size={18} />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Park Cart in Hold
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowHoldModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleHoldCurrentCart} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cart Identifier / Buyer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Counter Guest, Ramesh Fitting"
                  value={cartReferenceName}
                  onChange={(e) => setCartReferenceName(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="p-2.5 bg-gray-50 rounded-xl text-xs text-gray-600 flex justify-between">
                <span>Items in Cart:</span>
                <span className="font-bold text-gray-900">{currentCart.length} products</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHoldModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-2xs"
                >
                  Save & Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
