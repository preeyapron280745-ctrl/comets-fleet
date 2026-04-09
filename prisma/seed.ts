import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin
  const adminHash = await bcrypt.hash('admin1234', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: adminHash, name: 'ผู้ดูแลระบบ' },
  })
  console.log('✓ Admin created (admin / admin1234)')

  // Employees (from prototype data)
  const employees = [
    { name: 'สมชาย ใจดี', department: 'IT' },
    { name: 'สมหญิง รักงาน', department: 'HR' },
    { name: 'วิชัย มานะ', department: 'Sales' },
    { name: 'นภา สุขใจ', department: 'Finance' },
    { name: 'ธนา พัฒนา', department: 'IT' },
    { name: 'พรทิพย์ ดีมาก', department: 'HR' },
    { name: 'ชาญชัย เก่งกาจ', department: 'Production' },
    { name: 'รัตนา วิไล', department: 'Sales' },
    { name: 'อนันต์ ศรีสุข', department: 'Purchasing' },
    { name: 'กาญจนา ทองดี', department: 'Finance' },
    { name: 'ประสิทธิ์ ยอดเยี่ยม', department: 'Production' },
    { name: 'มาลี งามสม', department: 'QC' },
    { name: 'สุรชัย ขยัน', department: 'Purchasing' },
    { name: 'วันเพ็ญ สดใส', department: 'QC' },
    { name: 'ณรงค์ ฉลาด', department: 'IT' },
  ]

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { id: employees.indexOf(emp) + 1 },
      update: {},
      create: emp,
    })
  }
  console.log(`✓ ${employees.length} employees created`)

  // Drivers
  const drivers = [
    { name: 'สมพงษ์ ขับดี', phone: '081-111-1111' },
    { name: 'วิรัตน์ ปลอดภัย', phone: '082-222-2222' },
    { name: 'ประเสริฐ ตรงเวลา', phone: '083-333-3333' },
    { name: 'สุพจน์ ใจเย็น', phone: '084-444-4444' },
  ]

  for (const drv of drivers) {
    await prisma.driver.upsert({
      where: { id: drivers.indexOf(drv) + 1 },
      update: {},
      create: drv,
    })
  }
  console.log(`✓ ${drivers.length} drivers created`)

  // Cars
  const cars = [
    { plate: 'กข-1234', type: 'Toyota Fortuner', icon: '🚙' },
    { plate: 'กข-5678', type: 'Toyota Camry', icon: '🚗' },
    { plate: 'กข-9012', type: 'Toyota HiAce', icon: '🚐' },
    { plate: 'กข-3456', type: 'Isuzu D-Max', icon: '🛻' },
  ]

  for (const car of cars) {
    await prisma.car.upsert({
      where: { plate: car.plate },
      update: {},
      create: car,
    })
  }
  console.log(`✓ ${cars.length} cars created`)

  // Locations
  const locations = [
    { name: 'Office (สำนักงานใหญ่)', address: '123 ถ.สุขุมวิท กรุงเทพฯ' },
    { name: 'โรงงาน', address: '456 ถ.บางนา-ตราด สมุทรปราการ' },
    { name: 'สนามบินสุวรรณภูมิ', address: 'ถ.บางนา-ตราด สมุทรปราการ 10540' },
    { name: 'สนามบินดอนเมือง', address: '222 ถ.วิภาวดีรังสิต กรุงเทพฯ' },
    { name: 'Central World', address: '999/9 ถ.พระราม 1 กรุงเทพฯ' },
    { name: 'BITEC บางนา', address: '88 ถ.บางนา-ตราด กรุงเทพฯ' },
    { name: 'สำนักงานขาย (บางรัก)', address: '88 ถ.สีลม กรุงเทพฯ' },
    { name: 'กรมพัฒนาธุรกิจการค้า', address: '44/100 ถ.นนทบุรี 1 นนทบุรี' },
  ]

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: locations.indexOf(loc) + 1 },
      update: {},
      create: loc,
    })
  }
  console.log(`✓ ${locations.length} locations created`)

  // Sample bookings
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  const bookingCount = await prisma.booking.count()
  if (bookingCount === 0) {
    await prisma.booking.create({
      data: {
        date: today, startTime: '09:00', returnTime: '12:00',
        fromLocation: 'Office (สำนักงานใหญ่)', toLocation: 'สนามบินสุวรรณภูมิ',
        passengers: 'สมชาย ใจดี', purpose: 'ไปรับลูกค้า',
        status: 'CONFIRMED', tripStatus: 'NOT_STARTED',
        employeeId: 1, driverId: 1, carId: 1,
      },
    })
    await prisma.booking.create({
      data: {
        date: today, startTime: '13:00', returnTime: '16:00',
        fromLocation: 'Office (สำนักงานใหญ่)', toLocation: 'Central World',
        passengers: 'สมหญิง รักงาน, วิชัย มานะ', purpose: 'ไปประชุม',
        status: 'PENDING', employeeId: 2,
      },
    })
    await prisma.booking.create({
      data: {
        date: tomorrow, startTime: '08:30', returnTime: '11:30',
        fromLocation: 'Office (สำนักงานใหญ่)', toLocation: 'โรงงาน',
        passengers: 'ธนา พัฒนา', purpose: 'ติดตั้งอุปกรณ์',
        status: 'CONFIRMED', tripStatus: 'NOT_STARTED',
        employeeId: 5, driverId: 2, carId: 3,
      },
    })
  }
  console.log('✓ Sample bookings created')

  console.log('\n✅ Seed complete!')
  console.log('   Admin login: admin / admin1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
