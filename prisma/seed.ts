import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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

  // Sample invoices
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
          { description: 'Diseño de moldes para escultura', amount: 120.00, quantity: 1 },
        ],
      },
    },
  ]

  for (const invoice of sampleInvoices) {
    await prisma.invoice.create({ data: invoice })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
