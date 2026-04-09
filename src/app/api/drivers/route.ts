import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { todayStr } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const today = todayStr()
  const drivers = await prisma.driver.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    include: {
      bookings: {
        where: {
          date: { gte: today },
          status: 'CONFIRMED',
        },
        select: { id: true },
      },
    },
  })
  return NextResponse.json(
    drivers.map(d => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
      color: d.color,
      jobCount: d.bookings.length,
    }))
  )
}
