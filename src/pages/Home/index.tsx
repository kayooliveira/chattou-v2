import logoHorizontal from 'assets/img/logo-horizontal.png'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'lib/firebase'
import { GoogleLogo } from 'phosphor-react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, User } from 'store/auth'

export function HomePage() {
  const signIn = useAuthStore(state => state.signIn)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const location = useLocation()
  const navigate = useNavigate()
  const locationState = location.state

  const setUser = useAuthStore(state => state.setUser)
  onAuthStateChanged(auth, user => {
    if (user && !isAuthenticated) {
      const { uid, displayName: name, photoURL: avatar } = user

      if (name && avatar) {
        const userData: User = {
          uid,
          name,
          avatar,
          username: ''
        }
        setUser(userData)
      }
    }
  })

  useEffect(() => {
    if (locationState && locationState.notify) {
      switch (locationState.notify.type) {
        case 'error':
          toast.error(locationState.notify.message)
          break
        case 'success':
          toast.success(locationState.notify.message)
          break
        default:
          toast.remove()
      }
    }
  }, [locationState])

  useEffect(() => {
    if (isAuthenticated) {
      toast.remove()
      navigate('/conversations')
      toast.success(`Bem vindo de volta, ${user.name}!`)
    }
  }, [isAuthenticated])

  async function handleSignIn() {
    await signIn()
      .then(() => {
        navigate('/conversations')
      })
      .catch(() => {
        toast.error('Erro ao fazer login')
      })
  }
  return (
    <div className="absolute left-0 top-0 h-full w-screen bg-home bg-cover bg-center bg-no-repeat p-8">
      <div className="mx-auto flex h-full max-w-screen-xl flex-col items-center justify-center gap-4">
        <img src={logoHorizontal} alt="chattou" />
        <h1 className="text-center text-xl md:text-2xl lg:text-4xl">
          Discover a whole new world of connection with CHATTOU!
          <br /> Chat with people from all over the world in real time, make new
          friends and share your ideas and experiences.
          <br /> Join our global community right now.
        </h1>
        <button
          onClick={handleSignIn}
          title="Login com o google!"
          className="focus-default flex items-center justify-center gap-2 rounded-md bg-red-500 p-2 px-4 text-2xl outline-none transition-colors hover:bg-red-700 hover:text-chattou-textDark"
        >
          <GoogleLogo weight="fill" size="24" />
          Login
        </button>
      </div>
    </div>
  )
}
