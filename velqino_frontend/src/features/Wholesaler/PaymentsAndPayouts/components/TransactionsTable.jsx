"use client";

import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Printer,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Search,
  Filter,
  Copy,
  SlidersHorizontal
} from '@/utils/icons';
import '../../../../styles/Wholesaler/PaymentsPayouts/TransactionsTable.scss';

export default function TransactionsTable() {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const itemsPerPage = 8;

  const rawTransactions = [
    {
      id: 'TXN-2024-001',
      date: '2024-03-20 14:30',
      description: 'Order #ORD-2024-001 - Wireless Headphones (50 units)',
      type: 'Credit',
      amount: 62500,
      status: 'Completed',
      balance: 1245750,
      paymentMethod: 'UPI VPA',
      reference: 'REF-123456'
    },
    {
      id: 'TXN-2024-002',
      date: '2024-03-19 09:15',
      description: 'Order #ORD-2024-002 - Cotton T-Shirts (100 units)',
      type: 'Credit',
      amount: 45000,
      status: 'Completed',
      balance: 1183250,
      paymentMethod: 'Bank NEFT',
      reference: 'REF-123457'
    },
    {
      id: 'TXN-2024-003',
      date: '2024-03-18 16:45',
      description: 'Payout withdrawal to Corporate HDFC Bank',
      type: 'Debit',
      amount: 50000,
      status: 'Completed',
      balance: 1138250,
      paymentMethod: 'Bank Transfer',
      reference: 'PAYOUT-001'
    },
    {
      id: 'TXN-2024-004',
      date: '2024-03-17 11:20',
      description: 'Order #ORD-2024-003 - Ceramic Mugs (150 units)',
      type: 'Credit',
      amount: 44850,
      status: 'Completed',
      balance: 1188250,
      paymentMethod: 'Credit Card',
      reference: 'REF-123458'
    },
    {
      id: 'TXN-2024-005',
      date: '2024-03-16 08:30',
      description: 'Order #ORD-2024-004 - Yoga Mats (50 units)',
      type: 'Credit',
      amount: 44950,
      status: 'Pending',
      balance: 1143400,
      paymentMethod: 'UPI VPA',
      reference: 'REF-123459'
    },
    {
      id: 'TXN-2024-006',
      date: '2024-03-15 13:55',
      description: 'Platform infrastructure & escrow fee deduction',
      type: 'Debit',
      amount: 12500,
      status: 'Completed',
      balance: 1098450,
      paymentMethod: 'System',
      reference: 'FEE-001'
    },
    {
      id: 'TXN-2024-007',
      date: '2024-03-14 10:05',
      description: 'Order #ORD-2024-005 - Desk Lamps (30 units)',
      type: 'Credit',
      amount: 38970,
      status: 'Failed',
      balance: 1110950,
      paymentMethod: 'Credit Card',
      reference: 'REF-123460'
    },
    {
      id: 'TXN-2024-008',
      date: '2024-03-13 17:40',
      description: 'Order #ORD-2024-006 - Notebook Sets (200 units)',
      type: 'Credit',
      amount: 39800,
      status: 'Completed',
      balance: 1150000,
      paymentMethod: 'Bank NEFT',
      reference: 'REF-123461'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter(txn => {
      if (filterType !== 'all' && txn.type.toLowerCase() !== filterType.toLowerCase()) return false;
      if (filterStatus !== 'all' && txn.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          txn.description.toLowerCase().includes(query) ||
          txn.id.toLowerCase().includes(query) ||
          txn.reference.toLowerCase().includes(query) ||
          txn.paymentMethod.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [rawTransactions, filterType, filterStatus, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTransactions(paginatedTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(item => item !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  const exportCSV = () => {
    const rows = filteredTransactions.map(t => [t.id, t.date, t.type, t.amount, t.status, t.balance, t.reference].join(','));
    const csvContent = "data:text/csv;charset=utf-8,ID,Date,Type,Amount,Status,Balance,Reference\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Treasury Settlement Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Audit trail of merchant inflows, escrow releases, disbursements, and platform fees
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <button
            onClick={exportCSV}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
          >
            <Download size={14} className="text-primary-600" />
            <span>Export Statement</span>
          </button>
          <button
            onClick={() => window.print()}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
          >
            <Printer size={14} className="text-slate-500" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search description, reference, TXN ID..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Flow Types</option>
            <option value="credit">Credits In (+)</option>
            <option value="debit">Debits Out (-)</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={paginatedTransactions.length > 0 && selectedTransactions.length === paginatedTransactions.length}
                  className="rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3">Txn Reference</th>
              <th className="px-4 py-3">Date & Timestamp</th>
              <th className="px-4 py-3">Transaction Description</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Settled Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                  <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No transactions match your criteria</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try clearing your filters or search keywords</p>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map(txn => {
                const isCredit = txn.type.toLowerCase() === 'credit';
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(txn.id)}
                        onChange={() => handleSelectOne(txn.id)}
                        className="rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span>{txn.id}</span>
                        <button
                          onClick={() => handleCopy(txn.id, txn.id)}
                          type="button"
                          title="Copy ID"
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <Copy size={11} className={copiedId === txn.id ? "text-emerald-600" : ""} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{txn.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate" title={txn.description}>
                      {txn.description}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {txn.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-extrabold">
                      <span className={`inline-flex items-center gap-0.5 ${
                        isCredit ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isCredit ? (
                          <>
                            <ArrowUpRight size={13} />
                            +{formatCurrency(txn.amount)}
                          </>
                        ) : (
                          <>
                            <ArrowDownRight size={13} />
                            -{formatCurrency(txn.amount)}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        txn.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : txn.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          txn.status === 'Completed' ? 'bg-emerald-500' : txn.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(txn.balance)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</strong> of <strong>{filteredTransactions.length}</strong> ledger records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 py-1 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
