// 推图系统数据

export interface Chapter {
  id: string
  number: number
  name: string
  description: string
  background: string
  stages: Stage[]
  unlocked: boolean
  stars: number // 0-3
}

export interface Stage {
  id: string
  number: number
  chapterId: string
  name: string
  description: string
  background: string
  
  // 敌人配置
  enemy: {
    name: string
    avatar: string
    hp: number
    level: number
    ai: 'easy' | 'normal' | 'hard' | 'boss'
  }
  
  // 解锁条件
  requiredLevel: number
  
  // 奖励
  firstClearReward: {
    pearls: number
    exp: number
    shells?: number
  }
  
  // 星级条件
  starConditions: {
    condition1: string
    condition2: string
    condition3: string
  }
  
  // 状态
  unlocked: boolean
  cleared: boolean
  stars: number // 0-3
}

// ==================== 章节数据 ====================

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter_1',
    number: 1,
    name: '浅海迷途',
    description: '新手区，探索浅海的奥秘',
    background: 'ocean-shallow',
    unlocked: true,
    stars: 0,
    stages: [],
  },
  {
    id: 'chapter_2',
    number: 2,
    name: '珊瑚丛林',
    description: '美丽的珊瑚中隐藏着危险',
    background: 'coral-forest',
    unlocked: false,
    stars: 0,
    stages: [],
  },
  {
    id: 'chapter_3',
    number: 3,
    name: '深海峡谷',
    description: '黑暗的深渊，强大的敌人',
    background: 'deep-canyon',
    unlocked: false,
    stars: 0,
    stages: [],
  },
  {
    id: 'chapter_4',
    number: 4,
    name: '火山海床',
    description: '炽热的海底火山区域',
    background: 'volcanic-bed',
    unlocked: false,
    stars: 0,
    stages: [],
  },
  {
    id: 'chapter_5',
    number: 5,
    name: '远古遗迹',
    description: '神秘的古代文明遗迹',
    background: 'ancient-ruins',
    unlocked: false,
    stars: 0,
    stages: [],
  },
]

// ==================== 关卡数据 ====================

export const STAGES: Stage[] = [
  // 第一章：浅海迷途
  {
    id: 'stage_1_1',
    number: 1,
    chapterId: 'chapter_1',
    name: '初次探险',
    description: '熟悉战斗的基础操作',
    background: 'ocean-shallow',
    enemy: {
      name: '小虾米',
      avatar: '🦐',
      hp: 2,
      level: 1,
      ai: 'easy',
    },
    requiredLevel: 1,
    firstClearReward: {
      pearls: 20,
      exp: 10,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '3 回合内结束',
    },
    unlocked: true,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_1_2',
    number: 2,
    chapterId: 'chapter_1',
    name: '深海巡逻',
    description: '巡逻的螃蟹，小心它的钳子',
    background: 'ocean-shallow',
    enemy: {
      name: '巡逻蟹',
      avatar: '🦀',
      hp: 2,
      level: 1,
      ai: 'easy',
    },
    requiredLevel: 1,
    firstClearReward: {
      pearls: 25,
      exp: 15,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '使用 3 次攻击',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_1_3',
    number: 3,
    chapterId: 'chapter_1',
    name: '龙虾先锋',
    description: '第一只龙虾敌人',
    background: 'ocean-shallow',
    enemy: {
      name: '龙虾先锋',
      avatar: '🦞',
      hp: 3,
      level: 2,
      ai: 'normal',
    },
    requiredLevel: 1,
    firstClearReward: {
      pearls: 30,
      exp: 20,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '不使用海草',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_1_4',
    number: 4,
    chapterId: 'chapter_1',
    name: '深海猎手',
    description: '熟练的猎手，攻击欲望强烈',
    background: 'ocean-shallow',
    enemy: {
      name: '猎手鲨',
      avatar: '🦈',
      hp: 3,
      level: 2,
      ai: 'normal',
    },
    requiredLevel: 2,
    firstClearReward: {
      pearls: 35,
      exp: 25,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 1 HP 以上',
      condition3: '5 回合内结束',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_1_5',
    number: 5,
    chapterId: 'chapter_1',
    name: '浅海霸主',
    description: '第一章 BOSS 战',
    background: 'ocean-shallow',
    enemy: {
      name: '浅海霸主',
      avatar: '👑',
      hp: 4,
      level: 3,
      ai: 'boss',
    },
    requiredLevel: 2,
    firstClearReward: {
      pearls: 100,
      exp: 50,
      shells: 2,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '无伤通关',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  
  // 第二章：珊瑚丛林
  {
    id: 'stage_2_1',
    number: 1,
    chapterId: 'chapter_2',
    name: '珊瑚卫士',
    description: '守护珊瑚的卫士',
    background: 'coral-forest',
    enemy: {
      name: '珊瑚卫',
      avatar: '🪸',
      hp: 3,
      level: 3,
      ai: 'normal',
    },
    requiredLevel: 3,
    firstClearReward: {
      pearls: 40,
      exp: 30,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '使用掠夺 2 次',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_2_2',
    number: 2,
    chapterId: 'chapter_2',
    name: '毒刺水母',
    description: '剧毒的水母，小心触手',
    background: 'coral-forest',
    enemy: {
      name: '毒水母',
      avatar: '🎐',
      hp: 3,
      level: 4,
      ai: 'normal',
    },
    requiredLevel: 3,
    firstClearReward: {
      pearls: 50,
      exp: 35,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '防御成功 2 次',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_2_3',
    number: 3,
    chapterId: 'chapter_2',
    name: '海龟将军',
    description: '坚硬的外壳，需要策略应对',
    background: 'coral-forest',
    enemy: {
      name: '龟将军',
      avatar: '🐢',
      hp: 5,
      level: 4,
      ai: 'hard',
    },
    requiredLevel: 4,
    firstClearReward: {
      pearls: 60,
      exp: 40,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '使用大钳击败',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_2_4',
    number: 4,
    chapterId: 'chapter_2',
    name: '珊瑚女王',
    description: '第二章 BOSS 战',
    background: 'coral-forest',
    enemy: {
      name: '珊瑚女王',
      avatar: '👸',
      hp: 5,
      level: 5,
      ai: 'boss',
    },
    requiredLevel: 5,
    firstClearReward: {
      pearls: 150,
      exp: 80,
      shells: 5,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '无伤通关',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  
  // 第三章：深海峡谷
  {
    id: 'stage_3_1',
    number: 1,
    chapterId: 'chapter_3',
    name: '深渊居民',
    description: '黑暗中的未知生物',
    background: 'deep-canyon',
    enemy: {
      name: '深渊鱼',
      avatar: '🐟',
      hp: 4,
      level: 5,
      ai: 'normal',
    },
    requiredLevel: 5,
    firstClearReward: {
      pearls: 60,
      exp: 45,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '闪避成功 1 次',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_3_2',
    number: 2,
    chapterId: 'chapter_3',
    name: '巨型章鱼',
    description: '八只触手的威胁',
    background: 'deep-canyon',
    enemy: {
      name: '章鱼王',
      avatar: '🐙',
      hp: 5,
      level: 6,
      ai: 'hard',
    },
    requiredLevel: 6,
    firstClearReward: {
      pearls: 80,
      exp: 55,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '反击成功 1 次',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
  {
    id: 'stage_3_3',
    number: 3,
    chapterId: 'chapter_3',
    name: '峡谷霸主',
    description: '第三章 BOSS 战',
    background: 'deep-canyon',
    enemy: {
      name: '峡谷霸主',
      avatar: '🦑',
      hp: 6,
      level: 8,
      ai: 'boss',
    },
    requiredLevel: 7,
    firstClearReward: {
      pearls: 250,
      exp: 120,
      shells: 10,
    },
    starConditions: {
      condition1: '获得胜利',
      condition2: '剩余 2 HP 以上',
      condition3: '无伤通关',
    },
    unlocked: false,
    cleared: false,
    stars: 0,
  },
]

// ==================== 工具函数 ====================

export function getStagesByChapter(chapterId: string): Stage[] {
  return STAGES.filter(s => s.chapterId === chapterId)
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find(c => c.id === id)
}

export function getStageById(id: string): Stage | undefined {
  return STAGES.find(s => s.id === id)
}

export function getTotalStars(chapterId: string): number {
  return getStagesByChapter(chapterId).reduce((sum, stage) => sum + stage.stars, 0)
}

export function getMaxStars(chapterId: string): number {
  return getStagesByChapter(chapterId).length * 3
}

export function isChapterCleared(chapterId: string): boolean {
  const stages = getStagesByChapter(chapterId)
  return stages.length > 0 && stages.every(s => s.cleared)
}
