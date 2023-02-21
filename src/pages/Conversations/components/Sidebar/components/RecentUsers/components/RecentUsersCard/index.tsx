import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'

interface RecentUsersCardProps {
  name: string
  avatar: string
  uid: string
}

export function RecentUsersCard({ name, avatar, uid }: RecentUsersCardProps) {
  const user = useAuthStore(state => state.user)

  const createNewEmptyConversation = useConversationStore(
    state => state.createNewEmptyConversation
  )

  function handleClickUser() {
    createNewEmptyConversation(user.uid, uid)
  }

  return (
    <div
      tabIndex={0}
      onClick={handleClickUser}
      title={`Click to chat with ${name}`}
      className="focus-default flex w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md p-2 font-bold transition-opacity hover:opacity-40 lg:w-28"
    >
      <img
        className="w-full rounded-full"
        src={avatar}
        referrerPolicy="no-referrer"
        alt={`${name} avatar`}
      />
      <span className="max-w-[10ch] truncate text-xs text-chattou-textDarker lg:text-base">
        {name}
      </span>
    </div>
  )
}
