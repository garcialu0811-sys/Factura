'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header({ title }: { title: string }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <header className="app-header no-print">
      <style jsx>{`
        .app-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 52px;
          flex-shrink: 0;
        }
        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .header-title svg {
          width: 20px;
          height: 20px;
          fill: #c9a227;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .notification-bell {
          position: relative;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .notification-bell:hover {
          background: #f5f3ee;
        }
        .notification-bell svg {
          width: 20px;
          height: 20px;
          fill: #6b7280;
        }
        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          background: #c9a227;
          color: white;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-menu {
          position: relative;
        }
        .user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .user-button:hover {
          background: #f5f3ee;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 13px;
          flex-shrink: 0;
        }
        .user-info {
          text-align: left;
        }
        .user-name {
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.2;
        }
        .user-role {
          font-size: 10px;
          color: #6b7280;
        }
        .dropdown-arrow {
          width: 16px;
          height: 16px;
          fill: #6b7280;
          transition: transform 0.2s;
        }
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 6px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          min-width: 150px;
          z-index: 50;
          overflow: hidden;
        }
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 10px 14px;
          text-align: left;
          font-size: 13px;
          color: #374151;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: #f5f3ee;
          color: #c9a227;
        }
        .dropdown-item.danger {
          color: #dc2626;
        }
        .dropdown-item.danger:hover {
          background: #fef2f2;
        }
        @media (max-width: 768px) {
          .app-header { padding: 8px 12px; }
          .header-title { font-size: 14px; }
          .user-info { display: none; }
          .dropdown-arrow { display: none; }
        }
      `}</style>

      <div className="header-title">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="#c9a227" strokeWidth="2"/>
          <polyline points="14 2 14 8 20 8" fill="none" stroke="#c9a227" strokeWidth="2"/>
        </svg>
        {title}
      </div>

      <div className="header-right">
        <div className="notification-bell">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <span className="notification-badge">3</span>
        </div>

        <div className="user-menu">
          <div className="user-button" onClick={() => setShowMenu(!showMenu)}>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Usuario'}</div>
              <div className="user-role">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
            </div>
            <svg className={`dropdown-arrow ${showMenu ? 'open' : ''}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5z" fill="currentColor"/>
            </svg>
          </div>

          {showMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Mi Perfil</button>
              <button className="dropdown-item danger" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
