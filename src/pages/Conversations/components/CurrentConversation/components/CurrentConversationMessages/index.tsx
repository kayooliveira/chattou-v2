import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { database } from 'lib/firebase'
import { useEffect, useRef, useState } from 'react'
import { useConversationStore } from 'store/conversation'

import { CurrentConversationMessageBubble } from './components/CurrentConversationMessageBubble'

interface Message {
  id: string
  body: string
  isRead: boolean
  sender: string
  time: Date
  type: 'text'
}

export function CurrentConversationMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  const uid = useConversationStore(state => state.currentConversation)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  function scrollToNewestMessage() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const messagesCol = collection(database, `conversations/${uid}/messages`)
    const messagesQuery = query(messagesCol, orderBy('time', 'asc'))
    const unsub = onSnapshot(messagesQuery, messagesSnap => {
      messagesSnap.forEach(messageDoc => {
        if (messageDoc.exists()) {
          const messageData = messageDoc.data()
          if (messageData) {
            const newMessage = {
              id: messageDoc.id,
              body: messageData.body,
              isRead: messageData.isRead,
              sender: messageData.sender,
              time: new Date(messageData.time.seconds * 1000),
              type: messageData.type
            }
            setMessages(state => {
              const messageExists = state.find(m => m.id === newMessage.id)
              if (messageExists) {
                return state.map(m => {
                  if (m.id === newMessage.id) {
                    return newMessage
                  }
                  return m
                })
              }
              return [...state, newMessage]
            })
            scrollToNewestMessage()
          }
        }
      })
    })
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
