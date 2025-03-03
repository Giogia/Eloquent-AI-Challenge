// react
import { Suspense } from 'react'

// components
import { Chat } from '@/app/chat/chat'
import { ChatSessions } from '@/app/chat/chat-sessions'
import { ChatUser } from '@/app/chat/chat-user'

export default function Page() {
  return (
    <Suspense>
      <div className="flex h-screen w-full">
        <div className="w-1/5 border-r">
          <ChatSessions />
          <div className="fixed bottom-0 w-1/5">
            <ChatUser />
          </div>
        </div>
        <div className="w-4/5">
          <Chat />
        </div>
      </div>
    </Suspense>
  )
}
