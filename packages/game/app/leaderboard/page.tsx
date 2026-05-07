'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  avatar: string
  score: number
  wins: number
  losses: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* 头部 */}
      <header className="p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">🏆 排行榜</h1>
        </div>
      </header>

      {/* 榜单 */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="text-center py-10">加载中...</div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  player.rank <= 3
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'
                    : 'bg-white/10'
                }`}
              >
                {/* 排名 */}
                <div className={`w-10 text-center font-bold text-xl ${
                  player.rank === 1 ? 'text-yellow-400' :
                  player.rank === 2 ? 'text-gray-300' :
                  player.rank === 3 ? 'text-orange-400' :
                  'text-white/60'
                }`}>
                  {player.rank <= 3 ? (
                    <span>{player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}</span>
                  ) : (
                    `#${player.rank}`
                  )}
                </div>
                
                {/* 头像 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  player.rank === 1
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                    : player.rank === 2
                    ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                    : player.rank === 3
                    ? 'bg-gradient-to-br from-orange-500 to-red-500'
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  {player.avatar}
                </div>
                
                {/* 信息 */}
                <div className="flex-1">
                  <div className="font-bold">{player.name}</div>
                  <div className="text-sm text-white/60">
                    {player.wins}胜 {player.losses}负
                  </div>
                </div>
                
                {/* 分数 */}
                <div className="text-right">
                  <div className="text-xl font-bold text-cyan-400">{player.score}</div>
                  <div className="text-xs text-white/40">积分</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
