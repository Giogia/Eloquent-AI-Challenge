'use client'

// react
import { useEffect } from 'react'

// next
import { useSearchParams } from 'next/navigation'

// chat
import { ChatList } from '@/app/chat/chat-list'
import { ChatPrompt } from '@/app/chat/chat-prompt'
import { EmptyScreen } from '@/app/chat/empty-screen'

// lib
import { getHistory } from '@/lib/chat'

// hooks
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'

// stores
import { useChatStore } from '@/stores/chat'

export default function Page() {
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
      }
    }

    loadMessageHistory()
  }, [sessionId, setMessages, setSessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className={'pt-16 pb-[200px]'} ref={messagesRef}>
        {messages.length ? <ChatList /> : <EmptyScreen />}
      </div>
      <ChatPrompt />
    </div>
  )
}
