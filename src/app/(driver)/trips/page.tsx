'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { initial, avatarColor, formatDateTH, todayStr } from '@/lib/utils'

type Booking = {
  id: number; date: string; startTime: string; returnTime: string | null
  fromLocation: string; toLocation: string; passengers: string
  purpose: string; tripStatus: string; status: string
  car: { plate: string; type: string; icon: string } | null
  employee: { name: string; department: string | null }
}

export default function TripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  const [tab, setTab] = useState<'today' | 'upcoming' | 'history'>('today')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
    if (status === 'authenticated' && user?.role !== 'driver') router.push('/')
  }, [status, user])

  useEffect(() => {
    if (status !== 'authenticated') return
    setLoading(true)
    fetch(`/api/bookings?filter=${tab}`)
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false) })
  }, [tab, status])

  async function updateTrip(id: number, tripStatus: string) {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripStatus }),
    })
    // Re-fetch
    fetch(`/api/bookings?filter=${tab}`).then(r => r.json()).then(setBookings)
  }

  if (status === 'loading') return <div className="flex-1 flex items-center justify-center text-text-3">กำลังโหลด...</div>

  const todayCount = tab === 'today' ? bookings.filter(b => b.tripStatus === 'NOT_STARTED').length : 0

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-extrabold text-[15px] text-white flex-shrink-0"
            style={{ background: avatarColor(user?.name || '') }}>
            {initial(user?.name || '')}
          </div>
          <div>
            <div className="font-bold text-[15px] leading-tight">{user?.name}</div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-gold">คนขับรถ</div>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="border border-border rounded-lg px-3 py-1.5 text-text-2 text-[13px]">ออก</button>
      </div>

      {/* Tabs */}
      <div className="flex bg-s1 border-b border-border flex-shrink-0">
        {[
          { key: 'today', label: 'วันนี้', badge: todayCount },
          { key: 'upcoming', label: 'กำลังจะมาถึง' },
          { key: 'history', label: 'ประวัติ' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex-1 py-3 text-[13px] font-semibold border-b-[3px] transition-all relative font-sans
              ${tab === t.key ? 'text-gold border-gold' : 'text-text-3 border-transparent'}`}>
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="absolute top-2 right-[calc(50%-20px)] bg-danger text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {loading ? (
          <div className="text-center py-12 text-text-3">กำลังโหลด...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-text-3">
            <div className="text-5xl mb-3">🚗</div>
            <div className="text-base font-semibold text-text-2">ไม่มีงาน{tab === 'today' ? 'วันนี้' : tab === 'upcoming' ? 'ที่กำลังมาถึง' : 'ในอดีต'}</div>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id}
              className={`bg-s1 border border-border rounded-card p-4 mb-3 relative overflow-hidden cursor-pointer active:bg-s2 transition-colors`}
              onClick={() => router.push(`/trip/${b.id}`)}>
              {/* Status bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-card
                ${b.tripStatus === 'DONE' ? 'bg-text-3' : 'bg-success'}`} />
              <div className="pl-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xl font-bold text-gold-2">{b.startTime} <small className="text-text-3 text-sm font-normal">น.</small></span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full
                    ${b.tripStatus === 'DONE' ? 'bg-s3 text-text-3' :
                      b.tripStatus === 'DRIVING' ? 'bg-gold-dim text-gold-2' : 'bg-green-500/10 text-success'}`}>
                    {b.tripStatus === 'DONE' ? '✓ เสร็จแล้ว' : b.tripStatus === 'DRIVING' ? '🚗 กำลังเดินทาง' : '✓ ยืนยันแล้ว'}
                  </span>
                </div>
                <div className="text-xs text-text-3 mb-2">📅 {formatDateTH(b.date)}</div>
                <div className="text-sm mb-1">📍 <span className="font-semibold">{b.fromLocation}</span></div>
                <div className="text-sm mb-2">🏁 <span className="font-semibold">{b.toLocation}</span></div>
                <div className="flex gap-2 flex-wrap pt-2 border-t border-border">
                  <span className="text-xs text-text-2 bg-s2 rounded-full px-3 py-1">👤 {b.employee.name}</span>
                  {b.car && <span className="text-xs text-text-2 bg-s2 rounded-full px-3 py-1">{b.car.icon} {b.car.plate}</span>}
                </div>

                {/* Action buttons for today tab */}
                {tab === 'today' && b.tripStatus === 'NOT_STARTED' && (
                  <button onClick={e => { e.stopPropagation(); updateTrip(b.id, 'DRIVING') }}
                    className="w-full mt-3 py-3 rounded-card font-extrabold text-sm"
                    style={{ background: 'linear-gradient(135deg,#e8a020,#f5c050)', color: '#1a0e00' }}>
                    🚗 เริ่มออกเดินทาง
                  </button>
                )}
                {tab === 'today' && b.tripStatus === 'DRIVING' && (
                  <button onClick={e => { e.stopPropagation(); updateTrip(b.id, 'DONE') }}
                    className="w-full mt-3 py-3 rounded-card font-extrabold text-sm"
                    style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }}>
                    ✅ ส่งผู้โดยสารเรียบร้อย
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
