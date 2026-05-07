'use client'

import { useGameStore } from '@/lib/store/game'

export function PlayerCard() {
  const player = useGameStore((state) => state.player)
  
  return (
    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
      {/* 头像 */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
        {player.avatar}
      </div>
      
      {/* 信息 */}
      <div className="flex-1">
        <div className="font-bold text-lg">{player.name}</div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span>Lv.{player.level}</span>
          <span className="text-yellow-400">⭐ {player.experience} XP</span>
        </div>
      </div>
      
      {/* 战绩 */}
      <div className="text-right text-sm">
        <div className="text-green-400">胜 {player.wins}</div>
        <div className="text-red-400">负 {player.losses}</div>
      </div>
    </div>
  )
}
