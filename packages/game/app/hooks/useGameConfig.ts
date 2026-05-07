// 配置加载 Hook (简化版)

import { useState, useEffect } from 'react'

interface ConfigData {
  fighters?: Record<string, string>[]
  actions?: Record<string, string>[]
  tasks?: Record<string, string>[]
  stages?: Record<string, string>[]
  dungeons?: Record<string, string>[]
  skills?: Record<string, string>[]
}

// 全局配置缓存
let configCache: ConfigData = {}

// 获取配置
export function useGameConfig(type: 'fighters' | 'actions' | 'tasks' | 'stages' | 'dungeons' | 'skills') {
  const [data, setData] = useState<Record<string, string>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 使用缓存
    if (configCache && configCache[type]) {
      setData(configCache[type])
      setLoading(false)
      return
    }

    // 从API获取
    fetch(`/api/config?type=${type}`)
      .then(res => res.json())
      .then(result => {
        const items = result[type] || []
        configCache = { ...configCache, [type]: items }
        setData(items)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [type])

  // 按ID查找
  const getById = (id: string) => {
    return data.find(item => item.id === id) || null
  }

  return { data, loading, getById }
}

// 预加载所有配置
export async function preloadConfig(): Promise<ConfigData> {
  if (configCache) return configCache
  
  try {
    const res = await fetch('/api/config?type=all')
    const data = await res.json()
    configCache = data
    return data
  } catch {
    return {}
  }
}