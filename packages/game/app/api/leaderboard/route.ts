import { NextResponse } from 'next/server'

// 模拟排行榜数据
const leaderboard = [
  { rank: 1, id: 'p1', name: '深海霸主', avatar: '🦈', score: 2580, wins: 156, losses: 23 },
  { rank: 2, id: 'p2', name: '赤红龙虾', avatar: '🦞', score: 2340, wins: 134, losses: 31 },
  { rank: 3, id: 'p3', name: '蓝焰巨蟹', avatar: '🦀', score: 2100, wins: 112, losses: 28 },
  { rank: 4, id: 'p4', name: '幽灵虾王', avatar: '🦐', score: 1890, wins: 98, losses: 35 },
  { rank: 5, id: 'p5', name: '珊瑚守卫', avatar: '🐚', score: 1650, wins: 87, losses: 42 },
  { rank: 6, id: 'p6', name: '暗影螃蟹', avatar: '🦀', score: 1520, wins: 76, losses: 38 },
  { rank: 7, id: 'p7', name: '冰霜龙虾', avatar: '🦞', score: 1380, wins: 65, losses: 44 },
  { rank: 8, id: 'p8', name: '雷霆虾王', avatar: '🦐', score: 1250, wins: 58, losses: 52 },
  { rank: 9, id: 'p9', name: '火焰霸主', avatar: '🦈', score: 1120, wins: 49, losses: 48 },
  { rank: 10, id: 'p10', name: '深海勇士', avatar: '🦞', score: 980, wins: 42, losses: 55 },
]

export async function GET() {
  return NextResponse.json({
    leaderboard,
    updatedAt: new Date().toISOString(),
  })
}
