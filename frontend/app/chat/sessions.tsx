'use client'

// react
import { useEffect, useState } from 'react'

// next
import { useRouter, useSearchParams } from 'next/navigation'

// lib
import { getSessions } from '@/lib/chat'
import { cn } from '@/lib/utils'

// types
import { Session } from '@/types/Chat'

export function Sessions() {
  
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const loadSessionsHistory = async () => {
      const sessions = await getSessions()
      setSessions(sessions)
    }

    loadSessionsHistory()
  }, [])

  const handleSessionClick = (sessionId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('sessionId', sessionId)
    router.push(`/chat?${params.toString()}`)
  }

  return (
    <div className='flex flex-col overflow-y-auto bg-gray-200 h-full w-full p-2 mb-4'>
      <div className='text-base font-bold m-4'>Chats</div>
      {sessions.map(({ id, title }, index) => (
        <div 
          key={title+index} 
          className={cn(
            'truncate-x px-4 py-3 hover:bg-gray-300 cursor-pointer transition-colors rounded-lg',
            searchParams.get('sessionId') === id ? 'bg-gray-300' : ''
          )}
          onClick={() => handleSessionClick(id)}
        >
          {title}
        </div>
      ))}
    </div> 
  )
}
