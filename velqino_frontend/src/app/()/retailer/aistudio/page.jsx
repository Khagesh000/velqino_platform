"use client";

import React, { useState } from 'react';
import RetailerNavbar from '@/features/Retailer/RetailerDashboard/components/RetailerNavbar';
import AIStudio from '@/features/common/AIStudio/AIStudio';

export default function RetailerAIStudioPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 lg:pb-12">
      <RetailerNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main
        className={`transition-all duration-300 p-3 sm:p-5 lg:p-7 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <AIStudio sellerRole="retailer" />
      </main>
    </div>
  );
}
