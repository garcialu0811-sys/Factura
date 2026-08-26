'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function InvoiceHistoryPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    fetchInvoices()
  }, [router, status])

  const fetchInvoices = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status,
      })
      if (search) params.append('search', search)

      const res = await fetch(`/api/invoices?${params}`)
      const data = await res.json()

      let fetchedInvoices = data.invoices || []
      
      // Client-side date filtering if dates are set
      if (startDate) {
        const start = new Date(startDate).getTime()
        fetchedInvoices = fetchedInvoices.filter((inv: any) => new Date(inv.date).getTime() >= start)
      }
      if (endDate) {
        const end = new Date(endDate).getTime() + 86400000 // include the whole day
        fetchedInvoices = fetchedInvoices.filter((inv: any) => new Date(inv.date).getTime() <= end)
      }

      setInvoices(fetchedInvoices)
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    fetchInvoices(1)
  }

  const handlePageChange = (page: number) => {
    fetchInvoices(page)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-50 text-green-600 border border-green-200/50',
      pending: 'bg-amber-50 text-amber-600 border border-amber-200/50',
      cancelled: 'bg-red-50 text-red-600 border border-red-200/50',
    }
    const labels: Record<string, string> = {
      paid: 'Pagado',
      pending: 'Pendiente',
      cancelled: 'Cancelado',
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="flex h-screen bg-[#f5f3ee] overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header title="Historial de Recibos" />
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/20">
                <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 stroke-[#c9a227] fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div>
                <h2 className="font-playfair text-xl font-bold text-gray-900 tracking-wide">
                  Historial de Recibos
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Consulta, busca y gestiona todos los recibos generados
                </p>
              </div>
            </div>

            <Link
              href="/invoices/new"
              className="py-2.5 px-5 bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold text-xs rounded-xl shadow-md shadow-amber-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 uppercase tracking-wider flex items-center gap-1.5 shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo Recibo
            </Link>
          </div>

          {/* Filters Section */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[250px] relative flex items-center">
              <svg className="absolute left-3 w-4 h-4 text-gray-400 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por número, cliente o concepto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 border border-gray-200 rounded-xl outline-none focus:border-[#c9a227] transition-all"
              />
            </div>

            {/* Status Selector */}
            <div className="relative min-w-[140px] flex items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold text-gray-600 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#c9a227] cursor-pointer appearance-none pr-8"
              >
                <option value="all">Todos los estados</option>
                <option value="paid">Pagado</option>
                <option value="pending">Pendiente</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <svg className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none fill-current" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            {/* Date Pickers */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl outline-none focus:border-[#c9a227] cursor-pointer bg-white"
                title="Fecha inicial"
              />
              <span className="text-gray-300 text-xs">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl outline-none focus:border-[#c9a227] cursor-pointer bg-white"
                title="Fecha final"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="py-2 px-5 bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold text-xs rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 uppercase tracking-wider flex items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              Buscar
            </button>
          </div>

          {/* Receipts Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-xs font-bold text-gray-400 tracking-wider">Cargando facturas...</div>
            ) : invoices.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-200 mb-3 fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                </svg>
                <p className="text-xs font-bold text-gray-400">No se encontraron facturas</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">No. Recibo</th>
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">Fecha</th>
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">Cliente</th>
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">No. de Orden</th>
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">Total</th>
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">Estado</th>
                        <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-extrabold text-[10px] uppercase py-3.5 px-6 tracking-wider text-left border-b border-[#a6872d]/20">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {invoices.map((invoice: any) => (
                        <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                          <td className="py-4 px-6 text-xs font-bold text-[#c9a227]">{invoice.invoiceNumber}</td>
                          <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                            {new Date(invoice.date).toLocaleDateString('es-GT')}
                          </td>
                          <td className="py-4 px-6 text-xs text-gray-700 font-semibold">{invoice.clientName}</td>
                          <td className="py-4 px-6 text-xs text-gray-600 font-semibold">{invoice.orderNumber || '—'}</td>
                          <td className="py-4 px-6 text-xs text-gray-900 font-bold">Q{invoice.total.toFixed(2)}</td>
                          <td className="py-4 px-6 text-xs">{getStatusBadge(invoice.status)}</td>
                          <td className="py-4 px-6 text-xs">
                            <div className="flex gap-2">
                              <Link
                                href={`/invoices/${invoice.id}`}
                                className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[#c9a227] hover:text-[#c9a227] hover:bg-amber-50/30 flex items-center justify-center transition-all text-gray-400"
                                title="Ver detalle"
                              >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                </svg>
                              </Link>
                              <Link
                                href={`/invoices/${invoice.id}?print=true`}
                                className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[#c9a227] hover:text-[#c9a227] hover:bg-amber-50/30 flex items-center justify-center transition-all text-gray-400"
                                title="Imprimir"
                              >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                  <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center py-4 px-6 border-t border-gray-50">
                  <div className="text-[11px] text-gray-400 font-bold tracking-wider uppercase">
                    Mostrando {((pagination.page - 1) * 10) + 1} a {Math.min(pagination.page * 10, pagination.total)} de {pagination.total} facturas
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all ${
                          page === pagination.page
                            ? 'bg-[#c9a227] text-white border-[#c9a227] shadow-sm shadow-amber-500/10'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
