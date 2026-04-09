'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { initial, avatarColor } from '@/lib/utils'

type Driver = { id: number; name: string; phone: string | null; color: string; jobCount: number }

export default function DriverLoginPage() {
  const router = useRouter()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/drivers').then(r => r.json()).then(setDrivers)
  }, [])

  async function selectDriver(driver: Driver) {
    setLoading(true)
    const res = await signIn('driver', { driverId: driver.id, redirect: false })
    if (res?.ok) router.push('/trips')
    else setLoading(false)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg">
      {/* Top */}
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.push('/')} className="text-text-2 text-2xl leading-none px-1">‹</button>
        <div>
          <div className="font-bold text-[17px]">คนขับรถ</div>
          <div className="text-text-2 text-xs">เลือกชื่อของคุณ</div>
        </div>
      </div>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#e8a020,#f5c050)' }} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[18px] py-4">
        <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-3">คนขับทั้งหมด</div>

        <div className="grid grid-cols-2 gap-3">
          {drivers.map(d => (
            <button key={d.id} onClick={() => selectDriver(d)} disabled={loading}
              className="bg-s2 border border-border rounded-card p-4 text-center active:bg-s3 active:border-gold transition-all">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xl mx-auto mb-2 text-white"
                style={{ background: avatarColor(d.name) }}>
                {initial(d.name)}
              </div>
              <div className="text-sm font-bold leading-snug">{d.name}</div>
              <div className="text-xs text-text-2 mt-1">{d.jobCount} งานที่มาถึง</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
