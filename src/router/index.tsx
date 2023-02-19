import { DefaultLayout } from 'layouts/Default'
import { Conversations } from 'pages/Conversations'
import { HomePage } from 'pages/Home'
import { NotFoundPage } from 'pages/NotFound'
import { createBrowserRouter } from 'react-router-dom'

import { RequireAuth } from './components/RequireAuth'

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        element: <RequireAuth />, // ? Ensure the user is authenticated before access the paths.
        children: [
          {
            path: '/conversations',
            element: <Conversations />
          }
        ]
      },
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
