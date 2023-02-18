import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'lib/firebase'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, User } from 'store/auth'

export function RequireAuth() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const location = useLocation()
  const setUser = useAuthStore(state => state.setUser)
  onAuthStateChanged(auth, user => {
    if (user && !isAuthenticated) {
      const { uid, displayName: name, photoURL: avatar } = user

      if (name && avatar) {
        const userData: User = {
          uid,
          name,
          avatar,
          username: ''
        }
        setUser(userData)
      }
    }
  })

  if (isAuthenticated) {
    return <Outlet />
  } else {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,
          notify: {
            type: 'error',
            message: 'Por favor, faça login para continuar!'
          }
        }}
      />
    )
  }
}
