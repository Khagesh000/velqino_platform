"use client";

import React, { useState, lazy, Suspense, useEffect } from 'react';
import WholesaleNavbar from './components/WholesaleNavbar';
import { useGetWholesalerDashboardQuery } from '@/redux/wholesaler/slices/statsSlice';
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice';
import { 
  Sparkles, 
  Plus, 
  Download, 
  Upload, 
  ImageIcon, 
  ChevronDown 
} from '@/utils/icons';

// Modals reused from ProductsCatalog
import ProductEditModal from '../ProductsCatalog/components/ProductEditModal';
import ImportModal from '../ProductsCatalog/Modals/ImportModal';
import ImportImagesModal from '../ProductsCatalog/Modals/ImportImagesModal';
import ExportModal from '../ProductsCatalog/Modals/ExportModal';
import '@/styles/Wholesaler/ProductsCatalog/CatalogModals.scss';

// Dashboard Components
import KPIStatsCards from './components/KPIStatsCards';
import QuickActionsRow from './components/QuickActionsRow';
import SalesAnalyticsChart from './components/SalesAnalyticsChart';
import CategoryPerformance from './components/CategoryPerformance';
import RecentOrdersTable from './components/RecentOrdersTable';
import LowStockAlerts from './components/LowStockAlerts';
import RecentActivityFeed from './components/RecentActivityFeed';
import TopCustomersList from './components/TopCustomersList';
import PendingTasks from './components/PendingTasks';
import QuickInsights from './components/QuickInsights';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modal states for direct dashboard operations
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showImportVideoModal, setShowImportVideoModal] = useState(false);
  const [showImportImagesModal, setShowImportImagesModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);

  // Pagination state variables
  const [ordersPage, setOrdersPage] = useState(1);
  const [lowStockPage, setLowStockPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [chartPeriod, setChartPeriod] = useState('weekly');

  // Pagination handlers
  const handleOrdersPageChange = (page) => setOrdersPage(page);
  const handleLowStockPageChange = (page) => setLowStockPage(page);
  const handleActivityPageChange = (page) => setActivityPage(page);
  const handleCustomersPageChange = (page) => setCustomersPage(page);
  const handleTasksPageChange = (page) => setTasksPage(page);
  const handleTabChange = (tab) => setActiveTab(tab);
  const handleChartPeriodChange = (period) => setChartPeriod(period);

  // Single API call for dashboard data
  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    isFetching: dashboardFetching,
    refetch: refetchDashboard 
  } = useGetWholesalerDashboardQuery();

  // Fetch categories for product & media import modals
  const { data: categoriesData } = useGetCategoriesQuery();
  const categoriesList = categoriesData?.data || categoriesData || [];

  // Resilient Cache: prevents flash of empty content when refreshing or switching screens
  const [cachedDashboard, setCachedDashboard] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('velqino_wholesaler_dashboard_cache');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse dashboard cache:', e);
      }
    }
    return null;
  });

  // Extract nested data safely regardless of API response wrapper
  const rawPayload = dashboardData?.data || dashboardData;
  const liveDashboard = rawPayload?.data || rawPayload || {};

  // Sync to local/session storage on arrival
  useEffect(() => {
    const raw = dashboardData?.data || dashboardData;
    const actual = raw?.data || raw;
    if (actual && (actual.stats || actual.recentOrders || actual.lowStockAlerts)) {
      setCachedDashboard(actual);
      try {
        sessionStorage.setItem('velqino_wholesaler_dashboard_cache', JSON.stringify(actual));
      } catch (e) {}

      if (actual.stats) {
        localStorage.setItem('wholesaler_pending_orders', actual.stats.pending_orders || 0);
        localStorage.setItem('wholesaler_customers_count', actual.stats.total_customers || 0);
      }
    }
  }, [dashboardData]);

  // Use live data if populated, otherwise seamlessly fall back to cached data
  const dashboard = (liveDashboard && (liveDashboard.stats || liveDashboard.recentOrders || liveDashboard.lowStockAlerts))
    ? liveDashboard
    : (cachedDashboard || {});

  // Only show blocking loading state if we have absolutely zero data to render
  const isLoading = dashboardLoading && !dashboard.stats && !dashboard.recentOrders;
  
  const stats = dashboard.stats || {};
  const products = dashboard.products || [];
  const orders = dashboard.orders || [];
  const salesChart = dashboard.salesAnalytics || {};
  const categories = dashboard.categoryPerformance || [];
  const recentOrders = dashboard.recentOrders || [];
  const lowStockItems = dashboard.lowStockAlerts || [];
  const activities = dashboard.recentActivity || [];
  const topCustomers = dashboard.topCustomers || [];
  const pendingTasks = dashboard.pendingTasks || [];
  const orderStats = dashboard.orderStats || {};
  const quickInsights = dashboard.quickInsights || {};
  
  const ordersTotalPages = 1;
  const lowStockTotalPages = 1;
  const activityTotalPages = 1;
  const customersTotalPages = 1;
  const tasksTotalPages = 1;
  const customersTotalSpent = '₹0';
  const customersGrowth = '0%';
  const customersTotalCount = 0;
  const tasksStats = {};

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <WholesaleNavbar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      <main className={`transition-all duration-300 p-3 sm:p-5 lg:p-6 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Executive Header Banner with Action CTAs */}
          <div className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-xs flex-shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">Wholesaler Dashboard</h1>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Live Operations
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time command center for inventory, order dispatch, and sales performance
                </p>
              </div>
            </div>

            {/* Direct Action Triggers */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all flex items-center gap-2"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Import Menu Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowImportDropdown(!showImportDropdown)}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all flex items-center gap-2"
                >
                  <Upload size={15} />
                  <span className="hidden sm:inline">Import</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showImportDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showImportDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowImportDropdown(false)} 
                    />
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          setShowImportImagesModal(true);
                          setShowImportDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-primary-100 flex items-center justify-center text-primary-600">
                          <ImageIcon size={15} />
                        </div>
                        <span>Bulk Images</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowImportVideoModal(true);
                          setShowImportDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-primary-100 flex items-center justify-center text-primary-600">
                          <Upload size={15} />
                        </div>
                        <span>Bulk Video</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Add Product CTA */}
              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Top KPI Metrics Row */}
          <div>
            <KPIStatsCards stats={stats} isLoading={isLoading} />
          </div>
          
          {/* Quick Actions / Shortcuts Row */}
          <div>
            <QuickActionsRow 
              products={products} 
              orders={orders} 
              stats={stats} 
              onAddProduct={() => setShowAddProductModal(true)}
              onImportImages={() => setShowImportImagesModal(true)}
              onImportVideo={() => setShowImportVideoModal(true)}
              onExport={() => setShowExportModal(true)}
            />
          </div>

          {/* Grid Row 1: Analytics & Category Share (8 cols : 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col">
              <SalesAnalyticsChart 
                data={salesChart} 
                isLoading={isLoading} 
                activePeriod={chartPeriod} 
                onPeriodChange={handleChartPeriodChange}  
              />
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <CategoryPerformance data={categories} isLoading={isLoading} />
            </div>
          </div>

          {/* Row 2: Recent Orders - Full Width Row (Wide table visibility, no cramped horizontal scroll) */}
          <div className="w-full">
            <RecentOrdersTable 
              orders={recentOrders} 
              isLoading={isLoading}
              currentPage={ordersPage}
              totalPages={ordersTotalPages}
              onPageChange={handleOrdersPageChange}
              refetch={refetchDashboard}
            />
          </div>

          {/* Row 3: Low Stock Alerts + Top Customers (Spacious product cards with thumbnails + partner VIP profiles) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <LowStockAlerts 
                items={lowStockItems}
                isLoading={isLoading}
                currentPage={lowStockPage}
                totalPages={lowStockTotalPages}
                onPageChange={handleLowStockPageChange}
                refetch={refetchDashboard}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
              <TopCustomersList 
                customers={topCustomers} 
                isLoading={isLoading}
                currentPage={customersPage}
                totalPages={customersTotalPages}
                totalCount={customersTotalCount}
                totalSpent={customersTotalSpent}
                growth={customersGrowth}
                onPageChange={handleCustomersPageChange}
              />
            </div>
          </div>

          {/* Row 4: Pending Tasks + Recent Activity Feed (2 Balanced Columns with full breathing room) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <PendingTasks 
                tasks={pendingTasks}
                isLoading={isLoading}
                activeTab={activeTab}
                currentPage={tasksPage}
                totalPages={tasksTotalPages}
                stats={tasksStats}
                onTabChange={handleTabChange}
                onPageChange={handleTasksPageChange}
              />
            </div>
            <div className="flex flex-col">
              <RecentActivityFeed 
                activities={activities}
                isLoading={isLoading}
                currentPage={activityPage}
                totalPages={activityTotalPages}
                onPageChange={handleActivityPageChange}
              />
            </div>
          </div>

          {/* Quick Insights Row */}
          <div>
            <QuickInsights 
              stats={stats} 
              orderStats={orderStats} 
              isLoading={isLoading}
            />
          </div>
          
        </div>
      </main>

      {/* Reusable Modals Integrated into Dashboard */}

      {/* Add Product Modal (Reuses ProductEditModal) */}
      {showAddProductModal && (
        <div 
          className="velqino-modal-overlay fixed inset-0 z-[1050] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setShowAddProductModal(false)}
        >
          <div 
            className="velqino-modal-drawer relative w-full sm:max-w-2xl lg:max-w-3xl h-full bg-white shadow-2xl flex flex-col overflow-hidden sm:rounded-l-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <ProductEditModal 
              product={null}
              onClose={() => setShowAddProductModal(false)}
              onSave={() => {
                refetchDashboard?.();
                setShowAddProductModal(false);
              }}
              categories={categoriesList}
            />
          </div>
        </div>
      )}

      {/* Import Video Modal */}
      {showImportVideoModal && (
        <ImportModal 
          onClose={() => setShowImportVideoModal(false)} 
          categories={categoriesList}
        />
      )}

      {/* Import Images Modal */}
      {showImportImagesModal && (
        <ImportImagesModal 
          onClose={() => setShowImportImagesModal(false)} 
          categories={categoriesList}
        />
      )}

      {/* Export Catalog Modal */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}