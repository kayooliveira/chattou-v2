import { HomePage } from 'pages/Home'
import { NotFoundPage } from 'pages/NotFound'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/*',
    element: <NotFoundPage />
  }
])
