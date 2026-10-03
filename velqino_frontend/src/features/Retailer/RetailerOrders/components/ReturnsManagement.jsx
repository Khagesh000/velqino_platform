"use client";

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  Truck, 
  FileText, 
  MessageCircle, 
  Upload, 
  Eye, 
  AlertCircle, 
  DollarSign,
  Plus,
  Sparkles,
  X
} from '../../../../utils/icons';
import { 
  useGetRetailerReturnsQuery, 
  useCreateReturnRequestMutation, 
  useUpdateReturnStatusMutation 
} from '@/redux/retailer/slices/retailerOrdersSlice';
import { toast } from 'react-toastify';

export default function ReturnsManagement({ selectedOrder, retailerOrders = [] }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnComment, setReturnComment] = useState('');
  const [returnItems, setReturnItems] = useState([]);
  const [returnType, setReturnType] = useState('return');
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState('');

  const { data: returnsData, isLoading, refetch } = useGetRetailerReturnsQuery();
  const [createReturnRequest, { isLoading: isCreating }] = useCreateReturnRequestMutation();
  const [updateReturnStatus, { isLoading: isUpdating }] = useUpdateReturnStatusMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const returnRequests = returnsData?.data || [];

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch(s) {
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">Pending Review</span>;
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Approved</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">In Transit</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">Rejected</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-900 border border-primary-200">Refunded</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 capitalize">{s}</span>;
    }
  };

  const stats = {
    pending: returnRequests.filter(r => r.status === 'pending').length,
    approved: returnRequests.filter(r => r.status === 'approved').length,
    processing: returnRequests.filter(r => r.status === 'processing').length,
    totalRefund: returnRequests.reduce((sum, r) => sum + parseFloat(r.refund_amount || 0), 0)
  };

  const handleSubmitReturn = async (e) => {
    e?.preventDefault();
    if (!returnReason || !selectedOrderForReturn || returnItems.length === 0) {
      toast.error('Please select an order, items, and specify a reason');
      return;
    }

    try {
      await createReturnRequest({
        order_id: selectedOrderForReturn,
        return_type: returnType,
        reason: returnReason,
        comments: returnComment,
        items: returnItems
      }).unwrap();

      toast.success('Return authorization request created');
      setShowReturnModal(false);
      setReturnReason('');
      setReturnComment('');
      setReturnItems([]);
      setSelectedOrderForReturn('');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit return request');
    }
  };

  const handleUpdateStatus = async (returnId, newStatus) => {
    try {
      await updateReturnStatus({ returnId, status: newStatus }).unwrap();
      toast.success(`Return status set to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update return status');
    }
  };

  const availableOrders = retailerOrders.filter(order => 
    order.status === 'delivered' || order.status === 'shipped' || order.status === 'confirmed'
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <RefreshCw size={17} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Returns & Exchanges
              </h3>
              <p className="text-[11px] text-gray-400">Reverse logistics & customer refunds</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReturnModal(true)}
            className="px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Create Return Request</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-gray-400">Pending</p>
            <p className="text-lg font-black text-amber-700 mt-0.5">{stats.pending}</p>
          </div>
          <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-gray-400">Approved</p>
            <p className="text-lg font-black text-emerald-700 mt-0.5">{stats.approved}</p>
          </div>
          <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-gray-400">In Transit</p>
            <p className="text-lg font-black text-indigo-700 mt-0.5">{stats.processing}</p>
          </div>
          <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-gray-400">Total Refunded</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹{stats.totalRefund.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Requests List Table */}
        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : returnRequests.length === 0 ? (
            <div className="text-center py-12 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <RefreshCw size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">No active return authorizations</p>
              <p className="text-[11px] text-gray-400 mt-0.5">When customers request product returns or size swaps, authorizations log here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Return ID</th>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returnRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">
                      #RET-{req.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700">
                      {req.order_number || req.order_id}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-extrabold text-gray-700">
                      {req.return_type || 'RETURN'}
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                            className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                  <RefreshCw size={16} />
                </span>
                <h3 className="text-sm font-bold text-gray-900">New Return Authorization</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Select Order <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedOrderForReturn}
                  onChange={(e) => setSelectedOrderForReturn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  required
                >
                  <option value="">Choose order...</option>
                  {availableOrders.map(o => (
                    <option key={o.order_number || o.id} value={o.order_number || o.id}>
                      {o.order_number || `#ORD-${o.id}`} &bull; ₹{Number(o.grand_total || o.total_amount || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOrderForReturn && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Select Line Items to Return
                  </label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {retailerOrders
                      .find(o => (o.order_number || o.id) === selectedOrderForReturn)?.items?.map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReturnItems(prev => [...prev, {
                                  product_name: item.product_name,
                                  product_sku: item.product_sku,
                                  quantity: item.quantity,
                                  price: item.price
                                }]);
                              } else {
                                setReturnItems(prev => prev.filter(i => i.product_sku !== item.product_sku));
                              }
                            }}
                          />
                          <span className="font-bold text-gray-800 truncate">{item.product_name} &bull; Qty: {item.quantity}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Request Type</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setReturnType('return')}
                    className={`py-1.5 font-bold rounded-xl transition-all ${
                      returnType === 'return' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                    }`}
                  >
                    Refund Return
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnType('exchange')}
                    className={`py-1.5 font-bold rounded-xl transition-all ${
                      returnType === 'exchange' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                    }`}
                  >
                    Size / Variant Exchange
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                  required
                >
                  <option value="">Select reason...</option>
                  <option>Defective or damaged fabric</option>
                  <option>Wrong size or color dispatched</option>
                  <option>Customer changed mind</option>
                  <option>Missing packaging or accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Comments</label>
                <textarea
                  rows={2}
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  placeholder="Additional context or customer request notes..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-2xs disabled:opacity-50"
                >
                  {isCreating ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}