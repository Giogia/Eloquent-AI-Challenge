// stores
import { useChatStore } from '@/stores/chat'

// types
import { Type } from '@/types/chat'

/**
 * Processes the stream data recursively without using mutable let variables
 * @param reader The ReadableStreamDefaultReader to read chunks from
 * @param decoder TextDecoder to convert chunks to text
 * @param aiMessageId The ID for the AI message being streamed
 * @param accMessage The accumulated message object
 * @param remainingBuffer Any text remaining from the previous iteration
 */
export async function processStreamRecursively(
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  decoder: TextDecoder,
  aiMessageId: string,
  accMessage: { content: string },
  remainingBuffer: string
): Promise<void> {
  const readResult = await reader?.read()
  
  if (readResult?.done) {
    return
  }
  
  const chunk = decoder.decode(readResult?.value)
  const updatedBuffer = remainingBuffer + chunk
  
  const { newRemainingBuffer } = processEvents(updatedBuffer, aiMessageId, accMessage)
  
  return processStreamRecursively(reader, decoder, aiMessageId, accMessage, newRemainingBuffer)
}

/**
 * Processes all events in the current buffer
 * @param buffer The complete buffer to process
 * @param aiMessageId The ID for the AI message being streamed
 * @param accMessage The accumulated message object
 * @returns The remaining buffer after processing all complete events
 */
function processEvents(
  buffer: string,
  aiMessageId: string,
  accMessage: { content: string }
): { newRemainingBuffer: string } {
  const eventEndIndex = buffer.indexOf('\n\n')
  
  if (eventEndIndex === -1) {
    return { newRemainingBuffer: buffer }
  }
  
  const eventData = buffer.substring(0, eventEndIndex).trim()

  if (eventData.startsWith('data: ')) {
    try {
      const jsonData = JSON.parse(eventData.slice(6))
      handleStreamEvent(jsonData, aiMessageId, accMessage)
    } catch (error) {
      console.error('Error parsing event data:', error)
    }
  }
  
  const updatedBuffer = buffer.substring(eventEndIndex + 2)
  return processEvents(updatedBuffer, aiMessageId, accMessage)
}

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
