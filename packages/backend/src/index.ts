import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import Database from 'better-sqlite3';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const dbPath = path.join(__dirname, '../../database/lobster.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT UNIQUE,
    username TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    coin_symbol TEXT,
    balance REAL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    UNIQUE(user_id, coin_symbol)
  );

  CREATE TABLE IF NOT EXISTS coins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT UNIQUE,
    name TEXT,
    name_cn TEXT,
    price REAL,
    change_24h REAL,
    volume_24h REAL,
    market_cap REAL,
    color TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    coin_symbol TEXT,
    side TEXT,
    price REAL,
    amount REAL,
    total REAL,
    status TEXT DEFAULT 'filled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS battles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1 TEXT,
    player2 TEXT,
    winner TEXT,
    reward REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_value REAL,
    profit REAL,
    profit_percent REAL,
    wins INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initialize coins
const initCoins = db.prepare('SELECT COUNT(*) as count FROM coins');
if (initCoins.get()!.count === 0) {
  const categories = {
    '主流': [{ symbol: 'LOBSTER', name: 'Lobster DAO Token', name_cn: '龙虾币', price: 1.00, color: '#FF6B6B' }],
    '游戏': [
      { symbol: 'PEARL', name: 'Pearl Token', name_cn: '珍珠币', price: 0.10, color: '#0EA5E9' },
      { symbol: 'CORAL', name: 'Coral Impact', name_cn: '珊瑚影响力', price: 0.50, color: '#10B981' },
    ],
    '科技': ['量子链', 'AI算力币', '神经网络币', '区块链云', '数据矿币'].map((n, i) => ({
      symbol: `TECH-${String(i + 1).padStart(3, '0')}`,
      name: `${n} Token`,
      name_cn: n,
      price: Math.random() * 50 + 0.1,
      color: '#6366F1',
    })),
    '游戏': ['游戏金', '元宇宙币', 'NFT碎片', '虚拟地产', '电竞积分'].map((n, i) => ({
      symbol: `GAME-${String(i + 1).padStart(3, '0')}`,
      name: `${n} Token`,
      name_cn: n,
      price: Math.random() * 20 + 0.1,
      color: '#EC4899',
    })),
  };

  const insertCoin = db.prepare('INSERT INTO coins (symbol, name, name_cn, price, color, category) VALUES (?, ?, ?, ?, ?, ?)');
  
  Object.entries(categories).forEach(([category, coins]) => {
    (coins as any[]).forEach(coin => {
      insertCoin.run(coin.symbol, coin.name, coin.name_cn, coin.price, coin.color, category);
    });
  });
}

// API Routes

// Get all coins
app.get('/api/coins', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM coins';
  const params: string[] = [];
  
  if (category && category !== 'all') {
    sql += ' WHERE category = ?';
    params.push(category as string);
  }
  sql += ' ORDER BY price DESC';
  
  const coins = db.prepare(sql).all(...params) as any[];
  
  // Add random 24h change
  const result = coins.map(coin => ({
    ...coin,
    change_24h: (Math.random() - 0.5) * 20,
    volume_24h: Math.random() * 10000000,
  }));
  
  res.json(result);
});

// Get coin details
app.get('/api/coin/:symbol', (req, res) => {
  const { symbol } = req.params;
  const coin = db.prepare('SELECT * FROM coins WHERE symbol = ?').get(symbol);
  
  if (!coin) {
    return res.status(404).json({ error: 'Coin not found' });
  }
  
  // Generate mock klines
  const klines = [];
  let price = (coin as any).price;
  const now = Date.now();
  
  for (let i = 60; i >= 0; i--) {
    const time = now - i * 60000;
    const open = price;
    const change = (Math.random() - 0.5) * price * 0.02;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * price * 0.01;
    const low = Math.min(open, close) - Math.random() * price * 0.01;
    klines.push([time, open.toFixed(6), high.toFixed(6), low.toFixed(6), close.toFixed(6), Math.random() * 10000]);
    price = close;
  }
  
  res.json({ ...coin, klines });
});

// Get user wallet
app.get('/api/wallets/:address', (req, res) => {
  const { address } = req.params;
  
  let user = db.prepare('SELECT * FROM users WHERE address = ?').get(address) as any;
  
  if (!user) {
    // Create new user
    const result = db.prepare('INSERT INTO users (address) VALUES (?)').run(address);
    user = { id: result.lastInsertRowid, address };
    
    // Give initial tokens
    db.prepare('INSERT INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)').run(user.id, 'LOBSTER', 100);
    db.prepare('INSERT INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)').run(user.id, 'PEARL', 1000);
    db.prepare('INSERT INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)').run(user.id, 'USDT', 10000);
  }
  
  const wallets = db.prepare(`
    SELECT w.*, c.name, c.name_cn, c.price, c.color
    FROM wallets w
    JOIN coins c ON w.coin_symbol = c.symbol
    WHERE w.user_id = ? AND w.balance > 0.001
  `).all(user.id) as any[];
  
  const totalValue = wallets.reduce((sum, w) => sum + w.balance * (w.price || 0), 0);
  
  res.json({ wallets, totalValue, userId: user.id });
});

// Place order
app.post('/api/order', (req, res) => {
  const { userId, symbol, side, price, amount } = req.body;
  
  const total = price * amount;
  const checkSymbol = side === 'buy' ? 'USDT' : symbol;
  const needBalance = side === 'buy' ? total : amount;
  
  const wallet = db.prepare('SELECT balance FROM wallets WHERE user_id = ? AND coin_symbol = ?').get(userId, checkSymbol) as any;
  
  if (!wallet || wallet.balance < needBalance) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  // Execute trade
  const deduct = db.prepare('UPDATE wallets SET balance = balance - ? WHERE user_id = ? AND coin_symbol = ?');
  const add = db.prepare('INSERT OR REPLACE INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, COALESCE((SELECT balance FROM wallets WHERE user_id = ? AND coin_symbol = ?), 0) + ?)');
  
  deduct.run(needBalance, userId, checkSymbol);
  
  const gainSymbol = side === 'buy' ? symbol : 'USDT';
  const gainAmount = side === 'buy' ? amount : total;
  add.run(userId, gainSymbol, userId, gainSymbol, gainAmount);
  
  // Record order
  db.prepare('INSERT INTO orders (user_id, coin_symbol, side, price, amount, total) VALUES (?, ?, ?, ?, ?, ?)').run(userId, symbol, side, price, amount, total);
  
  res.json({ success: true, filled: amount, total });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = db.prepare(`
    SELECT l.*, u.username, u.address
    FROM leaderboard l
    JOIN users u ON l.user_id = u.id
    ORDER BY l.total_value DESC
    LIMIT 100
  `).all() as any[];
  
  res.json(leaderboard.map((r, i) => ({ rank: i + 1, ...r })));
});

// Battle history
app.get('/api/battles/:address', (req, res) => {
  const { address } = req.params;
  const battles = db.prepare(`
    SELECT * FROM battles
    WHERE player1 = ? OR player2 = ?
    ORDER BY timestamp DESC
    LIMIT 50
  `).all(address, address);
  
  res.json(battles);
});

// Stats
app.get('/api/stats', (req, res) => {
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  const coins = db.prepare('SELECT COUNT(*) as count FROM coins').get() as any;
  const volume = db.prepare('SELECT SUM(total) as total FROM orders').get() as any;
  const battles = db.prepare('SELECT COUNT(*) as count FROM battles').get() as any;
  
  res.json({
    totalUsers: users.count,
    totalCoins: coins.count,
    totalVolume: volume.total || 0,
    totalBattles: battles.count,
  });
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// WebSocket server for real-time updates
const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      // Handle different message types
      if (msg.type === 'subscribe') {
        ws.send(JSON.stringify({ type: 'subscribed', channel: msg.channel }));
      }
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Broadcast price updates every 5 seconds
setInterval(() => {
  // Update coin prices randomly
  const coins = db.prepare('SELECT symbol, price FROM coins').all() as any[];
  
  coins.forEach(coin => {
    const change = coin.price * (Math.random() * 0.02 - 0.01);
    db.prepare('UPDATE coins SET price = ? WHERE symbol = ?').run(coin.price + change, coin.symbol);
  });
  
  // Broadcast to all clients
  const message = JSON.stringify({ type: 'price_update', timestamp: Date.now() });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 5000);

server.listen(PORT, () => {
  console.log(`🦞 Lobster Ecosystem API running on http://localhost:${PORT}`);
});
