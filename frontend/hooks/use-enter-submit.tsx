// react
import { useRef, type RefObject, type KeyboardEvent } from 'react'

export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  } {
  const formRef = useRef<HTMLFormElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit()
      event.preventDefault()
    }
  }

  return {
    formRef: formRef as RefObject<HTMLFormElement>, 
    onKeyDown: handleKeyDown 
  }
}
