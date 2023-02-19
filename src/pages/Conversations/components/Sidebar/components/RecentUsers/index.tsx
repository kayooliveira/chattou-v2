import { collection, onSnapshot } from 'firebase/firestore'
import { database } from 'lib/firebase'
import { useEffect, useState } from 'react'
import { User } from 'store/auth'

import { RecentUsersCard } from './components/RecentUsersCard'

export function RecentUsers() {
  const [recentUsers, setRecentUsers] = useState<User[]>([])

  useEffect(() => {
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
            setRecentUsers(state => {
              const userExists = state.find(
                stateUser => stateUser.uid === userData.uid
              )
              if (userExists) {
                const newState = state.filter(
                  stateUser => stateUser.uid !== userData.uid
                )
                return [...newState, userData]
              }
              return [...state, userData]
            })
          }
        }
      })
    })

    return () => unsub()
  }, [])

  return (
    <div className="my-3 w-full lg:my-6">
      <span className="mb-1 flex w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-chattou-primary to-chattou-primaryDark p-0.5 px-3 text-xs font-bold lg:text-base">
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        Recent Active
      </span>
      <div
        tabIndex={1}
        className="scrollbar-chattou flex w-full items-stretch justify-start gap-2 overflow-x-scroll p-1 outline-none"
      >
        {recentUsers.map(user => (
          <RecentUsersCard
            key={user.uid}
            name={user.name}
            avatar={user.avatar}
            uid={user.uid}
          />
        ))}
      </div>
    </div>
  )
}
