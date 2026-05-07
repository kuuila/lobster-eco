import { NextResponse } from 'next/server'

// 健康检查
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'lobster-battle-api'
  })
}
