import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const { searchParams } = new URL(req.url)

  if (user.role === 'employee') {
    const bookings = await prisma.booking.findMany({
      where: { employeeId: Number(user.id) },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      include: { driver: { select: { name: true, phone: true } }, car: true },
    })
    return NextResponse.json(bookings)
  }

  if (user.role === 'driver') {
    const filter = searchParams.get('filter') // today | upcoming | history
    const today = new Date().toISOString().slice(0, 10)
    const where: any = { driverId: Number(user.id), status: 'CONFIRMED' }
    if (filter === 'today') where.date = today
    else if (filter === 'upcoming') where.date = { gt: today }
    else if (filter === 'history') where.date = { lt: today }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: [{ date: filter === 'history' ? 'desc' : 'asc' }, { startTime: 'asc' }],
      include: { employee: { select: { name: true, department: true } }, car: true },
    })
    return NextResponse.json(bookings)
  }

  if (user.role === 'admin') {
    const status = searchParams.get('status')
    const bookings = await prisma.booking.findMany({
      where: status ? { status } : {},
      orderBy: [{ createdAt: 'desc' }],
      include: {
        employee: { select: { name: true, department: true } },
        driver: { select: { name: true } },
        car: true,
      },
    })
    return NextResponse.json(bookings)
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  if (user.role !== 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { date, startTime, returnTime, fromLocation, toLocation, passengers, purpose, purposeDetail } = body

  if (!date || !startTime || !fromLocation || !toLocation || !passengers || !purpose) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const booking = await prisma.booking.create({
    data: {
      date,
      startTime,
      returnTime,
      fromLocation,
      toLocation,
      passengers,
      purpose,
      purposeDetail,
      employeeId: Number(user.id),
      status: 'PENDING',
    },
  })
  return NextResponse.json(booking, { status: 201 })
}
