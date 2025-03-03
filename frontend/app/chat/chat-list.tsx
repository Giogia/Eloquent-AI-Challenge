'use client'

import { Loader2 } from 'lucide-react'

// components
import { ChatMessage } from '@/app/chat/chat-message'

// stores
import { useChatStore } from '@/stores/chat'

// types
import { Message } from '@/types/chat'

export function ChatList() {
  const messages = useChatStore((state) => state.messages)
  const completionLoading = useChatStore((state) => state.completionLoading)

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message: Message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {completionLoading && (
        <div className="flex justify-center">
          <Loader2
            className="size-5 animate-spin text-zinc-400"
          />
        </div>
      )}
    </div>
  )
}
