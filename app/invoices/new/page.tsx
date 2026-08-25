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
    <div className="app-layout">
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f3ee;
        }
      `}</style>

      <style jsx>{`
        .app-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100vh;
          overflow: hidden;
        }
        .content-area {
          flex: 1;
          padding: 12px 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .page-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-shrink: 0;
        }
        .page-title svg {
          width: 22px;
          height: 22px;
          fill: #c9a227;
        }
        .page-title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .form-section {
          background: white;
          border-radius: 10px;
          padding: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #c9a227;
          margin-bottom: 10px;
          flex-shrink: 0;
        }
        .section-title svg {
          width: 18px;
          height: 18px;
          fill: #c9a227;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 10px;
        }
        .form-group {
          margin-bottom: 8px;
        }
        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 3px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 7px 10px;
          font-size: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #c9a227;
        }
        .form-group textarea {
          resize: vertical;
          min-height: 40px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
          flex: 1;
        }
        .items-table th {
          background: #f5f3ee;
          padding: 6px 8px;
          text-align: left;
          font-size: 10px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
        }
        .items-table td {
          padding: 4px;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table input {
          width: 100%;
          padding: 5px 8px;
          font-size: 11px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          outline: none;
        }
        .items-table input:focus {
          border-color: #c9a227;
        }
        .amount-input {
          width: 80px !important;
        }
        .quantity-input {
          width: 50px !important;
        }
        .remove-btn {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .remove-btn:hover {
          background: #fecaca;
        }
        .add-item-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f5f3ee;
          border: 1px dashed #c9a227;
          border-radius: 6px;
          color: #c9a227;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          align-self: flex-start;
        }
        .add-item-btn:hover {
          background: #c9a227;
          color: white;
        }
        .total-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 2px solid #c9a227;
          flex-shrink: 0;
        }
        .total-label {
          font-size: 13px;
          font-weight: 700;
          color: #374151;
        }
        .total-value {
          font-size: 18px;
          font-weight: 700;
          color: #c9a227;
        }
        .actions-bar {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-shrink: 0;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          white-space: nowrap;
        }
        .btn svg {
          width: 14px;
          height: 14px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(201, 162, 39, 0.3);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
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
          border: 1px solid #c9a227;
        }
        .btn-outline:hover {
          background: #c9a227;
          color: white;
        }
        .message {
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 10px;
          font-size: 12px;
          flex-shrink: 0;
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
        .preview-section {
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        .preview-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 10px;
          flex-shrink: 0;
        }
        .preview-title svg {
          width: 14px;
          height: 14px;
          fill: #c9a227;
        }

        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
            overflow: auto;
          }
          .form-section {
            overflow: visible;
          }
        }

        @media (max-width: 768px) {
          .content-area {
            padding: 8px 10px;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .actions-bar {
            flex-wrap: wrap;
          }
          .btn {
            flex: 1;
            justify-content: center;
            min-width: 80px;
          }
        }

        @media print {
          .no-print { display: none !important; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Sidebar />
      
      <div className="main-content">
        <Header title="Nueva Factura" />
        
        <div className="content-area">
          <div className="page-title">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="#c9a227" strokeWidth="2"/>
              <line x1="12" y1="18" x2="12" y2="12" stroke="#c9a227" strokeWidth="2"/>
              <line x1="9" y1="15" x2="15" y2="15" stroke="#c9a227" strokeWidth="2"/>
            </svg>
            <h2>Generar Nueva Factura</h2>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <div className="form-grid">
            <div className="form-section">
              <div className="section-title">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Complete el formulario para crear la factura
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>No. Factura</label>
                  <input type="text" value={invoiceNumber} readOnly style={{ background: '#f5f3ee' }} />
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input type="text" value={new Date().toLocaleDateString('es-GT')} readOnly style={{ background: '#f5f3ee' }} />
                </div>
                <div className="form-group">
                  <label>No. Orden</label>
                  <input
                    type="text"
                    placeholder="ORD-000000"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input
                  type="text"
                  placeholder="Ingrese el nombre del cliente"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad, Estado, ZIP</label>
                  <input
                    type="text"
                    placeholder="Ciudad, estado, ZIP"
                    value={formData.clientCity}
                    onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="section-title" style={{ marginTop: '4px' }}>
                Detalle de la Factura
              </div>

              <table className="items-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cant.</th>
                    <th>Monto</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          placeholder="Descripción del producto o servicio"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="amount-input"
                          placeholder="Q0.00"
                          value={item.amount || ''}
                          onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </td>
                      <td>
                        <button className="remove-btn" onClick={() => removeItem(index)}>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="add-item-btn" onClick={addItem}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Agregar Item
              </button>

              <div className="total-row">
                <span className="total-label">Total:</span>
                <span className="total-value">Q{calculateTotal().toFixed(2)}</span>
              </div>

              <div className="actions-bar">
                <button className="btn btn-secondary" onClick={() => {
                  setFormData({ clientName: '', clientAddress: '', clientCity: '', clientPhone: '', orderNumber: '', notes: '' })
                  setItems([{ description: '', amount: 0, quantity: 1 }])
                }}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  Limpiar
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button className="btn btn-outline" onClick={handlePrint}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                  Imprimir
                </button>
              </div>
            </div>

            <div className="form-section preview-section">
              <div className="preview-title">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                Vista previa de la factura
              </div>
              <InvoicePreview data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
