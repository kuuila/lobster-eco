'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DUNGEONS, SPECIAL_DUNGEONS, Dungeon, getDungeonTypeLabel, getDungeonTypeColor, canEnterDungeon } from '@/lib/game/dungeons'
import { useGameStore } from '@/lib/store/game'

export default function DungeonPage() {
  const player = useGameStore((state) => state.player)
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null)

  const allDungeons = [...DUNGEONS, ...SPECIAL_DUNGEONS]

  const handleEnter = (dungeon: Dungeon) => {
    if (!canEnterDungeon(dungeon, player.level)) {
      alert('无法进入：等级不足或次数已用完')
      return
    }
    
    alert(`进入副本：${dungeon.name}！`)
  }

  return (
    <main className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* 头部 */}
      <header className="p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">🏰 副本挑战</h1>
        </div>
      </header>

      {/* 副本类型筛选 */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'survival', 'timed', 'boss', 'challenge'].map((type) => (
            <button
              key={type}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-sm whitespace-nowrap"
            >
              {type === 'all' ? '全部' : getDungeonTypeLabel(type as Dungeon['type'])}
            </button>
          ))}
        </div>
      </div>

      {/* 副本列表 */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-4">
          {/* 常规副本 */}
          <div>
            <h2 className="text-lg font-bold mb-3">⚔️ 常规副本</h2>
            <div className="grid grid-cols-2 gap-3">
              {DUNGEONS.map((dungeon) => {
                const canEnter = canEnterDungeon(dungeon, player.level)

                return (
                  <button
                    key={dungeon.id}
                    onClick={() => setSelectedDungeon(dungeon)}
                    disabled={!dungeon.available}
                    className={`text-left rounded-xl overflow-hidden transition-all ${
                      dungeon.available
                        ? canEnter
                          ? 'active:scale-95'
                          : 'opacity-60'
                        : 'opacity-30'
                    }`}
                  >
                    <div className={`p-4 bg-gradient-to-br ${getDungeonTypeColor(dungeon.type)}`}>
                      <div className="text-3xl mb-2">{dungeon.icon}</div>
                      <div className="font-bold">{dungeon.name}</div>
                      <div className="text-xs text-white/80">{getDungeonTypeLabel(dungeon.type)}</div>
                    </div>
                    
                    <div className="bg-white/10 p-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>今日次数</span>
                        <span className={dungeon.runs >= dungeon.dailyLimit ? 'text-red-400' : 'text-green-400'}>
                          {dungeon.runs}/{dungeon.dailyLimit}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>要求等级</span>
                        <span className={player.level >= dungeon.requiredLevel ? 'text-green-400' : 'text-red-400'}>
                          Lv.{dungeon.requiredLevel}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 限时副本 */}
          <div>
            <h2 className="text-lg font-bold mb-3">🎉 限时副本</h2>
            <div className="grid grid-cols-2 gap-3">
              {SPECIAL_DUNGEONS.map((dungeon) => (
                <button
                  key={dungeon.id}
                  className={`text-left rounded-xl overflow-hidden ${
                    dungeon.available ? '' : 'opacity-50'
                  }`}
                  onClick={() => setSelectedDungeon(dungeon)}
                >
                  <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500">
                    <div className="text-3xl mb-2">{dungeon.icon}</div>
                    <div className="font-bold">{dungeon.name}</div>
                    <div className="text-xs text-white/80">
                      {dungeon.available ? '限时开放' : '未开放'}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 p-3">
                    <div className="text-xs text-white/60">
                      {dungeon.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 副本详情弹窗 */}
      {selectedDungeon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-sm w-full overflow-hidden">
            {/* 头部 */}
            <div className={`p-6 bg-gradient-to-br ${getDungeonTypeColor(selectedDungeon.type)}`}>
              <div className="text-5xl mb-3">{selectedDungeon.icon}</div>
              <div className="text-2xl font-bold">{selectedDungeon.name}</div>
              <div className="text-white/80">{selectedDungeon.description}</div>
            </div>

            {/* 内容 */}
            <div className="p-4 space-y-4">
              {/* 限制信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/60 mb-1">今日次数</div>
                  <div className="text-xl font-bold">
                    <span className={selectedDungeon.runs >= selectedDungeon.dailyLimit ? 'text-red-400' : 'text-green-400'}>
                      {selectedDungeon.runs}
                    </span>
                    /{selectedDungeon.dailyLimit}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/60 mb-1">要求等级</div>
                  <div className="text-xl font-bold">
                    Lv.{selectedDungeon.requiredLevel}
                  </div>
                </div>
              </div>

              {/* 特殊规则 */}
              <div>
                <div className="text-sm font-bold mb-2">📋 特殊规则</div>
                <ul className="space-y-1 text-sm text-white/70">
                  {selectedDungeon.specialRules.map((rule, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-yellow-400">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 奖励 */}
              <div>
                <div className="text-sm font-bold mb-2">🎁 通关奖励</div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-lg">
                    <span className="text-yellow-400">💎</span>
                    <span className="font-bold">{selectedDungeon.rewards.pearls}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-cyan-500/20 px-3 py-1 rounded-lg">
                    <span className="text-cyan-400">⭐</span>
                    <span className="font-bold">{selectedDungeon.rewards.exp}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-pink-500/20 px-3 py-1 rounded-lg">
                    <span className="text-pink-400">🐚</span>
                    <span className="font-bold">{selectedDungeon.rewards.shells}</span>
                  </div>
                </div>
              </div>

              {/* 最佳成绩 */}
              {selectedDungeon.bestScore > 0 && (
                <div className="text-center text-sm text-white/60">
                  最佳成绩：{selectedDungeon.bestScore} 分
                </div>
              )}

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDungeon(null)}
                  className="flex-1 py-3 rounded-xl bg-white/10 font-bold"
                >
                  返回
                </button>
                <button
                  onClick={() => handleEnter(selectedDungeon)}
                  disabled={!canEnterDungeon(selectedDungeon, player.level)}
                  className={`flex-1 py-3 rounded-xl font-bold ${
                    canEnterDungeon(selectedDungeon, player.level)
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  进入副本
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
