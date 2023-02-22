import classNames from 'classnames'
import EmojiPicker, {
  // eslint-disable-next-line import/named
  EmojiClickData,
  EmojiStyle,
  Theme
} from 'emoji-picker-react'
import { Microphone, PaperPlaneRight, Smiley, Trash } from 'phosphor-react'
import {
  FormEvent,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useMemo,
  useEffect
} from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { useAuthStore } from 'store/auth'
import { useConversationStore } from 'store/conversation'

import AudioPlayer from '../AudioPlayer'

export function CurrentConversationNewMessageForm() {
  const [showEmoji, setShowEmoji] = useState<boolean>(false)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const user = useAuthStore(state => state.user)
  const addMessageToCurrentConversation = useConversationStore(
    state => state.addMessageToCurrentConversation
  )
  const [audioURL, setAudioURL] = useState<string | undefined>(undefined)

  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingTime,
    recordingBlob
  } = useAudioRecorder()

  useEffect(() => {
    if (recordingBlob) {
      setAudioURL(URL.createObjectURL(recordingBlob))
    }
  }, [recordingBlob])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (showEmoji) {
      setShowEmoji(false)
    }
    if (audioURL) {
      const reader = new FileReader()
      reader.readAsDataURL(recordingBlob!)
      reader.onloadend = async () => {
        const base64Data = reader.result
        await addMessageToCurrentConversation({
          body: base64Data as string,
          isRead: false,
          sender: user.uid,
          time: new Date(),
          type: 'audio'
        })
        setAudioURL('')
      }
      return
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

  function toggleRecording() {
    if (isRecording) {
      stopRecording()
      return
    }
    startRecording()
  }

  function cancelRecording() {
    setAudioURL('')
  }

  return (
    <form
      ref={formRef}
      className={classNames(
        'relative mt-2 flex w-full items-center justify-center gap-4 rounded-full bg-chattou-backgroundLight p-1 px-1 text-chattou-textDarker focus-within:ring-1 focus-within:ring-chattou-secondary/50 focus-within:ring-offset-1 focus-within:ring-offset-transparent lg:px-4',
        {
          'justify-between': audioURL || isRecording
        }
      )}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      {showEmoji && (
        <span className="absolute left-0 bottom-16">
          {EmojiPickerContainer}
        </span>
      )}
      {audioURL && (
        <>
          <button
            title="Delete audio"
            onClick={cancelRecording}
            className="text-red-500"
          >
            <Trash weight="fill" size={24} />
          </button>
          <AudioPlayer source={audioURL} />
        </>
      )}
      {isRecording && (
        <span className="p-2 text-lg text-chattou-textDark">
          Recording audio... {recordingTime}s
        </span>
      )}
      {!isRecording && !audioURL && (
        <>
          <button
            type="button"
            className="rounded-full p-2 text-chattou-primary outline-none transition-colors focus:bg-chattou-primary focus:text-chattou-secondary hover:bg-chattou-primary hover:text-chattou-secondary"
            onClick={toggleShowEmoji}
          >
            <Smiley weight="fill" size={24} />
          </button>
          <ReactTextareaAutosize
            ref={textareaRef}
            name="message"
            minRows={1}
            maxRows={6}
            id="message"
            value={currentMessage}
            onChange={handleChangeMessage}
            className="block max-h-14 flex-1 resize-none rounded-lg border-none bg-chattou-backgroundLighter py-2 px-4 text-chattou-primary outline-none scrollbar-thin scrollbar-track-chattou-background scrollbar-thumb-chattou-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full placeholder:text-chattou-primary"
            placeholder="Message"
          />
        </>
      )}
      {currentMessage.trim().length || audioURL ? (
        <button className="-rotate-45 rounded-full p-2 text-chattou-primary outline-none transition-colors focus:bg-chattou-primary focus:text-chattou-secondary hover:bg-chattou-primary hover:text-chattou-secondary">
          <PaperPlaneRight weight="fill" size="24" />
        </button>
      ) : (
        <button onClick={toggleRecording}>
          <Microphone weight="fill" size="24" />
        </button>
      )}
    </form>
  )
}
