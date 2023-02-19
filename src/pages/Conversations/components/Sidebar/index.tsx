import { RecentConversations } from './components/RecentConversations'
import { RecentUsers } from './components/RecentUsers'
import { SidebarHeader } from './components/SidebarHeader'

export function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <SidebarHeader />
      <RecentUsers />
      <RecentConversations />
    </div>
  )
}
