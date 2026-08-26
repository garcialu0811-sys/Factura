'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import InvoicePreview from '@/components/InvoicePreview'

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    fetchInvoice()
  }, [router, params.id])

  useEffect(() => {
    if (searchParams.get('print') === 'true' && invoice) {
      setTimeout(() => window.print(), 500)
    }
  }, [invoice, searchParams])

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      } else {
        router.push('/invoices/history')
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setInvoice({ ...invoice, status: newStatus })
        setMessage({ type: 'success', text: 'Estado actualizado exitosamente' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar' })
    }
    setUpdating(false)
  }

  const deleteInvoice = async () => {
    if (!confirm('¿Estás seguro de eliminar esta factura?')) return

    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/invoices/history')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar' })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const element = document.getElementById('invoice-preview-print')
      if (!element) {
        setMessage({ type: 'error', text: 'No se pudo generar el PDF' })
        return
      }

      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pdfWidth / (canvas.width / 2.835), pdfHeight / (canvas.height / 2.835))
      const imgX = (pdfWidth - (canvas.width / 2.835) * ratio) / 2

      pdf.addImage(imgData, 'PNG', imgX, 0, (canvas.width / 2.835) * ratio, (canvas.height / 2.835) * ratio)
      pdf.save(`${invoice.invoiceNumber}.pdf`)
    } catch (err) {
      console.error('Error generando PDF:', err)
      setMessage({ type: 'error', text: 'Error al generar el PDF' })
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
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f5f3ee] overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-xs font-bold text-gray-400">
          <p>Cargando recibo...</p>
        </div>
      </div>
    )
  }

  if (!invoice) return null

  const previewData = {
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.date,
    orderNumber: invoice.orderNumber || '',
    clientName: invoice.clientName,
    clientAddress: invoice.clientAddress || '',
    clientCity: invoice.clientCity || '',
    clientPhone: invoice.clientPhone || '',
    items: invoice.items,
    total: invoice.total,
  }

  return (
    <div className="flex h-screen bg-[#f5f3ee] overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header title={`Recibo ${invoice.invoiceNumber}`} />
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Status Alert popup */}
          {message.text && (
            <div className={`px-4 py-3 rounded-xl mb-4 text-xs font-semibold shadow-sm border ${
              message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Page Toolbar (No-Print) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[#c9a227] fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <h2 className="font-playfair text-xl font-bold text-gray-900 tracking-wide">
                Detalle del Recibo
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => router.back()}
                className="py-2 px-4 border border-gray-200 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-wider flex items-center gap-1.5"
              >
                ← Volver
              </button>
              <button
                onClick={handlePrint}
                className="py-2 px-4 bg-amber-50 border border-[#c9a227]/40 text-[#c9a227] rounded-xl font-bold text-xs hover:bg-[#c9a227] hover:text-white transition-all uppercase tracking-wider flex items-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                </svg>
                Imprimir
              </button>
              <button
                onClick={handleDownload}
                className="py-2 px-4 bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] rounded-xl font-bold text-xs hover:shadow-md transition-all uppercase tracking-wider flex items-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                Descargar PDF
              </button>
              <button
                onClick={deleteInvoice}
                className="py-2 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>

          {/* Detail Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            
            {/* Details Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              
              {/* Status Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4 no-print">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</span>
                  {getStatusBadge(invoice.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus('paid')}
                    disabled={updating || invoice.status === 'paid'}
                    className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-150 hover:bg-green-100 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
                  >
                    Marcar Pagado
                  </button>
                  <button
                    onClick={() => updateStatus('pending')}
                    disabled={updating || invoice.status === 'pending'}
                    className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-150 hover:bg-amber-100 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
                  >
                    Marcar Pendiente
                  </button>
                  <button
                    onClick={() => updateStatus('cancelled')}
                    disabled={updating || invoice.status === 'cancelled'}
                    className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-150 hover:bg-red-100 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              {/* Info fields layout */}
              <span className="block text-[10px] font-bold text-[#c9a227] uppercase tracking-widest border-b border-gray-50 pb-1.5">
                Información del Recibo
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">No. Recibo</div>
                  <div className="text-xs font-bold text-gray-800">{invoice.invoiceNumber}</div>
                </div>
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Fecha</div>
                  <div className="text-xs font-bold text-gray-800">
                    {new Date(invoice.date).toLocaleDateString('es-GT')}
                  </div>
                </div>
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Cliente</div>
                  <div className="text-xs font-bold text-gray-800">{invoice.clientName}</div>
                </div>
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">No. Orden</div>
                  <div className="text-xs font-bold text-gray-800">{invoice.orderNumber || '—'}</div>
                </div>
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Dirección</div>
                  <div className="text-xs font-bold text-gray-800">{invoice.clientAddress || '—'}</div>
                </div>
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Ciudad</div>
                  <div className="text-xs font-bold text-gray-800">{invoice.clientCity || '—'}</div>
                </div>
                <div className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl col-span-2">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Teléfono</div>
                  <div className="text-xs font-bold text-gray-800">{invoice.clientPhone || '—'}</div>
                </div>
              </div>

              {/* Items Detail List */}
              <span className="block text-[10px] font-bold text-[#c9a227] uppercase tracking-widest border-b border-gray-50 pb-1.5 mt-2">
                Conceptos del Recibo
              </span>
              
              <div className="flex flex-col gap-2">
                {invoice.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50/60 border border-gray-100 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800">{item.description}</span>
                      <span className="text-[10px] text-gray-400 font-medium">Cantidad: {item.quantity || 1}</span>
                    </div>
                    <span className="text-xs font-extrabold text-[#c9a227]">
                      Q{(item.amount * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Box */}
              <div className="mt-4 p-4 bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] rounded-xl flex justify-between items-center shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-widest">TOTAL</span>
                <span className="text-xl font-black">Q{invoice.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Preview Sidebar */}
            <div className="sticky top-6">
              <InvoicePreview data={previewData} />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
