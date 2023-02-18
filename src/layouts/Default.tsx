import { Outlet } from 'react-router-dom'

export function DefaultLayout() {
  return (
    <div className="max-w-screen h-full max-h-full w-full">
      <Outlet />
    </div>
  )
}
