"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertCircle, 
  Send,
  Sparkles,
  ArrowRight
} from '../../../../utils/icons';

export default function OrderStatus({ selectedOrder, onStatusUpdate, onCancelOrder, onRefresh }) {
  const [mounted, setMounted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (selectedOrder) {
      setCurrentStatus(selectedOrder.status?.toLowerCase() || 'pending');
      setSelectedStatus(selectedOrder.status?.toLowerCase() || 'pending');
    }
  }, [selectedOrder]);

  if (!mounted) return null;

  const statusSteps = [
    { key: 'pending', label: 'Pending', icon: Clock, desc: 'Awaiting review' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Payment verified' },
    { key: 'processing', label: 'Processing', icon: Package, desc: 'Picking & packing' },
    { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'In courier transit' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, desc: 'Customer received' },
  ];

  const getStepIndex = (status) => {
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const handleApplyStatusChange = async (newStatus) => {
    if (!selectedOrder || !newStatus) return;
    setIsUpdating(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(selectedOrder.id || selectedOrder.order_number, newStatus);
        setCurrentStatus(newStatus);
        setSelectedStatus(newStatus);
      }
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelClick = async () => {
    if (!selectedOrder) return;
    if (onCancelOrder) {
      await onCancelOrder(selectedOrder.id || selectedOrder.order_number);
    }
  };

  if (!selectedOrder) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 shadow-2xs">
          <Clock size={26} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-900">Live Status Tracker</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Select any order from the table to view its delivery timeline and update dispatch progress.
        </p>
      </div>
    );
  }

  const activeStepIdx = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Truck size={17} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Fulfillment Tracker
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">
                {selectedOrder.order_number || `#ORD-${selectedOrder.id}`}
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
            isCancelled 
              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
              : currentStatus === 'delivered'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-primary-100 text-primary-800 border border-primary-200'
          }`}>
            {currentStatus}
          </span>
        </div>

        {/* Stepper Progress */}
        <div className="py-4">
          {isCancelled ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-1">
              <XCircle size={28} className="text-rose-600 mx-auto" />
              <h4 className="text-xs font-bold text-rose-900">Order Has Been Cancelled</h4>
              <p className="text-[11px] text-rose-700">Inventory allocation was reverted and customer notified.</p>
            </div>
          ) : (
            <div className="relative space-y-4">
              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative">
                    {/* Connecting line */}
                    {idx < statusSteps.length - 1 && (
                      <div 
                        className={`absolute left-4 top-8 w-0.5 h-6 -ml-px transition-colors ${
                          idx < activeStepIdx ? 'bg-primary-600' : 'bg-gray-200'
                        }`} 
                      />
                    )}

                    {/* Step Icon Node */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all z-10
                      ${isPassed 
                        ? 'bg-primary-600 text-white shadow-2xs' 
                        : isCurrent 
                        ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500 font-bold' 
                        : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      <Icon size={14} />
                    </div>

                    {/* Label & Description */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-primary-900' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-primary-100 text-primary-800">
                            Active Stage
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Advance Order Status
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isUpdating || isCancelled}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white disabled:opacity-50 font-medium"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>

            <button
              type="button"
              onClick={() => handleApplyStatusChange(selectedStatus)}
              disabled={isUpdating || isCancelled || selectedStatus === currentStatus}
              className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs disabled:opacity-40 flex items-center gap-1 active:scale-95"
            >
              {isUpdating ? <RefreshCw size={13} className="animate-spin" /> : <span>Update</span>}
            </button>
          </div>
        </div>

        {!isCancelled && currentStatus !== 'delivered' && (
          <button
            type="button"
            onClick={handleCancelClick}
            className="w-full py-2 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <XCircle size={14} />
            <span>Cancel Order</span>
          </button>
        )}
      </div>
    </div>
  );
}