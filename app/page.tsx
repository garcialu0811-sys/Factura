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

  return (
    <div className="login-wrapper">
      <style jsx>{`
        .login-wrapper {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }
        .left-panel {
          width: 45%;
          position: relative;
          background: linear-gradient(135deg, #f5edd6 0%, #e8dcc4 50%, #d4c4a0 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          overflow: hidden;
        }
        .wave-top-left {
          position: absolute;
          top: -50px;
          left: -50px;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #c9a227 0%, #b8942a 50%, #a6872d 100%);
          border-radius: 0 0 100% 0;
          opacity: 0.8;
          z-index: 1;
        }
        .wave-top-left::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
          border-radius: 0 0 80% 0;
          opacity: 0.6;
        }
        .wave-bottom-right {
          position: absolute;
          bottom: -50px;
          right: -50px;
          width: 350px;
          height: 350px;
          background: linear-gradient(315deg, #c9a227 0%, #b8942a 50%, #a6872d 100%);
          border-radius: 100% 0 0 0;
          opacity: 0.8;
          z-index: 1;
        }
        .wave-bottom-right::before {
          content: '';
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 280px;
          height: 280px;
          background: linear-gradient(315deg, #d4af37 0%, #c9a227 100%);
          border-radius: 80% 0 0 0;
          opacity: 0.6;
        }
        .brand-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .logo-container {
          max-width: 320px;
          margin: 0 auto 20px;
        }
        .login-logo {
          width: 100%;
          height: auto;
          mix-blend-mode: multiply;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .trust-section {
          margin-top: 30px;
          text-align: center;
        }
        .shield-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 15px;
        }
        .shield-icon svg {
          width: 50px;
          height: 50px;
          fill: none;
          stroke: #c9a227;
          stroke-width: 2;
        }
        .trust-section .trust-title {
          font-size: 16px;
          font-weight: 600;
          color: #2a2a2a;
          margin-bottom: 5px;
        }
        .trust-section .trust-subtitle {
          font-size: 14px;
          color: #555;
        }
        .right-panel {
          width: 55%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          background: #f5f3ee;
        }
        .login-card {
          background: #ffffff;
          width: 100%;
          max-width: 440px;
          padding: 45px 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        .login-icon {
          text-align: center;
          margin-bottom: 20px;
        }
        .login-icon .icon-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px solid #c9a227;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background: #faf8f4;
        }
        .login-icon .icon-circle svg {
          width: 32px;
          height: 32px;
          fill: #c9a227;
        }
        .login-header {
          text-align: center;
          margin-bottom: 25px;
        }
        .login-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .login-header p {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }
        .gold-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0 30px;
          gap: 12px;
        }
        .gold-divider .line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a227, transparent);
        }
        .gold-divider .diamond {
          width: 10px;
          height: 10px;
          background: #c9a227;
          transform: rotate(45deg);
        }
        .form-group {
          margin-bottom: 22px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          width: 20px;
          height: 20px;
          fill: #aaa;
          pointer-events: none;
        }
        .form-group input {
          width: 100%;
          padding: 14px 45px 14px 45px;
          font-size: 14px;
          color: #333;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .form-group input::placeholder {
          color: #aaa;
        }
        .form-group input:focus {
          border-color: #c9a227;
        }
        .eye-icon {
          position: absolute;
          right: 14px;
          width: 22px;
          height: 22px;
          fill: #aaa;
          cursor: pointer;
          transition: fill 0.2s ease;
        }
        .eye-icon:hover {
          fill: #666;
        }
        .forgot-password {
          text-align: right;
          margin-bottom: 25px;
        }
        .forgot-password a {
          font-size: 14px;
          color: #c9a227;
          text-decoration: none;
        }
        .login-button {
          width: 100%;
          padding: 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #c9a227 0%, #b8942a 50%, #a6872d 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(201, 162, 39, 0.3);
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201, 162, 39, 0.4);
        }
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .login-button svg {
          width: 20px;
          height: 20px;
          fill: #fff;
        }
        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
        .bottom-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 30px 0 25px;
          gap: 12px;
        }
        .bottom-divider .line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a227, transparent);
        }
        .bottom-divider .diamond {
          width: 8px;
          height: 8px;
          background: #c9a227;
          transform: rotate(45deg);
        }
        .footer {
          text-align: center;
        }
        .footer p {
          font-size: 12px;
          color: #888;
          line-height: 1.7;
        }
        @media (max-width: 900px) {
          .login-wrapper { flex-direction: column; }
          .left-panel { width: 100%; min-height: auto; padding: 50px 30px; }
          .right-panel { width: 100%; padding: 30px 20px 50px; }
          .login-card { padding: 35px 25px; }
        }
      `}</style>

      <div className="left-panel">
        <div className="wave-top-left"></div>
        <div className="wave-bottom-right"></div>
        
        <div className="brand-content">
          <div className="logo-container">
            <img src="/logo.png" alt="LG Art Sculptor Studio" className="login-logo" />
          </div>

          <div className="trust-section">
            <div className="shield-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                <path d="M9 12l2 2 4-4" stroke="#c9a227" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="trust-title">Calidad y confianza</p>
            <p className="trust-subtitle">en cada proyecto que realizamos.</p>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-card">
          <div className="login-icon">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
          </div>

          <div className="login-header">
            <h1>Bienvenido de nuevo</h1>
            <p>Inicia sesión para continuar administrando tus facturas</p>
          </div>

          <div className="gold-divider">
            <span className="line"></span>
            <span className="diamond"></span>
            <span className="line"></span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input
                  type="text"
                  id="username"
                  placeholder="Ingresa tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <svg
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
            </div>

            <div className="forgot-password">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="bottom-divider">
            <span className="line"></span>
            <span className="diamond"></span>
            <span className="line"></span>
          </div>

          <div className="footer">
            <p>&copy; 2026 LG Art Sculptor Studio, Inc.</p>
            <p>Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
