'use client'

// react
import { useEffect } from 'react'

// next
import { useSearchParams } from 'next/navigation'

// components
import { ChatList } from '@/app/chat/chat-list'
import { ChatPrompt } from '@/app/chat/chat-prompt'
import { EmptyScreen } from '@/app/chat/empty-screen'

// lib
import { getHistory } from '@/lib/chat'

// hooks
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'

// stores
import { useChatStore } from '@/stores/chat'

export function Chat() {
  const params = useSearchParams()
  const messages = useChatStore((state) => state.messages)
  const setMessages = useChatStore((state) => state.setMessages)
  const setSessionId = useChatStore((state) => state.setSessionId)

  const sessionId = params.get('sessionId')

  const { messagesRef, scrollRef, scrollToBottom } = useScrollAnchor()

  useEffect(() => {
    const loadMessageHistory = async () => {
      if (sessionId) {
        const history = await getHistory(sessionId)
        
        setSessionId(sessionId)
        setMessages(history.messages)
      } else {
        setSessionId()
        setMessages([])
      }
    }

    loadMessageHistory()
  }, [sessionId, setMessages, setSessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <div className="relative h-full w-full flex flex-col">
      <div
        className="flex-1 overflow-auto"
        ref={scrollRef}
      >
        <div className='pt-16 pb-[200px]' ref={messagesRef}>
          {messages.length ? <ChatList /> : <EmptyScreen />}
        </div>
      </div>
      <ChatPrompt />
    </div>
  )
}
