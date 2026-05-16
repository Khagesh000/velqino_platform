'use client';

import React, { useState, lazy, Suspense } from 'react';
import { MoreHorizontal } from '../../../utils/icons';
import RetailerNavbar from './components/RetailerNavbar';
import RetailerKPIStatsCards from './components/RetailerKPIStatsCards';
import RetailerQuickActionsRow from './components/RetailerQuickActionsRow';

// Import all hooks
import { useGetRetailerKPIStatsQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerDailySalesQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerTopProductsQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerCustomerActivityQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerRecentTransactionsQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerLowStockAlertsQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerTodaySummaryQuery } from '@/redux/retailer/slices/statsSlice';
import { useGetRetailerQuickReorderQuery } from '@/redux/retailer/slices/statsSlice';

// Lazy load all non-critical components
const DailySalesChart = lazy(() => import('./components/DailySalesChart'));
const TopSellingProducts = lazy(() => import('./components/TopSellingProducts'));
const RecentTransactions = lazy(() => import('./components/RecentTransactions'));
const LowStockAlerts = lazy(() => import('./components/LowStockAlerts'));
const CustomerActivity = lazy(() => import('./components/CustomerActivity'));
const TodaysSummary = lazy(() => import('./components/TodaysSummary'));
const QuickReorder = lazy(() => import('./components/QuickReorder'));

// Loading placeholders
const ChartPlaceholder = () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
const ProductsPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const TablePlaceholder = () => <div className="w-full h-[380px] bg-gray-100 rounded-xl animate-pulse" />
const AlertPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />
const ActivityPlaceholder = () => <div className="w-full h-[350px] bg-gray-100 rounded-xl animate-pulse" />
const SummaryPlaceholder = () => <div className="w-full h-[200px] bg-gray-100 rounded-xl animate-pulse" />
const ReorderPlaceholder = () => <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

export default function RetailerDashboard() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [customerFilter, setCustomerFilter] = useState('all');
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    
    // ✅ ALL API CALLS FIRE SIMULTANEOUSLY (PARALLEL)
    const { data: kpiData, isLoading: kpiLoading } = useGetRetailerKPIStatsQuery();
    const { data: salesData, isLoading: salesLoading } = useGetRetailerDailySalesQuery();
    const { data: topProductsData, isLoading: topProductsLoading } = useGetRetailerTopProductsQuery();
    const { data: customerData, isLoading: customerLoading } = useGetRetailerCustomerActivityQuery({ filter: customerFilter });
    const { data: transactionsData, isLoading: transactionsLoading } = useGetRetailerRecentTransactionsQuery({ mode: transactionFilter });
    const { data: lowStockData, isLoading: lowStockLoading } = useGetRetailerLowStockAlertsQuery({ filter: stockFilter });
    const { data: summaryData, isLoading: summaryLoading } = useGetRetailerTodaySummaryQuery();
    const { data: reorderData, isLoading: reorderLoading } = useGetRetailerQuickReorderQuery();
    
    // Extract data for props
    const kpiStats = kpiData?.data;
    const salesChart = salesData?.data;
    const topProducts = topProductsData?.data || [];
    const customers = customerData?.data || [];
    const transactions = transactionsData?.data || [];
    const lowStockItems = lowStockData?.data || [];
    const todaySummary = summaryData?.data;
    const reorderSuggestions = reorderData?.data || [];
    
    return (
        <div className="pb-20 lg:pb-0">
            <RetailerNavbar 
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
            />
            
            <main className={`transition-all duration-300 p-4 lg:p-6 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Header */}
                <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, Retail Store</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                    </div>
                </div>
                </div>

                    {/* Critical components - load with data */}
                    <RetailerKPIStatsCards stats={kpiStats} isLoading={kpiLoading} />
                    
                    <div className="mt-6">
                        <RetailerQuickActionsRow />
                    </div>

                    {/* All components with reserved space */}
                    <div className="mt-6" style={{ minHeight: '400px' }}>
                        <Suspense fallback={<ChartPlaceholder />}>
                            <DailySalesChart data={salesChart} isLoading={salesLoading} />
                        </Suspense>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div style={{ minHeight: '350px' }}>
                            <Suspense fallback={<ProductsPlaceholder />}>
                                <TopSellingProducts data={topProducts} isLoading={topProductsLoading} />
                            </Suspense>
                        </div>
                        <div style={{ minHeight: '350px' }}>
                            <Suspense fallback={<ActivityPlaceholder />}>
                                <CustomerActivity 
                                    data={customers} 
                                    isLoading={customerLoading} 
                                    onFilterChange={setCustomerFilter}
                                    activeFilter={customerFilter}
                                />
                            </Suspense>
                        </div>
                    </div>

                    <div className="mt-6" style={{ minHeight: '380px' }}>
                        <Suspense fallback={<TablePlaceholder />}>
                            <RecentTransactions 
                                data={transactions} 
                                isLoading={transactionsLoading}
                                onFilterChange={setTransactionFilter}
                                activeFilter={transactionFilter}
                            />
                        </Suspense>
                    </div>

                    <div className="mt-6" style={{ minHeight: '300px' }}>
                        <Suspense fallback={<AlertPlaceholder />}>
                            <LowStockAlerts 
                                data={lowStockItems} 
                                isLoading={lowStockLoading}
                                onFilterChange={setStockFilter}
                                activeFilter={stockFilter}
                            />
                        </Suspense>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div style={{ minHeight: '200px' }}>
                            <Suspense fallback={<SummaryPlaceholder />}>
                                <TodaysSummary data={todaySummary} isLoading={summaryLoading} />
                            </Suspense>
                        </div>
                        <div style={{ minHeight: '300px' }}>
                            <Suspense fallback={<ReorderPlaceholder />}>
                                <QuickReorder data={reorderSuggestions} isLoading={reorderLoading} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}