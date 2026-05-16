'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Package, TrendingUp, Clock, RefreshCw, ShoppingCart, Eye, Bell, CheckCircle, Filter, X } from '../../../../utils/icons';
import { useGetRetailerLowStockAlertsQuery } from '@/redux/retailer/slices/statsSlice';
import StockAlertsFilter from './filters/StockAlertsFilter';

export default function StockAlerts() {
  const [mounted, setMounted] = useState(false);
  const [hoveredAlert, setHoveredAlert] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const itemsPerPage = 12;
  const [filterParams, setFilterParams] = useState({});

  const { data: response, isLoading, refetch } = useGetRetailerLowStockAlertsQuery(filterParams);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const alerts = response?.data || [];
  
  // Filter based on type
  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => {
    if (filter === 'critical') return a.status === 'critical';
    if (filter === 'low') return a.status === 'warning';
    if (filter === 'out') return a.currentStock === 0;
    if (filter === 'expiring') return a.type === 'expiring';
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const alertCounts = {
    critical: alerts.filter(a => a.status === 'critical').length,
    low: alerts.filter(a => a.status === 'warning').length,
    out: alerts.filter(a => a.currentStock === 0).length,
    expiring: alerts.filter(a => a.type === 'expiring').length,
  };

  const getAlertStyle = (status) => {
    switch(status) {
      case 'critical': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500', badge: 'bg-red-500' };
      case 'warning': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500', badge: 'bg-orange-500' };
      case 'out': return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', icon: 'text-gray-500', badge: 'bg-gray-500' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-400', badge: 'bg-gray-400' };
    }
  };

  const getAlertMessage = (alert) => {
    if (alert.status === 'critical') return `Only ${alert.currentStock} units left! Below reorder level (${alert.reorderLevel})`;
    if (alert.status === 'warning') return `Low stock: ${alert.currentStock} units remaining. Reorder level is ${alert.reorderLevel}`;
    if (alert.currentStock === 0) return `Out of stock! Need immediate restock`;
    return 'Stock alert';
  };

  const handleApplyFilters = (filters) => {
    setFilterParams(filters);
    setCurrentPage(1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="stock-alerts bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-alerts bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Stock Alerts</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {alerts.length} alerts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilterModal(true)}
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all flex items-center gap-1"
            >
              <Filter size={14} />
              <span className="text-xs">Filter</span>
            </button>
            <button onClick={() => refetch()} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 pt-3 flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => { setFilter('all'); setCurrentPage(1); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => { setFilter('critical'); setCurrentPage(1); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filter === 'critical' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          Critical ({alertCounts.critical})
        </button>
        <button
          onClick={() => { setFilter('low'); setCurrentPage(1); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filter === 'low' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
        >
          Low Stock ({alertCounts.low})
        </button>
        <button
          onClick={() => { setFilter('out'); setCurrentPage(1); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filter === 'out' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Out of Stock ({alertCounts.out})
        </button>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-3 max-h-[650px] overflow-y-auto custom-scroll">
        {paginatedAlerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-400 mb-3" />
            <p className="text-sm font-medium text-gray-900">No stock alerts</p>
            <p className="text-xs text-gray-500 mt-1">All products are at healthy levels</p>
          </div>
        ) : (
          paginatedAlerts.map((alert, index) => {
            const style = getAlertStyle(alert.status);
            const stockPercent = (alert.currentStock / alert.reorderLevel) * 100;
            
            return (
              <div
                key={alert.id}
                className={`alert-item p-4 rounded-xl border-2 transition-all duration-200 ${style.bg} ${style.border} ${
                  hoveredAlert === alert.id ? 'shadow-lg transform -translate-y-0.5' : ''
                }`}
                onMouseEnter={() => setHoveredAlert(alert.id)}
                onMouseLeave={() => setHoveredAlert(null)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-row gap-4">
                  {/* Left Side - 30% Image */}
                  <div className="w-[30%] md:w-[25%] lg:w-[20%] flex-shrink-0">
                    <div className="aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                      {alert.image_url ? (
                        <img 
                          src={alert.image_url} 
                          alt={alert.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                        />
                      ) : (
                        <Package size={32} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Right Side - 70% Content */}
                  <div className="w-[70%] md:w-[75%] lg:w-[80%] flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{alert.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: {alert.sku}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white ${style.badge} inline-block w-fit`}>
                        {alert.status === 'critical' ? 'CRITICAL' : alert.status === 'warning' ? 'LOW STOCK' : alert.currentStock === 0 ? 'OUT OF STOCK' : 'ALERT'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{getAlertMessage(alert)}</p>
                    
                    {/* Progress Bar */}
                    {alert.status !== 'out' && (
                      <div className="mb-2">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>Stock Level</span>
                          <span>{alert.currentStock} / {alert.reorderLevel}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${alert.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(stockPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Supplier Info */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mt-2">
                      <span>Supplier: {alert.supplier || 'N/A'}</span>
                      <span>Lead Time: {alert.leadTime || '3-5 days'}</span>
                      <span>Price: ₹{alert.price}/unit</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-dashed border-gray-200">
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="View Product">
                        <Eye size={14} />
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1">
                        <ShoppingCart size={12} />
                        <span>Reorder Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="px-2 py-1 text-xs bg-primary-500 text-white rounded">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Summary */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <TrendingUp size={10} className="text-green-500" />
            <span>Restock suggestions available for {alertCounts.critical + alertCounts.low} products</span>
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
      </div>

      {showFilterModal && (
        <StockAlertsFilter 
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />
      )}

    </div>
  );
}