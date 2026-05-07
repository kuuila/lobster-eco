'use client'

import { useGameStore } from '@/lib/store/game'

export function ResourceBar() {
  const player = useGameStore((state) => state.player)
  
  return (
    <div className="flex gap-3 px-4 py-2 overflow-x-auto">
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/20 whitespace-nowrap">
        <span className="text-lg">💎</span>
        <span className="font-bold">{player.pearls}</span>
        <span className="text-white/60 text-sm">珍珠</span>
      </div>
      
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/20 whitespace-nowrap">
        <span className="text-lg">🐚</span>
        <span className="font-bold">{player.shells}</span>
        <span className="text-white/60 text-sm">贝壳</span>
      </div>
      
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/20 whitespace-nowrap">
        <span className="text-lg">⭐</span>
        <span className="font-bold">{player.experience}</span>
        <span className="text-white/60 text-sm">经验</span>
      </div>
    </div>
  )
}
