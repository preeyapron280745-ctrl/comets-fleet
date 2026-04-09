'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { initial, avatarColor, todayStr } from '@/lib/utils'

const PURPOSES = [
  'ไปพบลูกค้า','ไป Proof สี','ไปประชุม','ไปอบรม','ไปรับลูกค้า',
  'กลับ Office','รับสินค้า','ส่งสินค้า','รับอุปกรณ์','ติดตั้งอุปกรณ์',
  'นำอุปกรณ์ส่งซ่อม','ติดต่อสถานที่ราชการ','อื่นๆ',
]

export default function BookPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  const [tab, setTab] = useState<'book' | 'mybooking'>('book')
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([])
  const [myBookings, setMyBookings] = useState<any[]>([])
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    date: todayStr(),
    startTime: '09:00',
    returnTime: '12:00',
    fromLocation: '',
    toLocation: '',
    passengers: '',
    purpose: 'ไปพบลูกค้า',
    purposeDetail: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
    if (status === 'authenticated' && user?.role !== 'employee') router.push('/')
    fetch('/api/locations').then(r => r.json()).then(setLocations)
    setForm(f => ({ ...f, passengers: user?.name || '' }))
  }, [status, user])

  useEffect(() => {
    if (tab === 'mybooking') {
      fetch('/api/bookings').then(r => r.json()).then(setMyBookings)
    }
  }, [tab])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); setTab('mybooking') }, 2000)
    }
    setSubmitting(false)
  }

  if (status === 'loading') return <div className="flex-1 flex items-center justify-center text-text-3">กำลังโหลด...</div>

  const pendingCount = myBookings.filter(b => b.status === 'PENDING').length

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
            <div className="text-[11px] font-bold tracking-widest uppercase text-teal">พนักงาน · {user?.department}</div>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="border border-border rounded-lg px-3 py-1.5 text-text-2 text-[13px]">
          ออก
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-s1 border-b border-border flex-shrink-0">
        {[
          { key: 'book', label: 'จองรถ' },
          { key: 'mybooking', label: 'การจองของฉัน', badge: pendingCount },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex-1 py-3 text-[13px] font-semibold border-b-[3px] transition-all relative font-sans
              ${tab === t.key ? 'text-teal border-teal' : 'text-text-3 border-transparent'}`}>
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
        {tab === 'book' && (
          success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <div className="text-xl font-extrabold text-success mb-2">ส่งคำขอเรียบร้อย!</div>
              <div className="text-text-2 text-sm">รอการยืนยันจากผู้ดูแลระบบ</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="text-[13px] font-bold text-teal flex items-center gap-2 mt-2 mb-1">
                <span className="w-[3px] h-4 bg-teal rounded-sm block" />
                วันและเวลา
              </div>
              <div>
                <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">วันที่ <span className="text-danger">*</span></label>
                <input type="date" min={todayStr()}
                  className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans"
                  value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">เวลาออก <span className="text-danger">*</span></label>
                  <input type="time" className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans"
                    value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">เวลากลับ</label>
                  <input type="time" className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans"
                    value={form.returnTime} onChange={e => setForm(f => ({ ...f, returnTime: e.target.value }))} />
                </div>
              </div>

              <div className="text-[13px] font-bold text-teal flex items-center gap-2 mt-2 mb-1">
                <span className="w-[3px] h-4 bg-teal rounded-sm block" />
                เส้นทาง
              </div>
              <div>
                <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">ต้นทาง <span className="text-danger">*</span></label>
                <select className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans appearance-none"
                  value={form.fromLocation} onChange={e => setForm(f => ({ ...f, fromLocation: e.target.value }))} required>
                  <option value="">เลือกต้นทาง</option>
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">ปลายทาง <span className="text-danger">*</span></label>
                <select className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans appearance-none"
                  value={form.toLocation} onChange={e => setForm(f => ({ ...f, toLocation: e.target.value }))} required>
                  <option value="">เลือกปลายทาง</option>
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
              </div>

              <div className="text-[13px] font-bold text-teal flex items-center gap-2 mt-2 mb-1">
                <span className="w-[3px] h-4 bg-teal rounded-sm block" />
                ผู้โดยสารและวัตถุประสงค์
              </div>
              <div>
                <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">ผู้โดยสาร <span className="text-danger">*</span></label>
                <input className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans"
                  placeholder="ชื่อผู้โดยสาร (คั่นด้วยจุลภาค)"
                  value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">วัตถุประสงค์ <span className="text-danger">*</span></label>
                <select className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans appearance-none"
                  value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} required>
                  {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">รายละเอียดเพิ่มเติม</label>
                <textarea className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-teal font-sans resize-none min-h-[80px]"
                  placeholder="รายละเอียดเพิ่มเติม..."
                  value={form.purposeDetail} onChange={e => setForm(f => ({ ...f, purposeDetail: e.target.value }))} />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-card font-extrabold text-base disabled:opacity-50 mt-2 mb-6"
                style={{ background: 'linear-gradient(135deg,#0ea5a0,#14d4ce)', color: '#001a1a' }}>
                {submitting ? 'กำลังส่ง...' : '📤 ส่งคำขอจองรถ'}
              </button>
            </form>
          )
        )}

        {tab === 'mybooking' && (
          <div>
            {myBookings.length === 0 ? (
              <div className="text-center py-12 text-text-3">
                <div className="text-5xl mb-3">📋</div>
                <div className="text-base font-semibold text-text-2">ยังไม่มีการจอง</div>
                <div className="text-sm mt-1">กดแท็บ "จองรถ" เพื่อเริ่มจอง</div>
              </div>
            ) : (
              myBookings.map(b => (
                <div key={b.id} onClick={() => router.push(`/booking/${b.id}`)}
                  className="bg-s1 border border-border rounded-card p-4 mb-3 cursor-pointer active:bg-s2 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xl font-bold text-teal-2">{b.startTime} <small className="text-text-3 text-sm font-normal">น.</small></span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      b.status === 'CONFIRMED' ? 'bg-green-500/10 text-success' :
                      b.status === 'PENDING' ? 'bg-blue-500/10 text-info' :
                      b.status === 'REJECTED' ? 'bg-red-500/10 text-danger' : 'bg-s3 text-text-3'
                    }`}>
                      {b.status === 'CONFIRMED' ? '✓ ยืนยันแล้ว' : b.status === 'PENDING' ? '⏳ รอการยืนยัน' : b.status === 'REJECTED' ? '✗ ปฏิเสธ' : 'ยกเลิก'}
                    </span>
                  </div>
                  <div className="text-sm text-text-2 mb-1">📅 {b.date}</div>
                  <div className="text-sm">📍 {b.fromLocation} → {b.toLocation}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
