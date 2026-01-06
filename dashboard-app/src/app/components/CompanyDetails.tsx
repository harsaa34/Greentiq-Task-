'use client'

import { Star, MoreVertical, Pencil } from 'lucide-react'
import Image from 'next/image'

/* ================= TYPES ================= */

export interface Company {
  id: number
  name: string
  department?: string
  address?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  category?: string
  code?: string
  number?: string
  vat?: string
  business?: string
  updated_at?: string
}

/* ================= PROPS ================= */

interface CompanyDetailsProps {
  company?: Company
}

/* ================= COMPONENT ================= */

export default function CompanyDetails({ company }: CompanyDetailsProps) {
  const data: Company = company ?? {
    id: 1,
    name: 'SuperCompany Ltd ASA',
    department: 'Department Stockholm',
    address: 'Västgötagatan 5, 102 61 Stockholm',
    country: 'Sweden',
    phone: '+46 800 193 2820',
    email: 'info@sc.se',
    website: 'www.sc.se',
    category: 'Customer A',
    code: 'SUPERCO',
    number: '2002',
    vat: 'SE123456789',
    business: 'IT',
    updated_at: '18/09/2023 OG',
  }

  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow">

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
            <Image
              src="/Gemini_Generated_Image_21dm0421dm0421dm.png"
              alt={data.name}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{data.name}</h2>
              <Star size={16} className="text-orange-400" />
            </div>
            <p className="text-sm text-gray-500">{data.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ ORANGE CIRCLE + WHITE PENCIL */}
          <button className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition">
            <Pencil size={16} />
          </button>

          <button className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex items-center gap-5 mt-4 border-b pb-2 text-sm">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
          Company
        </span>
        <span className="text-gray-500 cursor-pointer hover:text-gray-700">More</span>
        <span className="text-gray-500 cursor-pointer hover:text-gray-700">Interest</span>
        <span className="text-gray-500 cursor-pointer hover:text-gray-700">Note</span>
        <span className="text-gray-500 cursor-pointer hover:text-gray-700">Market data</span>
        <span className="text-gray-500 cursor-pointer hover:text-gray-700">Misc</span>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
        <div className="space-y-2">
          <p>
            <span className="text-gray-500">Postal:</span>{' '}
            <span className="text-blue-600">{data.address}</span>
          </p>
          <p>
            <span className="text-gray-500">Country:</span> {data.country}
          </p>
          <p>
            <span className="text-gray-500">Phone:</span>{' '}
            <span className="text-blue-600">{data.phone}</span>{' '}
            <span className="text-gray-400 ml-1">Main</span>
          </p>
          <p>
            <span className="text-gray-500">Webaddress:</span>{' '}
            <span className="text-blue-600">{data.website}</span>
          </p>
          <p>
            <span className="text-gray-500">E-mail:</span>{' '}
            <span className="text-blue-600">{data.email}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <span className="text-gray-500">Category:</span> {data.category}
          </p>
          <p>
            <span className="text-gray-500">Code:</span> {data.code}
          </p>
          <p>
            <span className="text-gray-500">Number:</span> {data.number}
          </p>
          <p>
            <span className="text-gray-500">VAT No.:</span> {data.vat}
          </p>
          <p>
            <span className="text-gray-500">Business:</span> {data.business}
          </p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            Stop
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            No mailings
          </label>
        </div>

        <span>Updated: {data.updated_at}</span>
      </div>
    </div>
  )
}
