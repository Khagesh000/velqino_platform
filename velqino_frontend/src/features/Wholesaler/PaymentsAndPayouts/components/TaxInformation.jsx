"use client";

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Calendar,
  DollarSign,
  Building,
  FileCheck,
  Receipt,
  TrendingUp,
  Shield,
  ShieldCheck,
  Check
} from '@/utils/icons';
import '../../../../styles/Wholesaler/PaymentsPayouts/TaxInformation.scss';

export default function TaxInformation() {
  const [activeTab, setActiveTab] = useState('details');
  const [showEditGST, setShowEditGST] = useState(false);
  const [showEditPAN, setShowEditPAN] = useState(false);
  const [taxSettings, setTaxSettings] = useState({
    gstNumber: '27AAACV1234E1Z5',
    gstType: 'Regular Taxpayer',
    panNumber: 'AAACV1234E',
    businessType: 'Private Limited Company',
    businessName: 'Veltrix Wholesale Pvt Ltd',
    address: '123, MG Road, Bangalore - 560001',
    taxRegime: 'Regular B2B Regime',
    gstRate: 18,
    tdsApplicable: true,
    tdsRate: 2,
    gstReturnsFiled: 12,
    lastReturnFiled: '2024-02-28',
    nextReturnDue: '2024-03-20',
    taxCollected: 1245750,
    taxPaid: 1123450,
    taxPending: 122300
  });

  const [editForm, setEditForm] = useState({ ...taxSettings });

  const taxDocuments = [
    { id: 1, name: 'GST_Registration_Certificate_2024.pdf', type: 'GSTIN Registration', date: '15 Jan 2024', size: '1.2 MB', status: 'Verified' },
    { id: 2, name: 'Company_PAN_Card_Attested.pdf', type: 'Income Tax PAN', date: '15 Jan 2024', size: '0.8 MB', status: 'Verified' },
    { id: 3, name: 'GSTR-1_Filing_Summary_Q3.pdf', type: 'Quarterly Return', date: '10 Jan 2024', size: '2.1 MB', status: 'Verified' },
    { id: 4, name: 'TDS_Form_16A_Deduction.pdf', type: 'TDS Certificate', date: '05 Jan 2024', size: '1.5 MB', status: 'Pending' }
  ];

  const taxCollectedHistory = [
    { month: 'Jan 2024', sales: 1250000, taxCollected: 225000, taxPaid: 225000, status: 'Settled' },
    { month: 'Dec 2023', sales: 1100000, taxCollected: 198000, taxPaid: 198000, status: 'Settled' },
    { month: 'Nov 2023', sales: 980000, taxCollected: 176400, taxPaid: 176400, status: 'Settled' },
    { month: 'Oct 2023', sales: 1020000, taxCollected: 183600, taxPaid: 183600, status: 'Settled' },
    { month: 'Sep 2023', sales: 890000, taxCollected: 160200, taxPaid: 150000, status: 'Pending' }
  ];

  const handleSaveGST = () => {
    setTaxSettings({ ...taxSettings, gstNumber: editForm.gstNumber, gstType: editForm.gstType });
    setShowEditGST(false);
  };

  const handleSavePAN = () => {
    setTaxSettings({ ...taxSettings, panNumber: editForm.panNumber });
    setShowEditPAN(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const tabs = [
    { id: 'details', label: 'Tax Profile', icon: FileText },
    { id: 'collected', label: 'GST Collection', icon: DollarSign },
    { id: 'documents', label: 'Compliance Vault', icon: FileCheck },
    { id: 'settings', label: 'Withholding Rules', icon: Shield }
  ];

  return (
    <div className="tax-information bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xs">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Tax & Regulatory Compliance
            </h3>
            <p className="text-xs text-slate-500">GSTIN, PAN filing records, and withholding certificates</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          <ShieldCheck size={12} className="text-emerald-600" />
          GST Verified
        </span>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-5 border-b border-slate-200/80 bg-slate-50/40 overflow-x-auto scrollbar-none py-1.5 flex gap-1 flex-shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* GST Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-primary-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Goods & Services Tax (GSTIN)</h4>
                </div>
                <button
                  onClick={() => {
                    setEditForm({ ...taxSettings });
                    setShowEditGST(true);
                  }}
                  type="button"
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-500 text-[11px]">GSTIN Number</span>
                  <p className="font-mono font-extrabold text-slate-900 mt-0.5">{taxSettings.gstNumber}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-500 text-[11px]">Taxpayer Registration</span>
                  <p className="font-bold text-slate-900 mt-0.5">{taxSettings.gstType}</p>
                </div>
              </div>
            </div>

            {/* PAN Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-primary-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Permanent Account Number (PAN)</h4>
                </div>
                <button
                  onClick={() => {
                    setEditForm({ ...taxSettings });
                    setShowEditPAN(true);
                  }}
                  type="button"
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-500 text-[11px]">Corporate PAN</span>
                  <p className="font-mono font-extrabold text-slate-900 mt-0.5">{taxSettings.panNumber}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-500 text-[11px]">Entity Classification</span>
                  <p className="font-bold text-slate-900 mt-0.5">{taxSettings.businessType}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collected' && (
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3 py-2.5">Billing Period</th>
                    <th className="px-3 py-2.5">Taxable Gross</th>
                    <th className="px-3 py-2.5">GST Inflow (18%)</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {taxCollectedHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{item.month}</td>
                      <td className="px-3 py-2.5 text-slate-600">{formatCurrency(item.sales)}</td>
                      <td className="px-3 py-2.5 font-extrabold text-slate-900">{formatCurrency(item.taxCollected)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Settled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-2.5">
            {taxDocuments.map(doc => (
              <div key={doc.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.type} · {doc.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {doc.status}
                  </span>
                  <button
                    type="button"
                    title="Download document"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="font-semibold text-slate-700">TDS Section 194Q Compliance</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Applicable (2%)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="font-semibold text-slate-700">GST Output Tax Rate</span>
              <span className="font-bold text-slate-900 font-mono">18.00% Standard</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Next Mandatory GSTR-3B Due</span>
              <span className="font-bold text-rose-700 font-mono">20 March 2024</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit GSTIN Modal */}
      {showEditGST && (
        <div className="fixed inset-0 z-[100000] overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowEditGST(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900">Update GSTIN Record</h4>
              <button onClick={() => setShowEditGST(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">15-Digit GSTIN</label>
              <input
                type="text"
                value={editForm.gstNumber}
                onChange={e => setEditForm({ ...editForm, gstNumber: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowEditGST(false)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleSaveGST} className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold shadow-xs">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit PAN Modal */}
      {showEditPAN && (
        <div className="fixed inset-0 z-[100000] overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowEditPAN(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900">Update Corporate PAN</h4>
              <button onClick={() => setShowEditPAN(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">10-Character PAN Number</label>
              <input
                type="text"
                value={editForm.panNumber}
                onChange={e => setEditForm({ ...editForm, panNumber: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowEditPAN(false)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleSavePAN} className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold shadow-xs">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
