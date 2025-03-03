// react
import { useState, useEffect } from 'react'

// next
import { usePathname, useRouter } from 'next/navigation'

// lib
import { validateToken, refreshAccessToken } from '@/lib/auth'
import { getUser } from '@/lib/chat'

// types
import type { User } from '@/types/chat'

export function useAuth(redirectIfUnauthenticated = true) {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (pathname === '/login') {
      setLoading(false)
      return
    }

    async function checkAuth() {
      try {
        let isAuthenticated = await validateToken()

        if (!isAuthenticated) {
          isAuthenticated = await refreshAccessToken()
        }

        if (isAuthenticated) {
          const userData = await getUser()
          setUser(userData)

        } else if (redirectIfUnauthenticated) {
          router.push('/login')
        }
      } 
      catch (err) {
        console.error('Authentication error:', err)
        setError('Authentication failed')
        
        if (redirectIfUnauthenticated) {
          router.push('/login')
        }

      } 
      finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, redirectIfUnauthenticated, pathname])

  return { 
    user, 
    loading, 
    error, 
    isAuthenticated: Boolean(user), 
  }
}
