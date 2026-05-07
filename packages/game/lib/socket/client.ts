'use client'

import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

// ==================== 类型定义 ====================

interface Player {
  id: string
  name: string
  avatar: string
}

interface MatchFoundData {
  roomId: string
  opponent: Player
}

interface BattleStartData {
  roomId: string
  players: Player[]
}

// ==================== Hook ====================

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isMatching, setIsMatching] = useState(false)
  const [opponent, setOpponent] = useState<Player | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 初始化连接
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    const newSocket = io(socketUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      console.log('[Socket] Connected')
      setIsConnected(true)
      setError(null)
    })

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setIsConnected(false)
      setIsMatching(false)
    })

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err)
      setError('连接失败，请检查网络')
    })

    // 匹配成功
    newSocket.on('match:found', (data: MatchFoundData) => {
      console.log('[Socket] Match found:', data)
      setIsMatching(false)
      setRoomId(data.roomId)
      setOpponent(data.opponent)
    })

    // 战斗开始
    newSocket.on('battle:start', (data: BattleStartData) => {
      console.log('[Socket] Battle start:', data)
    })

    // 对手离开
    newSocket.on('battle:opponent_left', () => {
      console.log('[Socket] Opponent left')
      setOpponent(null)
      setRoomId(null)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // 注册玩家
  const register = useCallback((name: string, avatar: string) => {
    if (!socket) return
    socket.connect()
    socket.emit('register', { name, avatar })
  }, [socket])

  // 开始匹配
  const startMatch = useCallback(() => {
    if (!socket || !isConnected) return
    setIsMatching(true)
    setOpponent(null)
    setRoomId(null)
    socket.emit('match:start')
  }, [socket, isConnected])

  // 取消匹配
  const cancelMatch = useCallback(() => {
    if (!socket || !isConnected) return
    setIsMatching(false)
    socket.emit('match:cancel')
  }, [socket, isConnected])

  // 发送战斗行动
  const sendAction = useCallback((action: string) => {
    if (!socket || !roomId) return
    socket.emit('battle:action', { action, roomId })
  }, [socket, roomId])

  // 监听对手行动
  const onOpponentAction = useCallback((callback: (action: string) => void) => {
    if (!socket) return
    
    socket.on('battle:opponent_action', (data: { action: string }) => {
      callback(data.action)
    })
  }, [socket])

  return {
    // 状态
    socket,
    isConnected,
    isMatching,
    opponent,
    roomId,
    error,
    
    // 方法
    register,
    startMatch,
    cancelMatch,
    sendAction,
    onOpponentAction,
  }
}
