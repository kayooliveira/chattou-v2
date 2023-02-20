import { Clock } from 'phosphor-react'
import { useEffect } from 'react'
import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'

import { RecentConversationsCard } from './components/RecentConversationsCard'

export function RecentConversations() {
  const recentConversationsIds = useConversationStore(
    state => state.recentConversationsIds
  )
  const getRecentConversationsIds = useConversationStore(
    state => state.getRecentConversationsIds
  )
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    const unsub = getRecentConversationsIds(user.uid)
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
        {recentConversationsIds.map(recentConversationId => {
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
