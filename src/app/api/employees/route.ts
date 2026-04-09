import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const employees = await prisma.employee.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, department: true, color: true },
  })
  return NextResponse.json(employees)
}
