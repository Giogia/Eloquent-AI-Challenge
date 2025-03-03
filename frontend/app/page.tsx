'use client'

// next
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/chat')
  }, [router])

  return (
    <div className='h-screen w-full flex justify-center items-center'>
      Loading...
    </div>
  )
}
