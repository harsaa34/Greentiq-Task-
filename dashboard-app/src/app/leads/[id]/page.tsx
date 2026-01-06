'use client'

import { useEffect, useState } from 'react'
import DealPreviewCard from '../../components/DealPreviewCard'
import CompanyDetails from '../../components/CompanyDetails'

export default function LeadPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/leads/${params.id}`)
      .then(res => res.json())
      .then(data => setDeal(data))
  }, [params.id])

  if (!deal) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <CompanyDetails company={deal} />
      </div>
      <div className="col-span-1">
        <DealPreviewCard deal={deal} />
      </div>
    </div>
  )
}
