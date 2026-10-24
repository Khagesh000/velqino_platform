"use client";

import React, { useState } from 'react';
import WholesaleNavbar from '@/features/Wholesaler/WholesalerDashboard/components/WholesaleNavbar';
import AIStudio from '@/features/common/AIStudio/AIStudio';

export default function WholesalerAIStudioPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WholesaleNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main
        className={`transition-all duration-300 p-3 sm:p-5 lg:p-7 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <AIStudio sellerRole="wholesaler" />
      </main>
    </div>
  );
}
