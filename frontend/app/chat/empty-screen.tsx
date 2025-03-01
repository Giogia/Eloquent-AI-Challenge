'use client'

// dependencies
import { Bot } from 'lucide-react'

export function EmptyScreen() {
  return (
    <div className="mx-auto px-8 flex flex-col gap-8 items-center justify-center h-[50vh] text-center">
      <div className='border rounded-full p-4 pt-3'>
        <Bot color="#666666" size={64}/>
      </div>
      <div className='opacity-40'>
        Type a message to start chatting
      </div>
    </div>
  )
}
