'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Check,
  X,
  CircleDollarSign,
  Plus,
  Trash2,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import AddLeadModal from './AddLeadModal'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'

/* ===================== STYLES ===================== */

const statusStyles: Record<string, string> = {
  Open: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-red-100 text-red-600',
  Sold: 'bg-emerald-600 text-white',
  Stalled: 'bg-orange-100 text-orange-700',
}

/* ===================== TYPES ===================== */

interface Lead {
  id: number
  sale_name: string
  status: string
  amount: number
  stage: string
  stage_percentage: number
  sale_date: string
  next_activity_date: string | null
  created_at: string
}

interface Company {
  id: number
  name: string
}

interface SalesTableProps {
  selectedCompany?: Company
  onSelectLead?: (lead: Lead) => void
}

/* ===================== COMPONENT ===================== */

export default function SalesTable({
  selectedCompany,
  onSelectLead,
}: SalesTableProps) {
  const [sales, setSales] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  /* Pagination */
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 3

  const company = selectedCompany ?? {
    id: 1,
    name: 'SuperCompany Ltd ASA',
  }

  /* ===================== FETCH ===================== */

  const fetchLeads = async () => {
    try {
      setLoading(true)

      const res = await fetch(
        `/api/leads?companyId=${company.id}&page=${page}&limit=${limit}`
      )

      if (!res.ok) throw new Error('Failed to fetch leads')

      const json = await res.json()

      setSales(json.data || [])
      setTotalPages(json.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ===================== CREATE ===================== */

  const createLead = async (lead: any) => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })

    setIsModalOpen(false)
    setPage(1) // go back to first page
    fetchLeads()
  }

  /* ===================== REACT TABLE COLUMNS ===================== */

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => <div className="w-10"></div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3 text-center">
            <div className="w-4 h-4 rounded border border-emerald-400 flex items-center justify-center">
              {activeId === row.original.id && (
                <Check size={12} className="text-emerald-600" />
              )}
            </div>
          </div>
        ),
      },
      {
        id: 'status',
        header: () => <div className="p-3 text-left">Status</div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                statusStyles[row.original.status]
              }`}
            >
              {row.original.status === 'Lost' ? (
                <X size={12} />
              ) : (
                <Check size={12} />
              )}
              {row.original.status}
            </span>
          </div>
        ),
      },
      {
        id: 'sale_date',
        header: () => <div className="p-3 text-center">Sale date</div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3 text-center">
            {new Date(row.original.sale_date).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: 'amount',
        header: () => <div className="p-3 text-center">Amount</div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3 text-center">
            € {Number(row.original.amount).toFixed(2)}
          </div>
        ),
      },
      {
        id: 'stage',
        header: () => <div className="p-3 text-center">Stage ↓</div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3 text-center">
            {row.original.stage} ({row.original.stage_percentage}%)
          </div>
        ),
      },
      {
        id: 'next_activity_date',
        header: () => <div className="p-3 text-center">Next activity</div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3 text-center">
            {row.original.next_activity_date
              ? new Date(row.original.next_activity_date).toLocaleDateString()
              : '-'}
          </div>
        ),
      },
      {
        id: 'sale_name',
        header: () => <div className="p-3 text-left">Sale name</div>,
        cell: ({ row }: { row: { original: Lead } }) => (
          <div className="p-3">{row.original.sale_name}</div>
        ),
      },
    ],
    [activeId]
  )

  /* ===================== REACT TABLE ===================== */

  const table = useReactTable({
    data: sales,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  })

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    fetchLeads()
  }, [company.id, page])

  /* ===================== UI ===================== */

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow h-full flex items-center justify-center">
        <span className="text-gray-500">Loading sales…</span>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500">
              <tr>
                {table.getHeaderGroups().map((headerGroup) => (
                  headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))
                ))}
              </tr>
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    setActiveId(row.original.id)
                    onSelectLead?.(row.original)
                  }}
                  className={`border-t cursor-pointer ${
                    activeId === row.original.id
                      ? 'bg-teal-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-orange-600 hover:underline"
            >
              <Plus size={14} /> Add
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <Trash2 size={14} /> Delete
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <Download size={14} /> Export
            </button>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <CircleDollarSign size={16} className="text-gray-400" />
        </div>
      </div>

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createLead}
        selectedCompany={company}
      />
    </>
  )
}