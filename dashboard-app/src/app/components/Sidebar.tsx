'use client'

import React, { useState } from 'react'
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  DollarSign,
  FileText,
  Workflow,
  Mail,
  ClipboardList,
  BarChart3,
  Target,
  Settings,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  DollarSign,
  FileText,
  Workflow,
  Mail,
  ClipboardList,
  BarChart3,
  Target,
]

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(1) // default active like screenshot

  return (
    <aside className="w-16 h-screen bg-[#065f52] flex flex-col items-center py-6 shadow-xl">
      
      {/* Logo */}
      <div className="text-white text-3xl font-light mb-8">L</div>

      {/* Nav */}
      <div className="flex flex-col gap-3">
        {navItems.map((Icon, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                w-10 h-10 flex items-center justify-center
                transition-all duration-200
                ${isActive ? 'bg-white rounded-full' : 'rounded-full'}
                hover:bg-white
              `}
            >
              <Icon
                size={18}
                strokeWidth={1.6}
                className={`
                  transition-colors duration-200
                  ${isActive ? 'text-[#065f52]' : 'text-white'}
                  group-hover:text-[#065f52]
                `}
              />
            </button>
          )
        })}
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-6 items-center pt-6">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition">
          <Settings size={18} className="text-white hover:text-[#065f52]" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition">
          <ChevronRight size={18} className="text-white hover:text-[#065f52]" />
        </button>
      </div>
    </aside>
  )
}
