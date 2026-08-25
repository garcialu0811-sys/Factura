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
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF()

    // Add logo image
    const logoImg = new Image()
    logoImg.src = '/logo-login.png'
    await new Promise((resolve) => {
      logoImg.onload = resolve
    })
    doc.addImage(logoImg, 'PNG', 20, 15, 60, 20)

    // Invoice badge
    doc.setFillColor(201, 162, 39)
    doc.roundedRect(140, 20, 50, 12, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('FACTURA', 165, 28, { align: 'center' })

    doc.setTextColor(201, 162, 39)
    doc.setFontSize(14)
    doc.text(invoice.invoiceNumber, 165, 42, { align: 'center' })

    // Meta info
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString('es-GT')}`, 20, 65)
    if (invoice.orderNumber) {
      doc.text(`No. de Orden: ${invoice.orderNumber}`, 120, 65)
    }

    // Client section
    doc.setFillColor(245, 243, 238)
    doc.roundedRect(20, 75, 170, 35, 2, 2, 'F')
    
    doc.setFillColor(201, 162, 39)
    doc.roundedRect(20, 75, 40, 8, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text('RECIBIDO DE', 40, 80, { align: 'center' })

    doc.setTextColor(42, 42, 42)
    doc.setFontSize(10)
    doc.text(`Nombre: ${invoice.clientName}`, 25, 90)
    doc.text(`Dirección: ${invoice.clientAddress || '—'}`, 25, 96)
    doc.text(`Ciudad: ${invoice.clientCity || '—'}`, 25, 102)
    doc.text(`Teléfono: ${invoice.clientPhone || '—'}`, 110, 90)

    // Items table
    const items = invoice.items.map((item: any) => [
      item.description,
      item.quantity.toString(),
      `Q${item.amount.toFixed(2)}`
    ])

    autoTable(doc, {
      startY: 120,
      head: [['Descripción', 'Cantidad', 'Monto']],
      body: items,
      theme: 'grid',
      headStyles: {
        fillColor: [201, 162, 39],
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
      },
      columnStyles: {
        1: { halign: 'center', cellWidth: 30 },
        2: { halign: 'right', cellWidth: 40 },
      },
    })

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 120
    doc.setFillColor(245, 243, 238)
    doc.roundedRect(120, finalY + 10, 70, 15, 2, 2, 'F')
    doc.setDrawColor(201, 162, 39)
    doc.roundedRect(120, finalY + 10, 70, 15, 2, 2, 'S')
    
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(10)
    doc.text('TOTAL:', 125, finalY + 20)
    doc.setTextColor(201, 162, 39)
    doc.setFontSize(14)
    doc.text(`Q${invoice.total.toFixed(2)}`, 185, finalY + 20, { align: 'right' })

    // Thank you
    doc.setFontSize(16)
    doc.setTextColor(201, 162, 39)
    doc.text('¡Gracias por su preferencia!', 105, finalY + 35, { align: 'center' })

    // Signatures
    doc.setDrawColor(42, 42, 42)
    doc.line(30, finalY + 60, 80, finalY + 60)
    doc.line(120, finalY + 60, 170, finalY + 60)

    doc.setTextColor(42, 42, 42)
    doc.setFontSize(10)
    doc.text('Jose Gomez', 55, finalY + 67, { align: 'center' })
    doc.text('Cliente', 145, finalY + 67, { align: 'center' })

    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    doc.text('Firma del Dueño', 55, finalY + 72, { align: 'center' })
    doc.text('Firma del Cliente', 145, finalY + 72, { align: 'center' })

    // Footer
    doc.setFontSize(8)
    doc.text('© 2026 LG Art Sculptor Studio, Inc. Todos los derechos reservados.', 105, 285, { align: 'center' })

    doc.save(`${invoice.invoiceNumber}.pdf`)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      paid: { background: '#dcfce7', color: '#16a34a' },
      pending: { background: '#fef3c7', color: '#d97706' },
      cancelled: { background: '#fee2e2', color: '#dc2626' },
    }
    const labels: Record<string, string> = {
      paid: 'Pagado',
      pending: 'Pendiente',
      cancelled: 'Cancelado',
    }
    return (
      <span style={{
        ...styles[status],
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 600,
      }}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-cream-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Cargando factura...</p>
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
    <div className="flex min-h-screen bg-cream-50">
      <style jsx>{`
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .content-area {
          flex: 1;
          padding: 24px;
        }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .page-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .page-header-left svg {
          width: 28px;
          height: 28px;
          fill: #c9a227;
        }
        .page-header-left h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .actions-bar {
          display: flex;
          gap: 12px;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }
        .btn svg {
          width: 18px;
          height: 18px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(201, 162, 39, 0.3);
        }
        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .btn-secondary:hover {
          background: #f5f3ee;
        }
        .btn-outline {
          background: white;
          color: #c9a227;
          border: 2px solid #c9a227;
        }
        .btn-outline:hover {
          background: #c9a227;
          color: white;
        }
        .btn-danger {
          background: white;
          color: #dc2626;
          border: 1px solid #dc2626;
        }
        .btn-danger:hover {
          background: #dc2626;
          color: white;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
        }
        .detail-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .status-section {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .status-label {
          font-size: 14px;
          color: #6b7280;
        }
        .status-buttons {
          display: flex;
          gap: 8px;
        }
        .status-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .status-btn.paid {
          background: #dcfce7;
          color: #16a34a;
        }
        .status-btn.paid:hover {
          background: #16a34a;
          color: white;
        }
        .status-btn.pending {
          background: #fef3c7;
          color: #d97706;
        }
        .status-btn.pending:hover {
          background: #d97706;
          color: white;
        }
        .status-btn.cancelled {
          background: #fee2e2;
          color: #dc2626;
        }
        .status-btn.cancelled:hover {
          background: #dc2626;
          color: white;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .info-item {
          padding: 12px;
          background: #f5f3ee;
          border-radius: 8px;
        }
        .info-item .label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .info-item .value {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .items-list {
          margin-top: 24px;
        }
        .items-list h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #f5f3ee;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .item-row .description {
          font-size: 14px;
          color: #1a1a1a;
        }
        .item-row .amount {
          font-size: 14px;
          font-weight: 600;
          color: #c9a227;
        }
        .total-box {
          margin-top: 24px;
          padding: 16px;
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-box .label {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }
        .total-box .value {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }
        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .message.success {
          background: #dcfce7;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }
        .message.error {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .preview-sidebar {
          position: sticky;
          top: 24px;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Sidebar />
      
      <div className="main-content">
        <Header title={`Factura ${invoice.invoiceNumber}`} />
        
        <div className="content-area">
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <div className="page-header no-print">
            <div className="page-header-left">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="#c9a227" strokeWidth="2"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="#c9a227" strokeWidth="2"/>
              </svg>
              <h2>Detalle de Factura</h2>
            </div>
            <div className="actions-bar">
              <button className="btn btn-secondary" onClick={() => router.back()}>
                ← Volver
              </button>
              <button className="btn btn-outline" onClick={handlePrint}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                Imprimir
              </button>
              <button className="btn btn-primary" onClick={handleDownload}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Descargar PDF
              </button>
              <button className="btn btn-danger" onClick={deleteInvoice}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                Eliminar
              </button>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-card">
              <div className="status-section no-print">
                <span className="status-label">Estado:</span>
                {getStatusBadge(invoice.status)}
                <div className="status-buttons">
                  <button
                    className="status-btn paid"
                    onClick={() => updateStatus('paid')}
                    disabled={updating || invoice.status === 'paid'}
                  >
                    Marcar Pagado
                  </button>
                  <button
                    className="status-btn pending"
                    onClick={() => updateStatus('pending')}
                    disabled={updating || invoice.status === 'pending'}
                  >
                    Marcar Pendiente
                  </button>
                  <button
                    className="status-btn cancelled"
                    onClick={() => updateStatus('cancelled')}
                    disabled={updating || invoice.status === 'cancelled'}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="label">No. Factura</div>
                  <div className="value">{invoice.invoiceNumber}</div>
                </div>
                <div className="info-item">
                  <div className="label">Fecha</div>
                  <div className="value">{new Date(invoice.date).toLocaleDateString('es-GT')}</div>
                </div>
                <div className="info-item">
                  <div className="label">Cliente</div>
                  <div className="value">{invoice.clientName}</div>
                </div>
                <div className="info-item">
                  <div className="label">No. Orden</div>
                  <div className="value">{invoice.orderNumber || '—'}</div>
                </div>
                <div className="info-item">
                  <div className="label">Dirección</div>
                  <div className="value">{invoice.clientAddress || '—'}</div>
                </div>
                <div className="info-item">
                  <div className="label">Ciudad</div>
                  <div className="value">{invoice.clientCity || '—'}</div>
                </div>
                <div className="info-item">
                  <div className="label">Teléfono</div>
                  <div className="value">{invoice.clientPhone || '—'}</div>
                </div>
              </div>

              <div className="items-list">
                <h3>Items de la Factura</h3>
                {invoice.items.map((item: any) => (
                  <div className="item-row" key={item.id}>
                    <span className="description">{item.description}</span>
                    <span className="amount">Q{item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="total-box">
                <span className="label">TOTAL:</span>
                <span className="value">Q{invoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="preview-sidebar">
              <InvoicePreview data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
