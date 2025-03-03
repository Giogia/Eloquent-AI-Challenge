// stores
import { useChatStore } from '@/stores/chat'

// types
import { Type } from '@/types/chat'

/**
 * Handles stream events for chat messages
 * @param parsedChunk - The parsed chunk containing event data
 * @param aiMessageId - The ID of the AI message
 * @param accMessage - Accumulated message object containing content
 */
export function handleStreamEvent(
  parsedChunk: Record<string, string>,
  aiMessageId: string,
  accMessage: { content: string }
) {
  const store = useChatStore.getState()

  switch (parsedChunk.event) {
  case 'on_chat_model_start':
    store.addMessage({
      id: aiMessageId,
      content: '',
      type: Type.AI,
      error: null,
    })
    break
  case 'on_chat_model_stream':
    accMessage.content += parsedChunk.data
    store.editMessage({
      id: aiMessageId,
      content: accMessage.content,
    })
    break
  case 'on_chat_model_end':
    break
  default:
    console.error('Unknown event:', parsedChunk.event)
  }
}

/**
 * Processes multiple chunks of streaming data
 * @param chunk - The raw chunk string to process
 * @param aiMessageId - The ID of the AI message
 * @param accMessage - Accumulated message object containing content
 */
export function handleMultiChunk(
  chunk: string,
  aiMessageId: string,
  accMessage: { content: string }
) {
  let multiChunkAcc = ''
  let idx = 0
  
  while (idx < chunk.length) {
    if (chunk[idx] === '}') {
      try {
        multiChunkAcc += chunk[idx]
        const parsedChunk = JSON.parse(multiChunkAcc)
        handleStreamEvent(parsedChunk, aiMessageId, accMessage)
        chunk = chunk.substring(idx + 1)
        idx = 0
        multiChunkAcc = ''
      } catch {
        multiChunkAcc += chunk.substring(0, idx)
      }
    } else {
      multiChunkAcc += chunk[idx]
      idx++
    }
  }
}
