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
    return new Date(dateStr).toLocaleDateString('es-GT')
  }

  return (
    <div className="relative bg-white p-5 md:p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between overflow-hidden min-h-[720px] font-sans no-print select-none">
      
      {/* Gold corner ribbon decorations */}
      {/* Top-Left */}
      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none z-10">
        <div className="w-[100px] h-[18px] bg-gradient-to-r from-[#dfba4d] to-[#c1952e] absolute top-[12px] left-[-30px] -rotate-45 border-b border-[#a6872d]/30 shadow-sm"></div>
        <div className="w-[100px] h-[3px] bg-[#dfba4d]/40 absolute top-[34px] left-[-30px] -rotate-45"></div>
      </div>
      {/* Top-Right */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-10">
        <div className="w-[100px] h-[18px] bg-gradient-to-l from-[#dfba4d] to-[#c1952e] absolute top-[12px] right-[-30px] rotate-45 border-b border-[#a6872d]/30 shadow-sm"></div>
        <div className="w-[100px] h-[3px] bg-[#dfba4d]/40 absolute top-[34px] right-[-30px] rotate-45"></div>
      </div>
      {/* Bottom-Left */}
      <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden pointer-events-none z-10">
        <div className="w-[100px] h-[18px] bg-gradient-to-r from-[#dfba4d] to-[#c1952e] absolute bottom-[12px] left-[-30px] rotate-45 border-t border-[#a6872d]/30 shadow-sm"></div>
        <div className="w-[100px] h-[3px] bg-[#dfba4d]/40 absolute bottom-[34px] left-[-30px] rotate-45"></div>
      </div>
      {/* Bottom-Right */}
      <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-10">
        <div className="w-[100px] h-[18px] bg-gradient-to-l from-[#dfba4d] to-[#c1952e] absolute bottom-[12px] right-[-30px] -rotate-45 border-t border-[#a6872d]/30 shadow-sm"></div>
        <div className="w-[100px] h-[3px] bg-[#dfba4d]/40 absolute bottom-[34px] right-[-30px] -rotate-45"></div>
      </div>

      {/* Double Gold Line Border Frame */}
      <div className="border-4 border-double border-[#c9a227]/40 p-4 md:p-5 flex-1 flex flex-col justify-between rounded-xl relative">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="max-w-[170px] w-full">
              <img
                src="/logo-login.png"
                alt="LG Art"
                className="w-full h-auto mix-blend-multiply image-render-crisp"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            {/* Company Contact Info */}
            <div className="text-[9px] text-gray-500 font-medium flex flex-col gap-0.5 mt-2">
              <span className="flex items-center gap-1">
                📍 4ta. Calle 12-34, Zona 1, Guatemala
              </span>
              <span className="flex items-center gap-1">
                📞 +502 1234 5678 &nbsp;&nbsp; ✉️ info@lgartstudio.com
              </span>
            </div>
          </div>

          {/* Receipt Badge and Details */}
          <div className="flex flex-col items-end shrink-0">
            <span className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold px-4 py-1 text-[10px] rounded-md tracking-widest uppercase border border-[#a6872d]/20 mb-1.5 shadow-sm">
              RECIBO
            </span>
            <span className="bg-gray-50 border border-gray-200/60 rounded-lg px-3 py-1 font-bold text-gray-800 text-xs tracking-wider block text-center min-w-[110px]">
              {data.invoiceNumber || 'R-0000000'}
            </span>
            <div className="text-[9px] text-gray-600 mt-2 flex flex-col gap-0.5 items-end font-medium">
              <div>
                <span className="text-gray-400 mr-1.5 font-normal">Fecha:</span>
                <span className="font-semibold text-gray-900">{formatDate(data.date)}</span>
              </div>
              {data.orderNumber && (
                <div>
                  <span className="text-gray-400 mr-1.5 font-normal">No. de Orden:</span>
                  <span className="font-semibold text-gray-900">{data.orderNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Details Section ("RECIBIDO DE") */}
        <div className="mb-4">
          <div className="flex justify-center mb-1.5">
            <span className="bg-[#c9a227] text-white px-6 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
              Recibido De
            </span>
          </div>
          <div className="border border-[#c9a227]/25 rounded-xl bg-[#faf9f5]/30 p-3 text-[10px] text-gray-700 font-medium">
            <div className="grid grid-cols-[105px_10px_1fr] gap-y-1 leading-relaxed">
              <span className="text-gray-500 font-semibold">Nombre del Cliente</span>
              <span className="text-gray-400 text-center">:</span>
              <span className="font-bold text-gray-900">{data.clientName || '—'}</span>

              <span className="text-gray-500 font-semibold">Dirección</span>
              <span className="text-gray-400 text-center">:</span>
              <span className="font-semibold text-gray-800">{data.clientAddress || '—'}</span>

              <span className="text-gray-500 font-semibold">Ciudad, Estado, ZIP</span>
              <span className="text-gray-400 text-center">:</span>
              <span className="font-semibold text-gray-800">{data.clientCity || '—'}</span>

              <span className="text-gray-500 font-semibold">Teléfono</span>
              <span className="text-gray-400 text-center">:</span>
              <span className="font-semibold text-gray-800">{data.clientPhone || '—'}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 min-h-[140px] flex flex-col justify-between">
          <table className="w-full border-collapse text-[10px] mt-1">
            <thead>
              <tr className="border-b border-[#c9a227]/40">
                <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold py-1.5 px-3 text-left uppercase tracking-wider rounded-l-md">
                  Descripción
                </th>
                <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold py-1.5 px-2 text-center uppercase tracking-wider w-12">
                  Cant.
                </th>
                <th className="bg-gradient-to-r from-[#dfba4d] to-[#c1952e] text-[#4a3505] font-bold py-1.5 px-3 text-right uppercase tracking-wider rounded-r-md w-28">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-200">
              {data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/40">
                    <td className="py-2.5 px-3 text-gray-700 font-semibold leading-relaxed">
                      {item.description || 'Descripción del producto o servicio'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-gray-500">{item.quantity || 1}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                      Q{(item.amount * (item.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400 font-medium tracking-wide">
                    Agrega ítems para visualizar el detalle
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="flex justify-end mt-4">
          <div className="bg-[#faf8f4] border-2 border-[#dfba4d] rounded-xl px-5 py-2 flex items-center gap-4 min-w-[200px] shadow-sm">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">TOTAL</span>
            <span className="text-lg font-black text-[#c9a227] flex-1 text-right">
              Q{data.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Thank You Footer */}
        <div className="text-center mt-3 pt-2 border-t border-gray-100">
          <p className="font-vibes text-xl text-[#c9a227] tracking-wider font-semibold">
            ¡Gracias por su preferencia!
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="flex justify-between items-end mt-3 pt-2">
          {/* Owner Signature */}
          <div className="text-center w-28 flex flex-col items-center">
            <span className="font-vibes text-sm text-gray-400 h-6 select-none">Jose Gomez</span>
            <div className="w-full border-t border-gray-400 pt-1 flex flex-col">
              <span className="text-[9.5px] font-bold text-gray-800 leading-tight">Jose Gomez</span>
              <span className="text-[7.5px] text-gray-400 font-medium">Firma del Dueño</span>
            </div>
          </div>

          {/* Central Logo Stamp */}
          <div className="w-14 h-14 bg-gradient-to-br from-[#dfba4d] to-[#c1952e] rounded-full p-[2px] shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#fefdfa] rounded-full border border-dashed border-white/60 flex flex-col items-center justify-center text-[#c9a227] select-none">
              <span className="font-vibes text-xs leading-none font-bold">LG</span>
              <span className="font-playfair text-[6.5px] uppercase font-bold tracking-widest mt-0.5">Art</span>
              <span className="text-[4.5px] uppercase font-bold text-[#c9a227]/70 leading-none">Studio</span>
            </div>
          </div>

          {/* Client Signature */}
          <div className="text-center w-28 flex flex-col items-center">
            <span className="font-vibes text-sm text-gray-400 h-6 select-none">Cliente</span>
            <div className="w-full border-t border-gray-400 pt-1 flex flex-col">
              <span className="text-[9.5px] font-bold text-gray-800 leading-tight">Cliente</span>
              <span className="text-[7.5px] text-gray-400 font-medium">Firma del Cliente</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
