import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 玩家状态
interface PlayerState {
  id: string
  name: string
  avatar: string
  pearls: number
  shells: number
  experience: number
  level: number
  wins: number
  losses: number
}

// 背包状态
interface InventoryState {
  knives: number
  guns: number
  potions: number
  shields: number
  dodgeCharges: number
  counterCharges: number
}

// 战斗状态
interface BattleState {
  round: number
  timer: number
  selectedAction: string | null
  opponentAction: string | null
  isProcessing: boolean
  autoBattle: boolean
  logs: string[]
}

// 游戏状态
interface GameState {
  // 玩家
  player: PlayerState
  inventory: InventoryState
  
  // 战斗
  battle: BattleState
  inBattle: boolean
  battleType: 'pve' | 'pvp' | null
  
  // PVP匹配
  isMatching: boolean
  roomId: string | null
  
  // Actions
  initPlayer: () => void
  updatePlayer: (data: Partial<PlayerState>) => void
  updateInventory: (data: Partial<InventoryState>) => void
  
  // 战斗
  startBattle: (type: 'pve' | 'pvp') => void
  endBattle: (won: boolean) => void
  selectAction: (action: string) => void
  toggleAutoBattle: () => void
  addLog: (log: string) => void
  clearLogs: () => void
  
  // PVP匹配
  startMatching: () => void
  stopMatching: () => void
  setRoomId: (roomId: string | null) => void
}

const initialPlayer: PlayerState = {
  id: '',
  name: '龙虾勇士',
  avatar: '🦞',
  pearls: 100,
  shells: 0,
  experience: 0,
  level: 1,
  wins: 0,
  losses: 0,
}

const initialInventory: InventoryState = {
  knives: 0,
  guns: 0,
  potions: 0,
  shields: 0,
  dodgeCharges: 3,
  counterCharges: 2,
}

const initialBattle: BattleState = {
  round: 1,
  timer: 15,
  selectedAction: null,
  opponentAction: null,
  isProcessing: false,
  autoBattle: false,
  logs: [],
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,
      inventory: initialInventory,
      battle: initialBattle,
      inBattle: false,
      battleType: null,
      isMatching: false,
      roomId: null,
      
      initPlayer: () => {
        const saved = localStorage.getItem('lobster-player')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            set({ player: { ...initialPlayer, ...data } })
          } catch (e) {
            // 创建新玩家
            const newPlayer = {
              ...initialPlayer,
              id: crypto.randomUUID(),
            }
            set({ player: newPlayer })
          }
        } else {
          const newPlayer = {
            ...initialPlayer,
            id: crypto.randomUUID(),
          }
          set({ player: newPlayer })
        }
      },
      
      updatePlayer: (data) => {
        set((state) => ({
          player: { ...state.player, ...data },
        }))
      },
      
      updateInventory: (data) => {
        set((state) => ({
          inventory: { ...state.inventory, ...data },
        }))
      },
      
      startBattle: (type) => {
        set({
          inBattle: true,
          battleType: type,
          battle: {
            ...initialBattle,
            logs: ['⚔️ 战斗开始！'],
          },
          inventory: initialInventory,
        })
      },
      
      endBattle: (won) => {
        const { player } = get()
        set((state) => ({
          inBattle: false,
          battleType: null,
          battle: initialBattle,
          player: {
            ...state.player,
            wins: won ? player.wins + 1 : player.wins,
            losses: won ? player.losses : player.losses + 1,
            pearls: won ? player.pearls + 20 : Math.max(0, player.pearls - 10),
          },
        }))
      },
      
      selectAction: (action) => {
        set((state) => ({
          battle: { ...state.battle, selectedAction: action },
        }))
      },
      
      toggleAutoBattle: () => {
        set((state) => ({
          battle: { ...state.battle, autoBattle: !state.battle.autoBattle },
        }))
      },
      
      addLog: (log) => {
        set((state) => ({
          battle: {
            ...state.battle,
            logs: [log, ...state.battle.logs].slice(0, 50),
          },
        }))
      },
      
      clearLogs: () => {
        set((state) => ({
          battle: { ...state.battle, logs: [] },
        }))
      },
      
      startMatching: () => {
        set({ isMatching: true })
      },
      
      stopMatching: () => {
        set({ isMatching: false, roomId: null })
      },
      
      setRoomId: (roomId) => {
        set({ roomId, isMatching: false })
      },
    }),
    {
      name: 'lobster-game',
      partialize: (state) => ({
        player: state.player,
      }),
    }
  )
)
