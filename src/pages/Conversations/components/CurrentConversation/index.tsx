import { AnimatePresence, motion } from 'framer-motion'
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

  function handleClose() {
    closeCurrentConversation()
  }

  return (
    <AnimatePresence onExitComplete={() => console.log('FECHO MEU PATRÃO')}>
      {currentConversation && showCurrentConversation && (
        <motion.div
          initial={{ opacity: 0.5, x: 1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.5, x: 1000 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 flex h-screen w-screen flex-col items-center overflow-hidden  bg-chattou-background p-2"
        >
          <CurrentConversationHeader onClose={handleClose} />
          <CurrentConversationMessages />
          <CurrentConversationNewMessageForm />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
