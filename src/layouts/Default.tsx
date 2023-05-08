import { Outlet } from 'react-router-dom'
import { useAuthStore } from 'store/auth'

import { Loading } from './components/Loading'

export function DefaultLayout() {
  const isAuthStateLoading = useAuthStore(state => state.isAuthStateLoading)
  return (
    <div className="relative h-full max-h-full w-full max-w-screen-xl lg:mx-auto">
      <div className="absolute right-6 bottom-6">
        <a
          href="https://www.buymeacoffee.com/kayooliveira"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: '36.3px', width: '131.285px' }}
          />
        </a>
      </div>
      {isAuthStateLoading ? <Loading message="Autenticando..." /> : <Outlet />}
    </div>
  )
}
