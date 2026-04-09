import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  providers: [
    // Admin login (username + password)
    CredentialsProvider({
      id: 'admin',
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        })
        if (!admin) return null
        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null
        return { id: String(admin.id), name: admin.name, role: 'admin' }
      },
    }),

    // Employee login (name-pick, no password)
    CredentialsProvider({
      id: 'employee',
      name: 'Employee',
      credentials: {
        employeeId: { label: 'Employee ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.employeeId) return null
        const emp = await prisma.employee.findUnique({
          where: { id: Number(credentials.employeeId), active: true },
        })
        if (!emp) return null
        return {
          id: String(emp.id),
          name: emp.name,
          role: 'employee',
          department: emp.department,
          color: emp.color,
        }
      },
    }),

    // Driver login (name-pick, no password)
    CredentialsProvider({
      id: 'driver',
      name: 'Driver',
      credentials: {
        driverId: { label: 'Driver ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.driverId) return null
        const driver = await prisma.driver.findUnique({
          where: { id: Number(credentials.driverId), active: true },
        })
        if (!driver) return null
        return {
          id: String(driver.id),
          name: driver.name,
          role: 'driver',
          phone: driver.phone,
          color: driver.color,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.department = (user as any).department
        token.color = (user as any).color
        token.phone = (user as any).phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).department = token.department
        ;(session.user as any).color = token.color
        ;(session.user as any).phone = token.phone
      }
      return session
    },
  },
}
