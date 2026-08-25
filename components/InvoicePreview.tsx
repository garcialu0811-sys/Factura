'use client'

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
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          padding: 16px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
        }
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 2px solid #c9a227;
        }
        .company-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .company-logo {
          max-width: 180px;
        }
        .invoice-logo {
          width: 100%;
          height: auto;
          mix-blend-mode: multiply;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .company-contact {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 6px;
          font-size: 9px;
          color: #6b7280;
        }
        .company-contact span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .invoice-badge {
          text-align: right;
          flex-shrink: 0;
        }
        .invoice-badge .badge {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          display: inline-block;
          margin-bottom: 4px;
        }
        .invoice-badge .invoice-number {
          font-size: 13px;
          font-weight: 700;
          color: #c9a227;
          display: block;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 10px;
        }
        .meta-item label {
          color: #6b7280;
          margin-right: 4px;
        }
        .meta-item span {
          font-weight: 600;
          color: #1a1a1a;
        }
        .client-section {
          background: #f5f3ee;
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 10px;
        }
        .client-section h3 {
          background: #c9a227;
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 6px;
        }
        .client-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
        }
        .client-field {
          display: flex;
          gap: 4px;
          font-size: 10px;
        }
        .client-field .label {
          color: #6b7280;
          min-width: 80px;
        }
        .client-field .value {
          font-weight: 600;
          color: #1a1a1a;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .items-table thead th {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          padding: 6px 8px;
          text-align: left;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .items-table thead th:last-child {
          text-align: right;
        }
        .items-table tbody td {
          padding: 6px 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 10px;
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
          margin-top: 8px;
        }
        .total-box {
          background: #f5f3ee;
          border: 2px solid #c9a227;
          border-radius: 6px;
          padding: 8px 14px;
          text-align: right;
        }
        .total-label {
          font-size: 10px;
          color: #6b7280;
          margin-bottom: 2px;
        }
        .total-amount {
          font-size: 18px;
          font-weight: 700;
          color: #c9a227;
        }
        .thank-you {
          text-align: center;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
        }
        .thank-you p {
          font-family: 'Great Vibes', cursive;
          font-size: 16px;
          color: #c9a227;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 12px;
          padding-top: 8px;
        }
        .signature-box {
          text-align: center;
          width: 120px;
        }
        .signature-line {
          border-top: 1px solid #1a1a1a;
          margin-top: 30px;
          padding-top: 4px;
        }
        .signature-box .name {
          font-size: 11px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .signature-box .role {
          font-size: 8px;
          color: #6b7280;
        }
        .seal {
          width: 50px;
          height: 50px;
        }
      `}</style>

      <div className="preview-header">
        <div className="company-info">
          <div className="company-logo">
            <img src="/logo-login.png" alt="LG Art Sculptor Studio" className="invoice-logo" />
          </div>
          <div className="company-contact">
            <span>📍 4ta. Calle 12-34, Zona 1, Guatemala</span>
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
            <label>No. Orden:</label>
            <span>{data.orderNumber}</span>
          </div>
        )}
      </div>

      <div className="client-section">
        <h3>Recibido De</h3>
        <div className="client-grid">
          <div className="client-field">
            <span className="label">Nombre:</span>
            <span className="value">{data.clientName || '—'}</span>
          </div>
          <div className="client-field">
            <span className="label">Dirección:</span>
            <span className="value">{data.clientAddress || '—'}</span>
          </div>
          <div className="client-field">
            <span className="label">Ciudad:</span>
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
            <th>Cant.</th>
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
