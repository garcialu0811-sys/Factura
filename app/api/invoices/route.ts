import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

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

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientName, clientAddress, clientCity, clientPhone, clientEmail, orderNumber, items, notes } = body

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { id: 'desc' },
    })

    let nextNumber = 1237
    if (lastInvoice) {
      const lastNum = parseInt(lastInvoice.invoiceNumber.replace('R-', ''))
      nextNumber = lastNum + 1
    }

    const invoiceNumber = `R-${String(nextNumber).padStart(7, '0')}`

    // Calculate totals
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

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Error al crear la factura' },
      { status: 500 }
    )
  }
}
