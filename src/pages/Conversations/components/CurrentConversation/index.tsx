import { doc, getDoc } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import { database } from 'lib/firebase'
import { useEffect, useState } from 'react'
import { useAuthStore, User } from 'store/auth'
import {
  Conversation,
  CONVERSATION_INITIAL_DATA,
  useConversationStore
} from 'store/conversation'

import { CurrentConversationHeader } from './components/CurrentConversationHeader'
import { CurrentConversationMessages } from './components/CurrentConversationMessages'
import { CurrentConversationNewMessageForm } from './components/CurrentConversationNewMessageForm'

export function CurrentConversation() {
  const [conversation, setConversation] = useState<Conversation>(
    CONVERSATION_INITIAL_DATA
  )
  const currentConversation = useConversationStore(
    state => state.currentConversation
  )

  const closeCurrentConversation = useConversationStore(
    state => state.closeCurrentConversation
  )

  const showCurrentConversation = useConversationStore(
    state => state.showCurrentConversation
  )

  const user = useAuthStore(state => state.user)

  useEffect(() => {
    let currentConversationId = currentConversation

    if (currentConversationId) {
      const getConversationData = async () => {
        const cDoc = doc(database, 'conversations', currentConversation)
        await getDoc(cDoc).then(async conversationDoc => {
          if (conversationDoc.exists()) {
            const conversationData = conversationDoc.data()
            if (conversationData) {
              const user2Id = conversationData.users.find(
                (u: string) => u !== user.uid
              )
              const userDoc = doc(database, 'users', user2Id)
              const user2Data = await getDoc(userDoc).then(userDoc => {
                if (userDoc.exists()) {
                  if (userDoc.data()) return userDoc.data()
                }
              })
              if (user2Data) {
                const newConversation = {
                  id: conversationDoc.id,
                  image: user2Data.avatar,
                  lastMessage: conversationData.lastMessage,
                  lastMessageDate: new Date(
                    conversationData.lastMessageDate.seconds * 1000
                  ),
                  name: user2Data.name,
                  unreadMessagesQnt: conversationData.unreadMessagesQnt,
                  with: user2Data as User
                }
                setConversation(newConversation)
              }
            }
          }
        })
      }

      getConversationData()

      return () => {
        currentConversationId = ''
      }
    }
  }, [currentConversation])

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
          <CurrentConversationHeader
            avatar={conversation.with.avatar}
            name={conversation.with.name}
            username={conversation.with.username}
            onClose={handleClose}
          />
          <CurrentConversationMessages />
          <CurrentConversationNewMessageForm />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
