import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getCurrentSession() {
  return getServerSession(authOptions)
}

export async function requireSession() {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    return null
  }

  return session
}

export function isAdminSession(session: Awaited<ReturnType<typeof getCurrentSession>>) {
  return session?.user?.role === 'admin'
}