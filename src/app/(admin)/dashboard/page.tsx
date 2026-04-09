'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatDateTH, todayStr } from '@/lib/utils'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  const [pending, setPending] = useState<any[]>([])
  const [todayBookings, setTodayBookings] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
    if (status === 'authenticated' && user?.role !== 'admin') router.push('/')
  }, [status, user])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/bookings?status=PENDING').then(r => r.json()).then(setPending)
    fetch('/api/bookings').then(r => r.json()).then(all => {
      const today = todayStr()
      setTodayBookings(all.filter((b: any) => b.date === today))
    })
  }, [status])

  if (status === 'loading') return <div className="flex-1 flex items-center justify-center text-text-3">กำลังโหลด...</div>

  const confirmed = todayBookings.filter(b => b.status === 'CONFIRMED')
  const driving = confirmed.filter(b => b.tripStatus === 'DRIVING')
  const done = confirmed.filter(b => b.tripStatus === 'DONE')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center justify-between flex-shrink-0">
        <div>
          <div className="font-bold text-[15px]">🛡️ Admin Dashboard</div>
          <div className="text-[11px] text-text-2">{formatDateTH(todayStr())}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/requests')}
            className="border border-border rounded-lg px-3 py-1.5 text-text-2 text-[13px]">คำขอ</button>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="border border-border rounded-lg px-3 py-1.5 text-text-2 text-[13px]">ออก</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'รอการยืนยัน', value: pending.length, color: 'text-info', bg: 'bg-blue-500/10' },
            { label: 'วันนี้ทั้งหมด', value: todayBookings.length, color: 'text-teal-2', bg: 'bg-teal-dim' },
            { label: 'กำลังเดินทาง', value: driving.length, color: 'text-gold-2', bg: 'bg-gold-dim' },
            { label: 'เสร็จแล้ววันนี้', value: done.length, color: 'text-success', bg: 'bg-green-500/10' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border border-border rounded-card p-4`}>
              <div className={`text-3xl font-extrabold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-text-2 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pending requests */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest">รอการยืนยัน</div>
          <button onClick={() => router.push('/requests')} className="text-xs text-teal">ดูทั้งหมด ›</button>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-8 text-text-3">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-sm">ไม่มีรายการรอการยืนยัน</div>
          </div>
        ) : (
          pending.slice(0, 3).map(b => (
            <div key={b.id} onClick={() => router.push(`/requests/${b.id}`)}
              className="bg-s1 border border-border rounded-card p-4 mb-3 cursor-pointer active:bg-s2 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-lg font-bold text-gold-2">{b.startTime} น.</span>
                <span className="text-xs text-info bg-blue-500/10 px-3 py-1 rounded-full font-bold">⏳ รอยืนยัน</span>
              </div>
              <div className="text-sm font-semibold mb-1">{b.employee.name} <span className="text-text-3 font-normal">· {b.employee.department}</span></div>
              <div className="text-sm text-text-2">📅 {b.date} · {b.fromLocation} → {b.toLocation}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
