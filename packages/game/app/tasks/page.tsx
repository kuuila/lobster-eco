'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DAILY_TASKS, MAIN_TASKS, ACHIEVEMENTS, Task, calculateTaskProgress } from '@/lib/game/tasks'
import { useGameStore } from '@/lib/store/game'

type TaskTab = 'daily' | 'main' | 'achievement'

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<TaskTab>('daily')
  const [taskProgress, setTaskProgress] = useState<Record<string, number>>({})
  const player = useGameStore((state) => state.player)

  // 模拟任务进度
  useEffect(() => {
    const progress: Record<string, number> = {}
    DAILY_TASKS.forEach(t => progress[t.id] = Math.floor(Math.random() * t.target))
    MAIN_TASKS.forEach(t => progress[t.id] = Math.floor(Math.random() * t.target))
    ACHIEVEMENTS.forEach(t => progress[t.id] = Math.floor(Math.random() * t.target))
    
    // 登录任务默认完成
    progress['daily_login'] = 1
    
    setTaskProgress(progress)
  }, [])

  const getTasks = (): Task[] => {
    switch (activeTab) {
      case 'daily':
        return DAILY_TASKS
      case 'main':
        return MAIN_TASKS
      case 'achievement':
        return ACHIEVEMENTS
    }
  }

  const handleClaim = (taskId: string) => {
    const task = getTasks().find(t => t.id === taskId)
    if (!task) return

    // 模拟领取奖励
    alert(`领取奖励：💎 +${task.reward.pearls} ⭐ +${task.reward.exp}${task.reward.shells ? ` 🐚 +${task.reward.shells}` : ''}`)
  }

  const isTaskComplete = (task: Task): boolean => {
    return (taskProgress[task.id] || 0) >= task.target
  }

  const tabs: { key: TaskTab; label: string; icon: string }[] = [
    { key: 'daily', label: '每日任务', icon: '📅' },
    { key: 'main', label: '主线任务', icon: '🎯' },
    { key: 'achievement', label: '成就', icon: '🏆' },
  ]

  return (
    <main className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* 头部 */}
      <header className="p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">📋 任务中心</h1>
        </div>
      </header>

      {/* 标签切换 */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
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

      {/* 任务列表 */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-3">
          {getTasks().map((task) => {
            const progress = taskProgress[task.id] || 0
            const progressPercent = calculateTaskProgress(progress, task.target)
            const complete = isTaskComplete(task)

            return (
              <div
                key={task.id}
                className={`bg-white/10 rounded-xl p-4 ${complete ? 'ring-2 ring-yellow-500/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* 图标 */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    complete ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-white/10'
                  }`}>
                    {task.icon}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1">
                    <div className="font-bold mb-1">{task.name}</div>
                    <div className="text-sm text-white/60 mb-2">{task.description}</div>

                    {/* 进度条 */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{progress} / {task.target}</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            complete
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* 奖励 */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-400">💎 {task.reward.pearls}</span>
                      <span className="text-cyan-400">⭐ {task.reward.exp}</span>
                      {task.reward.shells && (
                        <span className="text-pink-400">🐚 {task.reward.shells}</span>
                      )}
                    </div>
                  </div>

                  {/* 按钮 */}
                  <button
                    onClick={() => handleClaim(task.id)}
                    disabled={!complete}
                    className={`px-4 py-2 rounded-lg font-bold text-sm ${
                      complete
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {complete ? '领取' : '进行中'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
