'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CHAPTERS, STAGES, Chapter, Stage, getStagesByChapter, getTotalStars, getMaxStars } from '@/lib/game/campaign'
import { useGameStore } from '@/lib/store/game'

export default function CampaignPage() {
  const [chapters, setChapters] = useState<Chapter[]>(CHAPTERS)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(CHAPTERS[0])
  const player = useGameStore((state) => state.player)

  // 获取章节的关卡
  const chapterStages = selectedChapter ? getStagesByChapter(selectedChapter.id) : []

  return (
    <main className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* 头部 */}
      <header className="p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">🎯 主线推图</h1>
        </div>
      </header>

      {/* 章节选择 */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {chapters.map((chapter) => {
            const stars = getTotalStars(chapter.id)
            const maxStars = getMaxStars(chapter.id)
            const isSelected = selectedChapter?.id === chapter.id
            const isUnlocked = chapter.unlocked

            return (
              <button
                key={chapter.id}
                onClick={() => isUnlocked && setSelectedChapter(chapter)}
                disabled={!isUnlocked}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : isUnlocked
                    ? 'bg-white/10'
                    : 'bg-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{chapter.number}</span>
                  <span className="font-bold">{chapter.name}</span>
                </div>
                <div className="text-xs text-white/60">
                  {isUnlocked ? `⭐ ${stars}/${maxStars}` : '🔒 未解锁'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 章节信息 */}
      {selectedChapter && (
        <div className="px-4 mb-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold">{selectedChapter.name}</h2>
                <p className="text-sm text-white/60">{selectedChapter.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">
                  ⭐ {getTotalStars(selectedChapter.id)}
                </div>
                <div className="text-xs text-white/40">
                  {getMaxStars(selectedChapter.id)} 总星
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 关卡列表 */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-3">
          {chapterStages.map((stage, index) => {
            const canPlay = player.level >= stage.requiredLevel

            return (
              <div
                key={stage.id}
                className={`bg-white/10 rounded-xl overflow-hidden ${
                  !canPlay ? 'opacity-50' : ''
                }`}
              >
                {/* 关卡头部 */}
                <div className="flex items-center gap-3 p-4">
                  {/* 序号 */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    stage.cleared
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                      : canPlay
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : 'bg-white/10'
                  }`}>
                    {stage.cleared ? '✓' : stage.number}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1">
                    <div className="font-bold">{stage.name}</div>
                    <div className="text-sm text-white/60">{stage.description}</div>
                  </div>

                  {/* BOSS 标记 */}
                  {stage.enemy.ai === 'boss' && (
                    <div className="px-2 py-1 bg-red-500/30 rounded-lg text-xs font-bold text-red-400">
                      BOSS
                    </div>
                  )}
                </div>

                {/* 敌人信息 */}
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                    <div className="text-3xl">{stage.enemy.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold">{stage.enemy.name}</div>
                      <div className="text-sm text-white/60">
                        ❤️ {stage.enemy.hp} | Lv.{stage.enemy.level}
                      </div>
                    </div>
                    
                    {/* 星级 */}
                    <div className="flex gap-1">
                      {[1, 2, 3].map((star) => (
                        <span
                          key={star}
                          className={star <= stage.stars ? 'text-yellow-400' : 'text-white/20'}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 奖励 & 条件 */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-3">
                      <span className="text-yellow-400">💎 {stage.firstClearReward.pearls}</span>
                      <span className="text-cyan-400">⭐ {stage.firstClearReward.exp}</span>
                      {stage.firstClearReward.shells && (
                        <span className="text-pink-400">🐚 {stage.firstClearReward.shells}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => canPlay && alert(`开始挑战 ${stage.name}！`)}
                      disabled={!canPlay}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        canPlay
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {canPlay ? (stage.cleared ? '再次挑战' : '开始挑战') : `需要 Lv.${stage.requiredLevel}`}
                    </button>
                  </div>

                  {/* 星级条件 */}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                    <span>⭐ {stage.starConditions.condition1}</span>
                    <span>|</span>
                    <span>⭐ {stage.starConditions.condition2}</span>
                    <span>|</span>
                    <span>⭐ {stage.starConditions.condition3}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
