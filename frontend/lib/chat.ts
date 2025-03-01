// stores
import { useChatStore } from '@/stores/chat'

// lib
import { messageId } from '@/lib/utils'
import { handleMultiChunk, handleStreamEvent } from '@/lib/stream'

/**
 * Initiates a chat conversation with the AI using the provided prompt
 * @param prompt The user's input message to send to the AI
 * @throws {string} When the network response is not OK
 */
export async function chat(prompt: string) {
  const store = useChatStore.getState()
  
  const resp = await fetch('/api/chat/completion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: store.sessionId,
      content: prompt,
    }),
    credentials: 'include',
  })

  if (!resp.ok) throw 'Network response was not OK'

  const reader = resp?.body?.getReader()
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
