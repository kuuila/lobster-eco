import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'

// ==================== 类型定义 ====================

interface Player {
  id: string
  name: string
  avatar: string
  roomId: string | null
}

interface Room {
  id: string
  players: Player[]
  status: 'waiting' | 'playing' | 'finished'
  createdAt: Date
}

// ==================== Socket.io 服务端 ====================

let io: SocketIOServer | null = null
const rooms = new Map<string, Room>()
const playerRooms = new Map<string, string>()
const matchQueue: Player[] = []

export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Player connected: ${socket.id}`)

    // 玩家注册
    socket.on('register', (data: { name: string; avatar: string }) => {
      const player: Player = {
        id: socket.id,
        name: data.name,
        avatar: data.avatar,
        roomId: null,
      }
      socket.data.player = player
      console.log(`[Socket] Player registered: ${player.name}`)
    })

    // 开始匹配
    socket.on('match:start', () => {
      const player = socket.data.player as Player | undefined
      if (!player) return

      console.log(`[Socket] Player matching: ${player.name}`)
      matchQueue.push(player)

      // 尝试匹配
      tryMatch(socket)
    })

    // 取消匹配
    socket.on('match:cancel', () => {
      const player = socket.data.player as Player | undefined
      if (!player) return

      const index = matchQueue.findIndex((p) => p.id === player.id)
      if (index !== -1) {
        matchQueue.splice(index, 1)
        console.log(`[Socket] Player cancelled match: ${player.name}`)
      }
    })

    // 战斗行动
    socket.on('battle:action', (data: { action: string }) => {
      const player = socket.data.player as Player | undefined
      if (!player || !player.roomId) return

      const room = rooms.get(player.roomId)
      if (!room || room.status !== 'playing') return

      // 转发给对手
      const opponent = room.players.find((p) => p.id !== player.id)
      if (opponent) {
        io?.to(opponent.id).emit('battle:opponent_action', {
          action: data.action,
          playerId: player.id,
        })
      }
    })

    // 断开连接
    socket.on('disconnect', () => {
      const player = socket.data.player as Player | undefined
      if (!player) return

      // 从匹配队列移除
      const index = matchQueue.findIndex((p) => p.id === player.id)
      if (index !== -1) {
        matchQueue.splice(index, 1)
      }

      // 离开房间
      if (player.roomId) {
        leaveRoom(socket, player.roomId)
      }

      console.log(`[Socket] Player disconnected: ${player.name}`)
    })
  })

  return io
}

// 尝试匹配
function tryMatch(socket: Socket) {
  if (matchQueue.length < 2) return

  const player1 = matchQueue.shift()!
  const player2 = matchQueue.shift()!

  // 创建房间
  const room: Room = {
    id: `room-${Date.now()}`,
    players: [player1, player2],
    status: 'playing',
    createdAt: new Date(),
  }

  rooms.set(room.id, room)
  player1.roomId = room.id
  player2.roomId = room.id

  // 加入房间
  const socket1 = io?.sockets.sockets.get(player1.id)
  const socket2 = io?.sockets.sockets.get(player2.id)
  
  if (socket1) {
    socket1.join(room.id)
    socket1.emit('match:found', {
      roomId: room.id,
      opponent: { id: player2.id, name: player2.name, avatar: player2.avatar },
    })
  }
  
  if (socket2) {
    socket2.join(room.id)
    socket2.emit('match:found', {
      roomId: room.id,
      opponent: { id: player1.id, name: player1.name, avatar: player1.avatar },
    })
  }

  console.log(`[Socket] Match created: ${room.id}`)
  
  // 通知双方战斗开始
  setTimeout(() => {
    io?.to(room.id).emit('battle:start', {
      roomId: room.id,
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
      })),
    })
  }, 1000)
}

// 离开房间
function leaveRoom(socket: Socket, roomId: string) {
  const room = rooms.get(roomId)
  if (!room) return

  const player = socket.data.player as Player | undefined
  if (!player) return

  // 通知对手
  const opponent = room.players.find((p) => p.id !== player.id)
  if (opponent) {
    io?.to(opponent.id).emit('battle:opponent_left', {
      playerId: player.id,
    })
  }

  // 删除房间
  rooms.delete(roomId)
  socket.leave(roomId)
  player.roomId = null
}

// 获取 io 实例
export function getIO(): SocketIOServer | null {
  return io
}

// 导出房间数据（用于调试）
export function getRooms() {
  return Object.fromEntries(rooms.entries())
}

export function getMatchQueue() {
  return [...matchQueue]
}
