import { XCircle } from 'phosphor-react'
interface CurrentConversationHeaderProps {
  avatar: string
  name: string
  username?: string
  onClose: () => void
}
export function CurrentConversationHeader({
  avatar,
  name,
  username,
  onClose
}: CurrentConversationHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between rounded-tr-xl rounded-tl-xl bg-chattou-backgroundLight p-2">
      <div className="flex items-center justify-center gap-2">
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-16 rounded-xl"
          referrerPolicy="no-referrer"
        />
        <div className="font-bold text-chattou-textDark">
          <span>{name}</span>
          <br />
          <span className="text-xs text-chattou-textDarker">{username}a</span>
        </div>
      </div>

      <button className="text-chattou-textDark" onClick={onClose}>
        <XCircle weight="fill" size="24" />
      </button>
    </header>
  )
}
