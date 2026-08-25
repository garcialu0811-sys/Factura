'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar no-print">
      <style jsx>{`
        .sidebar {
          width: 220px;
          min-width: 220px;
          height: 100vh;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }
        .logo-section {
          padding: 20px 16px 16px;
          text-align: center;
        }
        .logo-img-wrapper {
          max-width: 160px;
          margin: 0 auto;
        }
        .logo-img {
          width: 100%;
          height: auto;
          mix-blend-mode: multiply;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .nav-section {
          flex: 1;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          color: #6b7280;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nav-item:hover {
          background: #fef9ee;
          color: #c9a227;
        }
        .nav-item.active {
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(201, 162, 39, 0.35);
        }
        .icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #fef3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }
        .nav-item:hover .icon-box {
          background: #fde68a;
        }
        .nav-item.active .icon-box {
          background: rgba(255, 255, 255, 0.25);
        }
        .icon-box svg {
          width: 18px;
          height: 18px;
          stroke: #b45309;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .nav-item.active .icon-box svg {
          stroke: white;
        }
        .contact-section {
          padding: 14px 16px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #6b7280;
          line-height: 1.5;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 6px;
        }
        .contact-item:last-child {
          margin-bottom: 0;
        }
        .contact-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 64px;
            min-width: 64px;
          }
          .logo-section {
            padding: 12px 6px;
          }
          .logo-img-wrapper {
            max-width: 52px;
          }
          .nav-section {
            padding: 10px 6px;
            gap: 4px;
          }
          .nav-item {
            justify-content: center;
            padding: 12px;
            font-size: 0;
            gap: 0;
          }
          .icon-box {
            width: 36px;
            height: 36px;
          }
          .contact-section {
            display: none;
          }
        }
      `}</style>

      <div className="logo-section">
        <div className="logo-img-wrapper">
          <img src="/logo-login.png" alt="LG Art Sculptor Studio" className="logo-img" />
        </div>
      </div>

      <nav className="nav-section">
        <Link href="/invoices/new" className={`nav-item ${pathname === '/invoices/new' ? 'active' : ''}`}>
          <span className="icon-box">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </span>
          Nuevo Recibo
        </Link>
        <Link href="/invoices/history" className={`nav-item ${pathname === '/invoices/history' ? 'active' : ''}`}>
          <span className="icon-box">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </span>
          Historial de Recibos
        </Link>
        <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
          <span className="icon-box">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          Configuración
        </Link>
      </nav>

      <div className="contact-section">
        <div className="contact-item">
          <svg className="contact-icon" viewBox="0 0 24 24" fill="#c9a227"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>4ta. Calle 12-34, Zona 1<br/>Guatemala, Guatemala</span>
        </div>
        <div className="contact-item">
          <svg className="contact-icon" viewBox="0 0 24 24" fill="#c9a227"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>+502 1234 5678</span>
        </div>
        <div className="contact-item">
          <svg className="contact-icon" viewBox="0 0 24 24" fill="#c9a227"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>info@lgartstudio.com</span>
        </div>
        <div className="contact-item">
          <svg className="contact-icon" viewBox="0 0 24 24" fill="#c9a227"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          <span>www.lgartstudio.com</span>
        </div>
      </div>
    </aside>
  )
}
