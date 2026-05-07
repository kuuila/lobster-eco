import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonMumbai } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Lobster Battle',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
  chains: [
    polygon,
    polygonMumbai,
  ],
  ssr: true,
});

// Contract addresses (update after deployment)
export const LOBSTER_ADDRESS = process.env.NEXT_PUBLIC_LOBSTER_ADDRESS || '0x0000000000000000000000000000000000000000';
export const PEARL_ADDRESS = process.env.NEXT_PUBLIC_PEARL_ADDRESS || '0x0000000000000000000000000000000000000000';
export const CORAL_ADDRESS = process.env.NEXT_PUBLIC_CORAL_ADDRESS || '0x0000000000000000000000000000000000000000';
export const LOBSTER_NFT_ADDRESS = process.env.NEXT_PUBLIC_LOBSTER_NFT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const ITEM_NFT_ADDRESS = process.env.NEXT_PUBLIC_ITEM_NFT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const BATTLE_ARENA_ADDRESS = process.env.NEXT_PUBLIC_BATTLE_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000';
