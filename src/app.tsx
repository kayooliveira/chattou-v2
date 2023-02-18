import chattouIcon from 'assets/img/logotipo.png'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { router } from 'router'
export function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: 'top-center',
          icon: <img src={chattouIcon} width="20" alt="" />
        }}
      />
      <RouterProvider router={router} />
    </>
  )
}
