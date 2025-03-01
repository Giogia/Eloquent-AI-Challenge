// dependencies
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

// lib
import { chat } from '@/lib/chat'
import { messageId } from '@/lib/utils'

// types
import { Actor, Message } from '@/types/Chat'

/**
 * Represents the state and actions for the chat functionality
 */
interface ChatState {
  /** Array of chat messages */
  messages: Message[]
  /** Loading state for message completion */
  completionLoading: boolean
  /** Unique identifier for the chat session */
  sessionId: string
  /** Adds a new message to the chat */
  addMessage: (message: Message) => void
  /** Updates an existing message in the chat */
  editMessage: (message: Partial<Message>) => void
  /** Sets the loading state during message completion */
  setCompletionLoading: (loading: boolean) => void
  /** Current prompt text in the chat input */
  prompt: string
  /** Updates the prompt text */
  setPrompt: (prompt: string) => void
  /** Sends a message and handles the chat completion */
  sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  completionLoading: false,
  sessionId: uuid(),
  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message] 
    })),
  editMessage: (message) => {
    console.log('\x1b[35m%s\x1b[0m', ' message:', message)
    
    set((state) => ({
      messages: state.messages.map((m) => 
        m.id === message.id ? { ...m, ...message } : m
      ),
    }))
  },
  setCompletionLoading: (loading) => 
    set({ 
      completionLoading: loading 
    }),
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  sendMessage: async (content) => {
    const store = get()
    store.setCompletionLoading(true)
    store.addMessage({
      id: messageId(),
      content,
      role: Actor.Human,
      error: null
    })
    store.setPrompt('')
    
    try {
      await chat(content)
    } catch (error) {
      console.error(error)
    } finally {
      store.setCompletionLoading(false)
    }
  }
}))
