import logoHorizontal from 'assets/img/logo-horizontal.png'
import { GoogleLogo } from 'phosphor-react'

export function HomePage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-home bg-cover bg-center bg-no-repeat p-8 text-chattou-text">
      <img src={logoHorizontal} alt="" />
      <h1 className="text-center text-xl text-chattou-text md:text-2xl lg:text-4xl">
        Discover a whole new world of connection with CHATTOU! Chat with people
        from all over the world in real time, make new friends and share your
        ideas and experiences. Join our global community right now.
      </h1>
      <button className="focus-default flex items-center justify-center gap-2 rounded-md bg-red-500 p-2 px-4 text-2xl outline-none transition-colors hover:bg-red-700 hover:text-chattou-textDark">
        <GoogleLogo weight="fill" size="24" />
        Login
      </button>
    </div>
  )
}
