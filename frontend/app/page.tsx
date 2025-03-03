'use client'

// react
import { useEffect, useState } from 'react'

// next
import { useRouter } from 'next/navigation'
import { refreshAccessToken, validateToken } from '@/lib/auth'

export default function Page() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await validateToken()

        if (response) {
          router.push('/chat')
          return
        }

        const refreshResponse = await refreshAccessToken()

        if (refreshResponse) {
          router.push('/chat')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    validateAuth()
  }, [router])

  return isLoading ? 
    <div className='h-screen w-full flex justify-center items-center'>
      Loading...
    </div> : null
}
