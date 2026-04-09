'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('admin', { username, password, redirect: false })
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg">
      {/* Top */}
      <div className="bg-s1 border-b border-border px-[18px] py-[13px] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.push('/')} className="text-text-2 text-2xl leading-none px-1">‹</button>
        <div>
          <div className="font-bold text-[17px]">ผู้ดูแลระบบ</div>
          <div className="text-text-2 text-xs">เข้าสู่ระบบด้วย username และ password</div>
        </div>
      </div>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#3b8df5,#06b6d4)' }} />

      <form onSubmit={handleSubmit} className="flex-1 px-[18px] py-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">Username</label>
          <input
            className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-info font-sans"
            value={username} onChange={e => setUsername(e.target.value)}
            placeholder="กรอก username" autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-2 uppercase tracking-wide mb-2">Password</label>
          <input
            type="password"
            className="w-full bg-s2 border border-border rounded-card px-4 py-[13px] text-[15px] text-text outline-none focus:border-info font-sans"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="กรอก password" autoComplete="current-password"
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={loading || !username || !password}
          className="w-full py-4 rounded-card font-extrabold text-base disabled:opacity-50 transition-opacity mt-2"
          style={{ background: 'linear-gradient(135deg,#3b8df5,#06b6d4)', color: '#001a2e' }}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  )
}
