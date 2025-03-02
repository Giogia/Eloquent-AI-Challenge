'use client'

// next
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    if (!accessToken && !refreshToken) {
      router.push('/login')
    } else {
      router.push('/chat')
    }
  }, [router])

  return null
}
