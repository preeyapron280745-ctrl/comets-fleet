import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Get initials from Thai/English name */
export function initial(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return parts[0][0] + parts[1][0]
  return name.slice(0, 2)
}

/** Generate a consistent color from a string */
export function avatarColor(str: string): string {
  const colors = [
    '#0ea5a0', '#e8a020', '#3b8df5', '#10b981',
    '#f43f5e', '#8b5cf6', '#f97316', '#06b6d4',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

/** Format date to Thai display */
export function formatDateTH(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const thMonths = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  return `${d} ${thMonths[m - 1]} ${y + 543}`
}

/** Today as YYYY-MM-DD */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export const STATUS_LABEL: Record<string, string> = {
  PENDING:   '⏳ รอการยืนยัน',
  CONFIRMED: '✓ ยืนยันแล้ว',
  REJECTED:  '✗ ปฏิเสธ',
  CANCELLED: 'ยกเลิกแล้ว',
}

export const STATUS_CLASS: Record<string, string> = {
  PENDING:   'bg-blue-500/10 text-info',
  CONFIRMED: 'bg-green-500/10 text-success',
  REJECTED:  'bg-red-500/10 text-danger',
  CANCELLED: 'bg-s3 text-text-3',
}
