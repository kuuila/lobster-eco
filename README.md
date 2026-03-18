# Lobster Battle Ecosystem

Unified Game + Exchange + DAO ecosystem powered by Web3.

## Quick Start

```bash
# Install dependencies
npm install

# Run all services
npm run dev

# Run individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:8800
npm run dev:contracts # Local hardhat node
```

## Project Structure

```
lobster-eco/
├── packages/
│   ├── contracts/     # Smart contracts (Solidity)
│   ├── frontend/       # Next.js web app
│   ├── backend/        # Node.js API
│   └── game/          # Phaser.js game
├── package.json
└── turbo.json
```

## Environment Variables

```bash
# .env
POLYGON_RPC_URL=
MUMBAI_RPC_URL=
DEPLOYER_PRIVATE_KEY=
POLYGONSCAN_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
```

## License

MIT
