// 游戏核心逻辑 - 战斗引擎

// ==================== 类型定义 ====================

export interface Fighter {
  id: string
  name: string
  avatar: string
  hp: number
  maxHp: number
  power: number // 气泡能量
  coins: number // 珍珠
  knives: number // 小钳
  guns: number // 大钳
  potions: number // 海草
  hasShield: boolean
  isDodging: boolean
  isCountering: boolean
}

export interface BattleState {
  round: number
  phase: 'select' | 'resolve' | 'result' // 选择阶段/结算阶段/结果阶段
  player: Fighter
  opponent: Fighter
  playerAction: Action | null
  opponentAction: Action | null
  playerWins: number
  opponentWins: number
  logs: LogEntry[]
  winner: 'player' | 'opponent' | null
}

export interface Action {
  type: ActionType
  actor: 'player' | 'opponent'
}

export type ActionType = 
  | 'earn' // 采集珍珠
  | 'buyKnife' // 获取小钳
  | 'buyGun' // 获取大钳
  | 'buyPotion' // 获取海草
  | 'useKnife' // 小钳攻击
  | 'useGun' // 大钳攻击
  | 'steal1' // 小掠夺
  | 'steal2' // 大掠夺
  | 'defend' // 硬壳防御
  | 'dodge' // 闪避
  | 'counter' // 反击

export interface LogEntry {
  id: string
  text: string
  type: 'info' | 'damage' | 'heal' | 'shield' | 'win' | 'lose'
  timestamp: number
}

// ==================== 行动配置 ====================

export interface ActionConfig {
  name: string
  icon: string
  description: string
  cost?: { type: 'coins' | 'power' | 'knives' | 'guns'; amount: number }
  gain?: { type: 'coins' | 'power' | 'knives' | 'guns' | 'potions'; amount: number }
  category: 'gather' | 'attack' | 'steal' | 'defense'
}

export const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  earn: {
    name: '采集珍珠',
    icon: '💎',
    description: '珍珠 +1',
    gain: { type: 'coins', amount: 1 },
    category: 'gather',
  },
  buyKnife: {
    name: '获取小钳',
    icon: '🦠',
    description: '珍珠 -1，小钳 +1',
    cost: { type: 'coins', amount: 1 },
    gain: { type: 'knives', amount: 1 },
    category: 'gather',
  },
  buyGun: {
    name: '获取大钳',
    icon: '🐙',
    description: '珍珠 -2，大钳 +1',
    cost: { type: 'coins', amount: 2 },
    gain: { type: 'guns', amount: 1 },
    category: 'gather',
  },
  buyPotion: {
    name: '获取海草',
    icon: '🌿',
    description: '珍珠 -3，海草 +1',
    cost: { type: 'coins', amount: 3 },
    gain: { type: 'potions', amount: 1 },
    category: 'gather',
  },
  useKnife: {
    name: '小钳攻击',
    icon: '⚔️',
    description: '造成 1 点伤害，+3 气泡',
    cost: { type: 'knives', amount: 1 },
    gain: { type: 'power', amount: 3 },
    category: 'attack',
  },
  useGun: {
    name: '大钳攻击',
    icon: '🎯',
    description: '造成 2 点伤害，破甲，+5 气泡',
    cost: { type: 'guns', amount: 1 },
    gain: { type: 'power', amount: 5 },
    category: 'attack',
  },
  steal1: {
    name: '小掠夺',
    icon: '🦐',
    description: '掠夺对方 1 个资源',
    cost: { type: 'power', amount: 3 },
    category: 'steal',
  },
  steal2: {
    name: '大掠夺',
    icon: '🦀',
    description: '掠夺对方 2 个资源',
    cost: { type: 'power', amount: 5 },
    category: 'steal',
  },
  defend: {
    name: '硬壳防御',
    icon: '🛡️',
    description: '抵挡攻击，+1 气泡',
    gain: { type: 'power', amount: 1 },
    category: 'defense',
  },
  dodge: {
    name: '闪避',
    icon: '💨',
    description: '30% 闪避攻击',
    cost: { type: 'power', amount: 1 },
    category: 'defense',
  },
  counter: {
    name: '反击',
    icon: '⚡',
    description: '受击时反击 1 伤害',
    cost: { type: 'power', amount: 2 },
    category: 'defense',
  },
}

// ==================== 战斗引擎 ====================

export class BattleEngine {
  private state: BattleState
  private onStateChange?: (state: BattleState) => void

  constructor(player: Fighter, opponent: Fighter, onStateChange?: (state: BattleState) => void) {
    this.state = {
      round: 1,
      phase: 'select',
      player: { ...player },
      opponent: { ...opponent },
      playerAction: null,
      opponentAction: null,
      playerWins: 0,
      opponentWins: 0,
      logs: [],
      winner: null,
    }
    this.onStateChange = onStateChange
    this.addLog('⚔️ 战斗开始！', 'info')
  }

  getState(): BattleState {
    return this.state
  }

  // 检查行动是否可行
  canPerformAction(fighter: Fighter, actionType: ActionType): boolean {
    const config = ACTION_CONFIG[actionType]
    
    if (!config.cost) return true
    
    const resource = fighter[config.cost.type as keyof Fighter]
    return typeof resource === 'number' && resource >= config.cost.amount
  }

  // 执行玩家行动选择
  selectPlayerAction(action: ActionType): boolean {
    if (this.state.phase !== 'select') return false
    if (!this.canPerformAction(this.state.player, action)) return false

    this.state.playerAction = { type: action, actor: 'player' }
    this.notifyChange()
    return true
  }

  // AI 选择行动
  selectAIAction(): ActionType {
    const ai = this.state.opponent
    const actions: ActionType[] = []

    // AI 策略
    if (ai.knives > 0 && this.canPerformAction(ai, 'useKnife')) actions.push('useKnife')
    if (ai.guns > 0 && this.canPerformAction(ai, 'useGun')) actions.push('useGun')
    if (ai.power >= 5 && this.canPerformAction(ai, 'steal2') && Math.random() > 0.5) actions.push('steal2')
    if (ai.power >= 3 && this.canPerformAction(ai, 'steal1') && Math.random() > 0.6) actions.push('steal1')
    if (ai.coins >= 2 && ai.guns < 2 && this.canPerformAction(ai, 'buyGun')) actions.push('buyGun')
    if (ai.coins >= 1 && ai.knives < 3 && this.canPerformAction(ai, 'buyKnife')) actions.push('buyKnife')
    if (ai.power >= 2 && this.canPerformAction(ai, 'counter') && Math.random() > 0.5) actions.push('counter')
    if (ai.power >= 1 && this.canPerformAction(ai, 'dodge') && Math.random() > 0.6) actions.push('dodge')
    if (ai.hp <= 1 || Math.random() > 0.7) actions.push('defend')
    actions.push('earn')

    // 随机选择
    return actions[Math.floor(Math.random() * actions.length)]
  }

  // 执行回合
  executeRound(): void {
    if (!this.state.playerAction) return

    // AI 选择行动
    const aiAction = this.selectAIAction()
    this.state.opponentAction = { type: aiAction, actor: 'opponent' }
    this.state.phase = 'resolve'

    // 执行双方行动
    this.executeAction(this.state.playerAction, this.state.opponentAction)
    this.executeAction(this.state.opponentAction, this.state.playerAction)

    // 结算
    this.resolveRound()
    this.notifyChange()
  }

  // 执行单个行动
  private executeAction(action: Action, opponentAction: Action): void {
    const actor = action.actor === 'player' ? this.state.player : this.state.opponent
    const target = action.actor === 'player' ? this.state.opponent : this.state.player
    const actorName = action.actor === 'player' ? '你' : '敌方'
    const targetName = action.actor === 'player' ? '敌方' : '你'

    const config = ACTION_CONFIG[action.type]

    // 扣除消耗
    if (config.cost) {
      const resource = config.cost.type as keyof Fighter
      actor[resource] = Math.max(0, (actor[resource] as number) - config.cost.amount)
    }

    // 获得资源
    if (config.gain) {
      const resource = config.gain.type as keyof Fighter
      actor[resource] = (actor[resource] as number) + config.gain.amount
    }

    // 执行行动效果
    switch (action.type) {
      case 'earn':
        this.addLog(`${actorName}采集了珍珠 💎+1`, 'info')
        break

      case 'buyKnife':
        this.addLog(`${actorName}获得了小钳 🦠+1`, 'info')
        break

      case 'buyGun':
        this.addLog(`${actorName}获得了大钳 🐙+1`, 'info')
        break

      case 'buyPotion':
        this.addLog(`${actorName}获得了海草 🌿+1`, 'info')
        break

      case 'useKnife':
        if (target.hasShield) {
          this.addLog(`🛡️ ${targetName}的硬壳挡住了小钳攻击！`, 'shield')
        } else if (target.isDodging && Math.random() < 0.3) {
          this.addLog(`💨 ${targetName}闪避了小钳攻击！`, 'info')
        } else {
          target.hp--
          this.addLog(`${actorName}的小钳造成 1 点伤害！`, 'damage')
          if (target.isCountering) {
            actor.hp--
            this.addLog(`⚡ ${targetName}反击造成 1 点伤害！`, 'damage')
          }
        }
        break

      case 'useGun':
        if (target.hasShield) {
          target.hasShield = false
          this.addLog(`💥 ${actorName}的大钳击碎了${targetName}的硬壳！`, 'shield')
        } else if (target.isDodging && Math.random() < 0.3) {
          this.addLog(`💨 ${targetName}闪避了大钳攻击！`, 'info')
        } else {
          target.hp -= 2
          this.addLog(`${actorName}的大钳造成 2 点伤害！`, 'damage')
          if (target.isCountering) {
            actor.hp--
            this.addLog(`⚡ ${targetName}反击造成 1 点伤害！`, 'damage')
          }
        }
        break

      case 'steal1':
      case 'steal2':
        const stealCount = action.type === 'steal1' ? 1 : 2
        this.executeSteal(actor, target, actorName, stealCount)
        break

      case 'defend':
        actor.hasShield = true
        this.addLog(`${actorName}进入防御状态`, 'shield')
        break

      case 'dodge':
        actor.isDodging = true
        this.addLog(`${actorName}准备闪避`, 'info')
        break

      case 'counter':
        actor.isCountering = true
        this.addLog(`${actorName}准备反击`, 'info')
        break
    }
  }

  // 执行掠夺
  private executeSteal(actor: Fighter, target: Fighter, actorName: string, count: number): void {
    const resources: (keyof Fighter)[] = ['coins', 'knives', 'guns', 'potions']
    let stolen = 0

    for (let i = 0; i < count; i++) {
      const available = resources.filter(r => (target[r] as number) > 0)
      if (available.length === 0) break

      const resource = available[Math.floor(Math.random() * available.length)]
      target[resource] = (target[resource] as number) - 1
      actor[resource] = (actor[resource] as number) + 1
      stolen++
    }

    this.addLog(`${actorName}掠夺了 ${stolen} 个资源！`, 'info')
  }

  // 结算回合
  private resolveRound(): void {
    // 检查海草复活
    if (this.state.player.hp <= 0 && this.state.player.potions > 0) {
      this.state.player.potions--
      this.state.player.hp = 1
      this.state.player.hasShield = true
      this.addLog('🌿 你海草恢复！', 'heal')
    }

    if (this.state.opponent.hp <= 0 && this.state.opponent.potions > 0) {
      this.state.opponent.potions--
      this.state.opponent.hp = 1
      this.state.opponent.hasShield = true
      this.addLog('🌿 敌方海草恢复！', 'heal')
    }

    // 检查胜负
    if (this.state.player.hp <= 0) {
      this.state.opponentWins++
      this.addLog(`💔 你输了这局！比分 ${this.state.playerWins}:${this.state.opponentWins}`, 'lose')
      
      if (this.state.opponentWins >= 2) {
        this.state.winner = 'opponent'
        this.addLog('😢 你输掉了比赛！', 'lose')
      }
    } else if (this.state.opponent.hp <= 0) {
      this.state.playerWins++
      this.addLog(`🏆 你赢了这局！比分 ${this.state.playerWins}:${this.state.opponentWins}`, 'win')
      
      if (this.state.playerWins >= 2) {
        this.state.winner = 'player'
        this.addLog('🎉 你赢得了比赛！', 'win')
      }
    }

    // 准备下一局
    if (!this.state.winner) {
      this.state.round++
      this.state.phase = 'select'
      this.state.playerAction = null
      this.state.opponentAction = null
      
      // 重置状态
      this.state.player.isDodging = false
      this.state.player.isCountering = false
      this.state.opponent.isDodging = false
      this.state.opponent.isCountering = false
      
      this.addLog(`--- 第 ${this.state.round} 局 ---`, 'info')
    }
  }

  // 添加日志
  private addLog(text: string, type: LogEntry['type']): void {
    this.state.logs.unshift({
      id: crypto.randomUUID(),
      text,
      type,
      timestamp: Date.now(),
    })
  }

  // 通知状态变化
  private notifyChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.state)
    }
  }

  // 开始新游戏
  newGame(): void {
    this.state = {
      round: 1,
      phase: 'select',
      player: {
        ...this.state.player,
        hp: 3,
        power: 0,
        coins: 2,
        knives: 0,
        guns: 0,
        potions: 0,
        hasShield: false,
        isDodging: false,
        isCountering: false,
      },
      opponent: {
        ...this.state.opponent,
        hp: 3,
        power: 0,
        coins: 2,
        knives: 0,
        guns: 0,
        potions: 0,
        hasShield: false,
        isDodging: false,
        isCountering: false,
      },
      playerAction: null,
      opponentAction: null,
      playerWins: 0,
      opponentWins: 0,
      logs: [],
      winner: null,
    }
    this.addLog('⚔️ 新的比赛开始！', 'info')
    this.notifyChange()
  }
}

// ==================== 工厂函数 ====================

export function createFighter(id: string, name: string, avatar: string): Fighter {
  return {
    id,
    name,
    avatar,
    hp: 3,
    maxHp: 3,
    power: 0,
    coins: 2,
    knives: 0,
    guns: 0,
    potions: 0,
    hasShield: false,
    isDodging: false,
    isCountering: false,
  }
}

export function createAIFighter(): Fighter {
  const names = ['深海霸主', '赤红龙虾', '蓝焰巨蟹', '幽灵虾王', '珊瑚守卫']
  const avatars = ['🦈', '🦞', '🦀', '🦐', '🐚']
  const idx = Math.floor(Math.random() * names.length)
  
  return {
    id: 'ai-' + crypto.randomUUID(),
    name: names[idx],
    avatar: avatars[idx],
    hp: 3,
    maxHp: 3,
    power: 0,
    coins: 2,
    knives: 0,
    guns: 0,
    potions: 0,
    hasShield: false,
    isDodging: false,
    isCountering: false,
  }
}
