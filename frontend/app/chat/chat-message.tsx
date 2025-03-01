'use client'

// dependencies
import { User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// lib
import { cn } from '@/lib/utils'

// types
import { Type, Message } from '@/types/Chat'

export function ChatMessage ({ message }: { message: Message }) {
  return (message.type === Type.AI || message.type === Type.Human) ?
    (
      <div key={message.id}>
        <div
          className={cn(
            'group relative mb-4 items-start bg-white p-4 rounded-md',
            message.type === Type.Human ? 'bg-white' : 'bg-gray-50',
            message.type === Type.Human && 'flex-row-reverse',
            'flex'
          )}
        >
          <div
            className={cn(
              'flex size-10 shrink-0 select-none items-center justify-center rounded-full border',
              message.type === Type.Human
                ? 'bg-background'
                : 'bg-primary text-primary-foreground',
              `${message.error && 'text-red-600'}`
            )}
          >
            {message.type === Type.Human
              ? <User />
              : <Bot color="white" />
            }
          </div>
          <div
            className={cn(
              'px-1 space-y-2 overflow-hidden',
              message.type === Type.Human ? 'mr-4' : 'ml-4',
              Boolean(message.error) && 'text-red-600'
            )}
          >
            <ReactMarkdown
              components={{
                p({ children }) {
                  return (
                    <p
                      style={{
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {children}
                    </p>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    ) : (
      <div key={message.id}>UNSUPPORTED MESSAGE</div>
    )
};
