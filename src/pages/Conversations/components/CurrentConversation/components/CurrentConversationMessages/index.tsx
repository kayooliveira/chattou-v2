import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from 'store/auth'
import { Message, useConversationStore } from 'store/conversation'

import { CurrentConversationMessageBubble } from './components/CurrentConversationMessageBubble'

export function CurrentConversationMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  const uid = useConversationStore(state => state.currentConversation)
  const user = useAuthStore(state => state.user)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getCurrentConversationMessages = useConversationStore(
    state => state.getCurrentConversationMessages
  )

  const setConversationMessagesReadByUser = useConversationStore(
    state => state.setConversationMessagesReadByUser
  )

  function scrollToNewestMessage() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function onMessagesChange(messages: Message[]) {
    setMessages(messages)
    scrollToNewestMessage()
  }

  useEffect(() => {
    let isSubscribed = true
    const unsub = getCurrentConversationMessages(onMessagesChange)
    if (isSubscribed) {
      setConversationMessagesReadByUser(user.uid, uid)
    }
    return () => {
      isSubscribed = false
      unsub()
    }
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
