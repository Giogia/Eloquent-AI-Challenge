'use client'

// react
import { useEffect, useState } from 'react'

// next
import { useRouter, useSearchParams } from 'next/navigation'

// dependencies
import { SquarePen } from 'lucide-react'

// lib
import { getSessions } from '@/lib/chat'
import { cn } from '@/lib/utils'

// stores
import { useChatStore } from '@/stores/chat'

// types
import { Session } from '@/types/Chat'

export function Sessions() {
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = useChatStore((state) => state.sessionId)
  const setMessages = useChatStore((state) => state.setMessages)
  const setSessionId = useChatStore((state) => state.setSessionId)
  
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const loadSessionsHistory = async () => {
      const sessions = await getSessions()
      setSessions(sessions)
    }

    loadSessionsHistory()
  }, [sessionId])

  const handleSessionClick = (sessionId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('sessionId', sessionId)
    router.push(`/chat?${params.toString()}`)
  }

  const handleNewSession = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    setSessionId()
    setMessages([])
    params.delete('sessionId')
    router.push(`/chat?${params.toString()}`)
  }

  return (
    <div className='flex flex-col gap-1 overflow-y-auto bg-gray-200 h-full w-full p-2 mb-4'>
      <div className='flex w-full p-4'>
        <SquarePen 
          className='text-gray-400 hover:text-gray-800 cursor-pointer transition-colors'
          onClick={handleNewSession} 
        />
      </div>
      <div className='text-base font-bold m-4'>Chats</div>
      {sessions.map(({ id, title }, index) => (
        <div 
          key={title+index} 
          className={cn(
            'font-medium capitalize text-sm truncate px-4 py-3 hover:bg-gray-300 cursor-pointer transition-colors rounded-lg',
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
