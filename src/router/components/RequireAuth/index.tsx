import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from 'store/auth'

export function RequireAuth() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const location = useLocation()

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
