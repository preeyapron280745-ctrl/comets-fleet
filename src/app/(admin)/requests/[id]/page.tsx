'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { formatDateTH } from '@/lib/utils'

export default function AdminRequestDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = useParams()
  const [booking, setBooking] = useState<any>(null)
  const [drivers, setDrivers] = useState<any[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedCar, setSelectedCar] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
    if (status !== 'authenticated') return
    fetch(`/api/bookings/${id}`).then(r => r.json()).then(setBooking)
    fetch('/api/drivers').then(r => r.json()).then(setDrivers)
    fetch('/api/cars').then(r => r.json()).then(setCars)
  }, [status, id])

  async function confirm() {
    if (!selectedDriver || !selectedCar) return alert('กรุณาเลือกคนขับและรถ')
    setSubmitting(true)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm', driverId: selectedDriver, carId: selectedCar }),
    })
    router.push('/requests')
  }

  async function reject() {
    setSubmitting(true)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectReason }),
    })
    router.push('/requests')
  }

  if (!booking) return <div className="flex-1 flex items-center justify-center text-text-3">กำลังโหลด...</div>

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.back()} className="text-text-2 text-2xl leading-none px-1">‹</button>
        <div className="font-bold text-[17px]">อนุมัติการจอง #{booking.id}</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Hero */}
        <div className="bg-s1 border-b border-border p-4">
          <div className="font-mono text-4xl font-bold">{booking.startTime} <small className="text-text-2 text-sm font-sans font-normal">น.</small></div>
          <div className="text-text-2 text-sm mt-1">{formatDateTH(booking.date)}</div>
          {booking.returnTime && <div className="text-text-3 text-sm">กลับ {booking.returnTime} น.</div>}
        </div>

        {/* Requester */}
        <div className="border-b border-border p-4">
          <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-3">ผู้จอง</div>
          <div className="font-bold text-base">{booking.employee.name}</div>
          <div className="text-text-2 text-sm">{booking.employee.department}</div>
        </div>

        {/* Route */}
        <div className="border-b border-border p-4">
          <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-3">เส้นทาง</div>
          <div className="flex flex-col gap-2">
            <div><span className="text-xs text-text-3">ต้นทาง</span><div className="font-bold">{booking.fromLocation}</div></div>
            <div><span className="text-xs text-text-3">ปลายทาง</span><div className="font-bold">{booking.toLocation}</div></div>
          </div>
        </div>

        {/* Purpose & Passengers */}
        <div className="border-b border-border p-4">
          <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-2">วัตถุประสงค์</div>
          <div className="bg-gold-dim border border-gold/20 rounded-sm p-3 text-sm">{booking.purpose}{booking.purposeDetail && ` — ${booking.purposeDetail}`}</div>
          <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mt-4 mb-2">ผู้โดยสาร</div>
          <div className="text-sm">{booking.passengers}</div>
        </div>

        {/* Assign Driver & Car */}
        <div className="p-4 flex flex-col gap-4">
          <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-1">มอบหมายงาน</div>
          <div>
            <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">คนขับ <span className="text-danger">*</span></label>
            <select className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-gold font-sans appearance-none"
              value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}>
              <option value="">เลือกคนขับ</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.jobCount} งาน)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">รถ <span className="text-danger">*</span></label>
            <select className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-gold font-sans appearance-none"
              value={selectedCar} onChange={e => setSelectedCar(e.target.value)}>
              <option value="">เลือกรถ</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.icon} {c.plate} — {c.type}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 pb-8 flex flex-col gap-3 bg-bg border-t border-border flex-shrink-0">
        {!showReject ? (
          <>
            <button onClick={confirm} disabled={submitting}
              className="w-full py-4 rounded-card font-extrabold text-base disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }}>
              ✅ ยืนยันและมอบหมายงาน
            </button>
            <button onClick={() => setShowReject(true)}
              className="w-full py-3 bg-none border border-border rounded-card text-text-2 text-sm font-semibold">
              ✗ ปฏิเสธการจอง
            </button>
          </>
        ) : (
          <>
            <textarea className="w-full bg-s2 border border-danger/50 rounded-card px-4 py-3 text-sm text-text outline-none font-sans resize-none min-h-[80px]"
              placeholder="เหตุผลที่ปฏิเสธ..."
              value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <button onClick={reject} disabled={submitting}
              className="w-full py-4 rounded-card font-extrabold text-base"
              style={{ background: 'linear-gradient(135deg,#e11d48,#f43f5e)', color: '#fff' }}>
              ✗ ยืนยันการปฏิเสธ
            </button>
            <button onClick={() => setShowReject(false)} className="w-full py-3 border border-border rounded-card text-text-2 text-sm font-semibold">ยกเลิก</button>
          </>
        )}
      </div>
    </div>
  )
}
