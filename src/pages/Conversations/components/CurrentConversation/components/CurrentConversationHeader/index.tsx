import { XCircle } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { User, USER_INITIAL_STATE } from 'store/auth'
import { useConversationStore } from 'store/conversation'
interface CurrentConversationHeaderProps {
  onClose: () => void
}
export function CurrentConversationHeader({
  onClose
}: CurrentConversationHeaderProps) {
  const [currentConversationUser, setCurrentConversationUser] =
    useState<User>(USER_INITIAL_STATE)

  const getCurrentConversationUser = useConversationStore(
    state => state.getCurrentConversationUser
  )

  const currentConversation = useConversationStore(
    state => state.currentConversation
  )

  useEffect(() => {
    const unsub = getCurrentConversationUser(setCurrentConversationUser)
    return () => unsub()
  }, [currentConversation])

  return (
    <header className="flex w-full items-center justify-between rounded-tr-xl rounded-tl-xl bg-chattou-backgroundLight p-2">
      <div className="flex items-center justify-center gap-2">
        <img
          src={currentConversationUser.avatar}
          alt={`${currentConversationUser.name}'s avatar`}
          className="w-16 rounded-xl"
          referrerPolicy="no-referrer"
        />
        <div className="font-bold text-chattou-textDark">
          <span>{currentConversationUser.name}</span>
          <br />
          <span className="text-xs text-chattou-textDarker">
            {currentConversationUser.username}
          </span>
        </div>
      </div>

      <button className="text-chattou-textDark" onClick={onClose}>
        <XCircle weight="fill" size="24" />
      </button>
    </header>
  )
}
