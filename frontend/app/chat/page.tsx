// components
import { Chat } from '@/app/chat/chat'
import { Sessions } from '@/app/chat/sessions'

export default function Page() {
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/4 border-r">
        <Sessions />
      </div>
      <div className="w-3/4">
        <Chat />
      </div>
    </div>
  )
}
