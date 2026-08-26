'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    cancelled: 0,
    totalAmount: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/invoices?limit=5')
      const data = await res.json()
      
      const allRes = await fetch('/api/invoices?limit=100')
      const allData = await allRes.json()
      
      const invoices = allData.invoices || []
      
      setStats({
        total: invoices.length,
        paid: invoices.filter((i: any) => i.status === 'paid').length,
        pending: invoices.filter((i: any) => i.status === 'pending').length,
        cancelled: invoices.filter((i: any) => i.status === 'cancelled').length,
        totalAmount: invoices.reduce((sum: number, i: any) => sum + i.total, 0),
      })
      
      setRecentInvoices(data.invoices || [])
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
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
    <div className="flex h-screen bg-[#f5f3ee] overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header title="Dashboard" />
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-gold-100 to-cream-50 border border-[#e5dec9]/30 rounded-2xl p-8 mb-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-[-30px] right-[-30px] width-[150px] height-[150px] bg-gradient-to-br from-[#dfba4d] to-[#c1952e] rounded-full opacity-[0.08]"></div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 tracking-wide mb-1">
              Bienvenido al Sistema de Facturación
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Gestiona tus facturas de manera fácil y profesional
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {/* Total */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Facturas</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>

            {/* Pagadas */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Pagadas</div>
              <div className="text-2xl font-bold text-gray-900">{stats.paid}</div>
            </div>

            {/* Pendientes */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Pendientes</div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            </div>

            {/* Canceladas */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                </svg>
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Canceladas</div>
              <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
            </div>
          </div>

          {/* Recent Invoices Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair text-lg font-bold text-gray-900 tracking-wide">
                Facturas Recientes
              </h3>
              <Link href="/invoices/history" className="text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1">
                Ver todas <span>→</span>
              </Link>
            </div>
            
            <div className="overflow-x-auto -mx-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-6 bg-[#fcfbfa] text-[10px] font-bold text-gray-400 uppercase tracking-wider">No. Factura</th>
                    <th className="text-left py-3 px-6 bg-[#fcfbfa] text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                    <th className="text-left py-3 px-6 bg-[#fcfbfa] text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                    <th className="text-left py-3 px-6 bg-[#fcfbfa] text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="text-left py-3 px-6 bg-[#fcfbfa] text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="text-left py-3 px-6 bg-[#fcfbfa] text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-xs font-bold text-[#c9a227]">{invoice.invoiceNumber}</td>
                      <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                        {new Date(invoice.date).toLocaleDateString('es-GT')}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-700 font-semibold">{invoice.clientName}</td>
                      <td className="py-4 px-6 text-xs text-gray-900 font-bold">Q{invoice.total.toFixed(2)}</td>
                      <td className="py-4 px-6 text-xs">{getStatusBadge(invoice.status)}</td>
                      <td className="py-4 px-6 text-xs">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[#c9a227] hover:bg-amber-50/40 flex items-center justify-center transition-colors text-gray-400 hover:text-[#c9a227]"
                          title="Ver detalle"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {recentInvoices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gray-400 font-medium">
                        No hay facturas recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/invoices/new"
              className="flex-1 py-4 bg-white border-2 border-dashed border-[#c9a227]/40 text-[#c9a227] hover:border-[#c9a227] hover:bg-gradient-to-r hover:from-[#dfba4d] hover:to-[#c1952e] hover:text-[#4a3505] rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nueva Factura
            </Link>
            <Link
              href="/invoices/history"
              className="flex-1 py-4 bg-white border-2 border-dashed border-[#c9a227]/40 text-[#c9a227] hover:border-[#c9a227] hover:bg-gradient-to-r hover:from-[#dfba4d] hover:to-[#c1952e] hover:text-[#4a3505] rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3" />
                <path d="M3.05 11a9 9 0 1 1 .1 4" />
              </svg>
              Ver Historial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
