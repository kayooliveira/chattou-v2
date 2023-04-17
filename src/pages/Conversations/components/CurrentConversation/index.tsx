import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useConversationStore } from 'store/conversation'

import { CurrentConversationHeader } from './components/CurrentConversationHeader'
import { CurrentConversationMessages } from './components/CurrentConversationMessages'
import { CurrentConversationNewMessageForm } from './components/CurrentConversationNewMessageForm'

export function CurrentConversation() {
  const currentConversation = useConversationStore(
    state => state.currentConversation
  )

  const closeCurrentConversation = useConversationStore(
    state => state.closeCurrentConversation
  )

  const showCurrentConversation = useConversationStore(
    state => state.showCurrentConversation
  )

  useEffect(() => {
    if (!currentConversation) {
      closeCurrentConversation()
    }
  }, [currentConversation])

  function handleClose() {
    closeCurrentConversation()
  }

  return (
    <AnimatePresence>
      {showCurrentConversation ? (
        <motion.div
          initial={{ opacity: 0.5, x: 1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.5, x: 1000 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 flex h-screen w-screen flex-col items-center overflow-hidden bg-chattou-background p-2 lg:relative lg:h-full lg:w-full lg:flex-1 lg:py-4 lg:pr-8"
        >
          {currentConversation && (
            <>
              <CurrentConversationHeader onClose={handleClose} />
              <CurrentConversationMessages />
              <CurrentConversationNewMessageForm />
            </>
          )}
        </motion.div>
      ) : (
        <div className="hidden flex-1 items-center justify-center rounded-3xl bg-chattou-backgroundLight p-6 lg:flex">
          <h1 className="text-center text-2xl uppercase text-chattou-textDarker">
            Select a conversation to start chatting.
          </h1>
        </div>
      )}
    </AnimatePresence>
  )
}
