import EmojiPicker, {
  // eslint-disable-next-line import/named
  EmojiClickData,
  EmojiStyle,
  Theme
} from 'emoji-picker-react'
import { PaperPlaneRight } from 'phosphor-react'
import { FormEvent, useState, ChangeEvent, KeyboardEvent, useRef } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'

export function CurrentConversationNewMessageForm() {
  const [showEmoji, setShowEmoji] = useState<boolean>(false)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  function toggleShowEmoji() {
    setShowEmoji(!showEmoji)
  }

  function handleAddEmoji(emoji: EmojiClickData) {
    setCurrentMessage(state => state + emoji.emoji)
  }

  function handleChangeMessage(e: ChangeEvent<HTMLTextAreaElement>) {
    setCurrentMessage(e.target.value)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey && formRef.current) {
      e.preventDefault()
      formRef.current.requestSubmit()
    }
  }

  return (
    <form
      ref={formRef}
      className="mt-2 flex w-full items-center justify-center rounded-full bg-chattou-backgroundLight p-1  focus-within:ring-1 focus-within:ring-chattou-secondary/50 focus-within:ring-offset-1 focus-within:ring-offset-transparent"
      onSubmit={handleSubmit}
    >
      <button onClick={toggleShowEmoji}>
        {showEmoji && (
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
        )}
      </button>
      <ReactTextareaAutosize
        ref={textareaRef}
        name="message"
        minRows={1}
        maxRows={6}
        onKeyDown={handleKeyDown}
        id="message"
        value={currentMessage}
        onChange={handleChangeMessage}
        className="block max-h-14 flex-1 resize-none border-none bg-transparent px-4 text-chattou-primary outline-none scrollbar-thin scrollbar-track-chattou-background scrollbar-thumb-chattou-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full placeholder:text-chattou-primary"
        placeholder="Digite sua mensagem!"
      />
      <button className="-rotate-45 rounded-full p-2 text-chattou-primary outline-none transition-colors focus:bg-chattou-primary focus:text-chattou-secondary hover:bg-chattou-primary hover:text-chattou-secondary">
        <PaperPlaneRight weight="fill" size="24" />
      </button>
    </form>
  )
}
