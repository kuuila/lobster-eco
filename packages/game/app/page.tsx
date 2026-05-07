'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [playerScore] = useState(0)
  const [playerLevel] = useState(1)

  return (
    <main style={containerStyle}>
      <div style={gameContainerStyle}>
        {/* 头部 */}
        <header style={headerStyle}>
          <div style={logoStyle}>
            <span style={logoIconStyle}>🦞</span>
            龙虾对决
          </div>
          <div style={headerActionsStyle}>
            <button style={iconBtnStyle}>📜</button>
          </div>
        </header>

        {/* 龙虾信息栏 */}
        <div style={lobsterBarStyle}>
          <div style={lobsterInfoStyle}>
            <div style={lobsterAvatarStyle}>🦞</div>
            <div style={lobsterStatsStyle}>
              <div style={lobsterNameStyle}>我的龙虾</div>
              <div style={lobsterRankStyle}>Lv.{playerLevel} · 深海新秀</div>
            </div>
          </div>
          <div style={lobsterScoreStyle}>
            <div style={scoreLabelStyle}>珍珠</div>
            <div style={scoreValueStyle}>{playerScore}</div>
          </div>
        </div>

        {/* 主内容 */}
        <div style={menuScreenStyle}>
          {/* 标题 */}
          <div style={menuHeaderStyle}>
            <div style={menuTitleStyle}>🦞 龙虾对决 v4.2</div>
            <div style={menuSubtitleStyle}>深海争霸 · 弱肉强食</div>
          </div>

          {/* 主按钮 */}
          <Link href="/battle/pve" style={primaryBtnStyle}>
            ⚔️ 开始争霸
          </Link>

          {/* 每日挑战 */}
          <div style={challengesStyle}>
            <div style={challengesHeaderStyle}>
              <div style={challengesTitleStyle}>🎯 每日挑战</div>
              <div style={challengesProgressStyle}>0/4 完成</div>
            </div>
            {[
              { name: '赢得 1 场争霸', reward: 10, done: false },
              { name: '赢得 3 场争霸', reward: 30, done: false },
              { name: '完成 5 轮对战', reward: 15, done: false },
              { name: '击败敌人 3 次', reward: 20, done: false },
            ].map((task, i) => (
              <div key={i} style={challengeItemStyle}>
                <div style={challengeInfoStyle}>
                  <div style={challengeNameStyle}>{task.name}</div>
                  <div style={challengeRewardStyle}>+{task.reward} 珍珠</div>
                </div>
                <div style={challengeStatusStyle(task.done)}>
                  {task.done ? '✓' : '进行中'}
                </div>
              </div>
            ))}
          </div>

          {/* 排行榜 */}
          <div style={leaderboardStyle}>
            <div style={leaderboardTitleStyle}>🏆 深海排行榜</div>
            {[
              { name: '深海霸主', score: 2580, icon: '🦈', isMe: false },
              { name: '赤红龙虾', score: 2340, icon: '🦞', isMe: false },
              { name: '蓝焰巨蟹', score: 2100, icon: '🦀', isMe: false },
              { name: '我的龙虾', score: playerScore, icon: '🦞', isMe: true },
            ].map((player, i) => (
              <div key={i} style={leaderboardItemStyle(player.isMe)}>
                <div style={rankStyle(i)}>{i + 1}</div>
                <div style={lbAvatarStyle}>{player.icon}</div>
                <div style={lbNameStyle}>{player.name}</div>
                <div style={lbScoreStyle}>{player.score}</div>
              </div>
            ))}
          </div>

          {/* 次要按钮 */}
          <Link href="/battle/pvp" style={secondaryBtnStyle}>
            ⚔️ PVP 真人对战
          </Link>
        </div>
      </div>
    </main>
  )
}

// 样式定义
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

const logoStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const logoIconStyle: React.CSSProperties = {
  fontSize: '22px',
}

const headerActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
}

const iconBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.06)',
  border: 'none',
  color: 'white',
  fontSize: '14px',
  cursor: 'pointer',
}

const lobsterBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(249, 115, 22, 0.15))',
  border: '1px solid rgba(220, 38, 38, 0.3)',
  borderRadius: '12px',
  padding: '8px 12px',
  marginBottom: '12px',
}

const lobsterInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const lobsterAvatarStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #dc2626, #f97316)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
}

const lobsterStatsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
}

const lobsterNameStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '14px',
}

const lobsterRankStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#fbbf24',
}

const lobsterScoreStyle: React.CSSProperties = {
  textAlign: 'right',
}

const scoreLabelStyle: React.CSSProperties = {
  fontSize: '9px',
  color: 'rgba(255,255,255,0.5)',
}

const scoreValueStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#fbbf24',
}

const menuScreenStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  flex: 1,
  overflowY: 'auto',
  paddingBottom: '20px',
}

const menuHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '24px 0 16px',
}

const menuTitleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '4px',
  textShadow: '0 2px 10px rgba(220, 38, 38, 0.5)',
}

const menuSubtitleStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '13px',
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '14px 20px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  background: 'linear-gradient(135deg, #dc2626, #f97316)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
  textDecoration: 'none',
}

const secondaryBtnStyle: React.CSSProperties = {
  padding: '14px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  background: 'rgba(255,255,255,0.06)',
  color: 'white',
  textDecoration: 'none',
}

const challengesStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '12px',
  padding: '12px',
  border: '1px solid rgba(255,255,255,0.05)',
}

const challengesHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
}

const challengesTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const challengesProgressStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(255,255,255,0.5)',
}

const challengeItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
}

const challengeInfoStyle: React.CSSProperties = {
  flex: 1,
}

const challengeNameStyle: React.CSSProperties = {
  fontSize: '12px',
}

const challengeRewardStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'rgba(255,255,255,0.5)',
  marginTop: '2px',
}

const challengeStatusStyle = (done: boolean): React.CSSProperties => ({
  fontSize: '11px',
  padding: '4px 10px',
  borderRadius: '12px',
  background: done ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.2))' : 'rgba(255, 255, 255, 0.08)',
  color: done ? '#10b981' : 'rgba(255,255,255,0.5)',
})

const leaderboardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '12px',
  padding: '12px',
  border: '1px solid rgba(255,255,255,0.05)',
}

const leaderboardTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const leaderboardItemStyle = (isMe: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  borderRadius: '8px',
  background: isMe ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(249, 115, 22, 0.1))' : 'rgba(255, 255, 255, 0.03)',
  border: isMe ? '1px solid rgba(220, 38, 38, 0.3)' : 'none',
  marginBottom: '6px',
})

const rankStyle = (i: number): React.CSSProperties => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : i === 2 ? 'linear-gradient(135deg, #d97706, #92400e)' : 'rgba(255,255,255,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 'bold',
})

const lbAvatarStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #dc2626, #f97316)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
}

const lbNameStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '12px',
}

const lbScoreStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fbbf24',
}