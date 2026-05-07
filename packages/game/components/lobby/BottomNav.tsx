'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: '🏠', label: '大厅', href: '/' },
  { icon: '⚔️', label: '对战', href: '/battle/pvp' },
  { icon: '📋', label: '任务', href: '/tasks' },
  { icon: '🏆', label: '排行', href: '/leaderboard' },
]

export function BottomNav() {
  const pathname = usePathname()
  
  return (
    <nav className="flex justify-around items-center py-2 px-4 bg-black/20 backdrop-blur-sm border-t border-white/10 safe-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
