'use client'

// react
import React, { createContext, useContext, ReactNode } from 'react'

// hooks
import { useAuth } from '@/hooks/use-auth'

// types
import type { User } from '@/types/chat'

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
} | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
