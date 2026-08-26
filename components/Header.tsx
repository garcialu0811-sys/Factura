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
    <header className="h-14 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shrink-0 no-print">
      {/* Title */}
      <div className="flex items-center gap-2 font-playfair font-bold text-gray-900 text-base">
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-[#c9a227]" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span>{title}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#c9a227] cursor-pointer transition-colors duration-200">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#c9a227] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
            3
          </span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1.5 md:pl-1.5 md:pr-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dfba4d] to-[#c1952e] flex items-center justify-center text-[#4a3505] font-bold text-[13px] shrink-0 shadow-sm shadow-amber-500/10">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-gray-900 leading-tight">
                {user?.name || 'Usuario'}
              </div>
              <div className="text-[10px] text-gray-500">
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </div>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 hidden md:block ${
                showMenu ? 'rotate-180' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg w-40 py-1.5 z-50 overflow-hidden">
              <button className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-[#fef9ee] hover:text-[#c9a227] transition-colors duration-150 font-medium">
                Mi Perfil
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
