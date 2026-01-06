export interface Lead {
  id: number
  sale_name: string
  status: 'Open' | 'Lost' | 'Sold' | 'Stalled'
  amount: number
  stage: string
  stage_percentage: number
  sale_date: string
  next_activity_date: string
  created_at: string
}

export interface CompanyDetails {
  id: number
  name: string
  address: string
  phone: string
  email: string
  country: string
  category: string
  vat_number: string
  registration_number: string
  industry: string
  employees: number
  founded_year: number
  website: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}