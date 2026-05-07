// 配置文件类型定义

// 战斗员配置
export interface FighterConfig {
  id: string
  name: string
  hp: number
  coins: number
  knives: number
  guns: number
  potions: number
  shield: boolean
  ai_difficulty: 'easy' | 'normal' | 'hard' | 'boss'
  description: string
}

// 行动配置
export interface ActionConfig {
  id: string
  name: string
  icon: string
  category: 'gather' | 'attack' | 'steal' | 'defense'
  cost_type: string
  cost_amount: number
  gain_type: string
  gain_amount: number
  damage: number
  description: string
}

// 任务配置
export interface TaskConfig {
  id: string
  type: 'daily' | 'main' | 'achievement'
  name: string
  icon: string
  description: string
  target: number
  reward_pearls: number
  reward_exp: number
  reward_shells: number
  category: string
}

// 关卡配置
export interface StageConfig {
  id: string
  chapter_id: string
  stage_number: number
  name: string
  enemy_name: string
  enemy_avatar: string
  enemy_hp: number
  enemy_level: number
  enemy_ai: string
  required_level: number
  first_clear_pearls: number
  first_clear_exp: number
  first_clear_shells: number
  star_condition_1: string
  star_condition_2: string
  star_condition_3: string
}

// 副本配置
export interface DungeonConfig {
  id: string
  name: string
  icon: string
  type: 'survival' | 'timed' | 'boss' | 'challenge'
  description: string
  daily_limit: number
  required_level: number
  reward_pearls: number
  reward_exp: number
  reward_shells: number
  special_rule_1: string
  special_rule_2: string
  special_rule_3: string
}

// 技能配置
export interface SkillConfig {
  id: string
  name: string
  icon: string
  description: string
  max_level: number
  cost_per_level: number
  effect_per_level: number
  effect_unit: string
}
