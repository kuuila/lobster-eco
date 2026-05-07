import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 解析 CSV 文本为对象数组
function parseCSV(csvText: string): Record<string, string>[] {
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

// 读取 CSV 文件
function readCSV(filename: string): string {
  const filePath = path.join(process.cwd(), 'config', filename)
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

// GET /api/config?type=fighters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'
  
  const configs: Record<string, unknown> = {}
  
  if (type === 'all' || type === 'fighters') {
    configs.fighters = parseCSV(readCSV('fighters.csv'))
  }
  if (type === 'all' || type === 'actions') {
    configs.actions = parseCSV(readCSV('actions.csv'))
  }
  if (type === 'all' || type === 'tasks') {
    configs.tasks = parseCSV(readCSV('tasks.csv'))
  }
  if (type === 'all' || type === 'stages') {
    configs.stages = parseCSV(readCSV('stages.csv'))
  }
  if (type === 'all' || type === 'dungeons') {
    configs.dungeons = parseCSV(readCSV('dungeons.csv'))
  }
  if (type === 'all' || type === 'skills') {
    configs.skills = parseCSV(readCSV('skills.csv'))
  }
  
  return NextResponse.json(configs)
}