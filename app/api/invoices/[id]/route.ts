import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(params.id) },
      include: { items: true },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, clientName, clientAddress, clientCity, clientPhone, clientEmail, orderNumber, items, notes } = body

    // Delete existing items and recreate
    if (items) {
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: parseInt(params.id) },
      })
    }

    const subtotal = items ? items.reduce((sum: number, item: any) => sum + (item.amount * (item.quantity || 1)), 0) : undefined

    const invoice = await prisma.invoice.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(status && { status }),
        ...(clientName && { clientName }),
        ...(clientAddress && { clientAddress }),
        ...(clientCity && { clientCity }),
        ...(clientPhone && { clientPhone }),
        ...(clientEmail && { clientEmail }),
        ...(orderNumber && { orderNumber }),
        ...(subtotal !== undefined && { subtotal, total: subtotal }),
        ...(notes !== undefined && { notes }),
        ...(items && {
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              amount: item.amount,
              quantity: item.quantity || 1,
            })),
          },
        }),
      },
      include: { items: true },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar la factura' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.invoice.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Factura eliminada' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar la factura' },
      { status: 500 }
    )
  }
}
