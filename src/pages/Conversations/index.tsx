import { CurrentConversation } from './components/CurrentConversation'
import { Sidebar } from './components/Sidebar'

export function Conversations() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <CurrentConversation />
    </div>
  )
}
