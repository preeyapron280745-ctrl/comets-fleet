'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { initial, avatarColor } from '@/lib/utils'

type Employee = { id: number; name: string; department: string | null; color: string }

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('ALL')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/employees').then(r => r.json()).then(setEmployees)
  }, [])

  const depts = ['ALL', ...Array.from(new Set(employees.map(e => e.department).filter(Boolean) as string[])).sort()]

  const filtered = employees.filter(e => {
    const matchDept = dept === 'ALL' || e.department === dept
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  async function selectEmployee(emp: Employee) {
    setLoading(true)
    const res = await signIn('employee', {
      employeeId: emp.id,
      redirect: false,
    })
    if (res?.ok) router.push('/book')
    else setLoading(false)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg">
      {/* Top */}
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.push('/')} className="text-text-2 text-2xl leading-none px-1">‹</button>
        <div>
          <div className="font-bold text-[17px]">พนักงานจองรถ</div>
          <div className="text-text-2 text-xs">ค้นหาชื่อของคุณเพื่อเข้าใช้งาน</div>
        </div>
      </div>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#0ea5a0,#14d4ce)' }} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[18px] py-4">
        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3 text-lg">🔍</span>
          <input
            className="w-full bg-s2 border border-border rounded-card pl-11 pr-4 py-[14px] text-base text-text outline-none focus:border-teal placeholder:text-text-3 font-sans"
            placeholder="ค้นหาชื่อ-นามสกุล..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Dept chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
          {depts.map(d => (
            <button key={d} onClick={() => setDept(d)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all font-sans
                ${dept === d
                  ? 'bg-teal-dim border-teal text-teal-2'
                  : 'bg-s2 border-border text-text-2'}`}>
              {d === 'ALL' ? 'ทั้งหมด' : d}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-bold text-text-3 uppercase tracking-widest mb-2">
          {filtered.length} คน
        </div>

        {/* Employee list */}
        <div className="flex flex-col gap-2">
          {filtered.map(emp => (
            <button key={emp.id} onClick={() => selectEmployee(emp)} disabled={loading}
              className="bg-s2 border border-border rounded-card px-4 py-[14px] flex items-center gap-3 text-left active:bg-s3 active:border-teal transition-all w-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-base flex-shrink-0 text-white"
                style={{ background: avatarColor(emp.name) }}>
                {initial(emp.name)}
              </div>
              <div>
                <div className="text-[15px] font-semibold">{emp.name}</div>
                <div className="text-xs text-text-2">{emp.department}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
