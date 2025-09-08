import { stackServerApp } from '@/stack'
import { NextRequest } from 'next/server'

export const auth = {
  api: {
    async getSession({ headers }: { headers: Headers }) {
      try {
        const user = await stackServerApp.getUser()
        return user ? { user } : null
      } catch (error) {
        console.error('Auth error:', error)
        return null
      }
    }
  }
}

export async function requireAuth(request?: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return { user, isAuthenticated: true, userId: user.id }
  } catch (error) {
    throw new Error('Authentication required')
  }
}

export async function getCurrentUser(request?: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
