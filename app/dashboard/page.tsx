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
        .welcome-section {
          background: linear-gradient(135deg, #f5edd6 0%, #e8dcc4 100%);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .welcome-section::before {
          content: '';
          position: absolute;
          top: -30px;
          right: -30px;
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          border-radius: 50%;
          opacity: 0.2;
        }
        .welcome-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .welcome-section p {
          color: #6b7280;
          font-size: 14px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .stat-card .icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .stat-card .icon svg {
          width: 24px;
          height: 24px;
        }
        .stat-card .icon.total {
          background: #dbeafe;
        }
        .stat-card .icon.total svg {
          fill: #2563eb;
        }
        .stat-card .icon.paid {
          background: #dcfce7;
        }
        .stat-card .icon.paid svg {
          fill: #16a34a;
        }
        .stat-card .icon.pending {
          background: #fef3c7;
        }
        .stat-card .icon.pending svg {
          fill: #d97706;
        }
        .stat-card .icon.cancelled {
          background: #fee2e2;
        }
        .stat-card .icon.cancelled svg {
          fill: #dc2626;
        }
        .stat-card .label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .stat-card .value {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .recent-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .view-all {
          color: #c9a227;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .view-all:hover {
          text-decoration: underline;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }
        .invoice-table th {
          text-align: left;
          padding: 12px 16px;
          background: #f5f3ee;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .invoice-table th:first-child {
          border-radius: 8px 0 0 8px;
        }
        .invoice-table th:last-child {
          border-radius: 0 8px 8px 0;
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
        .quick-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
        .quick-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: white;
          border: 2px dashed #c9a227;
          border-radius: 12px;
          color: #c9a227;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .quick-action-btn:hover {
          background: #c9a227;
          color: white;
        }
        .quick-action-btn svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
      `}</style>

      <Sidebar />
      
      <div className="main-content">
        <Header title="Dashboard" />
        
        <div className="content-area">
          <div className="welcome-section">
            <h2>Bienvenido al Sistema de Facturación</h2>
            <p>Gestiona tus facturas de manera fácil y profesional</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="icon total">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              </div>
              <div className="label">Total Facturas</div>
              <div className="value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="icon paid">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div className="label">Pagadas</div>
              <div className="value">{stats.paid}</div>
            </div>
            <div className="stat-card">
              <div className="icon pending">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <div className="label">Pendientes</div>
              <div className="value">{stats.pending}</div>
            </div>
            <div className="stat-card">
              <div className="icon cancelled">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
              </div>
              <div className="label">Canceladas</div>
              <div className="value">{stats.cancelled}</div>
            </div>
          </div>

          <div className="recent-section">
            <div className="section-header">
              <h3>Facturas Recientes</h3>
              <Link href="/invoices/history" className="view-all">Ver todas →</Link>
            </div>
            
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>No. Factura</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice: any) => (
                  <tr key={invoice.id}>
                    <td className="invoice-number">{invoice.invoiceNumber}</td>
                    <td>{new Date(invoice.date).toLocaleDateString('es-GT')}</td>
                    <td>{invoice.clientName}</td>
                    <td>Q{invoice.total.toFixed(2)}</td>
                    <td>{getStatusBadge(invoice.status)}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/invoices/${invoice.id}`} className="action-btn">
                          <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quick-actions">
            <Link href="/invoices/new" className="quick-action-btn">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nueva Factura
            </Link>
            <Link href="/invoices/history" className="quick-action-btn">
              <svg viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
              Ver Historial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
