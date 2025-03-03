'use client'

// react
import { useState, useEffect } from 'react'

// dependencies
import { User as UserIcon } from 'lucide-react'

// lib
import { getUser } from '@/lib/chat'

// types
import { User } from '@/types/chat'

export function ChatUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if(userData) setUser(userData)
    }

    fetchUser()
  }, [])

  return user && (
    <div className="bg-gray-200 p-4 flex items-center space-x-3 mt-auto">
      <div className=" h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
        <UserIcon size={16} />
      </div>
      <span className="font-medium text-sm truncate">{user.username}</span>
    </div>
  )
}
