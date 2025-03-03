'use client'

// react
import * as React from 'react'

// dependencies
import { ArrowUp } from 'lucide-react'

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
        <div className="space-y-4 border-t bg-white p-2 shadow-lg md:rounded-xl sm:border md:p-3 md:pt-2">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="relative flex w-full gap-4 overflow-hidden bg-background">
              <div className="flex-grow flex flex-col max-h-60 overflow-hidden">
                <textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message."
                  className="block w-full rounded-md p-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
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
              <button
                type="submit"
                className="self-end p-1.5 rounded-full bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!prompt.trim() || isLoading}
                aria-label="Send message"
              >
                <ArrowUp size={20} />              
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
