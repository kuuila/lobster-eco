// 副本系统数据

export interface Dungeon {
  id: string
  name: string
  description: string
  icon: string
  background: string
  type: 'timed' | 'survival' | 'boss' | 'challenge'
  
  // 限制
  dailyLimit: number
  requiredLevel: number
  
  // 奖励
  rewards: {
    pearls: number
    exp: number
    shells: number
  }
  
  // 特殊规则
  specialRules: string[]
  
  // 状态
  runs: number
  bestScore: number
  
  // 可用性
  available: boolean
  availableUntil?: Date
}

// ==================== 副本数据 ====================

export const DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_survival',
    name: '生存试炼',
    description: '连续战斗，看你能坚持多久',
    icon: '⚡',
    background: 'arena',
    type: 'survival',
    dailyLimit: 3,
    requiredLevel: 1,
    rewards: {
      pearls: 100,
      exp: 50,
      shells: 3,
    },
    specialRules: [
      'HP 不回复',
      '击败敌人获得少量回复',
      '每 5 波奖励增加',
    ],
    runs: 0,
    bestScore: 0,
    available: true,
  },
  {
    id: 'dungeon_timed',
    name: '限时挑战',
    description: '在时间内击败尽可能多的敌人',
    icon: '⏱️',
    background: 'arena',
    type: 'timed',
    dailyLimit: 3,
    requiredLevel: 3,
    rewards: {
      pearls: 150,
      exp: 80,
      shells: 5,
    },
    specialRules: [
      '限时 60 秒',
      '击杀数决定奖励',
      '连击加成分数',
    ],
    runs: 0,
    bestScore: 0,
    available: true,
  },
  {
    id: 'dungeon_boss',
    name: 'BOSS 巢穴',
    description: '挑战强大的 BOSS',
    icon: '👹',
    background: 'boss-lair',
    type: 'boss',
    dailyLimit: 2,
    requiredLevel: 5,
    rewards: {
      pearls: 300,
      exp: 150,
      shells: 10,
    },
    specialRules: [
      'BOSS HP 翻倍',
      'BOSS 有特殊技能',
      '首通额外奖励',
    ],
    runs: 0,
    bestScore: 0,
    available: true,
  },
  {
    id: 'dungeon_challenge',
    name: '极限挑战',
    description: '在极端条件下战斗',
    icon: '🔥',
    background: 'volcanic',
    type: 'challenge',
    dailyLimit: 1,
    requiredLevel: 7,
    rewards: {
      pearls: 500,
      exp: 250,
      shells: 15,
    },
    specialRules: [
      '起始只有 1 HP',
      '无法购买海草',
      '击败敌人恢复 1 HP',
      '死亡立即结束',
    ],
    runs: 0,
    bestScore: 0,
    available: true,
  },
  {
    id: 'dungeon_treasure',
    name: '宝藏洞穴',
    description: '大量珍珠等你来拿',
    icon: '💰',
    background: 'treasure-cave',
    type: 'challenge',
    dailyLimit: 2,
    requiredLevel: 4,
    rewards: {
      pearls: 500,
      exp: 100,
      shells: 5,
    },
    specialRules: [
      '敌人掉落珍珠翻倍',
      '无法使用掠夺',
      '敌人攻击力降低',
    ],
    runs: 0,
    bestScore: 0,
    available: true,
  },
  {
    id: 'dungeon_arena',
    name: '竞技场',
    description: '与 AI 高手对战',
    icon: '🏟️',
    background: 'arena',
    type: 'challenge',
    dailyLimit: 3,
    requiredLevel: 6,
    rewards: {
      pearls: 200,
      exp: 120,
      shells: 8,
    },
    specialRules: [
      'AI 难度大幅提升',
      'AI 会预判你的行动',
      '胜利获得额外奖励',
    ],
    runs: 0,
    bestScore: 0,
    available: true,
  },
]

// ==================== 限时副本 ====================

export const SPECIAL_DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_weekend',
    name: '周末狂欢',
    description: '周末限定，双倍奖励',
    icon: '🎉',
    background: 'festival',
    type: 'survival',
    dailyLimit: 5,
    requiredLevel: 1,
    rewards: {
      pearls: 200,
      exp: 100,
      shells: 10,
    },
    specialRules: [
      '周末限时开放',
      '奖励翻倍',
      '特殊道具掉落',
    ],
    runs: 0,
    bestScore: 0,
    available: false,
  },
  {
    id: 'dungeon_nightmare',
    name: '噩梦降临',
    description: '最强挑战，只有勇者敢来',
    icon: '💀',
    background: 'nightmare',
    type: 'boss',
    dailyLimit: 1,
    requiredLevel: 10,
    rewards: {
      pearls: 1000,
      exp: 500,
      shells: 30,
    },
    specialRules: [
      'BOSS HP 三倍',
      'BOSS 有多个阶段',
      '限时 3 分钟',
      '失败扣减奖励',
    ],
    runs: 0,
    bestScore: 0,
    available: false,
  },
]

// ==================== 副本工具函数 ====================

export function getDungeonById(id: string): Dungeon | undefined {
  return [...DUNGEONS, ...SPECIAL_DUNGEONS].find(d => d.id === id)
}

export function getAvailableDungeons(): Dungeon[] {
  return [...DUNGEONS, ...SPECIAL_DUNGEONS].filter(d => d.available)
}

export function getDungeonsByType(type: Dungeon['type']): Dungeon[] {
  return DUNGEONS.filter(d => d.type === type)
}

export function canEnterDungeon(dungeon: Dungeon, playerLevel: number): boolean {
  return playerLevel >= dungeon.requiredLevel && 
         dungeon.available && 
         dungeon.runs < dungeon.dailyLimit
}

export function getDungeonTypeLabel(type: Dungeon['type']): string {
  const labels: Record<Dungeon['type'], string> = {
    timed: '⏱️ 限时',
    survival: '⚡ 生存',
    boss: '👹 BOSS',
    challenge: '🔥 挑战',
  }
  return labels[type]
}

export function getDungeonTypeColor(type: Dungeon['type']): string {
  const colors: Record<Dungeon['type'], string> = {
    timed: 'from-blue-500 to-cyan-500',
    survival: 'from-yellow-500 to-orange-500',
    boss: 'from-red-500 to-pink-500',
    challenge: 'from-purple-500 to-violet-500',
  }
  return colors[type]
}
