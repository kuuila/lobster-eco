'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PVPPage() {
  const router = useRouter()
  const [isMatching, setIsMatching] = useState(false)
  const [matchTime, setMatchTime] = useState(0)

  // 开始匹配
  const startMatching = () => {
    setIsMatching(true)
    setMatchTime(0)
    
    // 模拟匹配
    const timer = setInterval(() => {
      setMatchTime(prev => prev + 1)
    }, 1000)

    // 随机 2-5 秒后匹配成功
    const matchDelay = 2000 + Math.random() * 3000
    setTimeout(() => {
      clearInterval(timer)
      setIsMatching(false)
      // 跳转到战斗房间
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
      router.push(`/battle/pvp/room?room=${roomId}`)
    }, matchDelay)
  }

  // 取消匹配
  const cancelMatch = () => {
    setIsMatching(false)
  }

  return (
    <main style={containerStyle}>
      <div style={gameContainerStyle}>
        {/* 头部 */}
        <header style={headerStyle}>
          <Link href="/" style={{ fontSize: '20px', textDecoration: 'none' }}>←</Link>
          <div style={{ fontWeight: 'bold' }}>🦞 PVP 对战</div>
          <div style={{ width: '32px' }}></div>
        </header>

        {/* 状态 */}
        <div style={contentStyle}>
          {!isMatching ? (
            <>
              {/* 匹配说明 */}
              <div style={cardStyle}>
                <div style={cardTitleStyle}>⚔️ 真人对战</div>
                <div style={cardDescStyle}>
                  匹配其他玩家进行实时对战<br/>
                  三局两胜，赢得珍珠奖励
                </div>
              </div>

              {/* 机器人对战 */}
              <div style={cardStyle}>
                <div style={cardTitleStyle}>🤖 练习模式</div>
                <div style={cardDescStyle}>
                  与 AI 机器人对战<br/>
                  适合熟悉游戏规则
                </div>
                <Link href="/battle/pve" style={btnStyle}>
                  开始练习
                </Link>
              </div>

              {/* 开始匹配按钮 */}
              <button onClick={startMatching} style={primaryBtnStyle}>
                ⚔️ 开始匹配
              </button>

              {/* 快速开始（测试用） */}
              <button onClick={() => router.push('/battle/pvp/room?room=TEST01')} style={secondaryBtnStyle}>
                ⚡ 快速开始（测试）
              </button>
            </>
          ) : (
            <>
              {/* 匹配中 */}
              <div style={matchingStyle}>
                <div style={matchingIconStyle}>🔍</div>
                <div style={matchingTitleStyle}>匹配中...</div>
                <div style={matchingTimeStyle}>{matchTime}秒</div>
                <div style={matchingDescStyle}>
                  正在寻找对手<br/>
                  请稍候
                </div>
              </div>

              {/* 取消按钮 */}
              <button onClick={cancelMatch} style={cancelBtnStyle}>
                取消匹配
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

const containerStyle: React.CSSProperties = {
  height: '100vh',
  background: 'linear-gradient(180deg, #0c1929 0%, #0f2942 50%, #1a3a5c 100%)',
  color: 'white',
  overflow: 'hidden',
}

const gameContainerStyle: React.CSSProperties = {
  height: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 10px 8px',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
}

const contentStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingTop: '20px',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(255,255,255,0.05)',
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '8px',
}

const cardDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.5)',
  lineHeight: '1.6',
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '14px 20px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #dc2626, #f97316)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
}

const secondaryBtnStyle: React.CSSProperties = {
  padding: '12px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '13px',
  fontWeight: 'bold',
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.7)',
}

const btnStyle: React.CSSProperties = {
  display: 'block',
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '13px',
  fontWeight: 'bold',
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center',
  marginTop: '12px',
}

const matchingStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
}

const matchingIconStyle: React.CSSProperties = {
  fontSize: '48px',
  animation: 'pulse 1s infinite',
}

const matchingTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
}

const matchingTimeStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#fbbf24',
}

const matchingDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.5)',
  textAlign: 'center',
  lineHeight: '1.6',
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '12px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  background: 'transparent',
  color: 'rgba(255,255,255,0.7)',
}