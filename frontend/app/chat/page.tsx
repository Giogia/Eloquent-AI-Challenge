'use client'

// react
import { useEffect } from 'react'

// chat
import { ChatList } from '@/app/chat/chat-list'
import { ChatPrompt } from '@/app/chat/chat-prompt'
import { EmptyScreen } from '@/app/chat/empty-screen'

// hooks
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'

// stores
import { useChatStore } from '@/stores/chat'

export default function Page() {
  const messages = useChatStore((state) => state.messages)

  const { messagesRef, scrollRef, scrollToBottom } = useScrollAnchor()

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
