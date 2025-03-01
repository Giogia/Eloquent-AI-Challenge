// components
import { Chat } from '@/app/chat/chat'
import { Sessions } from '@/app/chat/sessions'

export default function Page() {
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/5 border-r">
        <Sessions />
      </div>
      <div className="w-4/5">
        <Chat />
      </div>
    </div>
  )
}
