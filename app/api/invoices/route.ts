import { NextResponse } from 'next/server'

// In-memory store for when DB is not available
let inMemoryInvoices: any[] = [
  {
    id: 1,
    invoiceNumber: 'R-0001246',
    clientName: 'María López',
    clientAddress: '4ta. Avenida 5-20, Zona 1',
    clientCity: 'Guatemala, Guatemala 01001',
    clientPhone: '+502 5555 1234',
    orderNumber: 'ORD-000568',
    date: '2026-07-08T00:00:00.000Z',
    status: 'paid',
    subtotal: 625,
    total: 625,
    items: [
      { id: 1, description: 'Escultura metálica personalizada', amount: 350, quantity: 1 },
      { id: 2, description: 'Instalación y montaje', amount: 275, quantity: 1 },
    ],
  },
  {
    id: 2,
    invoiceNumber: 'R-0001245',
    clientName: 'Carlos Méndez',
    clientAddress: '15 Avenida 3-10, Zona 3',
    clientCity: 'Guatemala, Guatemala 01003',
    clientPhone: '+502 5555 2345',
    orderNumber: 'ORD-000567',
    date: '2026-07-07T00:00:00.000Z',
    status: 'paid',
    subtotal: 275,
    total: 275,
    items: [
      { id: 3, description: 'Reparación de pieza metálica', amount: 275, quantity: 1 },
    ],
  },
  {
    id: 3,
    invoiceNumber: 'R-0001244',
    clientName: 'Ana Rodríguez',
    clientAddress: '7ma. Calle 10-50, Zona 2',
    clientCity: 'Guatemala, Guatemala 01002',
    clientPhone: '+502 5555 3456',
    orderNumber: 'ORD-000566',
    date: '2026-07-06T00:00:00.000Z',
    status: 'pending',
    subtotal: 120,
    total: 120,
    items: [
      { id: 4, description: 'Diseño de modelo para escultura', amount: 120, quantity: 1 },
    ],
  },
  {
    id: 4,
    invoiceNumber: 'R-0001243',
    clientName: 'Luis Hernández',
    clientAddress: '3era. Avenida 8-15, Zona 4',
    clientCity: 'Guatemala, Guatemala 01004',
    clientPhone: '+502 5555 4567',
    orderNumber: 'ORD-000565',
    date: '2026-07-05T00:00:00.000Z',
    status: 'paid',
    subtotal: 450,
    total: 450,
    items: [
      { id: 5, description: 'Puerta decorativa forjada', amount: 450, quantity: 1 },
    ],
  },
  {
    id: 5,
    invoiceNumber: 'R-0001242',
    clientName: 'Empresa XYZ',
    clientAddress: '10ma. Calle 5-30, Zona 9',
    clientCity: 'Guatemala, Guatemala 01009',
    clientPhone: '+502 5555 5678',
    orderNumber: 'ORD-000564',
    date: '2026-07-04T00:00:00.000Z',
    status: 'paid',
    subtotal: 1850,
    total: 1850,
    items: [
      { id: 6, description: 'Señalización corporativa en metal', amount: 1200, quantity: 1 },
      { id: 7, description: 'Instalación especializada', amount: 650, quantity: 1 },
    ],
  },
  {
    id: 6,
    invoiceNumber: 'R-0001241',
    clientName: 'Patricia Gómez',
    clientAddress: '2da. Avenida 12-40, Zona 1',
    clientCity: 'Guatemala, Guatemala 01001',
    clientPhone: '+502 5555 6789',
    orderNumber: 'ORD-000563',
    date: '2026-07-03T00:00:00.000Z',
    status: 'cancelled',
    subtotal: 340,
    total: 340,
    items: [
      { id: 8, description: 'Figura decorativa artesanal', amount: 340, quantity: 1 },
    ],
  },
  {
    id: 7,
    invoiceNumber: 'R-0001240',
    clientName: 'José Ramírez',
    clientAddress: '5ta. Calle 7-25, Zona 5',
    clientCity: 'Guatemala, Guatemala 01005',
    clientPhone: '+502 5555 7890',
    orderNumber: 'ORD-000562',
    date: '2026-07-02T00:00:00.000Z',
    status: 'paid',
    subtotal: 980,
    total: 980,
    items: [
      { id: 9, description: 'Barandal forjado personalizado', amount: 980, quantity: 1 },
    ],
  },
  {
    id: 8,
    invoiceNumber: 'R-0001239',
    clientName: 'Ana Torres',
    clientAddress: '8va. Avenida 4-10, Zona 7',
    clientCity: 'Guatemala, Guatemala 01007',
    clientPhone: '+502 5555 8901',
    orderNumber: 'ORD-000561',
    date: '2026-07-01T00:00:00.000Z',
    status: 'pending',
    subtotal: 150,
    total: 150,
    items: [
      { id: 10, description: 'Consultoría de diseño', amount: 150, quantity: 1 },
    ],
  },
  {
    id: 9,
    invoiceNumber: 'R-0001238',
    clientName: 'Miguel Ángel',
    clientAddress: '6ta. Calle 9-35, Zona 6',
    clientCity: 'Guatemala, Guatemala 01006',
    clientPhone: '+502 5555 9012',
    orderNumber: 'ORD-000560',
    date: '2026-06-30T00:00:00.000Z',
    status: 'paid',
    subtotal: 560,
    total: 560,
    items: [
      { id: 11, description: 'Mesa de centro con acabado especial', amount: 560, quantity: 1 },
    ],
  },
  {
    id: 10,
    invoiceNumber: 'R-0001237',
    clientName: 'Sofia Morales',
    clientAddress: '9na. Avenida 2-20, Zona 8',
    clientCity: 'Guatemala, Guatemala 01008',
    clientPhone: '+502 5555 0123',
    orderNumber: 'ORD-000559',
    date: '2026-06-29T00:00:00.000Z',
    status: 'cancelled',
    subtotal: 300,
    total: 300,
    items: [
      { id: 12, description: 'Cuadro en relieve metálico', amount: 300, quantity: 1 },
    ],
  },
]

let nextId = 11

async function tryPrisma(fn: () => Promise<any>) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const result = await fn()
    await prisma.$disconnect()
    return { data: result, useDB: true }
  } catch {
    return { data: null, useDB: false }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Try database first
    const dbResult = await tryPrisma(async () => {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      const where: any = {}
      if (search) {
        where.OR = [
          { invoiceNumber: { contains: search } },
          { clientName: { contains: search } },
          { orderNumber: { contains: search } },
        ]
      }
      if (status !== 'all') {
        where.status = status
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: { items: true },
          orderBy: { date: 'desc' },
          skip,
          take: limit,
        }),
        prisma.invoice.count({ where }),
      ])

      await prisma.$disconnect()
      return { invoices, total }
    })

    if (dbResult.useDB && dbResult.data) {
      return NextResponse.json({
        invoices: dbResult.data.invoices,
        pagination: {
          page,
          limit,
          total: dbResult.data.total,
          pages: Math.ceil(dbResult.data.total / limit),
        },
      })
    }

    // Fallback to in-memory
    let filtered = [...inMemoryInvoices]

    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(i =>
        i.invoiceNumber.toLowerCase().includes(s) ||
        i.clientName.toLowerCase().includes(s) ||
        (i.orderNumber && i.orderNumber.toLowerCase().includes(s))
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(i => i.status === status)
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const total = filtered.length
    const invoices = filtered.slice(skip, skip + limit)

    return NextResponse.json({
      invoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientName, clientAddress, clientCity, clientPhone, clientEmail, orderNumber, items, notes } = body

    // Try database first
    const dbResult = await tryPrisma(async () => {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      const lastInvoice = await prisma.invoice.findFirst({ orderBy: { id: 'desc' } })
      let nextNumber = 1237
      if (lastInvoice) {
        nextNumber = parseInt(lastInvoice.invoiceNumber.replace('R-', '')) + 1
      }
      const invoiceNumber = `R-${String(nextNumber).padStart(7, '0')}`
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount * (item.quantity || 1)), 0)

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          clientName,
          clientAddress,
          clientCity,
          clientPhone,
          clientEmail,
          orderNumber,
          subtotal,
          total: subtotal,
          notes,
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              amount: item.amount,
              quantity: item.quantity || 1,
            })),
          },
        },
        include: { items: true },
      })

      await prisma.$disconnect()
      return invoice
    })

    if (dbResult.useDB) {
      return NextResponse.json(dbResult.data, { status: 201 })
    }

    // Fallback to in-memory
    const lastNum = inMemoryInvoices.length > 0
      ? parseInt(inMemoryInvoices[0].invoiceNumber.replace('R-', ''))
      : 1236
    const invoiceNumber = `R-${String(lastNum + 1).padStart(7, '0')}`
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount * (item.quantity || 1)), 0)

    const invoice = {
      id: nextId++,
      invoiceNumber,
      clientName,
      clientAddress: clientAddress || '',
      clientCity: clientCity || '',
      clientPhone: clientPhone || '',
      clientEmail: clientEmail || '',
      orderNumber: orderNumber || '',
      date: new Date().toISOString(),
      status: 'pending',
      subtotal,
      total: subtotal,
      notes: notes || '',
      items: items.map((item: any, idx: number) => ({
        id: Date.now() + idx,
        description: item.description,
        amount: item.amount,
        quantity: item.quantity || 1,
      })),
    }

    inMemoryInvoices.unshift(invoice)

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la factura' }, { status: 500 })
  }
}
