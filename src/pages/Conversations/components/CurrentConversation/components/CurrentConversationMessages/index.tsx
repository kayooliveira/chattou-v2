import { useEffect, useRef, useState } from 'react'
import { Message, useConversationStore } from 'store/conversation'

import { CurrentConversationMessageBubble } from './components/CurrentConversationMessageBubble'

export function CurrentConversationMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  const uid = useConversationStore(state => state.currentConversation)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getCurrentConversationMessages = useConversationStore(
    state => state.getCurrentConversationMessages
  )

  function scrollToNewestMessage() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function onMessagesChange(message: Message) {
    setMessages(state => {
      const messageExists = state.find(m => m.id === message.id)
      if (messageExists) {
        return state.map(m => {
          if (m.id === message.id) {
            return message
          }
          return m
        })
      }
      return [...state, message]
    })
    scrollToNewestMessage()
  }

  useEffect(() => {
    const unsub = getCurrentConversationMessages(onMessagesChange)
    return () => unsub()
  }, [uid])

  useEffect(() => {
    scrollToNewestMessage()
  }, [messages])

  return (
    <div className="scrollbar-chattou w-full flex-1 overflow-x-scroll">
      {messages.map(message => (
        <CurrentConversationMessageBubble
          key={message.id}
          body={message.body}
          senderId={message.sender}
          isRead={message.isRead}
          time={message.time}
          type={message.type}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
