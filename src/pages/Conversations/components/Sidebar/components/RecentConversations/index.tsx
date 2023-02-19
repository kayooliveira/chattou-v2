import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { database } from 'lib/firebase'
import { Clock } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from 'store/auth'

import { RecentConversationsCard } from './components/RecentConversationsCard'

export function RecentConversations() {
  const [recentConversationIds, setRecentConversationIds] = useState<string[]>(
    []
  )
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    const conversationsCol = collection(database, 'conversations')
    const conversationsQuery = query(
      conversationsCol,
      where('users', 'array-contains', user.uid)
    )
    const unsub = onSnapshot(conversationsQuery, conversationsSnap => {
      conversationsSnap.forEach(conversationDoc => {
        if (conversationDoc.exists()) {
          if (conversationDoc.data()) {
            setRecentConversationIds(state => {
              if (state.includes(conversationDoc.id)) return state
              return [...state, conversationDoc.id]
            })
          }
        }
      })
    })

    return () => unsub()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-1">
      <span className="flex w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-chattou-primary to-chattou-primaryDark p-0.5 px-3 text-xs font-bold lg:text-base">
        <Clock weight="fill" size={16} />
        Recent Conversations
      </span>
      <div
        tabIndex={1}
        className="scrollbar-chattou flex flex-1 basis-1 flex-col gap-2 overflow-x-scroll p-1 outline-none"
      >
        {recentConversationIds.map(recentConversationId => {
          return (
            <RecentConversationsCard
              key={recentConversationId}
              uid={recentConversationId}
            />
          )
        })}
      </div>
    </div>
  )
}
