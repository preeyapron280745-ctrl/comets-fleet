import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

// Admin: confirm/reject booking | Driver: update trip status | Employee: cancel
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const id = Number(params.id)
  const body = await req.json()

  // Admin actions
  if (user.role === 'admin') {
    const { action, driverId, carId, rejectReason } = body
    if (action === 'confirm') {
      if (!driverId || !carId) return NextResponse.json({ error: 'driverId and carId required' }, { status: 400 })
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: 'CONFIRMED', driverId: Number(driverId), carId: Number(carId) },
      })
      return NextResponse.json(updated)
    }
    if (action === 'reject') {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: 'REJECTED', rejectReason },
      })
      return NextResponse.json(updated)
    }
  }

  // Employee: cancel
  if (user.role === 'employee') {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking || booking.employeeId !== Number(user.id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (booking.status !== 'PENDING') {
      return NextResponse.json({ error: 'Can only cancel pending bookings' }, { status: 400 })
    }
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
    return NextResponse.json(updated)
  }

  // Driver: update trip status
  if (user.role === 'driver') {
    const { tripStatus } = body
    if (!['DRIVING', 'DONE'].includes(tripStatus)) {
      return NextResponse.json({ error: 'Invalid tripStatus' }, { status: 400 })
    }
    const updated = await prisma.booking.update({
      where: { id },
      data: { tripStatus },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
    include: {
      employee: { select: { name: true, department: true } },
      driver: { select: { name: true, phone: true } },
      car: true,
    },
  })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}
