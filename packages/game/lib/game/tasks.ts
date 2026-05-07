// 任务系统数据

export interface Task {
  id: string
  type: 'daily' | 'main' | 'achievement'
  name: string
  description: string
  icon: string
  target: number
  reward: {
    pearls: number
    exp: number
    shells?: number
  }
  category?: string
}

// ==================== 每日任务 ====================

export const DAILY_TASKS: Task[] = [
  {
    id: 'daily_battle_1',
    type: 'daily',
    name: '初战告捷',
    description: '完成 1 场战斗',
    icon: '⚔️',
    target: 1,
    reward: { pearls: 20, exp: 10 },
    category: '战斗',
  },
  {
    id: 'daily_battle_3',
    type: 'daily',
    name: '战斗达人',
    description: '完成 3 场战斗',
    icon: '🏆',
    target: 3,
    reward: { pearls: 50, exp: 30 },
    category: '战斗',
  },
  {
    id: 'daily_win_1',
    type: 'daily',
    name: '胜利者',
    description: '赢得 1 场对战',
    icon: '🎉',
    target: 1,
    reward: { pearls: 30, exp: 20 },
    category: '战斗',
  },
  {
    id: 'daily_earn_10',
    type: 'daily',
    name: '采集达人',
    description: '采集 10 珍珠',
    icon: '💎',
    target: 10,
    reward: { pearls: 25, exp: 15 },
    category: '资源',
  },
  {
    id: 'daily_upgrade_1',
    type: 'daily',
    name: '强化武器',
    description: '购买 1 把武器',
    icon: '🛠️',
    target: 1,
    reward: { pearls: 15, exp: 10 },
    category: '养成',
  },
  {
    id: 'daily_use_potion',
    type: 'daily',
    name: '生命保障',
    description: '使用 1 次海草',
    icon: '🌿',
    target: 1,
    reward: { pearls: 10, exp: 5 },
    category: '道具',
  },
  {
    id: 'daily_steal_1',
    type: 'daily',
    name: '掠夺者',
    description: '成功掠夺 1 次',
    icon: '🦀',
    target: 1,
    reward: { pearls: 20, exp: 15 },
    category: '战斗',
  },
  {
    id: 'daily_login',
    type: 'daily',
    name: '每日登录',
    description: '每日签到',
    icon: '📅',
    target: 1,
    reward: { pearls: 50, exp: 20, shells: 1 },
    category: '福利',
  },
]

// ==================== 主线任务 ====================

export const MAIN_TASKS: Task[] = [
  {
    id: 'main_tutorial',
    type: 'main',
    name: '初入深海',
    description: '完成新手教程',
    icon: '📖',
    target: 1,
    reward: { pearls: 100, exp: 50 },
  },
  {
    id: 'main_battle_10',
    type: 'main',
    name: '身经百战',
    description: '累计完成 10 场战斗',
    icon: '⚔️',
    target: 10,
    reward: { pearls: 200, exp: 100 },
  },
  {
    id: 'main_battle_50',
    type: 'main',
    name: '战斗大师',
    description: '累计完成 50 场战斗',
    icon: '🎖️',
    target: 50,
    reward: { pearls: 500, exp: 300, shells: 5 },
  },
  {
    id: 'main_win_10',
    type: 'main',
    name: '常胜将军',
    description: '累计胜利 10 场',
    icon: '🏆',
    target: 10,
    reward: { pearls: 300, exp: 150 },
  },
  {
    id: 'main_win_50',
    type: 'main',
    name: '深海霸主',
    description: '累计胜利 50 场',
    icon: '👑',
    target: 50,
    reward: { pearls: 1000, exp: 500, shells: 10 },
  },
  {
    id: 'main_stage_5',
    type: 'main',
    name: '关卡先锋',
    description: '通关第 5 关',
    icon: '🎯',
    target: 5,
    reward: { pearls: 200, exp: 100 },
  },
  {
    id: 'main_stage_10',
    type: 'main',
    name: '关卡杀手',
    description: '通关第 10 关',
    icon: '💀',
    target: 10,
    reward: { pearls: 500, exp: 300 },
  },
  {
    id: 'main_stage_20',
    type: 'main',
    name: '推图王者',
    description: '通关第 20 关',
    icon: '👑',
    target: 20,
    reward: { pearls: 1000, exp: 500, shells: 10 },
  },
  {
    id: 'main_level_5',
    type: 'main',
    name: '等级提升',
    description: '达到 5 级',
    icon: '⬆️',
    target: 5,
    reward: { pearls: 150, exp: 100 },
  },
  {
    id: 'main_level_10',
    type: 'main',
    name: '资深玩家',
    description: '达到 10 级',
    icon: '⭐',
    target: 10,
    reward: { pearls: 300, exp: 200, shells: 3 },
  },
  {
    id: 'main_collect_1000',
    type: 'main',
    name: '收藏家',
    description: '累计获得 1000 珍珠',
    icon: '💰',
    target: 1000,
    reward: { pearls: 100, exp: 50 },
  },
  {
    id: 'main_dungeon_5',
    type: 'main',
    name: '副本猎人',
    description: '通关 5 次副本',
    icon: '🏰',
    target: 5,
    reward: { pearls: 300, exp: 200 },
  },
]

// ==================== 成就系统 ====================

export const ACHIEVEMENTS: Task[] = [
  {
    id: 'ach_first_battle',
    type: 'achievement',
    name: '初战',
    description: '完成第一场战斗',
    icon: '⚔️',
    target: 1,
    reward: { pearls: 50, exp: 30 },
  },
  {
    id: 'ach_first_win',
    type: 'achievement',
    name: '首胜',
    description: '获得第一场胜利',
    icon: '🎉',
    target: 1,
    reward: { pearls: 100, exp: 50 },
  },
  {
    id: 'ach_battle_100',
    type: 'achievement',
    name: '百战百胜',
    description: '累计完成 100 场战斗',
    icon: '💯',
    target: 100,
    reward: { pearls: 1000, exp: 500, shells: 10 },
  },
  {
    id: 'ach_win_streak_5',
    type: 'achievement',
    name: '五连胜',
    description: '连续获得 5 场胜利',
    icon: '🔥',
    target: 5,
    reward: { pearls: 300, exp: 200, shells: 3 },
  },
  {
    id: 'ach_win_streak_10',
    type: 'achievement',
    name: '十连胜',
    description: '连续获得 10 场胜利',
    icon: '⚡',
    target: 10,
    reward: { pearls: 800, exp: 400, shells: 8 },
  },
  {
    id: 'ach_no_damage',
    type: 'achievement',
    name: '无伤通关',
    description: '一局不失血获胜',
    icon: '🛡️',
    target: 1,
    reward: { pearls: 200, exp: 100 },
  },
  {
    id: 'ach_rich',
    type: 'achievement',
    name: '富甲一方',
    description: '持有 1000 珍珠',
    icon: '💰',
    target: 1000,
    reward: { pearls: 100, exp: 50 },
  },
  {
    id: 'ach_collector',
    type: 'achievement',
    name: '收藏大师',
    description: '拥有 10 把武器',
    icon: '🗃️',
    target: 10,
    reward: { pearls: 300, exp: 150 },
  },
  {
    id: 'ach_level_20',
    type: 'achievement',
    name: '二十级',
    description: '达到 20 级',
    icon: '👑',
    target: 20,
    reward: { pearls: 1000, exp: 500, shells: 20 },
  },
  {
    id: 'ach_pvp_master',
    type: 'achievement',
    name: 'PVP大师',
    description: 'PVP 获得 50 胜',
    icon: '🏆',
    target: 50,
    reward: { pearls: 2000, exp: 1000, shells: 30 },
  },
]

// ==================== 任务工具函数 ====================

export function getTasksByType(type: Task['type']): Task[] {
  switch (type) {
    case 'daily':
      return DAILY_TASKS
    case 'main':
      return MAIN_TASKS
    case 'achievement':
      return ACHIEVEMENTS
    default:
      return []
  }
}

export function getTaskById(id: string): Task | undefined {
  return [...DAILY_TASKS, ...MAIN_TASKS, ...ACHIEVEMENTS].find(t => t.id === id)
}

export function calculateTaskProgress(current: number, target: number): number {
  return Math.min(100, Math.floor((current / target) * 100))
}
