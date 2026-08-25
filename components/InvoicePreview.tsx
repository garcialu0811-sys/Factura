'use client'

import { ReactNode } from 'react'

interface InvoiceItem {
  description: string
  amount: number
  quantity: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  orderNumber: string
  clientName: string
  clientAddress: string
  clientCity: string
  clientPhone: string
  items: InvoiceItem[]
  total: number
}

export default function InvoicePreview({ data }: { data: InvoiceData }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('es-GT')
    return new Date(dateStr).toLocaleDateString('es-GT')
  }

  return (
    <div className="invoice-preview">
      <style jsx>{`
        .invoice-preview {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #c9a227;
        }
        .company-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .company-logo {
          max-width: 280px;
        }
        .invoice-logo {
          width: 100%;
          height: auto;
          mix-blend-mode: multiply;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .invoice-badge {
          text-align: right;
        }
        .invoice-badge .badge {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          display: inline-block;
          margin-bottom: 8px;
        }
        .invoice-badge .invoice-number {
          font-size: 18px;
          font-weight: 700;
          color: #c9a227;
          display: block;
        }
        .company-contact {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 12px;
          font-size: 11px;
          color: #6b7280;
        }
        .company-contact span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .meta-item {
          font-size: 13px;
        }
        .meta-item label {
          color: #6b7280;
          margin-right: 8px;
        }
        .meta-item span {
          font-weight: 600;
          color: #1a1a1a;
        }
        .client-section {
          background: #f5f3ee;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .client-section h3 {
          background: #c9a227;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 12px;
        }
        .client-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .client-field {
          display: flex;
          gap: 8px;
          font-size: 13px;
        }
        .client-field .label {
          color: #6b7280;
          min-width: 120px;
        }
        .client-field .value {
          font-weight: 600;
          color: #1a1a1a;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table thead th {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .items-table thead th:last-child {
          text-align: right;
        }
        .items-table tbody td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        .items-table tbody td:last-child {
          text-align: right;
          font-weight: 600;
        }
        .items-table tbody tr:nth-child(even) {
          background: #f5f3ee;
        }
        .total-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .total-box {
          background: #f5f3ee;
          border: 2px solid #c9a227;
          border-radius: 8px;
          padding: 16px 24px;
          text-align: right;
        }
        .total-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .total-amount {
          font-size: 28px;
          font-weight: 700;
          color: #c9a227;
        }
        .thank-you {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .thank-you p {
          font-family: 'Great Vibes', cursive;
          font-size: 24px;
          color: #c9a227;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
        }
        .signature-box {
          text-align: center;
          width: 200px;
        }
        .signature-line {
          border-top: 1px solid #1a1a1a;
          margin-top: 60px;
          padding-top: 8px;
        }
        .signature-box .name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .signature-box .role {
          font-size: 12px;
          color: #6b7280;
        }
        .seal {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }
      `}</style>

      <div className="preview-header">
        <div className="company-info">
          <div className="company-logo">
            <img src="/logo.png" alt="LG Art Sculptor Studio" className="invoice-logo" />
          </div>
          <div className="company-contact">
            <span>📍 4ta. Calle 12-34, Zona 1, Guatemala, Guatemala</span>
            <span>📞 +502 1234 5678</span>
            <span>✉️ info@lgartstudio.com</span>
          </div>
        </div>
        <div className="invoice-badge">
          <span className="badge">FACTURA</span>
          <span className="invoice-number">{data.invoiceNumber || 'R-0000000'}</span>
        </div>
      </div>

      <div className="meta-row">
        <div className="meta-item">
          <label>Fecha:</label>
          <span>{formatDate(data.date)}</span>
        </div>
        {data.orderNumber && (
          <div className="meta-item">
            <label>No. de Orden:</label>
            <span>{data.orderNumber}</span>
          </div>
        )}
      </div>

      <div className="client-section">
        <h3>Recibido De</h3>
        <div className="client-grid">
          <div className="client-field">
            <span className="label">Nombre del Cliente:</span>
            <span className="value">{data.clientName || '—'}</span>
          </div>
          <div className="client-field">
            <span className="label">Dirección:</span>
            <span className="value">{data.clientAddress || '—'}</span>
          </div>
          <div className="client-field">
            <span className="label">Ciudad, Estado, ZIP:</span>
            <span className="value">{data.clientCity || '—'}</span>
          </div>
          <div className="client-field">
            <span className="label">Teléfono:</span>
            <span className="value">{data.clientPhone || '—'}</span>
          </div>
        </div>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {data.items.length > 0 ? (
            data.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description || 'Descripción del producto o servicio'}</td>
                <td>{item.quantity || 1}</td>
                <td>Q{(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', color: '#9ca3af' }}>
                Agrega items a la factura
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="total-section">
        <div className="total-box">
          <div className="total-label">TOTAL:</div>
          <div className="total-amount">Q{data.total.toFixed(2)}</div>
        </div>
      </div>

      <div className="thank-you">
        <p>¡Gracias por su preferencia!</p>
      </div>

      <div className="signatures">
        <div className="signature-box">
          <div className="signature-line">
            <div className="name">Jose Gomez</div>
            <div className="role">Firma del Dueño</div>
          </div>
        </div>
        <div className="seal">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#c9a227" strokeWidth="3"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#c9a227" strokeWidth="1"/>
            <text x="50" y="45" textAnchor="middle" fill="#c9a227" fontSize="12" fontFamily="Great Vibes">LG Art</text>
            <text x="50" y="60" textAnchor="middle" fill="#c9a227" fontSize="8" fontFamily="Playfair Display">STUDIO</text>
          </svg>
        </div>
        <div className="signature-box">
          <div className="signature-line">
            <div className="name">Cliente</div>
            <div className="role">Firma del Cliente</div>
          </div>
        </div>
      </div>
    </div>
  )
}
