'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/invoices/new',
      label: 'Nuevo Recibo',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-amber-700 group-hover:stroke-amber-900 group-[.active]:stroke-amber-900 transition-colors" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      )
    },
    {
      href: '/invoices/history',
      label: 'Historial de Recibos',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-amber-700 group-hover:stroke-amber-900 group-[.active]:stroke-amber-900 transition-colors" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      href: '/dashboard',
      label: 'Configuración',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-amber-700 group-hover:stroke-amber-900 group-[.active]:stroke-amber-900 transition-colors" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ]

  return (
    <aside className="w-16 min-w-[4rem] md:w-60 md:min-w-[15rem] h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0 no-print">
      {/* Logo */}
      <div className="p-3 md:p-6 text-center">
        <div className="max-w-[40px] md:max-w-[160px] mx-auto">
          <img
            src="/logo-login.png"
            alt="LG Art Sculptor Studio"
            className="w-full h-auto mix-blend-multiply image-render-crisp"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-2 py-3 md:px-3 md:py-4 flex flex-col gap-2 md:gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-center md:justify-start gap-0 md:gap-3 p-3 md:px-4 md:py-3 rounded-xl text-gray-500 font-medium text-[13px] transition-all duration-200 whitespace-nowrap hover:bg-[#fef9ee] hover:text-[#c9a227] ${
                isActive
                  ? 'active bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-semibold shadow-md shadow-amber-500/15'
                  : ''
              }`}
            >
              <span
                className={`w-9 h-9 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isActive ? 'bg-white/40' : 'bg-amber-50 group-hover:bg-amber-100'
                }`}
              >
                {item.icon}
              </span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Contact Card (hidden on mobile) */}
      <div className="hidden md:block mx-4 my-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm shrink-0">
        <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-normal mb-3">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="#c9a227">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>
            4ta. Calle 12-34, Zona 1
            <br />
            Guatemala, Guatemala
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-normal mb-3">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="#c9a227">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <span>+502 1234 5678</span>
        </div>
        <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-normal mb-3">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="#c9a227">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <span>info@lgartstudio.com</span>
        </div>
        <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-normal">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="#c9a227">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span>www.lgartstudio.com</span>
        </div>
      </div>
    </aside>
  )
}
