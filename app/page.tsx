'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    } catch (err) {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  const handleCreateAccount = () => {
    alert('El registro de nuevos usuarios está deshabilitado. Por favor, solicite credenciales al administrador.')
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#f5f3ee] font-sans">
      {/* Left Panel */}
      <div className="w-[45%] h-screen relative bg-gradient-to-br from-[#f5edd6] via-[#e8dcc4] to-[#d4c4a0] hidden lg:flex flex-col justify-center items-center p-8 overflow-hidden shrink-0 border-r border-[#e3d5b5]">
        {/* Wave decorations */}
        <div className="absolute -top-12 -left-12 w-80 h-80 bg-gradient-to-br from-[#dfba4d] to-[#c1952e] rounded-br-full opacity-30 pointer-events-none"></div>
        <div className="absolute -top-6 -left-6 w-64 h-64 bg-gradient-to-br from-[#dfba4d] to-[#c1952e] rounded-br-full opacity-40 pointer-events-none"></div>
        
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-gradient-to-tr from-[#dfba4d] to-[#c1952e] rounded-tr-full opacity-30 pointer-events-none"></div>
        <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-tr from-[#dfba4d] to-[#c1952e] rounded-tr-full opacity-40 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-sm">
          <div className="max-w-[285px] w-full mb-6">
            <img
              src="/logo-login.png"
              alt="LG Art Sculptor Studio"
              className="w-full h-auto mix-blend-multiply image-render-crisp"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#c9a227]/40 flex items-center justify-center bg-white/40 mb-3 shadow-sm">
              <svg className="w-6 h-6 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800 tracking-wide">Calidad y confianza</p>
            <p className="text-xs text-gray-600 mt-1 font-medium">en cada proyecto que realizamos.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 h-screen flex justify-center items-center p-6 md:p-12 overflow-y-auto">
        <div className="bg-white w-full max-w-[420px] p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 flex flex-col border border-gray-100/80">
          
          {/* Lock Icon Circle */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full border-2 border-[#dfba4d]/30 bg-[#faf8f4] flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="font-playfair text-2xl font-bold text-gray-900 tracking-wide">Bienvenido de nuevo</h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Inicia sesión para continuar administrando tus recibos
            </p>
          </div>

          {/* Gold Divider */}
          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent"></span>
            <span className="w-1.5 h-1.5 bg-[#c9a227] rotate-45"></span>
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent"></span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl mb-4 text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4" autoComplete="off">
            {/* Username */}
            <div className="flex flex-col">
              <label htmlFor="username" className="text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
                Nombre de usuario
              </label>
              <div className="relative flex items-center">
                <svg className="absolute left-3.5 w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <input
                  type="text"
                  id="username"
                  placeholder="Ingresa tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/25 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <svg className="absolute left-3.5 w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/25 transition-all text-gray-800 placeholder-gray-400 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.74-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.01-.17c0-1.66-1.34-3-3-3l-.16.02z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a href="#" className="text-[11px] text-[#c9a227] hover:underline font-semibold tracking-wide">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold rounded-xl shadow-md shadow-amber-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Bottom Divider / or label */}
          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">o</span>
            <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></span>
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleCreateAccount}
            className="w-full py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Crear nueva cuenta
          </button>

          {/* Footer Copyright */}
          <div className="text-center mt-6 text-[10px] text-gray-400 leading-normal font-medium">
            <p>&copy; 2026 LG Art Sculptor Studio, Inc.</p>
            <p className="mt-0.5">Todos los derechos reservados.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
