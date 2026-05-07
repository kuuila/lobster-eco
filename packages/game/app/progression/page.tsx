'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store/game'

interface Skill {
  id: string
  name: string
  icon: string
  description: string
  level: number
  maxLevel: number
  cost: number
  effect: string
}

const SKILLS: Skill[] = [
  {
    id: 'attack',
    name: '攻击强化',
    icon: '⚔️',
    description: '增加攻击伤害',
    level: 0,
    maxLevel: 5,
    cost: 1,
    effect: '每次升级 +5% 伤害',
  },
  {
    id: 'defense',
    name: '防御强化',
    icon: '🛡️',
    description: '增加防御效果',
    level: 0,
    maxLevel: 5,
    cost: 1,
    effect: '每次升级 +10% 防御',
  },
  {
    id: 'steal',
    name: '掠夺精通',
    icon: '🦀',
    description: '提升掠夺成功率',
    level: 0,
    maxLevel: 5,
    cost: 1,
    effect: '每次升级 +5% 成功率',
  },
  {
    id: 'dodge',
    name: '闪避大师',
    icon: '💨',
    description: '提升闪避概率',
    level: 0,
    maxLevel: 5,
    cost: 1,
    effect: '每次升级 +3% 闪避率',
  },
  {
    id: 'hp',
    name: '生命强化',
    icon: '❤️',
    description: '增加最大 HP',
    level: 0,
    maxLevel: 3,
    cost: 2,
    effect: '每次升级 +1 最大 HP',
  },
  {
    id: 'power',
    name: '能量积蓄',
    icon: '🫧',
    description: '增加初始气泡',
    level: 0,
    maxLevel: 3,
    cost: 2,
    effect: '每次升级 +1 初始气泡',
  },
]

export default function ProgressionPage() {
  const player = useGameStore((state) => state.player)
  const [skills, setSkills] = useState(SKILLS)
  const [activeTab, setActiveTab] = useState<'skills' | 'equipment' | 'avatar'>('skills')

  const handleUpgrade = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId)
    if (!skill) return
    if (skill.level >= skill.maxLevel) {
      alert('已达到最高等级！')
      return
    }

    // 检查技能点
    const totalUsed = skills.reduce((sum, s) => sum + s.level, 0)
    const availablePoints = player.level + 2 - totalUsed // 每级获得 1 点，初始 2 点
    
    if (availablePoints < skill.cost) {
      alert('技能点不足！')
      return
    }

    setSkills(skills.map(s => 
      s.id === skillId ? { ...s, level: s.level + 1 } : s
    ))
  }

  const totalUsedPoints = skills.reduce((sum, s) => sum + s.level, 0)
  const totalPoints = player.level + 2
  const availablePoints = totalPoints - totalUsedPoints

  return (
    <main className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* 头部 */}
      <header className="p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">🛠️ 龙虾养成</h1>
        </div>
      </header>

      {/* 玩家信息卡片 */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
              {player.avatar}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{player.name}</div>
              <div className="text-sm text-white/60">
                Lv.{player.level} · {player.experience} / {player.level * 100} XP
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: `${(player.experience % (player.level * 100)) / (player.level * 100) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-xl font-bold text-yellow-400">{player.pearls}</div>
              <div className="text-xs text-white/60">💎 珍珠</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-xl font-bold text-pink-400">{player.shells}</div>
              <div className="text-xs text-white/60">🐚 贝壳</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-xl font-bold text-green-400">{player.wins}</div>
              <div className="text-xs text-white/60">🏆 胜利</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-xl font-bold text-cyan-400">{availablePoints}</div>
              <div className="text-xs text-white/60">⭐ 技能点</div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {[
            { key: 'skills', label: '技能强化', icon: '⚡' },
            { key: 'equipment', label: '装备', icon: '🛡️' },
            { key: 'avatar', label: '外观', icon: '🎨' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 font-bold'
                  : 'bg-white/10'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 px-4 overflow-y-auto">
        {activeTab === 'skills' && (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{skill.name}</div>
                    <div className="text-sm text-white/60">{skill.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">
                      Lv.{skill.level}/{skill.maxLevel}
                    </div>
                    <div className="text-xs text-white/40">
                      消耗 {skill.cost} 点
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/60">{skill.effect}</div>
                  <button
                    onClick={() => handleUpgrade(skill.id)}
                    disabled={skill.level >= skill.maxLevel || availablePoints < skill.cost}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold ${
                      skill.level >= skill.maxLevel
                        ? 'bg-green-500/30 text-green-400'
                        : availablePoints >= skill.cost
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {skill.level >= skill.maxLevel ? '已满级' : '升级'}
                  </button>
                </div>

                {/* 等级进度 */}
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: skill.maxLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${
                        i < skill.level ? 'bg-yellow-500' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">🛡️</div>
            <div className="font-bold mb-2">装备系统</div>
            <div className="text-white/60">开发中...</div>
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">🎨</div>
            <div className="font-bold mb-2">外观系统</div>
            <div className="text-white/60">开发中...</div>
          </div>
        )}
      </div>
    </main>
  )
}
