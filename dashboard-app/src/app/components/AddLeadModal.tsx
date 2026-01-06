'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

/* ===================== TYPES ===================== */

interface Company {
  id: number
  name: string
}

type LeadStatus = 'Open' | 'Lost' | 'Sold' | 'Stalled'

interface LeadFormData {
  sale_name: string
  status: LeadStatus
  amount: number
  stage: string
  stage_percentage: number
  next_activity_date: string
}

interface AddLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (lead: LeadFormData & {
    company_id: number
    company_name: string
  }) => void
  selectedCompany?: Company
}

interface FormErrors {
  sale_name?: string
  amount?: string
  stage_percentage?: string
  next_activity_date?: string
}

/* ===================== COMPONENT ===================== */

const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedCompany
}) => {
  /* ---------- DEFAULT COMPANY ---------- */
  const defaultCompany: Company = {
    id: 1,
    name: 'SuperCompany Ltd ASA'
  }

  const company = selectedCompany ?? defaultCompany

  /* ---------- STATE ---------- */
  const [formData, setFormData] = useState<LeadFormData>({
    sale_name: '',
    status: 'Open',
    amount: 0,
    stage: 'Proposal',
    stage_percentage: 50,
    next_activity_date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  /* ---------- VALIDATION ---------- */
  const validateField = (name: keyof LeadFormData, value: any): string | undefined => {
    switch (name) {
      case 'sale_name':
        if (!value?.trim()) return 'Sale name is required'
        if (value.length > 100) return 'Sale name must be less than 100 characters'
        return undefined
        
      case 'amount':
        if (value <= 0) return 'Amount must be greater than 0'
        if (value > 999999999.99) return 'Amount is too large'
        return undefined
        
      case 'stage_percentage':
        if (value < 0 || value > 100) return 'Stage percentage must be between 0 and 100'
        return undefined
        
      case 'next_activity_date':
        if (!value) return 'Next activity date is required'
        return undefined
        
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof LeadFormData, formData[key as keyof LeadFormData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ---------- HANDLERS ---------- */
  const handleChange = (name: keyof LeadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (name: keyof LeadFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        ...formData,
        company_id: company.id,
        company_name: company.name
      })
      
      // Reset on success
      setFormData({
        sale_name: '',
        status: 'Open',
        amount: 0,
        stage: 'Proposal',
        stage_percentage: 50,
        next_activity_date: new Date().toISOString().split('T')[0]
      })
      setErrors({})
      setTouched({})
      onClose()
    } catch (error) {
      console.error('Failed to submit lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------- OPTIONS ---------- */
  const statusOptions: LeadStatus[] = ['Open', 'Lost', 'Sold', 'Stalled']
  const stageOptions = [
    'Prospecting',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ]

  if (!isOpen) return null

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Lead
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              For:{' '}
              <span className="font-medium text-blue-600">
                {company.name}
              </span>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* ---------- FORM ---------- */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">

          {/* Company Preview */}
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-bold text-blue-600">
                  {company.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {company.name}
                </p>
                <p className="text-xs text-gray-500">
                  Company ID: {company.id}
                </p>
              </div>
            </div>
          </div>

          {/* Sale Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sale Name *
            </label>
            <input
              type="text"
              value={formData.sale_name}
              onChange={(e) => handleChange('sale_name', e.target.value)}
              onBlur={() => handleBlur('sale_name')}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                errors.sale_name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter sale name"
              disabled={isSubmitting}
            />
            {errors.sale_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.sale_name}
              </p>
            )}
          </div>

          {/* Status & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                disabled={isSubmitting}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('amount')}
                className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.amount 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                disabled={isSubmitting}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Stage & Percentage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                disabled={isSubmitting}
              >
                {stageOptions.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stage %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.stage_percentage}
                onChange={(e) => handleChange('stage_percentage', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('stage_percentage')}
                className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.stage_percentage 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                disabled={isSubmitting}
              />
              {errors.stage_percentage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stage_percentage}
                </p>
              )}
            </div>
          </div>

          {/* Next Activity Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Next Activity Date *
            </label>
            <input
              type="date"
              value={formData.next_activity_date}
              onChange={(e) => handleChange('next_activity_date', e.target.value)}
              onBlur={() => handleBlur('next_activity_date')}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                errors.next_activity_date 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={isSubmitting}
            />
            {errors.next_activity_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.next_activity_date}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Lead'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddLeadModal