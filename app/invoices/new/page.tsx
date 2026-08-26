'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import InvoicePreview from '@/components/InvoicePreview'

interface InvoiceItem {
  description: string
  amount: number
  quantity: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    clientCity: '',
    clientPhone: '',
    orderNumber: '',
    notes: '',
  })
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', amount: 0, quantity: 1 },
  ])
  const [invoiceNumber, setInvoiceNumber] = useState('R-0001247')
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    fetchNextInvoiceNumber()
  }, [router])

  const fetchNextInvoiceNumber = async () => {
    try {
      const res = await fetch('/api/invoices?limit=1')
      const data = await res.json()
      if (data.invoices && data.invoices.length > 0) {
        const lastNum = parseInt(data.invoices[0].invoiceNumber.replace('R-', ''))
        setInvoiceNumber(`R-${String(lastNum + 1).padStart(7, '0')}`)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: '', amount: 0, quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.amount * item.quantity), 0)
  }

  const handleSave = async () => {
    if (!formData.clientName) {
      setMessage({ type: 'error', text: 'El nombre del cliente es obligatorio' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.filter(item => item.description || item.amount > 0),
        }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Factura guardada exitosamente' })
        setTimeout(() => {
          router.push('/invoices/history')
        }, 1500)
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la factura' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    }

    setSaving(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const element = document.getElementById('invoice-preview-print')
      if (!element) {
        setMessage({ type: 'error', text: 'No se pudo encontrar la vista previa del recibo' })
        setDownloading(false)
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
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / (imgWidth / 2.835), pdfHeight / (imgHeight / 2.835))
      const imgX = (pdfWidth - (imgWidth / 2.835) * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, (imgWidth / 2.835) * ratio, (imgHeight / 2.835) * ratio)
      pdf.save(`${invoiceNumber}.pdf`)
    } catch (err) {
      console.error('Error generando PDF:', err)
      setMessage({ type: 'error', text: 'Error al generar el PDF' })
    }
    setDownloading(false)
  }

  const previewData = {
    invoiceNumber,
    date: new Date().toISOString(),
    orderNumber: formData.orderNumber,
    clientName: formData.clientName,
    clientAddress: formData.clientAddress,
    clientCity: formData.clientCity,
    clientPhone: formData.clientPhone,
    items,
    total: calculateTotal(),
  }

  return (
    <div className="flex h-screen bg-[#f5f3ee] overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header title="Nuevo Recibo" />
        
        <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
          
          {/* Status Message */}
          {message.text && (
            <div className={`px-4 py-3 rounded-xl mb-4 text-xs font-semibold shadow-sm border ${
              message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form and Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 flex-1 min-h-0 overflow-hidden">
            
            {/* ─── FORM COLUMN ─── */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-y-auto flex flex-col">
              {/* Form header band */}
              <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #dfba4d, #c1952e)' }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4z"/>
                    <line x1="12" y1="18" x2="12" y2="12" stroke="white" strokeWidth="1.5" fill="none"/>
                    <line x1="9" y1="15" x2="15" y2="15" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm tracking-wide">Generar Nuevo Recibo</h2>
                  <p className="text-[10px] text-gray-400 font-medium">Complete el formulario para crear el recibo</p>
                </div>
              </div>

              <div className="px-5 py-4 flex flex-col flex-1 justify-between">
                <div>
                  {/* Meta Inputs: No, Date, Order */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Nº Recibo
                      </label>
                      <div className="relative flex items-center">
                        <svg className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        </svg>
                        <input
                          type="text"
                          value={invoiceNumber}
                          readOnly
                          className="pl-8 pr-2 py-2 bg-gray-50 text-gray-400 font-bold border border-gray-200 rounded-lg text-xs w-full outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Fecha
                      </label>
                      <div className="relative flex items-center">
                        <svg className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <input
                          type="text"
                          value={new Date().toLocaleDateString('es-GT')}
                          readOnly
                          className="pl-8 pr-2 py-2 bg-gray-50 text-gray-400 font-bold border border-gray-200 rounded-lg text-xs w-full outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        No. Orden
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-gray-400">#</span>
                        <input
                          type="text"
                          placeholder="ORD-000000"
                          value={formData.orderNumber}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          className="pl-7 pr-2 py-2 bg-white text-gray-800 font-semibold border border-gray-200 rounded-lg text-xs w-full outline-none focus:border-[#c9a227] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sold To Section */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-extrabold text-[#c9a227] uppercase tracking-widest">Sold to:</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  
                  <div className="grid grid-cols-[110px_1fr] items-center gap-x-3 gap-y-2.5 mb-5">
                    <span className="text-[11px] font-bold text-gray-600">Nombre del Cliente</span>
                    <div className="relative flex items-center">
                      <svg className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Ingrese el nombre del cliente"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="pl-8 pr-3 py-2 w-full text-xs font-medium text-gray-800 border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all placeholder-gray-300"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-gray-600">Dirección</span>
                    <div className="relative flex items-center">
                      <svg className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Ingrese la dirección"
                        value={formData.clientAddress}
                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        className="pl-8 pr-3 py-2 w-full text-xs font-medium text-gray-800 border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all placeholder-gray-300"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-gray-600">Ciudad / ZIP</span>
                    <div className="relative flex items-center">
                      <svg className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Ingrese ciudad y código postal"
                        value={formData.clientCity}
                        onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })}
                        className="pl-8 pr-3 py-2 w-full text-xs font-medium text-gray-800 border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all placeholder-gray-300"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-gray-600">Teléfono</span>
                    <div className="relative flex items-center">
                      <svg className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 fill-current" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Ingrese número de teléfono"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        className="pl-8 pr-3 py-2 w-full text-xs font-medium text-gray-800 border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all placeholder-gray-300"
                      />
                    </div>
                  </div>

                  {/* Items Detail Section */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-extrabold text-[#c9a227] uppercase tracking-widest">Detalle del Recibo</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse mb-2">
                      <thead>
                        <tr className="bg-gray-50 rounded-lg">
                          <th className="text-left py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider rounded-l-lg">Descripción</th>
                          <th className="text-center py-2 px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider w-14">Cant.</th>
                          <th className="text-right py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider w-24">Monto</th>
                          <th className="w-8 rounded-r-lg" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                placeholder="Descripción del producto o servicio"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs font-medium border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all placeholder-gray-300"
                              />
                            </td>
                            <td className="py-2 px-1">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-full text-center px-1.5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all"
                              />
                            </td>
                            <td className="py-2 px-1">
                              <input
                                type="number"
                                placeholder="0.00"
                                value={item.amount || ''}
                                onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                className="w-full text-right px-2 py-1.5 text-xs font-bold border border-gray-200 rounded-lg outline-none focus:border-[#c9a227] transition-all"
                              />
                            </td>
                            <td className="py-2 px-1">
                              <button
                                onClick={() => removeItem(index)}
                                className="w-7 h-7 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center rounded-lg transition-colors"
                                title="Eliminar ítem"
                              >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={addItem}
                    className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-[#c9a227]/40 text-[#c9a227] hover:border-[#c9a227] hover:bg-amber-50/40 rounded-xl font-bold text-xs transition-all duration-200 mt-1"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Agregar Ítem
                  </button>
                </div>

                {/* Total and Actions */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <div className="flex justify-end items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total:</span>
                    <div className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] rounded-xl px-5 py-2 font-black text-sm min-w-[130px] text-right shadow-sm">
                      Q{calculateTotal().toFixed(2)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Row 1: Clear + Save */}
                    <button
                      onClick={() => {
                        setFormData({ clientName: '', clientAddress: '', clientCity: '', clientPhone: '', orderNumber: '', notes: '' })
                        setItems([{ description: '', amount: 0, quantity: 1 }])
                      }}
                      className="py-2.5 border border-gray-200 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                      Limpiar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="py-2.5 bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] rounded-xl font-bold text-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                      </svg>
                      {saving ? 'Guardando...' : 'Guardar'}
                    </button>

                    {/* Row 2: Print + Download PDF */}
                    <button
                      onClick={handlePrint}
                      className="py-2.5 bg-amber-50 border border-[#c9a227]/40 text-[#c9a227] rounded-xl font-bold text-xs hover:bg-[#c9a227] hover:text-white transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                      </svg>
                      Imprimir
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={downloading}
                      className="py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold text-xs transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {downloading ? (
                        <>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current animate-spin">
                            <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
                          </svg>
                          Generando...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                          </svg>
                          Descargar PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ─── PREVIEW COLUMN ─── */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-y-auto flex flex-col">
              <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#c9a227]">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Vista previa del recibo</span>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                <InvoicePreview data={previewData} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
