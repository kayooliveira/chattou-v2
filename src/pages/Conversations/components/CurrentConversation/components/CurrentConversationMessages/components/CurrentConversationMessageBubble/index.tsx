import classNames from 'classnames'
import { format } from 'date-fns'
import { useAuthStore } from 'store/auth'
import getAudioDataFromMessageBody from 'utils/getAudioDataFromMessageBody'

import AudioPlayer from '../../../AudioPlayer'

interface CurrentConversationMessageBubbleProps {
  body: string
  time: Date
  senderId: string
  isRead: boolean
  type: 'text' | 'audio'
}

type MessageActionType = 'in' | 'out'

export function CurrentConversationMessageBubble({
  body,
  time,
  senderId,
  type
}: CurrentConversationMessageBubbleProps) {
  const user = useAuthStore(state => state.user)
  const messageAction: MessageActionType = senderId === user.uid ? 'out' : 'in'

  function formatMessageTime(date: Date) {
    return format(date, 'HH:mm')
  }

  return (
    <div
      className={classNames('flex w-full items-center gap-2 p-2', {
        'justify-end': messageAction === 'out',
        'justify-start': messageAction === 'in'
      })}
    >
      {type === 'text' ? (
        <p
          className={classNames(
            'w-fit max-w-[20rem] gap-6 whitespace-pre-wrap break-words rounded-xl py-2 px-4 text-lg leading-[23px] text-chattou-text after:absolute after:-right-2 after:top-0 after:h-3 after:w-4 after:rounded',
            {
              'rounded-tr-none bg-gradient-to-l from-chattou-primaryDark to-chattou-primary':
                messageAction === 'out',
              'text-chattou-light rounded-tl-none bg-chattou-backgroundLight':
                messageAction === 'in'
            }
          )}
        >
          {body}

          <span className="text-chattou-light relative bottom-0 float-right mt-2 pl-6 text-xs leading-none">
            {formatMessageTime(time)}
          </span>
        </p>
      ) : (
        <AudioPlayer
          style={messageAction}
          source={getAudioDataFromMessageBody(body)}
        />
      )}
    </div>
  )
}
