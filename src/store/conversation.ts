import {
  doc,
  getDoc,
  orderBy,
  query,
  where,
  collection,
  onSnapshot,
  // eslint-disable-next-line import/named
  Unsubscribe,
  updateDoc,
  addDoc,
  getDocs
} from 'firebase/firestore'
// eslint-disable-next-line import/named
import { produce } from 'immer'
import { database } from 'lib/firebase'
import { create } from 'zustand'

import { User } from './auth'

export interface Conversation {
  id: string
  image: string
  lastMessage: string
  lastMessageDate: Date
  name: string
  unreadMessagesQnt: number
  with: User
}

export interface Message {
  id: string
  body: string
  isRead: boolean
  sender: string
  time: Date
  type: 'text' | 'audio'
}

export const CONVERSATION_INITIAL_DATA: Conversation = {
  id: '',
  image: '',
  lastMessage: '',
  lastMessageDate: new Date(),
  name: '',
  unreadMessagesQnt: 0,
  with: {
    avatar: '',
    name: '',
    uid: '',
    username: ''
  }
}

interface State {
  currentConversation: string
  currentConversationUser: string
  showCurrentConversation: boolean
  recentUsers: User[]
  recentConversationsIds: string[]
  setCurrentConversation: (
    conversationId: string,
    userId: string
  ) => Promise<void>
  getCurrentConversationUser: (
    onConversationChange: (newUser: User) => void
  ) => Unsubscribe
  getCurrentConversationMessages: (
    onMessageChange: (newMessage: Message) => void
  ) => Unsubscribe
  addMessageToCurrentConversation: (
    message: Omit<Message, 'id'>
  ) => Promise<void>
  createNewEmptyConversation: (
    user1Id: string,
    user2Id: string
  ) => Promise<void>
  closeCurrentConversation: () => void
  openCurrentConversation: () => void
  toggleCurrentConversation: () => void
  getRecentUsers: () => Unsubscribe
  getRecentConversationsIds: (userId: string) => Unsubscribe
  getConversationData: (
    conversationId: string,
    userId: string,
    onConversationChange: (newConversation: Conversation) => void
  ) => Unsubscribe
  setConversationMessagesReadByUser: (
    userId: string,
    conversationId?: string
  ) => Promise<void>
}

export const useConversationStore = create<State>((setState, getState) => ({
  currentConversation: '',
  currentConversationUser: '',
  showCurrentConversation: true,
  recentUsers: [],
  recentConversationsIds: [],
  setCurrentConversation: async (conversationId, userId) => {
    try {
      const cDoc = doc(database, 'conversations', conversationId)
      const currentConversationUserId = await getDoc(cDoc).then(
        conversationDoc => {
          if (conversationDoc.exists()) {
            const conversationData = conversationDoc.data()
            if (conversationData) {
              const user2Id = conversationData.users.find(
                (u: string) => u !== userId
              )
              if (user2Id) return user2Id
            }
          }
        }
      )

      setState(
        produce<State>(state => {
          state.currentConversation = conversationId
          state.currentConversationUser = currentConversationUserId
          state.showCurrentConversation = true
        })
      )
    } catch (error) {
      console.error(error)
    }
  },
  getCurrentConversationUser: onUserChange => {
    try {
      const actualState = getState()
      const currentConversationUserId = actualState.currentConversationUser

      const uDoc = doc(database, 'users', currentConversationUserId)
      const unsub = onSnapshot(uDoc, userDoc => {
        if (userDoc.exists()) {
          const user2Data = userDoc.data()
          if (user2Data) {
            const newUser: User = {
              avatar: user2Data.avatar,
              name: user2Data.name,
              uid: user2Data.uid,
              username: user2Data.username
            }
            onUserChange(newUser)
          }
        }
      })

      return unsub
    } catch (error) {
      console.error(error)
      return () => null
    }
  },
  getCurrentConversationMessages: onMessagesChange => {
    try {
      const actualState = getState()
      const currentConversationId = actualState.currentConversation
      const messagesCol = collection(
        database,
        `conversations/${currentConversationId}/messages`
      )
      const messagesQuery = query(messagesCol, orderBy('time', 'asc'))
      const unsub = onSnapshot(messagesQuery, messagesSnap => {
        messagesSnap.forEach(messageDoc => {
          if (messageDoc.exists()) {
            const messageData = messageDoc.data()
            if (messageData) {
              const newMessage = {
                id: messageDoc.id,
                body: messageData.body,
                isRead: messageData.isRead,
                sender: messageData.sender,
                time: new Date(messageData.time.seconds * 1000),
                type: messageData.type
              }
              onMessagesChange(newMessage)
            }
          }
        })
      })
      return unsub
    } catch (error) {
      console.error(error)
      return () => null
    }
  },
  addMessageToCurrentConversation: async message => {
    try {
      const actualState = getState()
      const currentConversationId = actualState.currentConversation
      const conversationDoc = doc(
        database,
        'conversations',
        currentConversationId
      )
      await updateDoc(conversationDoc, {
        lastMessage: message.body,
        lastMessageDate: message.time
      })
      const messagesRef = collection(
        database,
        `conversations/${currentConversationId}/messages`
      )
      await addDoc(messagesRef, message)
    } catch (error) {
      console.error(error)
    }
  },
  createNewEmptyConversation: async (user1Id, user2Id) => {
    try {
      const conversationCol = collection(database, 'conversations')

      const conversationExistsQuery = query(
        conversationCol,
        where('users', 'array-contains', user1Id || user2Id)
      )
      const conversationExists = await getDocs(conversationExistsQuery).then(
        conversationDocs => {
          let conversationId = ''
          conversationDocs.forEach(conversationDoc => {
            if (conversationDoc.exists()) {
              const conversationData = conversationDoc.data()
              if (conversationData) {
                if (conversationData.users.includes(user2Id)) {
                  conversationId = conversationDoc.id
                }
              }
            }
          })
          return conversationId
        }
      )

      if (conversationExists) {
        setState(
          produce<State>(state => {
            state.currentConversation = conversationExists
            state.currentConversationUser = user2Id
            state.showCurrentConversation = true
          })
        )
        return
      }

      const conversationDoc = await addDoc(conversationCol, {
        users: [user1Id, user2Id],
        lastMessageDate: null,
        lastMessage: ''
      })
      if (conversationDoc.id) {
        setState(
          produce<State>(state => {
            state.currentConversation = conversationDoc.id
            state.currentConversationUser = user2Id
            state.showCurrentConversation = true
          })
        )
      }
    } catch (error) {
      console.error(error)
    }
  },
  closeCurrentConversation: () => {
    try {
      setState(
        produce<State>(state => {
          state.showCurrentConversation = false
        })
      )
    } catch (error) {
      console.error(error)
    }
  },
  openCurrentConversation: () => {
    try {
      setState(
        produce<State>(state => {
          state.showCurrentConversation = true
        })
      )
    } catch (error) {
      console.error(error)
    }
  },
  toggleCurrentConversation: () => {
    try {
      setState(
        produce<State>(state => {
          state.showCurrentConversation = !state.showCurrentConversation
        })
      )
    } catch (error) {
      console.error(error)
    }
  },
  getRecentUsers: () => {
    try {
      const usersDoc = collection(database, 'users')
      const unsub = onSnapshot(usersDoc, usersSnapshot => {
        if (usersSnapshot.empty) return
        usersSnapshot.forEach(userDoc => {
          if (userDoc.exists()) {
            const userDocData = userDoc.data()
            if (userDocData) {
              const userData: User = {
                uid: userDocData.uid, // ! REMOVER O CÓDIGO "|| userDocData.id" após lançar a v2!
                name: userDocData.name,
                avatar: userDocData.avatar,
                username: userDocData.username
              }
              setState(
                produce<State>(state => {
                  const userExists = state.recentUsers.find(
                    stateUser => stateUser.uid === userData.uid
                  )

                  if (userExists) {
                    const newState = state.recentUsers.filter(
                      stateUser => stateUser.uid !== userData.uid
                    )
                    state.recentUsers = [...newState, userData]
                    return
                  }

                  state.recentUsers = [...state.recentUsers, userData]
                })
              )
            }
          }
        })
      })

      return unsub
    } catch (error) {
      console.error(error)
      return () => null
    }
  },
  getRecentConversationsIds: userId => {
    try {
      const conversationsCol = collection(database, 'conversations')
      const conversationsQuery = query(
        conversationsCol,
        where('users', 'array-contains', userId)
      )
      const unsub = onSnapshot(conversationsQuery, conversationsSnap => {
        conversationsSnap.forEach(conversationDoc => {
          if (conversationDoc.exists()) {
            if (conversationDoc.data() && conversationDoc.data().lastMessage) {
              setState(
                produce<State>(state => {
                  if (
                    state.recentConversationsIds.includes(conversationDoc.id)
                  ) {
                    return
                  }

                  state.recentConversationsIds = [
                    ...state.recentConversationsIds,
                    conversationDoc.id
                  ]
                })
              )
            }
          }
        })
      })

      return unsub
    } catch (error) {
      console.error(error)
      return () => null
    }
  },
  getConversationData: (conversationId, userId, onConversationChange) => {
    try {
      const cDoc = doc(database, 'conversations', conversationId)
      const unsub = onSnapshot(cDoc, async conversationDoc => {
        if (conversationDoc.exists()) {
          const conversationData = conversationDoc.data()
          if (conversationData) {
            const user2Id = conversationData.users.find(
              (u: string) => u !== userId
            )
            const userDoc = doc(database, 'users', user2Id)
            const user2Data = await getDoc(userDoc).then(userDoc => {
              if (userDoc.exists()) {
                if (userDoc.data()) return userDoc.data()
              }
            })
            if (user2Data) {
              const messagesCol = collection(
                database,
                `conversations/${conversationDoc.id}/messages`
              )
              const messagesQuery = query(
                messagesCol,
                where('isRead', '==', false)
              )

              const unreadMessages = await getDocs(messagesQuery).then(
                messagesDocs => {
                  let unreadMessagesQnt = 0
                  messagesDocs.forEach(messageDoc => {
                    if (messageDoc.exists()) {
                      if (messageDoc.data()) {
                        if (messageDoc.data().sender === user2Id) {
                          unreadMessagesQnt += 1
                        }
                      }
                    }
                  })
                  return unreadMessagesQnt
                }
              )

              const newConversation = {
                id: conversationDoc.id,
                image: user2Data.avatar,
                lastMessage: conversationData.lastMessage,
                lastMessageDate: new Date(
                  conversationData.lastMessageDate.seconds * 1000
                ),
                name: user2Data.name,
                unreadMessagesQnt: unreadMessages,
                with: user2Data as User
              }
              onConversationChange(newConversation)
            }
          }
        }
      })

      return unsub
    } catch (error) {
      console.error(error)
      return () => null
    }
  },
  setConversationMessagesReadByUser: async (userId, conversation) => {
    try {
      const actualState = getState()
      const currentConversationId = actualState.currentConversation
      const conversationId = conversation || currentConversationId
      const conversationDoc = doc(database, 'conversations', conversationId)
      await updateDoc(conversationDoc, {
        lastMessageReadTime: new Date()
      })
      const messagesCol = collection(
        database,
        `conversations/${conversationId}/messages`
      )
      const messagesQuery = query(messagesCol, where('sender', '!=', userId))
      const messagesIds = await getDocs(messagesQuery).then(messagesDoc => {
        const ids: string[] = []
        messagesDoc.forEach(messageDoc => {
          if (messageDoc.exists()) {
            ids.push(messageDoc.id)
          }
        })
        return ids
      })

      messagesIds.forEach(async messageId => {
        const messageDoc = doc(
          database,
          `conversations/${conversationId}/messages`,
          messageId
        )
        await updateDoc(messageDoc, {
          isRead: true
        })
      })
    } catch (error) {
      console.error(error)
    }
  }
}))
