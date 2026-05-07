'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 游戏状态
interface Fighter {
  hp: number
  maxHp: number
  power: number
  coins: number
  knives: number
  guns: number
  potions: number
  hasShield: boolean
  isDodging: boolean
  isCountering: boolean
}

interface BattleState {
  round: number
  playerWins: number
  opponentWins: number
  selectedAction: string | null
  logs: { text: string; type: string }[]
  winner: 'player' | 'opponent' | null
  isProcessing: boolean
}

const MAX_POWER = 10

// 行动配置
const ACTIONS = {
  gather: [
    { id: 'earn', icon: '💎', name: '采集珍珠', desc: '珍珠 +1', cost: null, costType: 'free' },
    { id: 'buyKnife', icon: '🦠', name: '获取小钳', desc: '造成 1 点伤害', cost: 1, costType: 'pearl' },
    { id: 'buyGun', icon: '🐙', name: '获取大钳', desc: '造成 2 点伤害 | 破甲', cost: 2, costType: 'pearl' },
    { id: 'buyPotion', icon: '🌿', name: '获取海草', desc: '濒死时自动恢复', cost: 3, costType: 'pearl' },
  ],
  attack: [
    { id: 'useKnife', icon: '🦠', name: '小钳攻击', desc: '1点伤害 | +3气泡', cost: 1, costType: 'knives' },
    { id: 'useGun', icon: '🐙', name: '大钳攻击', desc: '2点伤害 | +5气泡', cost: 1, costType: 'guns' },
  ],
  steal: [
    { id: 'steal1', icon: '🦐', name: '小掠夺', desc: '随机掠夺对方 1 个资源', cost: 3, costType: 'bubble' },
    { id: 'steal2', icon: '🦀', name: '大掠夺', desc: '随机掠夺对方 2 个资源', cost: 5, costType: 'bubble' },
  ],
  defense: [
    { id: 'defend', icon: '🛡️', name: '硬壳防御', desc: '抵挡攻击 | +1气泡', cost: null, costType: 'free' },
    { id: 'dodge', icon: '💨', name: '闪避', desc: '30%闪避攻击', cost: 1, costType: 'bubble' },
    { id: 'counter', icon: '⚡', name: '反击', desc: '受击时反击1伤害', cost: 2, costType: 'bubble' },
  ],
}

export default function PVEBattlePage() {
  const [player, setPlayer] = useState<Fighter>({
    hp: 3, maxHp: 3, power: 0, coins: 2, knives: 0, guns: 0, potions: 0,
    hasShield: false, isDodging: false, isCountering: false,
  })
  const [opponent, setOpponent] = useState<Fighter>({
    hp: 3, maxHp: 3, power: 0, coins: 2, knives: 0, guns: 0, potions: 0,
    hasShield: false, isDodging: false, isCountering: false,
  })
  const [battle, setBattle] = useState<BattleState>({
    round: 1, playerWins: 0, opponentWins: 0, selectedAction: null, logs: [], winner: null, isProcessing: false,
  })
  const [activeTab, setActiveTab] = useState<'gather' | 'attack' | 'steal' | 'defense'>('gather')
  const [autoBattle, setAutoBattle] = useState(false)
  const [showPopup, setShowPopup] = useState<{ text: string; type: string } | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)

  // 添加日志
  const addLog = (text: string, type: string = 'info') => {
    setBattle(prev => ({
      ...prev,
      logs: [{ text, type }, ...prev.logs.slice(0, 49)],
    }))
  }

  // 显示弹窗
  const popup = (text: string, type: string) => {
    setShowPopup({ text, type })
    setTimeout(() => setShowPopup(null), 1200)
  }

  // 检查行动是否可用
  const canAction = (actionId: string): boolean => {
    if (battle.isProcessing || battle.winner) return false
    switch (actionId) {
      case 'earn': case 'defend': return true
      case 'buyKnife': return player.coins >= 1
      case 'buyGun': return player.coins >= 2
      case 'buyPotion': return player.coins >= 3
      case 'useKnife': return player.knives >= 1
      case 'useGun': return player.guns >= 1
      case 'steal1': return player.power >= 3
      case 'steal2': return player.power >= 5
      case 'dodge': return player.power >= 1
      case 'counter': return player.power >= 2
      default: return false
    }
  }

  // AI 选择行动
  const getAIAction = (): string => {
    const actions: string[] = []
    if (opponent.knives > 0) actions.push('useKnife')
    if (opponent.guns > 0) actions.push('useGun')
    if (opponent.power >= 5 && Math.random() > 0.5) actions.push('steal2')
    if (opponent.power >= 3 && Math.random() > 0.6) actions.push('steal1')
    if (opponent.coins >= 2 && opponent.guns < 2) actions.push('buyGun')
    if (opponent.coins >= 1 && opponent.knives < 3) actions.push('buyKnife')
    if (opponent.hp <= 1 || Math.random() > 0.7) actions.push('defend')
    actions.push('earn')
    return actions[Math.floor(Math.random() * actions.length)]
  }

  // 执行行动
  const executeAction = (actor: Fighter, target: Fighter, actionId: string, isPlayer: boolean) => {
    let newActor = { ...actor }
    let newTarget = { ...target }
    const actorName = isPlayer ? '你' : '敌方'
    const targetName = isPlayer ? '敌方' : '你'
    let log = ''

    switch (actionId) {
      case 'earn':
        newActor.coins++
        newActor.power = Math.min(MAX_POWER, newActor.power + 1)
        log = `${actorName}采集了珍珠 💎+1`
        break
      case 'buyKnife':
        newActor.coins--
        newActor.knives++
        log = `${actorName}获得了小钳 🦠+1`
        break
      case 'buyGun':
        newActor.coins -= 2
        newActor.guns++
        log = `${actorName}获得了大钳 🐙+1`
        break
      case 'buyPotion':
        newActor.coins -= 3
        newActor.potions++
        log = `${actorName}获得了海草 🌿+1`
        break
      case 'useKnife':
        newActor.knives--
        newActor.power = Math.min(MAX_POWER, newActor.power + 3)
        if (newTarget.hasShield) {
          newTarget.hasShield = false
          log = `🛡️ ${targetName}的硬壳挡住了攻击！`
        } else if (newTarget.isDodging && Math.random() < 0.3) {
          log = `💨 ${targetName}闪避了攻击！`
        } else {
          newTarget.hp--
          log = `${actorName}的小钳造成 1 点伤害！`
          if (newTarget.isCountering) {
            newActor.hp--
            addLog(`⚡ ${targetName}反击造成 1 点伤害！`, 'lose')
          }
        }
        break
      case 'useGun':
        newActor.guns--
        newActor.power = Math.min(MAX_POWER, newActor.power + 5)
        if (newTarget.hasShield) {
          newTarget.hasShield = false
          log = `💥 ${actorName}的大钳击碎了${targetName}的硬壳！`
        } else if (newTarget.isDodging && Math.random() < 0.3) {
          log = `💨 ${targetName}闪避了攻击！`
        } else {
          newTarget.hp -= 2
          log = `${actorName}的大钳造成 2 点伤害！`
          if (newTarget.isCountering) {
            newActor.hp--
            addLog(`⚡ ${targetName}反击造成 1 点伤害！`, 'lose')
          }
        }
        break
      case 'steal1':
      case 'steal2':
        newActor.power -= actionId === 'steal1' ? 3 : 5
        const stealCount = actionId === 'steal1' ? 1 : 2
        let stolen = 0
        const resources = ['coins', 'knives', 'guns', 'potions'] as const
        for (let i = 0; i < stealCount; i++) {
          const available = resources.filter(r => (newTarget[r] as number) > 0)
          if (available.length === 0) break
          const resource = available[Math.floor(Math.random() * available.length)]
          ;(newTarget[resource] as number)--
          ;(newActor[resource] as number)++
          stolen++
        }
        log = `${actorName}掠夺了 ${stolen} 个资源！`
        break
      case 'defend':
        newActor.hasShield = true
        newActor.power = Math.min(MAX_POWER, newActor.power + 1)
        log = `${actorName}进入防御状态`
        break
      case 'dodge':
        newActor.power--
        newActor.isDodging = true
        log = `${actorName}准备闪避`
        break
      case 'counter':
        newActor.power -= 2
        newActor.isCountering = true
        log = `${actorName}准备反击`
        break
    }

    addLog(log, isPlayer ? 'info' : 'lose')
    return { newActor, newTarget }
  }

  // 检查胜负
  const checkWinner = (p: Fighter, o: Fighter, b: BattleState) => {
    // 海草复活
    if (p.hp <= 0 && p.potions > 0) {
      p.potions--
      p.hp = 1
      p.hasShield = true
      addLog('🌿 你海草恢复！', 'win')
    }
    if (o.hp <= 0 && o.potions > 0) {
      o.potions--
      o.hp = 1
      o.hasShield = true
      addLog('🌿 敌方海草恢复！', 'lose')
    }

    if (p.hp <= 0) {
      const newWins = b.opponentWins + 1
      addLog(`💔 你输了这局！比分 ${b.playerWins}:${newWins}`, 'lose')
      if (newWins >= 2) {
        return { winner: 'opponent' as const, playerWins: b.playerWins, opponentWins: newWins }
      }
      return { winner: null, playerWins: b.playerWins, opponentWins: newWins }
    }
    if (o.hp <= 0) {
      const newWins = b.playerWins + 1
      addLog(`🏆 你赢了这局！比分 ${newWins}:${b.opponentWins}`, 'win')
      if (newWins >= 2) {
        return { winner: 'player' as const, playerWins: newWins, opponentWins: b.opponentWins }
      }
      return { winner: null, playerWins: newWins, opponentWins: b.opponentWins }
    }
    return { winner: null, playerWins: b.playerWins, opponentWins: b.opponentWins }
  }

  // 执行回合（点击确认按钮后）
  const executeRound = () => {
    if (!battle.selectedAction || battle.isProcessing || battle.winner) return

    setBattle(prev => ({ ...prev, isProcessing: true }))

    // 重置状态
    let newPlayer = { ...player, isDodging: false, isCountering: false }
    let newOpponent = { ...opponent, isDodging: false, isCountering: false }

    // 玩家行动
    const playerResult = executeAction(newPlayer, newOpponent, battle.selectedAction, true)
    newPlayer = playerResult.newActor
    newOpponent = playerResult.newTarget

    // AI行动
    const aiAction = getAIAction()
    const aiResult = executeAction(newOpponent, newPlayer, aiAction, false)
    newOpponent = aiResult.newActor
    newPlayer = aiResult.newTarget

    // 检查胜负
    const result = checkWinner(newPlayer, newOpponent, battle)

    // 更新状态
    setPlayer(newPlayer)
    setOpponent(newOpponent)
    setBattle(prev => ({
      ...prev,
      selectedAction: null,
      isProcessing: false,
      playerWins: result.playerWins,
      opponentWins: result.opponentWins,
      winner: result.winner,
      round: result.winner ? prev.round : prev.round + 1,
    }))

    if (result.winner) {
      setTimeout(() => {
        popup(result.winner === 'player' ? '🎉 胜利！' : '😢 失败...', result.winner === 'player' ? 'success' : 'fail')
        setTimeout(() => setShowResult(true), 1200)
      }, 500)
    }
  }

  // 选择行动（只选中，不执行）
  const selectAction = (actionId: string) => {
    if (battle.isProcessing || battle.winner || !canAction(actionId)) return
    setBattle(prev => ({ ...prev, selectedAction: actionId }))
  }

  // 自动战斗 - 显示完整决策过程
  useEffect(() => {
    if (!autoBattle || battle.winner || battle.isProcessing || battle.selectedAction) return

    // 第一步：选择行动
    const allActions = [
      ...ACTIONS.gather.map(a => ({ ...a, tab: 'gather' as const })),
      ...ACTIONS.attack.map(a => ({ ...a, tab: 'attack' as const })),
      ...ACTIONS.steal.map(a => ({ ...a, tab: 'steal' as const })),
      ...ACTIONS.defense.map(a => ({ ...a, tab: 'defense' as const })),
    ]
    const available = allActions.filter(a => canAction(a.id))
    if (available.length === 0) return

    const action = available[Math.floor(Math.random() * available.length)]

    // 切换标签页
    setActiveTab(action.tab)

    // 延迟后选中行动（显示红框）
    const selectTimer = setTimeout(() => {
      selectAction(action.id)
    }, 400)

    return () => clearTimeout(selectTimer)
  }, [autoBattle, battle])

  // 自动战斗 - 点击确认执行
  useEffect(() => {
    if (!autoBattle || !battle.selectedAction || battle.isProcessing || battle.winner) return

    const executeTimer = setTimeout(() => {
      executeRound()
    }, 600)

    return () => clearTimeout(executeTimer)
  }, [autoBattle, battle.selectedAction])

  // 新游戏
  const newGame = () => {
    setPlayer({
      hp: 3, maxHp: 3, power: 0, coins: 2, knives: 0, guns: 0, potions: 0,
      hasShield: false, isDodging: false, isCountering: false,
    })
    setOpponent({
      hp: 3, maxHp: 3, power: 0, coins: 2, knives: 0, guns: 0, potions: 0,
      hasShield: false, isDodging: false, isCountering: false,
    })
    setBattle({
      round: 1, playerWins: 0, opponentWins: 0, selectedAction: null, logs: [], winner: null, isProcessing: false,
    })
    setShowResult(false)
    addLog('⚔️ 战斗开始！', 'info')
  }

  return (
    <main style={containerStyle}>
      <div style={gameContainerStyle}>
        {/* 头部 */}
        <header style={headerStyle}>
          <Link href="/" style={{ fontSize: '20px', textDecoration: 'none' }}>←</Link>
          <div style={{ fontWeight: 'bold' }}>🦞 龙虾对决 v4.2</div>
          <button onClick={() => setAutoBattle(!autoBattle)} style={iconBtnStyle}>
            {autoBattle ? '🤖' : '🎮'}
          </button>
        </header>

        {/* 回合信息 */}
        <div style={roundInfoStyle}>
          <div>
            <div style={roundLabelStyle}>第几轮</div>
            <div style={roundNumberStyle}>{battle.round}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={autoBattle ? { color: '#dc2626' } : { color: 'rgba(255,255,255,0.5)' }}>自动</span>
            <button onClick={() => setAutoBattle(!autoBattle)} style={autoSwitchStyle(autoBattle)}>
              <span style={autoSliderStyle(autoBattle)} />
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={roundLabelStyle}>胜负(三局两胜)</div>
            <div style={roundNumberStyle}>{battle.playerWins} : {battle.opponentWins}</div>
          </div>
        </div>

        {/* 战场 */}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: '70px' }}>
          {/* 敌人 */}
          <FighterCard fighter={opponent} name="敌方螃蟹" isOpponent />

          <div style={vsStyle}>⚔️ VS ⚔️</div>

          {/* 玩家 */}
          <FighterCard fighter={player} name="我的龙虾" />

          {/* 战斗日志 - 可点击弹出完整战报 */}
          <div style={logStyle} onClick={() => setShowLogModal(true)}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📜 战斗记录</span>
              <span style={{ fontSize: '8px', color: '#0ea5e9' }}>点击查看全部 ▼</span>
            </div>
            <div style={{ maxHeight: '35px', overflow: 'hidden' }}>
              {battle.logs.slice(0, 3).map((log, i) => (
                <div key={i} style={{
                  fontSize: '9px',
                  padding: '1px 0',
                  color: log.type === 'win' ? '#10b981' : log.type === 'lose' ? '#ef4444' : 'rgba(255,255,255,0.7)',
                }}>
                  {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* 行动面板 */}
          <div style={actionPanelStyle}>
            <div style={actionTabsStyle}>
              {(['gather', 'attack', 'steal', 'defense'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={actionTabStyle(activeTab === tab)}
                >
                  {tab === 'gather' ? '💎 收集' : tab === 'attack' ? '⚔️ 攻击' : tab === 'steal' ? '🦀 掠夺' : '🛡️ 防御'}
                </button>
              ))}
            </div>
            <div style={actionButtonsStyle}>
              {ACTIONS[activeTab].map(action => (
                <button
                  key={action.id}
                  onClick={() => selectAction(action.id)}
                  disabled={!canAction(action.id)}
                  style={actionBtnStyle(battle.selectedAction === action.id, canAction(action.id))}
                >
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{action.name}</div>
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)' }}>{action.desc}</div>
                  </div>
                  <div style={{
                    fontSize: '8px',
                    fontWeight: 'bold',
                    color: action.costType === 'free' ? '#10b981' : action.costType === 'pearl' ? '#fbbf24' : '#0ea5e9',
                  }}>
                    {action.costType === 'free' ? '免费' : `${action.costType === 'pearl' ? '💎' : action.costType === 'bubble' ? '🫧' : ''} -${action.cost}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 确认按钮 - 固定在底部 */}
        <button
          onClick={executeRound}
          disabled={!battle.selectedAction || battle.isProcessing || battle.winner}
          style={submitBtnStyle(!!battle.selectedAction && !battle.isProcessing)}
        >
          {battle.isProcessing ? '执行中...' : battle.selectedAction ? '确认出击' : '请选择行动'}
        </button>

        {/* 弹窗 */}
        {showPopup && (
          <div style={popupOverlayStyle}>
            <div style={popupTextStyle(showPopup.type)}>{showPopup.text}</div>
          </div>
        )}

        {/* 结果弹窗 */}
        {showResult && (
          <div style={resultOverlayStyle}>
            <div style={resultCardStyle}>
              <div style={{ fontSize: '56px', marginBottom: '10px' }}>
                {battle.winner === 'player' ? '🎉' : '😢'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>
                {battle.winner === 'player' ? '争霸胜利！' : '争霸失败...'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px', whiteSpace: 'pre-line' }}>
                {`比分 ${battle.playerWins} : ${battle.opponentWins}\n${battle.winner === 'player' ? '+20 珍珠' : '-10 珍珠'}`}
              </div>
              <button onClick={newGame} style={resultBtnStyle}>再来一局</button>
              <Link href="/" style={{ ...resultBtnStyle, background: 'rgba(255,255,255,0.1)', marginTop: '10px', display: 'block', textDecoration: 'none' }}>
                返回大厅
              </Link>
            </div>
          </div>
        )}

        {/* 战斗记录弹窗 */}
        {showLogModal && (
          <div style={logModalOverlayStyle} onClick={() => setShowLogModal(false)}>
            <div style={logModalStyle} onClick={(e) => e.stopPropagation()}>
              <div style={logModalHeaderStyle}>
                <span>📜 完整战报</span>
                <button onClick={() => setShowLogModal(false)} style={closeBtnStyle}>✕</button>
              </div>
              <div style={logModalContentStyle}>
                {battle.logs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '20px' }}>
                    暂无战斗记录
                  </div>
                ) : (
                  battle.logs.map((log, i) => (
                    <div key={i} style={{
                      ...logEntryStyle,
                      color: log.type === 'win' ? '#10b981' : log.type === 'lose' ? '#ef4444' : 'rgba(255,255,255,0.8)',
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: '8px' }}>{i + 1}.</span>
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// 战斗员卡片组件
function FighterCard({ fighter, name, isOpponent = false }: { fighter: Fighter; name: string; isOpponent?: boolean }) {
  return (
    <div style={fighterStyle}>
      <div style={fighterTopStyle}>
        <div style={fighterAvatarStyle(isOpponent)}>{isOpponent ? '🦀' : '🦞'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{name}</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
            💎 {fighter.coins} 🦠 {fighter.knives} 🐙 {fighter.guns} 🌿 {fighter.potions}
          </div>
        </div>
        {fighter.hasShield && <span style={{ fontSize: '16px' }}>🛡️</span>}
      </div>
      <div style={barStyle}>
        <span style={{ fontSize: '12px' }}>🦞</span>
        <div style={barTrackStyle}>
          <div style={barFillStyle((fighter.hp / fighter.maxHp) * 100, fighter.hp > fighter.maxHp / 2)} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 'bold', minWidth: '30px', textAlign: 'right' }}>
          {fighter.hp}/{fighter.maxHp}
        </span>
      </div>
      <div style={barStyle}>
        <span style={{ fontSize: '12px' }}>🫧</span>
        <div style={barTrackStyle}>
          <div style={{ ...barFillStyle((fighter.power / MAX_POWER) * 100, false), background: 'linear-gradient(90deg, #0ea5e9, #06b6d4)' }} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 'bold', minWidth: '30px', textAlign: 'right', color: '#0ea5e9' }}>
          {fighter.power}
        </span>
      </div>
    </div>
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

const roundInfoStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(249, 115, 22, 0.1))',
  border: '1px solid rgba(220, 38, 38, 0.2)',
  borderRadius: '8px',
  padding: '6px 10px',
  marginBottom: '4px',
}

const roundLabelStyle: React.CSSProperties = {
  fontSize: '9px',
  color: 'rgba(255,255,255,0.5)',
}

const roundNumberStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
}

const autoSwitchStyle = (active: boolean): React.CSSProperties => ({
  width: '44px',
  height: '24px',
  borderRadius: '12px',
  border: 'none',
  background: active ? 'linear-gradient(135deg, #dc2626, #f97316)' : '#374151',
  position: 'relative',
  cursor: 'pointer',
})

const autoSliderStyle = (active: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  background: 'white',
  transition: 'transform 0.3s',
  transform: active ? 'translateX(20px)' : 'translateX(0)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
})

const fighterStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '8px 10px',
  border: '1px solid rgba(255,255,255,0.05)',
  marginBottom: '4px',
}

const fighterTopStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '6px',
}

const fighterAvatarStyle = (isOpponent: boolean): React.CSSProperties => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: isOpponent ? 'linear-gradient(135deg, #dc2626, #f97316)' : 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  boxShadow: `0 2px 6px ${isOpponent ? 'rgba(220, 38, 38, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
})

const vsStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#dc2626',
  padding: '2px 0',
  textShadow: '0 0 10px rgba(220, 38, 38, 0.5)',
}

const barStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  marginBottom: '4px',
}

const barTrackStyle: React.CSSProperties = {
  flex: 1,
  height: '6px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
}

const barFillStyle = (width: number, healthy: boolean): React.CSSProperties => ({
  height: '100%',
  width: `${width}%`,
  background: healthy ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ef4444, #f97316)',
  transition: 'width 0.3s',
  borderRadius: '3px',
})

const logStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '8px',
  padding: '6px 8px',
  maxHeight: '45px',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.05)',
  marginBottom: '6px',
}

const actionPanelStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '8px',
  border: '1px solid rgba(255,255,255,0.05)',
}

const actionTabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '3px',
  marginBottom: '6px',
}

const actionTabStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '6px 3px',
  borderRadius: '6px',
  border: 'none',
  background: active ? 'linear-gradient(135deg, #dc2626, #f97316)' : 'rgba(255,255,255,0.05)',
  color: active ? 'white' : 'rgba(255,255,255,0.5)',
  fontSize: '9px',
  fontWeight: 'bold',
  cursor: 'pointer',
})

const actionButtonsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '4px',
}

const actionBtnStyle = (selected: boolean, enabled: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 8px',
  borderRadius: '6px',
  border: selected ? '2px solid #dc2626' : '2px solid transparent',
  background: selected ? 'rgba(220, 38, 38, 0.15)' : 'rgba(255,255,255,0.05)',
  color: 'white',
  fontSize: '10px',
  cursor: 'pointer',
  textAlign: 'left',
  opacity: enabled ? 1 : 0.35,
})

const submitBtnStyle = (canSubmit: boolean): React.CSSProperties => ({
  position: 'fixed',
  bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 32px)',
  maxWidth: '460px',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: canSubmit ? 'linear-gradient(135deg, #dc2626, #f97316)' : 'rgba(255,255,255,0.1)',
  color: canSubmit ? 'white' : 'rgba(255,255,255,0.4)',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: canSubmit ? 'pointer' : 'not-allowed',
  boxShadow: canSubmit ? '0 4px 20px rgba(220, 38, 38, 0.4)' : 'none',
  zIndex: 100,
})

const popupOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 300,
  backdropFilter: 'blur(4px)',
}

const popupTextStyle = (type: string): React.CSSProperties => ({
  fontSize: '44px',
  fontWeight: 'bold',
  textAlign: 'center',
  animation: 'popupAnim 1.2s ease-out forwards',
  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
  color: type === 'success' ? '#10b981' : '#ef4444',
})

const resultCardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #1a3a5c, #0f2942)',
  border: '2px solid rgba(220, 38, 38, 0.3)',
  borderRadius: '20px',
  padding: '28px',
  textAlign: 'center',
  maxWidth: '290px',
  width: '90%',
}

const resultBtnStyle: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #dc2626, #f97316)',
  color: 'white',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%',
}

const resultOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
}

const logModalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 250,
}

const logModalStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #1a3a5c, #0f2942)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  width: '90%',
  maxWidth: '400px',
  maxHeight: '70vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const logModalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  fontSize: '16px',
  fontWeight: 'bold',
}

const closeBtnStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const logModalContentStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '12px 16px',
}

const logEntryStyle: React.CSSProperties = {
  padding: '8px 0',
  fontSize: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  lineHeight: '1.5',
}