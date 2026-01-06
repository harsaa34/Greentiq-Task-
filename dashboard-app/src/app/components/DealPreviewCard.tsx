'use client'

import {
  ListFilter,
  DollarSign,
  Calendar,
  ClipboardList,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

interface Activity {
  date: string
  title: string
}

interface Deal {
  sale_name: string
  amount: number
  currency?: string
  company_name?: string
  contact_name?: string
  sale_date?: string
  owner?: string
  status?: string
  stage_percentage?: number
  sale_type?: string
  activities?: Activity[]
  stakeholders?: string[]
}

interface DealPreviewCardProps {
  deal?: Deal
}

export default function DealPreviewCard({ deal }: DealPreviewCardProps) {
  if (!deal) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 h-full flex items-center justify-center text-gray-400 text-sm">
        Select a deal to preview
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5 h-full flex flex-col">

      {/* HEADER ICONS */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-gray-400">
          <ListFilter size={16} />
          <DollarSign size={16} />
          <Calendar size={16} />
          <ClipboardList size={16} />
          <Sparkles size={16} className="text-emerald-500" />
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* PREVIEW */}
      <p className="text-[11px] text-gray-400 tracking-wide font-medium mb-3">
        PREVIEW
      </p>

      {/* TITLE */}
      <div className="flex gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold">
          S
        </div>

        <div>
          <h3 className="text-[15px] font-semibold text-blue-600 leading-tight">
            {deal.sale_name}
          </h3>
          <p className="text-sm text-gray-500">
            {deal.amount.toLocaleString()} {deal.currency ?? 'EUR'}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="text-sm space-y-2 text-gray-700 mb-5">
        <Detail label="Company" value={deal.company_name} link />
        <Detail label="Contact" value={deal.contact_name} link />
        <Detail label="Sale date" value={deal.sale_date} />
        <Detail label="Owner" value={deal.owner} />
        <Detail label="Sale type" value={deal.sale_type} />
        <Detail
          label="Status"
          value={`${deal.status ?? 'Open'} (${deal.stage_percentage ?? 0}%)`}
        />
      </div>

      <Divider />

      {/* ACTIVITIES */}
      <section className="mb-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Activities
        </h4>

        {deal.activities?.length ? (
          <ul className="space-y-1 text-sm">
            {deal.activities.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-gray-400 w-[80px]">
                  {a.date}
                </span>
                <span className="text-blue-600 truncate">
                  {a.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No activities</p>
        )}
      </section>

      <Divider />

      {/* STAKEHOLDERS */}
      <section>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Stakeholders
        </h4>

        {deal.stakeholders?.length ? (
          <ul className="text-sm text-gray-700 space-y-1">
            {deal.stakeholders.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No stakeholders</p>
        )}
      </section>
    </div>
  )
}

/* ---------- Small helpers ---------- */

function Detail({
  label,
  value,
  link,
}: {
  label: string
  value?: string
  link?: boolean
}) {
  return (
    <p>
      <span className="text-gray-400">{label}:</span>{' '}
      {link ? (
        <span className="text-blue-600 cursor-pointer">
          {value ?? '—'}
        </span>
      ) : (
        <span>{value ?? '—'}</span>
      )}
    </p>
  )
}

function Divider() {
  return <div className="border-t my-4" />
}
