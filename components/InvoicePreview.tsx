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
    try { return new Date(dateStr).toLocaleDateString('es-GT') } catch { return dateStr }
  }

  const hasContent = data.clientName || data.items.some(i => i.description || i.amount > 0)

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[420px] gap-4 text-gray-300 select-none">
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current opacity-30">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-300">El recibo aparecerá aquí</p>
        <p className="text-[10px] text-gray-200 font-medium">Completa el formulario para ver la vista previa</p>
      </div>
    )
  }

  return (
    <div
      id="invoice-preview-print"
      className="relative bg-white font-sans"
      style={{ fontFamily: 'Arial, sans-serif', minHeight: '720px' }}
    >
      {/* Outer gold double border frame */}
      <div className="border-4 border-double border-[#c9a227]/50 m-2 p-5 flex flex-col gap-4 min-h-[700px] relative">

        {/* Corner decorations */}
        <div className="absolute top-[-2px] left-[-2px] w-6 h-6 border-t-4 border-l-4 border-[#c9a227]" />
        <div className="absolute top-[-2px] right-[-2px] w-6 h-6 border-t-4 border-r-4 border-[#c9a227]" />
        <div className="absolute bottom-[-2px] left-[-2px] w-6 h-6 border-b-4 border-l-4 border-[#c9a227]" />
        <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 border-b-4 border-r-4 border-[#c9a227]" />

        {/* ── HEADER ── */}
        <div className="flex justify-between items-start gap-3">
          {/* Logo + company info */}
          <div className="flex flex-col gap-1">
            <img
              src="/logo-login.png"
              alt="LG Art Sculptor Studio"
              className="w-[120px] h-auto mix-blend-multiply"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            <div className="text-[8px] text-gray-500 leading-relaxed mt-1">
              <div>Foundry. Specializing in: Bronze Casting, Patinas,</div>
              <div>Molding, Welding, High Quality</div>
              <div>Restorations &amp; Enlargements</div>
            </div>
          </div>

          {/* Receipt badge + number */}
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-white text-[10px] font-bold tracking-widest uppercase px-5 py-1 rounded-sm"
              style={{ background: 'linear-gradient(135deg, #dfba4d, #c1952e)' }}
            >
              FACTURA
            </span>
            <span className="text-[#c9a227] font-extrabold text-base tracking-wider text-right">
              {data.invoiceNumber || 'R-0000000'}
            </span>
            <div className="text-[9px] text-gray-600 text-right leading-snug">
              <div><span className="text-gray-400">Fecha: </span><span className="font-semibold">{formatDate(data.date)}</span></div>
              {data.orderNumber && (
                <div><span className="text-gray-400">No. de Orden: </span><span className="font-semibold">{data.orderNumber}</span></div>
              )}
            </div>
          </div>
        </div>

        {/* Company contact divider line */}
        <div className="flex items-center gap-2 text-[8px] text-gray-400 font-medium border-t border-[#c9a227]/30 pt-2">
          <span>📍 4ta. Calle 12-34, Zona 1, Guatemala</span>
          <span className="text-[#c9a227]">|</span>
          <span>📞 +502 1234 5678</span>
          <span className="text-[#c9a227]">|</span>
          <span>✉️ info@lgartstudio.com</span>
        </div>

        {/* ── CLIENT SECTION ── */}
        <div>
          <div
            className="text-white text-[9px] font-bold uppercase tracking-widest px-4 py-0.5 rounded-sm mb-2 inline-block"
            style={{ background: '#c9a227' }}
          >
            Recibido De
          </div>
          <div className="border border-[#c9a227]/20 rounded bg-[#faf9f6] p-3 text-[10px] grid gap-1">
            <div className="grid grid-cols-[100px_8px_1fr] gap-x-1 items-baseline">
              <span className="text-gray-500 font-semibold">Nombre</span>
              <span className="text-gray-400">:</span>
              <span className="font-bold text-gray-900">{data.clientName || '—'}</span>
            </div>
            <div className="grid grid-cols-[100px_8px_1fr] gap-x-1 items-baseline">
              <span className="text-gray-500 font-semibold">Dirección</span>
              <span className="text-gray-400">:</span>
              <span className="text-gray-800">{data.clientAddress || '—'}</span>
            </div>
            <div className="grid grid-cols-[100px_8px_1fr] gap-x-1 items-baseline">
              <span className="text-gray-500 font-semibold">Ciudad</span>
              <span className="text-gray-400">:</span>
              <span className="text-gray-800">{data.clientCity || '—'}</span>
            </div>
            <div className="grid grid-cols-[100px_8px_1fr] gap-x-1 items-baseline">
              <span className="text-gray-500 font-semibold">Teléfono</span>
              <span className="text-gray-400">:</span>
              <span className="text-gray-800">{data.clientPhone || '—'}</span>
            </div>
          </div>
        </div>

        {/* ── ITEMS TABLE ── */}
        <div className="flex-1">
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr>
                <th
                  className="text-left py-2 px-3 text-[9px] font-bold uppercase tracking-wider text-[#4a3505] rounded-l-sm"
                  style={{ background: 'linear-gradient(135deg, #dfba4d, #c1952e)' }}
                >
                  Descripción
                </th>
                <th
                  className="py-2 px-2 text-center text-[9px] font-bold uppercase tracking-wider text-[#4a3505] w-14"
                  style={{ background: 'linear-gradient(135deg, #dfba4d, #c1952e)' }}
                >
                  Cantidad
                </th>
                <th
                  className="py-2 px-3 text-right text-[9px] font-bold uppercase tracking-wider text-[#4a3505] w-24 rounded-r-sm"
                  style={{ background: 'linear-gradient(135deg, #dfba4d, #c1952e)' }}
                >
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.filter(i => i.description || i.amount > 0).length > 0 ? (
                data.items
                  .filter(i => i.description || i.amount > 0)
                  .map((item, idx) => (
                    <tr key={idx} className="border-b border-dashed border-gray-200">
                      <td className="py-2.5 px-3 text-gray-700 font-medium leading-snug">
                        {item.description || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center text-gray-600 font-semibold">
                        {item.quantity || 1}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-900 font-bold">
                        Q{(item.amount * (item.quantity || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-300 text-[10px]">
                    Sin conceptos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── TOTAL ── */}
        <div className="flex justify-end">
          <div
            className="flex items-center gap-6 px-5 py-2.5 rounded-sm border"
            style={{
              borderColor: '#c9a227',
              background: '#faf9f6',
              minWidth: 200,
            }}
          >
            <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">TOTAL:</span>
            <span className="text-base font-black text-[#c9a227] ml-auto">Q{data.total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── THANK YOU ── */}
        <div className="text-center border-t border-gray-100 pt-3">
          <p className="text-[#c9a227] font-bold text-sm tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            ¡Gracias por su preferencia!
          </p>
        </div>

        {/* ── SIGNATURES ── */}
        <div className="flex justify-between items-end pt-2">
          <div className="flex flex-col items-center gap-1 w-28">
            <div className="w-full border-t border-gray-500 pt-1 text-center">
              <p className="text-[9px] font-bold text-gray-800">Jose Gomez</p>
              <p className="text-[8px] text-gray-400">Firma del Dueño</p>
            </div>
          </div>

          {/* Stamp */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #dfba4d, #c1952e)' }}
          >
            <div className="w-10 h-10 rounded-full bg-white border-2 border-dashed border-[#c9a227]/60 flex flex-col items-center justify-center">
              <span className="text-[8px] font-black text-[#c9a227] leading-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>LG</span>
              <span className="text-[5px] font-bold text-[#c9a227] uppercase tracking-wider leading-none">Art</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 w-28">
            <div className="w-full border-t border-gray-500 pt-1 text-center">
              <p className="text-[9px] font-bold text-gray-800">Cliente</p>
              <p className="text-[8px] text-gray-400">Firma del Cliente</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center border-t border-gray-100 pt-2">
          <p className="text-[7px] text-gray-400">
            © 2026 LG Art Sculptor Studio, Inc. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </div>
  )
}
