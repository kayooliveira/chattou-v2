import { Outlet } from 'react-router-dom'

export function DefaultLayout() {
  return (
    <div className="h-full max-h-full w-full max-w-screen-xl lg:mx-auto">
      <Outlet />
    </div>
  )
}
