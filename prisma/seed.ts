import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Luci García',
      role: 'admin',
    },
  })

  // Create sample invoices
  const sampleInvoices = [
    {
      invoiceNumber: 'R-0001246',
      clientName: 'María López',
      clientAddress: '4ta. Avenida 5-20, Zona 1',
      clientCity: 'Guatemala, Guatemala 01001',
      clientPhone: '+502 5555 1234',
      orderNumber: 'ORD-000568',
      status: 'paid',
      subtotal: 625.00,
      total: 625.00,
      items: {
        create: [
          { description: 'Escultura metálica personalizada', amount: 350.00, quantity: 1 },
          { description: 'Instalación y montaje', amount: 275.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001245',
      clientName: 'Carlos Méndez',
      clientAddress: '15 Avenida 3-10, Zona 3',
      clientCity: 'Guatemala, Guatemala 01003',
      clientPhone: '+502 5555 2345',
      orderNumber: 'ORD-000567',
      status: 'paid',
      subtotal: 275.00,
      total: 275.00,
      items: {
        create: [
          { description: 'Reparación de pieza metálica', amount: 275.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001244',
      clientName: 'Ana Rodríguez',
      clientAddress: '7ma. Calle 10-50, Zona 2',
      clientCity: 'Guatemala, Guatemala 01002',
      clientPhone: '+502 5555 3456',
      orderNumber: 'ORD-000566',
      status: 'pending',
      subtotal: 120.00,
      total: 120.00,
      items: {
        create: [
          { description: 'Diseño de坯模 para escultura', amount: 120.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001243',
      clientName: 'Luis Hernández',
      clientAddress: '3era. Avenida 8-15, Zona 4',
      clientCity: 'Guatemala, Guatemala 01004',
      clientPhone: '+502 5555 4567',
      orderNumber: 'ORD-000565',
      status: 'paid',
      subtotal: 450.00,
      total: 450.00,
      items: {
        create: [
          { description: 'Puerta decorativa forjada', amount: 450.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001242',
      clientName: 'Empresa XYZ',
      clientAddress: '10ma. Calle 5-30, Zona 9',
      clientCity: 'Guatemala, Guatemala 01009',
      clientPhone: '+502 5555 5678',
      orderNumber: 'ORD-000564',
      status: 'paid',
      subtotal: 1850.00,
      total: 1850.00,
      items: {
        create: [
          { description: 'Señalización corporativa en metal', amount: 1200.00, quantity: 1 },
          { description: 'Instalación especializada', amount: 650.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001241',
      clientName: 'Patricia Gómez',
      clientAddress: '2da. Avenida 12-40, Zona 1',
      clientCity: 'Guatemala, Guatemala 01001',
      clientPhone: '+502 5555 6789',
      orderNumber: 'ORD-000563',
      status: 'cancelled',
      subtotal: 340.00,
      total: 340.00,
      items: {
        create: [
          { description: 'Figura decorativa artesanal', amount: 340.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001240',
      clientName: 'José Ramírez',
      clientAddress: '5ta. Calle 7-25, Zona 5',
      clientCity: 'Guatemala, Guatemala 01005',
      clientPhone: '+502 5555 7890',
      orderNumber: 'ORD-000562',
      status: 'paid',
      subtotal: 980.00,
      total: 980.00,
      items: {
        create: [
          { description: 'Barandal forjado personalizado', amount: 980.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001239',
      clientName: 'Ana Torres',
      clientAddress: '8va. Avenida 4-10, Zona 7',
      clientCity: 'Guatemala, Guatemala 01007',
      clientPhone: '+502 5555 8901',
      orderNumber: 'ORD-000561',
      status: 'pending',
      subtotal: 150.00,
      total: 150.00,
      items: {
        create: [
          { description: 'Consultoría de diseño', amount: 150.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001238',
      clientName: 'Miguel Ángel',
      clientAddress: '6ta. Calle 9-35, Zona 6',
      clientCity: 'Guatemala, Guatemala 01006',
      clientPhone: '+502 5555 9012',
      orderNumber: 'ORD-000560',
      status: 'paid',
      subtotal: 560.00,
      total: 560.00,
      items: {
        create: [
          { description: 'Mesa de centro con acabado especial', amount: 560.00, quantity: 1 },
        ],
      },
    },
    {
      invoiceNumber: 'R-0001237',
      clientName: 'Sofia Morales',
      clientAddress: '9na. Avenida 2-20, Zona 8',
      clientCity: 'Guatemala, Guatemala 01008',
      clientPhone: '+502 5555 0123',
      orderNumber: 'ORD-000559',
      status: 'cancelled',
      subtotal: 300.00,
      total: 300.00,
      items: {
        create: [
          { description: 'Cuadro en relieve metálico', amount: 300.00, quantity: 1 },
        ],
      },
    },
  ]

  for (const invoice of sampleInvoices) {
    await prisma.invoice.create({
      data: invoice,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
