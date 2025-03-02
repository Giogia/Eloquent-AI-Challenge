
// lib
import { messageId } from '@/lib/utils'
import { handleMultiChunk, handleStreamEvent } from '@/lib/stream'

// types
import { History, Session } from '@/types/Chat'

/**
 * Initiates a chat conversation with the AI using the provided prompt
 * @param prompt The user's input message to send to the AI
 * @throws {string} When the network response is not OK
 */
export async function chat(sessionId:string, prompt: string) {
  try {
    const accessToken = localStorage.getItem('access_token')

    const response = await fetch('/api/chat/completion', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        sessionId,
        content: prompt,
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
    
    const reader = response?.body?.getReader()
    const decoder = new TextDecoder()
    const aiMessageId = messageId()
    const accMessage = { content: '' }

    while (true) {
      const { done, value } = await reader?.read() || {}
      if (done) break

      const chunk = decoder.decode(value)
      try {
        const parsedChunk = JSON.parse(chunk)
        handleStreamEvent(parsedChunk, aiMessageId, accMessage)
      } catch (error) {
        console.error('Error parsing chunk:', error)
        handleMultiChunk(chunk, aiMessageId, accMessage)
      }
    }
  }
  catch (error) {
    console.error('Error fetching chat:', error)
  }
}

/**
 * Retrieves chat history for a given session
 * @param sessionId The ID of the chat session to fetch history for
 * @returns Promise containing an array of chat messages
 * @throws {Error} When the fetch request fails
 */
export async function getHistory(sessionId: string): Promise<History> {
  try {
    const accessToken = localStorage.getItem('access_token')

    const response = await fetch(`/api/chat/history/${sessionId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json' 
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }

    const history = await response.json()

    return history
  } 
  catch (error) {
    console.error('Error fetching session history:', error)
    return { 
      messages: [] 
    }
  }
}

/**
 * Retrieves all available chat sessions
 * @returns Promise containing an array of session IDs
 * @throws {Error} When the fetch request fails
 */
export async function getSessions(): Promise<Session[]> {
  try {
    const accessToken = localStorage.getItem('access_token')
    
    const response = await fetch('/api/chat/sessions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }

    const sessions = await response.json()
    
    return sessions
  } 
  catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}
