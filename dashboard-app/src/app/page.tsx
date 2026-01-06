'use client'

import { useState, Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'

import CompanyDetails from './components/CompanyDetails'
import SalesTable from './components/SalesTable'

// Dynamically import components with loading states
const Tabs = dynamic(() => import('./components/Tabs'), {
  loading: () => (
    <div className="p-3 border-b">
      <div className="flex gap-6">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  ),
  ssr: false
})

// Lazy load DealPreviewCard with skeleton
const DealPreviewCard = dynamic(() => import('./components/DealPreviewCard'), {
  loading: () => (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false
})

export default function Page() {
  const [activeTab, setActiveTab] = useState('Sales')
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  return (
    <div className="h-full grid grid-cols-[1fr_360px] gap-6">

      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-6 h-full">
        <CompanyDetails />

        <div className="bg-white rounded-xl shadow flex flex-col h-full overflow-hidden">
          {/* Tabs with suspense boundary */}
          <Suspense fallback={
            <div className="p-3 border-b">
              <div className="flex gap-6">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          }>
            <div className="p-3 border-b">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </Suspense>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'Sales' && (
              <SalesTable onSelectLead={setSelectedLead} />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Lazy loaded DealPreviewCard */}
      <Suspense fallback={
        <div className="bg-white rounded-xl shadow p-6">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      }>
        <DealPreviewCard deal={selectedLead} />
      </Suspense>
    </div>
  )
}