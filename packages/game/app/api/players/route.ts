import { NextRequest, NextResponse } from 'next/server'

// 模拟数据库
const players = new Map()

// 获取玩家信息
export async function GET(request: NextRequest) {
  const playerId = request.nextUrl.searchParams.get('id')
  
  if (!playerId) {
    return NextResponse.json({ error: 'Missing player id' }, { status: 400 })
  }
  
  const player = players.get(playerId)
  
  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }
  
  return NextResponse.json(player)
}

// 创建/更新玩家
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.id || !data.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const player = {
      id: data.id,
      name: data.name,
      avatar: data.avatar || '🦞',
      pearls: data.pearls || 100,
      shells: data.shells || 0,
      experience: data.experience || 0,
      level: data.level || 1,
      wins: data.wins || 0,
      losses: data.losses || 0,
      updatedAt: new Date().toISOString(),
    }
    
    players.set(player.id, player)
    
    return NextResponse.json(player)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
