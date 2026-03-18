'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface BattleState {
  round: number;
  playerHp: number;
  opponentHp: number;
  playerPower: number;
  opponentPower: number;
  playerCoins: number;
  opponentCoins: number;
  playerKnives: number;
  opponentKnives: number;
  playerGuns: number;
  opponentGuns: number;
  playerPotions: number;
  opponentPotions: number;
  playerHasShield: boolean;
  opponentHasShield: boolean;
  playerWins: number;
  opponentWins: number;
  timer: number;
  selectedAction: string | null;
  phase: 'menu' | 'matching' | 'battle' | 'result';
  isMyTurn: boolean;
  logs: string[];
}

const initialState: BattleState = {
  round: 1,
  playerHp: 3,
  opponentHp: 3,
  playerPower: 0,
  opponentPower: 0,
  playerCoins: 2,
  opponentCoins: 2,
  playerKnives: 0,
  opponentKnives: 0,
  playerGuns: 0,
  opponentGuns: 0,
  playerPotions: 0,
  opponentPotions: 0,
  playerHasShield: false,
  opponentHasShield: false,
  playerWins: 0,
  opponentWins: 0,
  timer: 15,
  selectedAction: null,
  phase: 'menu',
  isMyTurn: true,
  logs: [],
};

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState<BattleState>(initialState);
  const [activeTab, setActiveTab] = useState<'gather' | 'attack' | 'steal' | 'defense'>('gather');

  const startMatchmaking = () => {
    setState(prev => ({ ...prev, phase: 'matching' }));
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        phase: 'battle',
        logs: ['⚔️ 对战开始！']
      }));
      startTimer();
    }, 2000);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.timer <= 1) {
          clearInterval(interval);
          if (!prev.selectedAction) {
            return { ...prev, timer: 0 };
          }
          return prev;
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
  };

  const selectAction = (action: string) => {
    setState(prev => ({ ...prev, selectedAction: action }));
  };

  const executeAction = useCallback(() => {
    const action = state.selectedAction;
    if (!action) return;

    setState(prev => {
      const newState = { ...prev };
      const player = {
        hp: prev.playerHp,
        power: prev.playerPower,
        coins: prev.playerCoins,
        knives: prev.playerKnives,
        guns: prev.playerGuns,
        potions: prev.playerPotions,
        hasShield: prev.playerHasShield,
      };
      const opponent = {
        hp: prev.opponentHp,
        power: prev.opponentPower,
        coins: prev.opponentCoins,
        knives: prev.opponentKnives,
        guns: prev.opponentGuns,
        potions: prev.opponentPotions,
        hasShield: prev.opponentHasShield,
      };

      // Execute player action
      switch (action) {
        case 'earn':
          player.coins++;
          newState.logs = ['💎 采集珍珠 +1', ...prev.logs];
          break;
        case 'buyKnife':
          player.coins--;
          player.knives++;
          newState.logs = ['🦠 获取小钳 +1', ...prev.logs];
          break;
        case 'buyGun':
          player.coins -= 2;
          player.guns++;
          newState.logs = ['🐙 获取大钳 +1', ...prev.logs];
          break;
        case 'buyPotion':
          player.coins -= 3;
          player.potions++;
          newState.logs = ['🌿 获取海草 +1', ...prev.logs];
          break;
        case 'useKnife':
          player.knives--;
          player.power = Math.min(10, player.power + 3);
          if (!opponent.hasShield && Math.random() > 0.3) {
            opponent.hp--;
            newState.logs = ['✅ 小钳攻击命中！-1 HP', ...prev.logs];
          } else {
            newState.logs = ['❌ 攻击被挡住！', ...prev.logs];
          }
          break;
        case 'useGun':
          player.guns--;
          player.power = Math.min(10, player.power + 5);
          if (opponent.hasShield) {
            opponent.hasShield = false;
            newState.logs = ['💥 破壳！', ...prev.logs];
          } else if (Math.random() > 0.3) {
            opponent.hp -= 2;
            newState.logs = ['✅ 大钳攻击命中！-2 HP', ...prev.logs];
          } else {
            newState.logs = ['💨 攻击被闪避！', ...prev.logs];
          }
          break;
        case 'defend':
          player.hasShield = true;
          player.power = Math.min(10, player.power + 1);
          newState.logs = ['🛡️ 硬壳防御', ...prev.logs];
          break;
      }

      // AI opponent action
      const aiActions = ['earn', 'earn', 'buyKnife', 'buyGun', 'useKnife', 'useGun', 'defend'];
      const aiAction = aiActions[Math.floor(Math.random() * aiActions.length)];
      
      switch (aiAction) {
        case 'earn':
          opponent.coins++;
          break;
        case 'buyKnife':
          if (opponent.coins >= 1) { opponent.coins--; opponent.knives++; }
          break;
        case 'buyGun':
          if (opponent.coins >= 2) { opponent.coins -= 2; opponent.guns++; }
          break;
        case 'useKnife':
          if (opponent.knives > 0) {
            opponent.knives--;
            opponent.power = Math.min(10, opponent.power + 3);
            if (!player.hasShield && Math.random() > 0.3) {
              player.hp--;
              newState.logs = ['❌ 敌方小钳命中！-1 HP', ...newState.logs];
            }
          }
          break;
        case 'useGun':
          if (opponent.guns > 0) {
            opponent.guns--;
            opponent.power = Math.min(10, opponent.power + 5);
            if (player.hasShield) {
              player.hasShield = false;
              newState.logs = ['💥 敌方破壳！', ...newState.logs];
            } else if (Math.random() > 0.3) {
              player.hp -= 2;
              newState.logs = ['❌ 敌方大钳命中！-2 HP', ...newState.logs];
            }
          }
          break;
        case 'defend':
          opponent.hasShield = true;
          break;
      }

      // Check death and revive
      if (player.hp <= 0 && player.potions > 0) {
        player.potions--;
        player.hp = 1;
        player.hasShield = true;
        newState.logs = ['🌿 海草复活！', ...newState.logs];
      }
      if (opponent.hp <= 0 && opponent.potions > 0) {
        opponent.potions--;
        opponent.hp = 1;
        opponent.hasShield = true;
      }

      // Check round end
      let playerWins = prev.playerWins;
      let opponentWins = prev.opponentWins;
      let round = prev.round;
      
      if (opponent.hp <= 0) {
        playerWins++;
        newState.logs = ['🏆 本轮胜利！', ...newState.logs];
      } else if (player.hp <= 0) {
        opponentWins++;
        newState.logs = ['💔 本轮失败！', ...newState.logs];
      }

      // Check match end
      if (playerWins >= 2 || opponentWins >= 2) {
        return {
          ...newState,
          playerHp: player.hp,
          opponentHp: opponent.hp,
          playerPower: player.power,
          opponentPower: opponent.power,
          playerCoins: player.coins,
          opponentCoins: opponent.coins,
          playerKnives: player.knives,
          opponentKnives: opponent.knives,
          playerGuns: player.guns,
          opponentGuns: opponent.guns,
          playerPotions: player.potions,
          opponentPotions: opponent.potions,
          playerHasShield: player.hasShield,
          opponentHasShield: opponent.hasShield,
          playerWins,
          opponentWins,
          phase: 'result',
        };
      }

      // Next round
      if (opponent.hp <= 0 || player.hp <= 0) {
        return {
          ...newState,
          round: round + 1,
          playerHp: 3,
          opponentHp: 3,
          playerPower: player.power,
          opponentPower: opponent.power,
          playerCoins: player.coins,
          opponentCoins: opponent.coins,
          playerKnives: player.knives,
          opponentKnives: opponent.knives,
          playerGuns: player.guns,
          opponentGuns: opponent.guns,
          playerPotions: player.potions,
          opponentPotions: opponent.potions,
          playerWins,
          opponentWins,
          timer: 15,
          selectedAction: null,
        };
      }

      return {
        ...newState,
        playerHp: player.hp,
        opponentHp: opponent.hp,
        playerPower: player.power,
        opponentPower: opponent.power,
        playerCoins: player.coins,
        opponentCoins: opponent.coins,
        playerKnives: player.knives,
        opponentKnives: opponent.knives,
        playerGuns: player.guns,
        opponentGuns: opponent.guns,
        playerPotions: player.potions,
        opponentPotions: opponent.potions,
        playerHasShield: player.hasShield,
        opponentHasShield: opponent.hasShield,
        timer: 15,
        selectedAction: null,
      };
    });
  }, [state.selectedAction]);

  const actions = {
    gather: [
      { id: 'earn', icon: '💎', name: '采集珍珠', desc: '珍珠 +1', cost: null },
      { id: 'buyKnife', icon: '🦠', name: '获取小钳', desc: '1点伤害', cost: 1 },
      { id: 'buyGun', icon: '🐙', name: '获取大钳', desc: '2点伤害', cost: 2 },
      { id: 'buyPotion', icon: '🌿', name: '获取海草', desc: '濒死复活', cost: 3 },
    ],
    attack: [
      { id: 'useKnife', icon: '🦠', name: '小钳攻击', desc: '1伤害 +3气泡', cost: null, require: state.playerKnives },
      { id: 'useGun', icon: '🐙', name: '大钳攻击', desc: '2伤害 +5气泡', cost: null, require: state.playerGuns },
    ],
    steal: [
      { id: 'steal1', icon: '🦐', name: '小掠夺', desc: '掠夺1资源', cost: 3, require: state.playerPower },
      { id: 'steal2', icon: '🦀', name: '大掠夺', desc: '掠夺2资源', cost: 5, require: state.playerPower },
    ],
    defense: [
      { id: 'defend', icon: '🛡️', name: '硬壳防御', desc: '抵挡攻击 +1气泡', cost: null },
      { id: 'dodge', icon: '💨', name: '闪避', desc: '30%闪避', cost: 1, require: state.playerPower },
      { id: 'counter', icon: '⚡', name: '反击', desc: '受击反击', cost: 2, require: state.playerPower },
    ],
  };

  const canAfford = (action: { cost?: number | null; require?: number }) => {
    if (action.cost && state.playerCoins < action.cost) return false;
    if (action.require !== undefined && action.require <= 0) return false;
    return true;
  };

  useEffect(() => {
    if (state.selectedAction && state.phase === 'battle') {
      const timeout = setTimeout(executeAction, 500);
      return () => clearTimeout(timeout);
    }
  }, [state.selectedAction, executeAction, state.phase]);

  if (state.phase === 'menu') {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-8xl mb-8">🦞</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            龙虾对决
          </h1>
          <p className="text-slate-400 mb-8">15秒策略战斗 · 三局两胜</p>
          
          {!isConnected ? (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              请先连接钱包
            </div>
          ) : (
            <button
              onClick={startMatchmaking}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl text-xl transition-all hover:scale-105"
            >
              ⚔️ 开始争霸
            </button>
          )}
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-bold">连胜: 0</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-2xl mb-2">💎</div>
              <div className="font-bold">PEARL: 0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === 'matching') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse">🔍</div>
          <div className="text-2xl mt-4">寻找对手...</div>
        </div>
      </div>
    );
  }

  if (state.phase === 'result') {
    const won = state.playerWins >= 2;
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-8xl mb-4">{won ? '🎉' : '😢'}</div>
          <div className={`text-4xl font-bold mb-4 ${won ? 'text-green-400' : 'text-red-400'}`}>
            {won ? '争霸胜利！' : '争霸失败'}
          </div>
          <div className="text-xl mb-8">
            比分: {state.playerWins} : {state.opponentWins}
          </div>
          <div className="text-lg text-slate-400 mb-8">
            {won ? '+25 PEARL' : '-10 PEARL'}
          </div>
          <button
            onClick={() => setState(initialState)}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl text-lg"
          >
            继续游戏
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-slate-400">第几轮</div>
            <div className="text-xl font-bold">{state.round}</div>
          </div>
          <div className={`text-3xl font-bold ${state.timer <= 5 ? 'text-red-500 pulse' : ''}`}>
            {state.timer}
          </div>
          <div>
            <div className="text-xs text-slate-400">胜负</div>
            <div className="text-xl font-bold">{state.playerWins} : {state.opponentWins}</div>
          </div>
        </div>

        {/* Opponent */}
        <div className="battle-card mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-2xl">
              🦀
            </div>
            <div className="flex-1">
              <div className="font-bold">敌方螃蟹</div>
              <div className="text-xs text-slate-400">伺机而动...</div>
            </div>
          </div>
          <div className="resource-bar">
            <span>🦞</span>
            <div className="progress-track">
              <div className="progress-fill health-fill" style={{ width: `${(state.opponentHp / 3) * 100}%` }} />
            </div>
            <span className="text-sm">{state.opponentHp}/3</span>
          </div>
          <div className="resource-bar">
            <span>🫧</span>
            <div className="progress-track">
              <div className="progress-fill energy-fill" style={{ width: `${(state.opponentPower / 10) * 100}%` }} />
            </div>
            <span className="text-sm text-cyan-400">{state.opponentPower}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">💎{state.opponentCoins}</span>
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">🦠{state.opponentKnives}</span>
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">🐙{state.opponentGuns}</span>
            {state.opponentHasShield && <span className="bg-cyan-900 px-2 py-1 rounded text-xs">🛡️</span>}
          </div>
        </div>

        {/* VS */}
        <div className="text-center text-2xl font-bold text-red-500 my-2">⚔️ VS ⚔️</div>

        {/* Player */}
        <div className="battle-card mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-2xl">
              🦞
            </div>
            <div className="flex-1">
              <div className="font-bold">我的龙虾</div>
              <div className="text-xs text-slate-400">
                {state.selectedAction ? '准备中...' : '选择行动'}
              </div>
            </div>
          </div>
          <div className="resource-bar">
            <span>🦞</span>
            <div className="progress-track">
              <div className="progress-fill health-fill" style={{ width: `${(state.playerHp / 3) * 100}%` }} />
            </div>
            <span className="text-sm">{state.playerHp}/3</span>
          </div>
          <div className="resource-bar">
            <span>🫧</span>
            <div className="progress-track">
              <div className="progress-fill energy-fill" style={{ width: `${(state.playerPower / 10) * 100}%` }} />
            </div>
            <span className="text-sm text-cyan-400">{state.playerPower}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">💎{state.playerCoins}</span>
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">🦠{state.playerKnives}</span>
            <span className="bg-slate-700 px-2 py-1 rounded text-xs">🐙{state.playerGuns}</span>
            {state.playerHasShield && <span className="bg-cyan-900 px-2 py-1 rounded text-xs">🛡️</span>}
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 h-20 overflow-y-auto">
          <div className="text-xs text-slate-400 mb-1">📜 战斗记录</div>
          {state.logs.slice(0, 5).map((log, i) => (
            <div key={i} className="text-xs">{log}</div>
          ))}
        </div>

        {/* Action Tabs */}
        <div className="flex gap-1 mb-2">
          {(['gather', 'attack', 'steal', 'defense'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {tab === 'gather' && '💎 收集'}
              {tab === 'attack' && '⚔️ 攻击'}
              {tab === 'steal' && '🦀 掠夺'}
              {tab === 'defense' && '🛡️ 防御'}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          {actions[activeTab].map(action => (
            <button
              key={action.id}
              onClick={() => canAfford(action) && selectAction(action.id)}
              disabled={!canAfford(action) || state.selectedAction !== null}
              className={`p-3 rounded-lg text-left transition-all ${
                state.selectedAction === action.id 
                  ? 'bg-red-600 border-2 border-red-400' 
                  : canAfford(action) 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-slate-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <div className="font-bold text-sm">{action.name}</div>
                  <div className="text-xs text-slate-400">{action.desc}</div>
                </div>
              </div>
              {action.cost && (
                <div className="text-xs text-yellow-400 mt-1">💎 -{action.cost}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
