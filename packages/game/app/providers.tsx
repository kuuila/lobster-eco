'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/game'

export function Providers({ children }: { children: React.ReactNode }) {
  // 初始化游戏状态
  useEffect(() => {
    // 从 localStorage 恢复玩家数据
    useGameStore.getState().initPlayer()
  }, [])

  return <>{children}</>
}
