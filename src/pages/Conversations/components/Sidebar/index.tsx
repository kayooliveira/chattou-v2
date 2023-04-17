import { RecentConversations } from './components/RecentConversations'
import { RecentUsers } from './components/RecentUsers'
import { SidebarHeader } from './components/SidebarHeader'

export function Sidebar() {
  return (
    <div className="flex w-full flex-col p-6 lg:w-fit lg:max-w-[50%]">
      <SidebarHeader />
      <RecentUsers />
      <RecentConversations />
    </div>
  )
}
