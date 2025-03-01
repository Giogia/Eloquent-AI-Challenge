'use client'

// react
import * as React from 'react'

// hooks
import { useEnterSubmit } from '@/hooks/use-enter-submit'

// stores
import { useChatStore } from '@/stores/chat'

export function ChatPrompt() {
  const prompt = useChatStore((state) => state.prompt)
  const setPrompt = useChatStore((state) => state.setPrompt)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const isLoading = useChatStore((state) => state.completionLoading)
  
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return
    sendMessage(prompt)
  }

  return (
    <div className="sticky inset-x-0 bottom-0 w-full duration-300 ease-in-out animate-in md:px-4">
      <div className="md:mb-4 mx-auto max-w-3xl">
        <div className="space-y-4 border-t bg-white p-2 shadow-lg md:rounded-xl sm:border md:p-4">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background">
              <textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                placeholder="Send a message."
                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
