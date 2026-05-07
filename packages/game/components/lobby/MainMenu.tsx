'use client'

import Link from 'next/link'

interface MenuItem {
  icon: string
  title: string
  desc: string
  href: string
  color: string
  badge?: string
}

const menuItems: MenuItem[] = [
  {
    icon: '⚔️',
    title: '争霸对战',
    desc: 'PVP 真人对决',
    href: '/battle/pvp',
    color: 'from-red-500 to-orange-500',
    badge: '热门',
  },
  {
    icon: '🎯',
    title: '主线推图',
    desc: '挑战关卡，解锁剧情',
    href: '/campaign',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🏰',
    title: '副本挑战',
    desc: '限时副本，稀有奖励',
    href: '/dungeon',
    color: 'from-purple-500 to-pink-500',
    badge: '限时',
  },
  {
    icon: '📋',
    title: '每日任务',
    desc: '完成任务领取奖励',
    href: '/tasks',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '🛠️',
    title: '龙虾养成',
    desc: '升级强化你的龙虾',
    href: '/progression',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: '🦞',
    title: 'PVE 练习',
    desc: '与 AI 对战练习',
    href: '/battle/pve',
    color: 'from-gray-500 to-slate-500',
  },
]

export function MainMenu() {
  return (
    <div className="space-y-3">
      {/* 公告/活动横幅 */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-3 border border-yellow-500/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-float">🎉</span>
          <div>
            <div className="font-bold text-yellow-400">限时活动</div>
            <div className="text-sm text-white/70">周末双倍经验进行中！</div>
          </div>
        </div>
      </div>
      
      {/* 菜单网格 */}
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative p-4 rounded-xl bg-gradient-to-br ${item.color} shadow-lg transition-transform active:scale-95`}
          >
            {/* 徽章 */}
            {item.badge && (
              <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold bg-white/30 rounded-full">
                {item.badge}
              </span>
            )}
            
            {/* 图标 */}
            <div className="text-3xl mb-2">{item.icon}</div>
            
            {/* 标题 */}
            <div className="font-bold text-lg">{item.title}</div>
            
            {/* 描述 */}
            <div className="text-sm text-white/80">{item.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
