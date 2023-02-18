import logoHorizontal from 'assets/img/logo-horizontal.png'
import { GoogleLogo } from 'phosphor-react'
import { useAuthStore } from 'store/auth'

export function HomePage() {
  const signIn = useAuthStore(state => state.signIn)

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
          onClick={signIn}
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
