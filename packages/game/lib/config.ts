// CSV 配置文件解析工具

// 解析 CSV 文本为对象数组
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  
  const result: Record<string, string>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const obj: Record<string, string> = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    
    result.push(obj)
  }
  
  return result
}

// 获取配置项 by ID
export function getById<T extends Record<string, string>>(
  items: T[], 
  id: string
): T | undefined {
  return items.find(item => item.id === id)
}

// 获取配置项列表 by 字段
export function filterBy<T extends Record<string, string>>(
  items: T[],
  field: string,
  value: string
): T[] {
  return items.filter(item => item[field] === value)
}

// 解析数字（带默认值）
export function parseNumber(value: string, defaultValue: number = 0): number {
  const num = parseInt(value, 10)
  return isNaN(num) ? defaultValue : num
}

// 解析布尔值
export function parseBool(value: string): boolean {
  return value.toLowerCase() === 'true'
}

// 导出配置数据
import fightersCSV from './fighters.csv?raw'
import actionsCSV from './actions.csv?raw'
import tasksCSV from './tasks.csv?raw'
import stagesCSV from './stages.csv?raw'
import dungeonsCSV from './dungeons.csv?raw'
import skillsCSV from './skills.csv?raw'

// 配置数据
export const fighterConfigs = parseCSV(fightersCSV)
export const actionConfigs = parseCSV(actionsCSV)
export const taskConfigs = parseCSV(tasksCSV)
export const stageConfigs = parseCSV(stagesCSV)
export const dungeonConfigs = parseCSV(dungeonsCSV)
export const skillConfigs = parseCSV(skillsCSV)

// 便捷方法
export const getFighterConfig = (id: string) => getById(fighterConfigs, id)
export const getActionConfig = (id: string) => getById(actionConfigs, id)
export const getTaskConfig = (id: string) => getById(taskConfigs, id)
export const getStageConfig = (id: string) => getById(stageConfigs, id)
export const getDungeonConfig = (id: string) => getById(dungeonConfigs, id)
export const getSkillConfig = (id: string) => getById(skillConfigs, id)

export const getFightersByAI = (ai: string) => filterBy(fighterConfigs, 'ai_difficulty', ai)
export const getTasksByType = (type: string) => filterBy(taskConfigs, 'type', type)
export const getStagesByChapter = (chapterId: string) => filterBy(stageConfigs, 'chapter_id', chapterId)
export const getDungeonsByType = (type: string) => filterBy(dungeonConfigs, 'type', type)
