import logoHorizontal from 'assets/img/logo-horizontal.png'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-8 text-center text-chattou-text">
      <div>
        <img src={logoHorizontal} alt="" className="mb-4" />
        <h1 className="text-3xl">Página não encontrada</h1>
        <h2 className="text-xl">
          Clique{' '}
          <Link className="text-chattou-primary underline" to="/">
            aqui
          </Link>{' '}
          para retornar à página principal{' '}
        </h2>
      </div>
    </div>
  )
}
