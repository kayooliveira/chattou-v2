import { DefaultLayout } from 'layouts/Default'
import { HomePage } from 'pages/Home'
import { NotFoundPage } from 'pages/NotFound'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/*',
        element: <NotFoundPage />
      }
    ]
  }
])
