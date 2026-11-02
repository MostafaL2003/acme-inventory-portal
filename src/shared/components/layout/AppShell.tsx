import { Outlet } from 'react-router-dom'
import {
  CommandPaletteModal,
  useCommandPaletteShortcut,
} from '@/features/command-palette'
import { SidebarNav } from './SidebarNav'
import { TopHeader } from './TopHeader'

export function AppShell() {
  useCommandPaletteShortcut()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <CommandPaletteModal />
    </div>
  )
}

export default AppShell
