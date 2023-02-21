import EmojiPicker, {
  // eslint-disable-next-line import/named
  EmojiClickData,
  EmojiStyle,
  Theme
} from 'emoji-picker-react'
import { PaperPlaneRight, Smiley } from 'phosphor-react'
import {
  FormEvent,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useMemo
} from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'

export function CurrentConversationNewMessageForm() {
  const [showEmoji, setShowEmoji] = useState<boolean>(false)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const user = useAuthStore(state => state.user)
  const addMessageToCurrentConversation = useConversationStore(
    state => state.addMessageToCurrentConversation
  )

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (showEmoji) {
      setShowEmoji(false)
    }
    if (currentMessage.trim().length) {
      await addMessageToCurrentConversation({
        body: currentMessage,
        isRead: false,
        sender: user.uid,
        time: new Date(),
        type: 'text'
      })
      setCurrentMessage('')
      textareaRef.current?.focus()
    }
  }

  function toggleShowEmoji() {
    setShowEmoji(!showEmoji)
  }

  function handleAddEmoji(emoji: EmojiClickData) {
    setCurrentMessage(state => state + emoji.emoji)
    textareaRef.current?.focus()
  }

  function handleChangeMessage(e: ChangeEvent<HTMLTextAreaElement>) {
    setCurrentMessage(e.target.value)
    if (showEmoji) {
      setShowEmoji(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>): void {
    switch (e.key) {
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault()
          formRef.current?.requestSubmit()
          if (showEmoji) {
            setShowEmoji(false)
          }
        }
        break
      case 'Escape':
        if (showEmoji) {
          setShowEmoji(false)
        }
        break
      default:
    }
  }

  const EmojiPickerContainer = useMemo(
    () => (
      <EmojiPicker
        height="350px"
        lazyLoadEmojis
        emojiStyle={EmojiStyle.NATIVE}
        onEmojiClick={handleAddEmoji}
        theme={Theme.DARK}
        searchPlaceHolder="Buscar"
        previewConfig={{
          showPreview: false
        }}
        searchDisabled={true}
      />
    ),
    [showEmoji]
  )

  return (
    <form
      ref={formRef}
      className="relative mt-2  flex w-full items-center justify-center rounded-full bg-chattou-backgroundLight p-1 text-chattou-textDarker  focus-within:ring-1 focus-within:ring-chattou-secondary/50 focus-within:ring-offset-1 focus-within:ring-offset-transparent"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="rounded-full p-2 text-chattou-primary outline-none transition-colors focus:bg-chattou-primary focus:text-chattou-secondary hover:bg-chattou-primary hover:text-chattou-secondary"
        onClick={toggleShowEmoji}
      >
        <Smiley weight="fill" size={24} />
        {showEmoji && (
          <span className="absolute left-0 bottom-16">
            {EmojiPickerContainer}
          </span>
        )}
      </button>
      <ReactTextareaAutosize
        ref={textareaRef}
        name="message"
        minRows={1}
        maxRows={6}
        id="message"
        value={currentMessage}
        onChange={handleChangeMessage}
        className="block max-h-14 flex-1 resize-none border-none bg-transparent px-4 text-chattou-primary outline-none scrollbar-thin scrollbar-track-chattou-background scrollbar-thumb-chattou-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full placeholder:text-chattou-primary"
        placeholder="Message"
      />
      <button className="-rotate-45 rounded-full p-2 text-chattou-primary outline-none transition-colors focus:bg-chattou-primary focus:text-chattou-secondary hover:bg-chattou-primary hover:text-chattou-secondary">
        <PaperPlaneRight weight="fill" size="24" />
      </button>
    </form>
  )
}
