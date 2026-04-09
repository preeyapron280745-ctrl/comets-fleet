import Link from 'next/link'

export default function RolePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-8"
      style={{ background: 'linear-gradient(170deg,#0c0e18 0%,#0f1220 40%,#0d1018 100%)' }}>

      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-[18px] flex items-center justify-center text-3xl mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg,#e8a020 0%,#c06010 100%)', boxShadow: '0 12px 40px rgba(232,160,32,.3)' }}>
          🚗
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">COMETS Fleet</h1>
        <p className="text-text-2 text-sm mt-1">ระบบจัดการรถและคนขับ</p>
      </div>

      {/* Role Cards */}
      <div className="w-full flex flex-col gap-4">

        {/* Employee */}
        <Link href="/login/employee"
          className="bg-s1 border-2 border-border rounded-[18px] p-6 flex items-center gap-4 active:scale-[.97] transition-transform"
          style={{ '--glow': 'rgba(14,165,160,0.08)' } as React.CSSProperties}>
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(14,165,160,.12)', border: '1.5px solid rgba(14,165,160,.3)' }}>
            👤
          </div>
          <div className="flex-1">
            <div className="text-lg font-extrabold text-teal-2">จองรถ</div>
            <div className="text-text-2 text-sm mt-1 leading-snug">สำหรับพนักงานที่ต้องการ<br />จองรถและดูสถานะการจอง</div>
          </div>
          <span className="text-border2 text-2xl">›</span>
        </Link>

        {/* Driver */}
        <Link href="/login/driver"
          className="bg-s1 border-2 border-border rounded-[18px] p-6 flex items-center gap-4 active:scale-[.97] transition-transform">
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(232,160,32,.12)', border: '1.5px solid rgba(232,160,32,.3)' }}>
            🚘
          </div>
          <div className="flex-1">
            <div className="text-lg font-extrabold text-gold-2">คนขับรถ</div>
            <div className="text-text-2 text-sm mt-1 leading-snug">ดูงานที่ได้รับมอบหมาย<br />และรายละเอียดการเดินทาง</div>
          </div>
          <span className="text-border2 text-2xl">›</span>
        </Link>

        {/* Admin */}
        <Link href="/login/admin"
          className="bg-s1 border-2 border-border rounded-[18px] p-6 flex items-center gap-4 active:scale-[.97] transition-transform">
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(59,141,245,.12)', border: '1.5px solid rgba(59,141,245,.3)' }}>
            🛡️
          </div>
          <div className="flex-1">
            <div className="text-lg font-extrabold text-info">ผู้ดูแลระบบ</div>
            <div className="text-text-2 text-sm mt-1 leading-snug">อนุมัติการจอง จัดการรถและคนขับ</div>
          </div>
          <span className="text-border2 text-2xl">›</span>
        </Link>
      </div>
    </main>
  )
}
