'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden"
      style={{ background: '#f0ebe0' }}
    >
      {/* Main Card */}
      <div
        className={`relative w-full max-w-[960px] bg-white rounded-[20px] flex flex-col lg:flex-row shadow-[0_25px_60px_rgba(100,75,20,0.07),0_8px_24px_rgba(100,75,20,0.04)] transition-all duration-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        style={{ minHeight: '580px', maxHeight: '660px' }}
      >
        {/* Corner decoration - Top Left */}
        <div className="absolute top-0 left-0 w-[200px] h-[240px] pointer-events-none select-none z-30 overflow-hidden">
          <img
            src="/decorations/corner-top-left.png"
            alt=""
            className="absolute top-0 left-0 w-full h-full object-cover object-top-left"
          />
        </div>

        {/* Corner decoration - Bottom Right (at divider line on desktop, bottom-right on mobile) */}
        <div className="absolute bottom-0 right-0 w-[220px] h-[260px] pointer-events-none select-none z-20 overflow-hidden lg:right-[60%] lg:left-auto lg:w-[300px] lg:h-[280px]">
          <img
            src="/decorations/corner-bottom-right.png"
            alt=""
            className="absolute bottom-0 right-0 w-full h-full object-cover object-bottom-right"
          />
        </div>

        {/* LEFT PANEL */}
        <div className="w-full lg:w-[40%] relative overflow-hidden shrink-0 hidden lg:flex flex-col items-center justify-center p-8"
          style={{ background: 'linear-gradient(165deg, #faf7ef 0%, #f5f0e3 40%, #ede5d3 100%)' }}>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[280px]">
            {/* Logo */}
            <div className="w-[250px] mb-4">
              <img
                src="/logo-login.png"
                alt="LG Art Sculptor Studio"
                className="w-full h-auto mix-blend-multiply"
              />
            </div>

            {/* Diamond divider */}
            <div className="flex items-center gap-2.5 my-3 w-full max-w-[200px]">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c58a2a]/30 to-transparent" />
              <span className="w-1.5 h-1.5 bg-[#c58a2a]/50 rotate-45 shrink-0" />
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c58a2a]/30 to-transparent" />
            </div>

            {/* Bottom badge */}
            <div className="flex flex-col items-center mt-1">
              <div className="w-10 h-10 rounded-full border border-[#c58a2a]/20 flex items-center justify-center bg-white/40 mb-2.5">
                <svg className="w-5 h-5 text-[#c58a2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-gray-800 tracking-wide">Calidad y confianza</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">en cada proyecto que realizamos.</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-[360px]">
            {/* Lock Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-[52px] h-[52px] rounded-full border border-[#e8dcc8] bg-[#fdfaf5] flex items-center justify-center">
                <svg className="w-[22px] h-[22px] text-[#c58a2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-5">
              <h1 className="font-[Playfair_Display] text-[24px] font-bold text-gray-900 tracking-wide">
                Bienvenido
              </h1>
              <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">
                Inicia sesión para continuar administrando tus recibos
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c58a2a]/25 to-transparent" />
              <span className="w-1.5 h-1.5 bg-[#c58a2a]/40 rotate-45 shrink-0" />
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c58a2a]/25 to-transparent" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200/60 text-red-600 text-[12px] px-4 py-2.5 rounded-xl mb-4 text-center font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-3.5" autoComplete="off">
              {/* Username */}
              <div className="flex flex-col">
                <label htmlFor="username" className="text-[12px] font-semibold text-gray-700 mb-1.5 tracking-wide">
                  Nombre de usuario
                </label>
                <div className="relative flex items-center">
                  <svg className="absolute left-3.5 w-[17px] h-[17px] text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <input
                    type="text"
                    id="username"
                    placeholder="Ingresa tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 text-[13px] bg-white border border-[#e2ded7] rounded-[10px] outline-none focus:border-[#c58a2a] focus:ring-[3px] focus:ring-[#c58a2a]/10 transition-all text-gray-800 placeholder-gray-400"
                    style={{ height: '48px' }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-[12px] font-semibold text-gray-700 mb-1.5 tracking-wide">
                  Contraseña
                </label>
                <div className="relative flex items-center">
                  <svg className="absolute left-3.5 w-[17px] h-[17px] text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 text-[13px] bg-white border border-[#e2ded7] rounded-[10px] outline-none focus:border-[#c58a2a] focus:ring-[3px] focus:ring-[#c58a2a]/10 transition-all text-gray-800 placeholder-gray-400"
                    style={{ height: '48px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.74-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.01-.17c0-1.66-1.34-3-3-3l-.16.02z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right -mt-0.5">
                <a href="#" className="text-[12px] text-[#c58a2a] hover:text-[#9a6426] hover:underline font-medium transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-1 text-white font-semibold rounded-[10px] shadow-[0_4px_14px_rgba(180,130,40,0.25)] hover:shadow-[0_6px_20px_rgba(180,130,40,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-[13px] tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #d4a843 0%, #c58a2a 40%, #a87525 100%)',
                  height: '48px',
                }}
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Footer Divider */}
            <div className="flex items-center gap-2.5 mt-5">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="w-1 h-1 bg-[#c58a2a]/30 rotate-45 shrink-0" />
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Copyright */}
            <div className="text-center mt-4 text-[11px] text-gray-400 leading-normal font-medium">
              <p>&copy; 2026 LG Art Sculptor Studio, Inc.</p>
              <p className="mt-0.5">Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
