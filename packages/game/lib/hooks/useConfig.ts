'use client'

import { useState, useEffect } from 'react'

// 配置数据类型
interface ConfigData {
  fighters?: Record<string, string>[]
  actions?: Record<string, string>[]
  tasks?: Record<string, string>[]
  stages?: Record<string, string>[]
  dungeons?: Record<string, string>[]
  skills?: Record<string, string>[]
}

// 获取配置数据
export function useConfig(type: string = 'all') {
  const [config, setConfig] = useState<ConfigData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/config?type=${type}`)
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [type])

  return { config, loading, error }
}

// 获取单个配置项
export function useConfigItem(type: string, id: string) {
  const [item, setItem] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/config?type=${type}`)
      .then(res => res.json())
      .then(data => {
        const items = data[type] || []
        const found = items.find((i: Record<string, string>) => i.id === id)
        setItem(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [type, id])

  return { item, loading }
}

// 获取筛选后的配置列表
export function useConfigFilter(type: string, field: string, value: string) {
  const [items, setItems] = useState<Record<string, string>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/config?type=${type}`)
      .then(res => res.json())
      .then(data => {
        const allItems = data[type] || []
        const filtered = allItems.filter((i: Record<string, string>) => i[field] === value)
        setItems(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [type, field, value])

  return { items, loading }
}
