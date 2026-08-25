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
      setInvoices(data.invoices || [])
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
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        {labels[status]}
      </span>
    )
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
        .page-header-left p {
          font-size: 14px;
          color: #6b7280;
        }
        .new-invoice-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .new-invoice-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(201, 162, 39, 0.3);
        }
        .new-invoice-btn svg {
          width: 18px;
          height: 18px;
          fill: white;
        }
        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        .search-input input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
        }
        .search-input input:focus {
          border-color: #c9a227;
        }
        .search-input svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          fill: #9ca3af;
        }
        .filter-select {
          padding: 10px 14px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          background: white;
          min-width: 150px;
        }
        .filter-select:focus {
          border-color: #c9a227;
        }
        .search-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .search-btn:hover {
          transform: translateY(-1px);
        }
        .search-btn svg {
          width: 18px;
          height: 18px;
          fill: white;
        }
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }
        .invoice-table th {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          padding: 14px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .invoice-table td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .invoice-table tr:hover {
          background: #f5f3ee;
        }
        .invoice-number {
          font-weight: 600;
          color: #c9a227;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          text-decoration: none;
        }
        .action-btn:hover {
          background: #f5f3ee;
          border-color: #c9a227;
        }
        .action-btn svg {
          width: 16px;
          height: 16px;
          fill: #6b7280;
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
        }
        .pagination-info {
          font-size: 13px;
          color: #6b7280;
        }
        .pagination-buttons {
          display: flex;
          gap: 8px;
        }
        .page-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .page-btn:hover {
          background: #f5f3ee;
        }
        .page-btn.active {
          background: #c9a227;
          color: white;
          border-color: #c9a227;
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }
        .empty-state svg {
          width: 64px;
          height: 64px;
          fill: #d1d5db;
          margin-bottom: 16px;
        }
        .empty-state p {
          font-size: 14px;
        }
      `}</style>

      <Sidebar />
      
      <div className="main-content">
        <Header title="Historial de Facturas" />
        
        <div className="content-area">
          <div className="page-header">
            <div className="page-header-left">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="#c9a227" strokeWidth="2"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="#c9a227" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="#c9a227" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="#c9a227" strokeWidth="2"/>
              </svg>
              <div>
                <h2>Historial de Facturas</h2>
                <p>Consulta, busca y gestiona todas las facturas generadas</p>
              </div>
            </div>
            <Link href="/invoices/new" className="new-invoice-btn">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nueva Factura
            </Link>
          </div>

          <div className="filters-section">
            <div className="search-input">
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input
                type="text"
                placeholder="Buscar por número, cliente o concepto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="paid">Pagado</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <button className="search-btn" onClick={handleSearch}>
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              Buscar
            </button>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading">Cargando facturas...</div>
            ) : invoices.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                <p>No se encontraron facturas</p>
              </div>
            ) : (
              <>
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>No. Factura</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>No. de Orden</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice: any) => (
                      <tr key={invoice.id}>
                        <td className="invoice-number">{invoice.invoiceNumber}</td>
                        <td>{new Date(invoice.date).toLocaleDateString('es-GT')}</td>
                        <td>{invoice.clientName}</td>
                        <td>{invoice.orderNumber || '—'}</td>
                        <td>Q{invoice.total.toFixed(2)}</td>
                        <td>{getStatusBadge(invoice.status)}</td>
                        <td>
                          <div className="actions">
                            <Link href={`/invoices/${invoice.id}`} className="action-btn" title="Ver detalle">
                              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </Link>
                            <Link href={`/invoices/${invoice.id}?print=true`} className="action-btn" title="Imprimir">
                              <svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <div className="pagination-info">
                    Mostrando {((pagination.page - 1) * 10) + 1} a {Math.min(pagination.page * 10, pagination.total)} de {pagination.total} facturas
                  </div>
                  <div className="pagination-buttons">
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`page-btn ${page === pagination.page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
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
