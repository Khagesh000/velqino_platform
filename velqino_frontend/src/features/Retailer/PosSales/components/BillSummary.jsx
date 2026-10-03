"use client";

import React, { useState } from 'react';
import { 
  Receipt, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Wallet, 
  ArrowRight,
  Sparkles,
  X
} from '../../../../utils/icons';

export default function BillSummary({ 
  cart = [], 
  discount = { type: 'percentage', value: 0 },
  selectedPayment = 'cash',
  selectedCustomer = null,
  applyLoyalty = false,
  orderNote = '',
  onCompleteSale
}) {
  const [cashTendered, setCashTendered] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState(null);

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  // GST 18% calculation
  const cgst = Math.round(subtotal * 0.09 * 100) / 100;
  const sgst = Math.round(subtotal * 0.09 * 100) / 100;
  const totalTax = cgst + sgst;

  // Discount calculation
  let discountAmount = 0;
  if (discount?.type === 'percentage') {
    discountAmount = Math.round(((subtotal * (discount.value || 0)) / 100) * 100) / 100;
  } else if (discount?.type === 'fixed') {
    discountAmount = Math.min(discount.value || 0, subtotal);
  }

  // Loyalty discount calculation: 100 points = ₹50
  const loyaltyDiscount = applyLoyalty && selectedCustomer?.points 
    ? Math.min(Math.floor(selectedCustomer.points / 100) * 50, subtotal)
    : 0;

  const totalDeductions = discountAmount + loyaltyDiscount;
  const grandTotal = Math.max(0, Math.round(subtotal + totalTax - totalDeductions));

  // Cash change calculation
  const numericTendered = Number(cashTendered) || 0;
  const changeDue = numericTendered >= grandTotal ? numericTendered - grandTotal : 0;
  const amountShort = numericTendered > 0 && numericTendered < grandTotal ? grandTotal - numericTendered : 0;

  const handleQuickCash = (amount) => {
    setCashTendered(amount.toString());
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add items to checkout.');
      return;
    }

    if (selectedPayment === 'cash' && numericTendered > 0 && numericTendered < grandTotal) {
      if (!window.confirm(`Cash tendered is short by ₹${amountShort}. Proceed anyway?`)) {
        return;
      }
    }

    setIsProcessing(true);

    const saleRecord = {
      id: `#TR-${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      customer: selectedCustomer?.name || 'Walk-in Buyer',
      customerPhone: selectedCustomer?.phone || '',
      items: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
      itemsList: cart.map(i => ({ name: i.name, quantity: i.quantity || 1, price: i.price, sku: i.sku })),
      subtotal,
      cgst,
      sgst,
      discountAmount,
      loyaltyDiscount,
      total: grandTotal,
      payment: selectedPayment.toUpperCase(),
      cashTendered: numericTendered,
      changeDue,
      orderNote
    };

    setTimeout(() => {
      setIsProcessing(false);
      setCompletedTxn(saleRecord);
      if (onCompleteSale) {
        onCompleteSale(saleRecord);
      }
    }, 800);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
            <Receipt size={17} />
          </span>
          <h3 className="text-sm sm:text-base font-bold text-gray-900">
            Bill Breakdown
          </h3>
        </div>
        <span className="text-[11px] font-bold text-gray-400 font-mono">
          GST-18% Registered
        </span>
      </div>

      {/* Bill Numbers Table */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center text-gray-600">
          <span>Cart Subtotal</span>
          <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span>CGST (9%)</span>
          <span className="font-semibold text-gray-700">+₹{cgst.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span>SGST (9%)</span>
          <span className="font-semibold text-gray-700">+₹{sgst.toLocaleString('en-IN')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/60 px-2 py-1 rounded-lg">
            <span>Special Discount {discount.type === 'percentage' ? `(${discount.value}%)` : ''}</span>
            <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {loyaltyDiscount > 0 && (
          <div className="flex justify-between items-center text-amber-700 bg-amber-50/60 px-2 py-1 rounded-lg">
            <span>Loyalty Reward Points</span>
            <span className="font-bold">-₹{loyaltyDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Net Payable Hero Strip */}
        <div className="pt-3 border-t border-gray-200/90 flex justify-between items-baseline">
          <div>
            <span className="text-xs font-bold uppercase text-gray-400 block">Net Payable</span>
            <span className="text-[10px] text-gray-400">Inclusive of all taxes</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-primary-700 tracking-tight">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Cash Tendering Box (Only shown if Cash is selected) */}
      {selectedPayment === 'cash' && cart.length > 0 && (
        <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700">Cash Received from Buyer</span>
            {numericTendered > 0 && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                changeDue >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {changeDue > 0 ? `Change: ₹${changeDue}` : amountShort > 0 ? `Due: ₹${amountShort}` : 'Exact'}
              </span>
            )}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={cashTendered}
              onChange={(e) => setCashTendered(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Quick Cash Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleQuickCash(grandTotal)}
              className="px-2 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px]"
            >
              Exact (₹{grandTotal})
            </button>
            <button
              type="button"
              onClick={() => handleQuickCash(500)}
              className="px-2 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px]"
            >
              ₹500
            </button>
            <button
              type="button"
              onClick={() => handleQuickCash(1000)}
              className="px-2 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px]"
            >
              ₹1,000
            </button>
            <button
              type="button"
              onClick={() => handleQuickCash(2000)}
              className="px-2 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px]"
            >
              ₹2,000
            </button>
          </div>
        </div>
      )}

      {/* Complete Checkout Button */}
      <button
        type="button"
        disabled={cart.length === 0 || isProcessing}
        onClick={handleCheckout}
        className={`
          w-full mt-4 py-3 sm:py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
          ${cart.length === 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
            : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-md active:scale-98'
          }
        `}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Settling Register...</span>
          </>
        ) : (
          <>
            <CheckCircle size={17} />
            <span>Complete Order & Print Bill (₹{grandTotal.toLocaleString('en-IN')})</span>
          </>
        )}
      </button>

      {/* Printable Receipt Modal */}
      {completedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scroll animate-scale">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Sale Settled Successfully</h3>
                  <p className="text-xs text-gray-500">{completedTxn.id} • {completedTxn.time}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setCompletedTxn(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Thermal Receipt Card */}
            <div id="pos-printable-receipt" className="p-4 rounded-2xl bg-gray-50 border border-gray-200 font-mono text-xs space-y-3">
              <div className="text-center pb-3 border-b border-dashed border-gray-300">
                <h4 className="font-extrabold text-sm text-gray-900 font-sans tracking-tight">VELQINO RETAIL STORE</h4>
                <p className="text-[10px] text-gray-500">Official POS Tax Invoice</p>
                <p className="text-[10px] text-gray-400 mt-1">Date: {completedTxn.date} {completedTxn.time}</p>
                <p className="text-[10px] text-gray-400">Customer: {completedTxn.customer} ({completedTxn.customerPhone || 'Counter'})</p>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 py-2 border-b border-dashed border-gray-300 text-[11px]">
                {completedTxn.itemsList.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[180px]">{item.quantity}x {item.name}</span>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Financials */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{completedTxn.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>CGST (9%)</span>
                  <span>₹{completedTxn.cgst}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>SGST (9%)</span>
                  <span>₹{completedTxn.sgst}</span>
                </div>
                {completedTxn.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{completedTxn.discountAmount}</span>
                  </div>
                )}
                {completedTxn.loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Loyalty Points</span>
                    <span>-₹{completedTxn.loyaltyDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t border-dashed border-gray-300">
                  <span>TOTAL PAID</span>
                  <span className="font-sans text-primary-700">₹{completedTxn.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[10px] pt-1">
                  <span>Tender Mode</span>
                  <span>{completedTxn.payment}</span>
                </div>
                {completedTxn.changeDue > 0 && (
                  <div className="flex justify-between text-emerald-700 text-[10px]">
                    <span>Change Returned</span>
                    <span>₹{completedTxn.changeDue}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-2 text-[10px] text-gray-400 border-t border-dashed border-gray-300">
                <p>Thank you for shopping with us!</p>
                <p>Goods once sold can be exchanged within 7 days.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 mt-4">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer size={15} />
                <span>Print Bill</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedTxn(null)}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Start Next Sale</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
