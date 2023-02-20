import { MagnifyingGlass, UserSwitch } from 'phosphor-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuthStore } from 'store/auth'

export function SidebarHeader() {
  const [searchUserInput, setSearchUserInput] = useState<string>('')

  const signOut = useAuthStore(state => state.signOut)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchUserInput(value)
  }

  function handleSearchUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (searchUserInput.trim().length) {
      console.log('Buscando...')
    }
  }

  return (
    <header className="flex flex-col gap-6 text-chattou-textDarker">
      <div className="flex w-full items-center justify-between">
        <span className="text-xl font-bold">Messages</span>
        <button
          onClick={signOut}
          className="focus-default rounded-full transition-all duration-300 hover:rotate-[360deg] hover:text-chattou-text"
        >
          <UserSwitch size={32} />
        </button>
      </div>
      <form
        className="flex w-full items-stretch justify-center rounded-full bg-chattou-backgroundLight focus-within:ring-2 focus-within:ring-chattou-secondary/50"
        onSubmit={handleSearchUser}
      >
        <input
          type="search"
          name="search"
          id="search"
          title="Search user input"
          placeholder="Search..."
          className=" flex-1 bg-transparent px-4 py-2 outline-none placeholder:text-chattou-textDarker"
          onChange={handleChange}
          value={searchUserInput}
        />
        <button
          type="submit"
          title="Submit search"
          className="flex items-center justify-center rounded-full p-2 px-4 outline-none transition-colors focus:text-chattou-textDark hover:text-chattou-textDark"
        >
          <MagnifyingGlass size={32} weight="fill" />
        </button>
      </form>
    </header>
  )
}
