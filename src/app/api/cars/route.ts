import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cars = await prisma.car.findMany({ where: { active: true }, orderBy: { plate: 'asc' } })
  return NextResponse.json(cars)
}
