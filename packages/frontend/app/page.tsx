'use client';

import Link from 'next/link';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LOBSTER_ADDRESS, PEARL_ADDRESS } from '@/lib/contracts';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: lobsterBalance } = useBalance({
    address,
    token: LOBSTER_ADDRESS,
    query: { enabled: !!address },
  });
  const { data: pearlBalance } = useBalance({
    address,
    token: PEARL_ADDRESS,
    query: { enabled: !!address },
  });

  return (
    <main className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🦞</span>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Lobster Battle
            </h1>
            <p className="text-sm text-slate-400">Play to Earn Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="flex gap-4 text-sm bg-slate-800 px-4 py-2 rounded-lg">
              <span>🦞 {lobsterBalance?.formatted || '0'} LOBSTER</span>
              <span>💎 {pearlBalance?.formatted || '0'} PEARL</span>
            </div>
          )}
          <ConnectButton />
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Link href="/game" className="group">
          <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-8 hover:border-red-400 transition-all hover:scale-105">
            <span className="text-6xl">⚔️</span>
            <h2 className="text-2xl font-bold mt-4">龙虾对决</h2>
            <p className="text-slate-400 mt-2">15秒策略战斗，赢取PEARL</p>
            <div className="mt-4 text-red-400 group-hover:text-red-300">开始战斗 →</div>
          </div>
        </Link>

        <Link href="/exchange" className="group">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400 transition-all hover:scale-105">
            <span className="text-6xl">📈</span>
            <h2 className="text-2xl font-bold mt-4">虾币交易所</h2>
            <p className="text-slate-400 mt-2">交易游戏代币与NFT</p>
            <div className="mt-4 text-blue-400 group-hover:text-blue-300">进入交易所 →</div>
          </div>
        </Link>

        <Link href="/dao" className="group">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400 transition-all hover:scale-105">
            <span className="text-6xl">🏛️</span>
            <h2 className="text-2xl font-bold mt-4">深海议会</h2>
            <p className="text-slate-400 mt-2">DAO治理，社区共治</p>
            <div className="mt-4 text-purple-400 group-hover:text-purple-300">参与治理 →</div>
          </div>
        </Link>
      </section>

      <section className="mt-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">❤️</span>
            <div>
              <h2 className="text-2xl font-bold">慈善公益</h2>
              <p className="text-slate-400 mt-1">10%收益捐赠中东人道援助，用游戏改变世界</p>
            </div>
            <Link href="/charity" className="ml-auto bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold transition-colors">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">生态系统</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl mb-2">🦞</div>
            <div className="font-bold">LOBSTER</div>
            <div className="text-sm text-slate-400">治理代币</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl mb-2">💎</div>
            <div className="font-bold">PEARL</div>
            <div className="text-sm text-slate-400">游戏代币</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl mb-2">🪸</div>
            <div className="font-bold">CORAL</div>
            <div className="text-sm text-slate-400">影响力代币</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="text-3xl mb-2">🖼️</div>
            <div className="font-bold">NFT</div>
            <div className="text-sm text-slate-400">龙虾角色</div>
          </div>
        </div>
      </section>
    </main>
  );
}
