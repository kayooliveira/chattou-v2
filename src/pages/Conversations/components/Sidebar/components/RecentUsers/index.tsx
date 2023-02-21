import { useEffect } from 'react'
import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'

import { RecentUsersCard } from './components/RecentUsersCard'

export function RecentUsers() {
  const recentUsers = useConversationStore(state => state.recentUsers)

  const getRecentUsers = useConversationStore(state => state.getRecentUsers)

  const user = useAuthStore(state => state.user)

  useEffect(() => {
    const unsub = getRecentUsers(user.uid)
    return () => unsub()
  }, [])

  return (
    <div className="my-3 w-full lg:my-6">
      <span className="mb-1 flex w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-chattou-primary to-chattou-primaryDark p-0.5 px-3 text-xs font-bold lg:text-base">
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        Recent Active
      </span>
      <div
        tabIndex={1}
        className="scrollbar-chattou flex w-full items-stretch justify-start gap-2 overflow-x-scroll p-1 outline-none"
      >
        {recentUsers.map(user => (
          <RecentUsersCard
            key={user.uid}
            name={user.name}
            avatar={user.avatar}
            uid={user.uid}
          />
        ))}
      </div>
    </div>
  )
}
