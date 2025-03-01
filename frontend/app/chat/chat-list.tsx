'use client'

// components
import { ChatMessage } from '@/app/chat/chat-message'

// stores
import { useChatStore } from '@/stores/chat'

// types
import { Message } from '@/types/Chat'

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
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 animate-spin stroke-zinc-400"
          >
            <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
          </svg>
        </div>
      )}
    </div>
  )
}
