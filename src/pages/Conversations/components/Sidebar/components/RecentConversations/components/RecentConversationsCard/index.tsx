import { format } from 'date-fns'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { database } from 'lib/firebase'
import { useEffect, useState } from 'react'
import { useAuthStore, User } from 'store/auth'
import {
  Conversation,
  CONVERSATION_INITIAL_DATA,
  useConversationStore
} from 'store/conversation'

interface RecentConversationsCardProps {
  uid: string
}

export function RecentConversationsCard({ uid }: RecentConversationsCardProps) {
  const [conversation, setConversation] = useState<Conversation>(
    CONVERSATION_INITIAL_DATA
  )

  const user = useAuthStore(state => state.user)

  const setCurrentConversation = useConversationStore(
    state => state.setCurrentConversation
  )

  useEffect(() => {
    const cDoc = doc(database, 'conversations', uid)
    const unsub = onSnapshot(cDoc, async conversationDoc => {
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data()
        if (conversationData) {
          const user2Id = conversationData.users.find(
            (u: string) => u !== user.uid
          )
          const userDoc = doc(database, 'users', user2Id)
          const user2Data = await getDoc(userDoc).then(userDoc => {
            if (userDoc.exists()) {
              if (userDoc.data()) return userDoc.data()
            }
          })
          if (user2Data) {
            const newConversation = {
              id: conversationDoc.id,
              image: user2Data.avatar,
              lastMessage: conversationData.lastMessage,
              lastMessageDate: new Date(
                conversationData.lastMessageDate.seconds * 1000
              ),
              name: user2Data.name,
              unreadMessagesQnt: conversationData.unreadMessagesQnt,
              with: user2Data as User
            }
            setConversation(newConversation)
          }
        }
      }
    })

    return () => unsub()
  }, [])

  function formatConversationDate(date: Date) {
    return format(date, 'HH:mm')
  }

  function handleClickConversation() {
    setCurrentConversation(uid)
  }

  return (
    <div
      tabIndex={0}
      onClick={handleClickConversation}
      className="focus-default flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-chattou-backgroundLight p-2 text-chattou-text transition-all hover:border-chattou-secondary/50"
    >
      <div className="flex w-full items-center justify-start gap-4">
        <img
          className="w-16 rounded-md"
          src={conversation.with.avatar}
          alt={`${conversation.with.name} avatar`}
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="text-xl font-bold">{conversation.with.name}</span>
          <span className="text-xs text-chattou-textDark">
            {conversation.lastMessage}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-1">
        <span>{formatConversationDate(conversation.lastMessageDate)}</span>
        {conversation.unreadMessagesQnt > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-chattou-primary text-xs font-bold ">
            {conversation.unreadMessagesQnt}
          </span>
        )}
      </div>
    </div>
  )
}
