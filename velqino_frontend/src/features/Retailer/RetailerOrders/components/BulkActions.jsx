"use client";

import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, 
  Printer, 
  Truck, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Package, 
  Download, 
  Mail, 
  AlertCircle, 
  FileText, 
  Send,
  Sparkles,
  X,
  FileSpreadsheet
} from '../../../../utils/icons';

export default function BulkActions({ selectedOrders = [], onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('processing');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const count = selectedOrders.length;

  const bulkActions = [
    { 
      id: 'update_status', 
      label: 'Batch Status Update', 
      icon: RefreshCw, 
      badge: 'Operational',
      colorClass: 'text-primary-600 bg-primary-50 border-primary-100', 
      description: 'Update fulfillment status for all selected orders simultaneously.' 
    },
    { 
      id: 'print_invoices', 
      label: 'Print Packing Slips', 
      icon: Printer, 
      badge: 'Fulfillment',
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100', 
      description: 'Generate standardized order dispatch receipts and invoices.' 
    },
    { 
      id: 'download_csv', 
      label: 'Export Order Records', 
      icon: FileSpreadsheet, 
      badge: 'Reporting',
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100', 
      description: 'Download detailed order lines as spreadsheet (CSV) format.' 
    },
    { 
      id: 'send_notifications', 
      label: 'Notify Customers', 
      icon: Mail, 
      badge: 'Customer Care',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-100', 
      description: 'Send automated shipping & tracking updates via email.' 
    },
    { 
      id: 'mark_delivered', 
      label: 'Mark Delivered', 
      icon: CheckCircle, 
      badge: 'Complete',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-100', 
      description: 'Mark all selected active consignments as successfully delivered.' 
    },
    { 
      id: 'bulk_cancel', 
      label: 'Cancel Orders', 
      icon: XCircle, 
      badge: 'Danger',
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100', 
      description: 'Void and reverse selected orders with inventory restock.' 
    },
  ];

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Verified and queued' },
    { value: 'processing', label: 'Processing', icon: Package, desc: 'Picking & packaging in warehouse' },
    { value: 'shipped', label: 'Shipped', icon: Truck, desc: 'Handed over to courier partner' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, desc: 'Successfully handed to buyer' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, desc: 'Voided order' },
  ];

  const handleActionClick = (actionId) => {
    if (count === 0) return;

    if (actionId === 'update_status') {
      setShowStatusModal(true);
    } else if (actionId === 'download_csv') {
      handleExportCSV();
    } else if (actionId === 'print_invoices') {
      handlePrintInvoices();
    } else {
      executeAction(actionId);
    }
  };

  const executeAction = async (actionId, targetStatus = null) => {
    setIsProcessing(true);
    
    // Non-blocking processing
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsProcessing(false);
    setShowStatusModal(false);

    let message = 'Action executed successfully';
    if (actionId === 'update_status') {
      message = `Status updated to ${targetStatus || selectedStatus} for ${count} order(s).`;
    } else if (actionId === 'print_invoices') {
      message = `Generated packing receipts for ${count} order(s).`;
    } else if (actionId === 'send_notifications') {
      message = `Fulfillment notices dispatched to ${count} buyer(s).`;
    } else if (actionId === 'mark_delivered') {
      message = `Marked ${count} order(s) as delivered.`;
    } else if (actionId === 'bulk_cancel') {
      message = `Cancelled ${count} order(s) and restocked inventory.`;
    }

    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 4000);

    if (onComplete) onComplete();
  };

  const handleExportCSV = () => {
    if (count === 0) return;
    try {
      const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Total (INR)', 'Status', 'Payment Method'];
      const rows = selectedOrders.map(o => [
        o.order_number || o.id,
        o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN') : '',
        `"${(o.customer_name || '').replace(/"/g, '""')}"`,
        `"${(o.customer_email || '').replace(/"/g, '""')}"`,
        `"${(o.customer_phone || '').replace(/"/g, '""')}"`,
        parseFloat(o.grand_total || 0).toFixed(2),
        o.status || '',
        o.payment_method || ''
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Retail_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccessMessage(`Exported ${count} orders to CSV successfully.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrintInvoices = () => {
    window.print();
    setSuccessMessage(`Triggered print layout for ${count} order(s).`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <PackageCheck size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Bulk Order Actions</h3>
            <p className="text-[11px] text-gray-400">Batch operations on active order consignments</p>
          </div>
        </div>

        {/* Selected Counter Badge */}
        <span className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
          count > 0 
            ? 'bg-primary-50 text-primary-700 border-primary-200/70 shadow-2xs' 
            : 'bg-gray-100 text-gray-400 border-gray-200'
        }`}>
          {count} Selected
        </span>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="mx-4 sm:mx-5 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 text-emerald-600 hover:text-emerald-900">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Info Banner when no orders selected */}
      {count === 0 && (
        <div className="mx-4 sm:mx-5 mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">No orders currently highlighted</p>
            <p className="text-[11px] text-amber-700/80 mt-0.5">
              Select or view orders in the table to execute bulk status shifts, exports, or batch customer dispatches.
            </p>
          </div>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bulkActions.map((action) => {
          const IconComponent = action.icon;
          const isDisabled = count === 0 || isProcessing;
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              disabled={isDisabled}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                isDisabled 
                  ? 'bg-gray-50/60 border-gray-100 text-gray-400 opacity-60 cursor-not-allowed'
                  : 'bg-white border-gray-200/80 hover:border-primary-300 hover:shadow-xs active:scale-[0.99] cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${action.colorClass}`}>
                  <IconComponent size={16} />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                  {action.badge}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {action.label}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Utility Actions Footer */}
      <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium text-gray-500">
          Targeting: <span className="font-bold text-gray-800">{count} order(s)</span>
        </p>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handlePrintInvoices}
            disabled={count === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-2xs"
          >
            <Printer size={13} className="text-gray-500" />
            <span>Print Batch</span>
          </button>
          <button 
            type="button"
            onClick={handleExportCSV}
            disabled={count === 0}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Modal: Update Order Status in Bulk */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <RefreshCw size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Batch Status Transition</h3>
                  <p className="text-xs text-gray-400">Updating {count} highlighted order(s)</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status Options Selector */}
            <div className="space-y-2 mb-5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Destination Status
              </label>
              {statusOptions.map((status) => {
                const StatusIcon = status.icon;
                const isSelected = selectedStatus === status.value;
                return (
                  <label
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/60 shadow-2xs'
                        : 'border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bulk_status"
                      value={status.value}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(status.value)}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <StatusIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {status.label}
                      </p>
                      <p className="text-[11px] text-gray-400">{status.desc}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle size={16} className="text-primary-600 shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeAction('update_status', selectedStatus)}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    <span>Apply Status</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
