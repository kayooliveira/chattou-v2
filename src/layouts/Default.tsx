import { Outlet } from 'react-router-dom'
import { useAuthStore } from 'store/auth'

import { Loading } from './components/Loading'

export function DefaultLayout() {
  const isAuthStateLoading = useAuthStore(state => state.isAuthStateLoading)
  return (
    <div className="h-full max-h-full w-full max-w-screen-xl lg:mx-auto">
      {isAuthStateLoading ? <Loading message="Autenticando..." /> : <Outlet />}
    </div>
  )
}
