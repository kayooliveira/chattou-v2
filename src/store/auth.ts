import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { produce } from 'immer'
import { auth, database } from 'lib/firebase'
import { create } from 'zustand'

export interface User {
  uid: string
  name: string
  username?: string
  avatar: string
}

const USER_INITIAL_STATE: User = {
  uid: '',
  name: '',
  username: '',
  avatar: ''
}

interface State {
  user: User
  isAuthenticated: boolean
  isAuthStateLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<State>(setState => ({
  user: USER_INITIAL_STATE,
  isAuthenticated: false,
  isAuthStateLoading: false,
  signIn: async () => {
    setState(
      produce<State>(state => {
        state.isAuthStateLoading = true
      })
    )

    try {
      const provider = new GoogleAuthProvider()

      const { user } = await signInWithPopup(auth, provider)

      const { uid, displayName: name, photoURL: avatar } = user

      if (uid && name && avatar) {
        setState(
          produce<State>(state => {
            state.user = {
              uid,
              name,
              avatar,
              username: ''
            }
            state.isAuthenticated = true
          })
        )

        const userDoc = doc(database, 'users', uid)

        await setDoc(userDoc, {
          uid,
          name,
          avatar,
          username: ''
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setState(
        produce<State>(state => {
          state.isAuthStateLoading = false
        })
      )
    }
  },
  signOut: async () => {
    setState(
      produce<State>(state => {
        state.isAuthStateLoading = true
      })
    )

    try {
      await auth.signOut()
      setState(
        produce<State>(state => {
          state.isAuthenticated = false
        })
      )
    } catch (error) {
      console.error(error)
    } finally {
      setState(
        produce<State>(state => {
          state.isAuthStateLoading = false
        })
      )
    }
  }
}))
