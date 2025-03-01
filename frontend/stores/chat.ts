// dependencies
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

// lib
import { chat } from '@/lib/chat'
import { messageId } from '@/lib/utils'

// types
import { Type, Message } from '@/types/Chat'

/**
 * Represents the state and actions for the chat functionality
 */
interface ChatState {
  /** Unique identifier for the chat session */
  sessionId: string
  /** Sets the session ID for the chat */
  setSessionId: (sessionId: string) => void
  /** Array of chat messages */
  messages: Message[]
  /** Sets the messages array to a new value */
  setMessages: (messages: Message[]) => void
  /** Adds a new message to the chat */
  addMessage: (message: Message) => void
  /** Updates an existing message in the chat */
  editMessage: (message: Partial<Message>) => void
  /** Loading state for message completion */  
  completionLoading: boolean
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
  sessionId: uuid(),
  setSessionId: (sessionId) => set({ sessionId }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message] 
    })),
  editMessage: (message) => {
    set((state) => ({
      messages: state.messages.map((m) => 
        m.id === message.id ? { ...m, ...message } : m
      ),
    }))
  },
  completionLoading: false,
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
      type: Type.Human,
      error: null
    })
    store.setPrompt('')
    
    try {
      await chat(store.sessionId, content)
    } catch (error) {
      console.error(error)
    } finally {
      store.setCompletionLoading(false)
    }
  }
}))
