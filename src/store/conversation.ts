import { produce } from 'immer'
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
  showCurrentConversation: boolean
  setCurrentConversation: (uid: string) => void
  closeCurrentConversation: () => void
  openCurrentConversation: () => void
  toggleCurrentConversation: () => void
}

export const useConversationStore = create<State>(setState => ({
  currentConversation: '',
  showCurrentConversation: true,
  setCurrentConversation: uid => {
    try {
      setState(
        produce<State>(state => {
          state.currentConversation = uid
          state.showCurrentConversation = true
        })
      )
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
  }
}))
