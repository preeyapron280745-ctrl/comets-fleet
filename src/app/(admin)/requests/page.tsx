'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminRequests() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
    if (status === 'authenticated' && user?.role !== 'admin') router.push('/')
  }, [status, user])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/bookings?status=PENDING').then(r => r.json()).then(setBookings)
  }, [status])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.push('/dashboard')} className="text-text-2 text-2xl leading-none px-1">‹</button>
        <div>
          <div className="font-bold text-[17px]">คำขอรอการยืนยัน</div>
          <div className="text-text-2 text-xs">{bookings.length} รายการ</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-text-3">
            <div className="text-5xl mb-3">✅</div>
            <div className="text-base font-semibold text-text-2">ไม่มีรายการรอการยืนยัน</div>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} onClick={() => router.push(`/requests/${b.id}`)}
              className="bg-s1 border border-info/30 rounded-card p-4 mb-3 cursor-pointer active:bg-s2 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xl font-bold text-gold-2">{b.startTime} น.</span>
                <span className="text-xs text-info bg-blue-500/10 px-3 py-1 rounded-full font-bold">⏳ รอยืนยัน</span>
              </div>
              <div className="text-sm font-bold mb-1">{b.employee.name}
                <span className="text-text-3 font-normal"> · {b.employee.department}</span>
              </div>
              <div className="text-sm text-text-2 mb-1">📅 {b.date}</div>
              <div className="text-sm mb-2">📍 {b.fromLocation} → {b.toLocation}</div>
              <div className="text-xs text-text-2 bg-s2 rounded-full px-3 py-1 inline-block">🎯 {b.purpose}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
