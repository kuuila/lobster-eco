#!/usr/bin/env node

/**
 * 虾币交易所 - 增强版
 * 多维度币种 + 投资比赛 + 排行榜
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8800;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 数据库
const DB_PATH = path.join(__dirname, '../database/exchange.db');
const db = new sqlite3.Database(DB_PATH);

// 币种数据
const cryptoCategories = {
    'TECH': ['量子链', 'AI算力币', '神经网络币', '区块链云', '数据矿币', '云计算币', '智能合约币', '分布式存储', '边缘计算币', '物联网币'],
    'GAME': ['游戏金', '元宇宙币', 'NFT碎片', '虚拟地产', '游戏道具币', '电竞积分', '角色代币', '皮肤币', '装备碎片', '成就币'],
    'PET': ['猫币', '狗币', '兔币', '龙币', '凤凰币', '麒麟币', '独角兽币', '熊猫币', '考拉币', '企鹅币'],
    'ELE': ['金元素', '银元素', '铜元素', '火元素', '水元素', '土元素', '风元素', '雷元素', '光元素', '暗元素'],
    'STAR': ['水星币', '金星币', '地球币', '火星币', '木星币', '土星币', '天王星币', '海王星币', '冥王星币', '太阳币'],
    'MYTH': ['宙斯币', '雅典娜币', '波塞冬币', '哈迪斯币', '阿波罗币', '阿瑞斯币', '赫拉币', '赫淮斯托斯币', '赫尔墨斯币', '阿佛洛狄忒币'],
    'EAST': ['盘古币', '女娲币', '伏羲币', '神农币', '黄帝币', '炎帝币', '蚩尤币', '后羿币', '嫦娥币', '玉帝币'],
    'FOOD': ['奶茶币', '火锅币', '烧烤币', '寿司币', '披萨币', '汉堡币', '拉面币', '炸鸡币', '咖啡币', '甜点币'],
    'ART': ['画币', '音乐币', '舞蹈币', '戏剧币', '雕塑币', '摄影币', '电影币', '诗歌币', '书法币', '建筑币'],
    'TIME': ['秒币', '分币', '时币', '日币', '周币', '月币', '年币', '世纪币', '纪元币', '永恒币']
};

// 初始化数据库
function initDB() {
    db.serialize(() => {
        // 用户表
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            initial_capital REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 钱包表
        db.run(`CREATE TABLE IF NOT EXISTS wallets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            coin_symbol TEXT,
            balance REAL DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, coin_symbol)
        )`);

        // 币种表
        db.run(`CREATE TABLE IF NOT EXISTS coins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE,
            name TEXT,
            name_cn TEXT,
            price REAL,
            change_24h REAL,
            volume_24h REAL,
            market_cap REAL,
            logo TEXT,
            color TEXT,
            category TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 订单表
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            coin_symbol TEXT,
            side TEXT,
            price REAL,
            amount REAL,
            total REAL,
            filled REAL DEFAULT 0,
            status TEXT DEFAULT 'filled',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 排行榜缓存表
        db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_value REAL,
            profit REAL,
            profit_percent REAL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        initDefaultData();
    });
}

// 初始化默认数据
function initDefaultData() {
    db.get("SELECT COUNT(*) as count FROM coins", (err, row) => {
        if (row.count === 0) {
            console.log("初始化币种数据...");
            
            const coins = [];
            
            // 主流币
            coins.push({ symbol: 'SHA3', name: 'Xia Coin', name_cn: '虾币', price: 100, color: '#FF6B6B', category: '主流' });
            coins.push({ symbol: 'USDT', name: 'Tether', name_cn: '泰达币', price: 1, color: '#26A17B', category: '稳定币' });
            
            // 生成各类币种
            Object.entries(cryptoCategories).forEach(([prefix, names]) => {
                names.forEach((name, idx) => {
                    coins.push({
                        symbol: `${prefix}-${String(idx + 1).padStart(3, '0')}`,
                        name: `${name} Token`,
                        name_cn: name,
                        price: (Math.random() * 50 + 0.1).toFixed(2) * 1,
                        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                        category: prefix
                    });
                });
            });

            const stmt = db.prepare(`INSERT INTO coins (symbol, name, name_cn, price, change_24h, volume_24h, market_cap, logo, color, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            
            coins.forEach(coin => {
                const change = (Math.random() - 0.5) * 20;
                const volume = Math.random() * 10000000;
                const marketCap = coin.price * (1000000 + Math.random() * 10000000);
                stmt.run(coin.symbol, coin.name, coin.name_cn, coin.price, change, volume, marketCap, '', coin.color, coin.category);
            });
            
            stmt.finalize();
            console.log(`已创建 ${coins.length} 个币种`);
        }
    });
}

// 随机初始资金
function randomInitialCapital() {
    return Math.floor(Math.random() * 100000) + 10000; // 10000 - 110000 USDT
}

// 随机赠送虾壳币
function randomCoins(userId, callback) {
    const coinCount = Math.floor(Math.random() * 5) + 3; // 3-7种币
    const symbols = [];
    
    db.all("SELECT symbol, price FROM coins WHERE symbol != 'USDT' ORDER BY RANDOM() LIMIT ?", [coinCount], (err, coins) => {
        if (err) { callback(); return; }
        
        const stmt = db.prepare("INSERT OR REPLACE INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)");
        
        coins.forEach(coin => {
            const amount = Math.random() * 100 + 10;
            stmt.run(userId, coin.symbol, amount);
            symbols.push(`${coin.symbol}: ${amount.toFixed(2)}`);
        });
        
        stmt.finalize();
        callback(symbols);
    });
}

// 更新排行榜
function updateLeaderboard(userId) {
    db.all(`SELECT w.coin_symbol, w.balance, c.price 
            FROM wallets w 
            JOIN coins c ON w.coin_symbol = c.symbol 
            WHERE w.user_id = ?`, [userId], (err, wallets) => {
        
        const totalValue = wallets.reduce((sum, w) => sum + w.balance * w.price, 0);
        
        db.get("SELECT initial_capital FROM users WHERE id = ?", [userId], (err, user) => {
            if (!user) return;
            
            const profit = totalValue - user.initial_capital;
            const profitPercent = (profit / user.initial_capital * 100);
            
            db.run(`INSERT OR REPLACE INTO leaderboard (user_id, total_value, profit, profit_percent, updated_at) 
                    VALUES (?, ?, ?, ?, datetime('now'))`, 
                [userId, totalValue, profit, profitPercent]);
        });
    });
}

// ============ API 接口 ============

// 获取所有币种
app.get('/api/coins', (req, res) => {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM coins';
    const params = [];
    const conditions = [];
    
    if (category && category !== 'all') {
        conditions.push('category = ?');
        params.push(category);
    }
    if (search) {
        conditions.push('(symbol LIKE ? OR name LIKE ? OR name_cn LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY price DESC';
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.json({ error: err.message });
            return;
        }
        
        // 添加模拟24h变化
        rows = rows.map(coin => ({
            ...coin,
            change_24h: (Math.random() - 0.5) * 20,
            volume_24h: Math.random() * 10000000
        }));
        
        res.json(rows);
    });
});

// 获取币种分类
app.get('/api/categories', (req, res) => {
    const categories = [
        { id: 'all', name: '全部', count: 103 },
        { id: '主流', name: '主流币', count: 1 },
        { id: '稳定币', name: '稳定币', count: 1 },
        { id: 'TECH', name: '科技', count: 10 },
        { id: 'GAME', name: '游戏', count: 10 },
        { id: 'PET', name: '动物', count: 10 },
        { id: 'ELE', name: '元素', count: 10 },
        { id: 'STAR', name: '星球', count: 10 },
        { id: 'MYTH', name: '希腊神话', count: 10 },
        { id: 'EAST', name: '东方神话', count: 10 },
        { id: 'FOOD', name: '美食', count: 10 },
        { id: 'ART', name: '艺术', count: 10 },
        { id: 'TIME', name: '时间', count: 10 }
    ];
    res.json(categories);
});

// 获取单个币种详情
app.get('/api/coin/:symbol', (req, res) => {
    const { symbol } = req.params;
    
    db.get('SELECT * FROM coins WHERE symbol = ?', [symbol], (err, row) => {
        if (err || !row) {
            res.json({ error: 'Coin not found' });
            return;
        }
        
        // 生成模拟K线
        const klines = [];
        let price = row.price;
        const now = Date.now();
        for (let i = 60; i >= 0; i--) {
            const time = now - i * 60000;
            const open = price;
            const change = (Math.random() - 0.5) * price * 0.02;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * price * 0.01;
            const low = Math.min(open, close) - Math.random() * price * 0.01;
            const volume = Math.random() * 10000;
            klines.push([time, open, high, low, close, volume]);
            price = close;
        }
        
        // 生成订单簿
        const orders = {
            bids: Array(10).fill(0).map((_, i) => ({
                price: parseFloat((row.price * (1 - (i + 1) * 0.001)).toFixed(6)),
                amount: parseFloat((Math.random() * 100).toFixed(4))
            })),
            asks: Array(10).fill(0).map((_, i) => ({
                price: parseFloat((row.price * (1 + (i + 1) * 0.001)).toFixed(6)),
                amount: parseFloat((Math.random() * 100).toFixed(4))
            }))
        };
        
        res.json({ ...row, klines, orders });
    });
});

// 用户注册
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        res.json({ success: false, error: '请输入用户名和密码' });
        return;
    }
    
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
        if (row) {
            res.json({ success: false, error: '用户名已存在' });
            return;
        }
        
        const capital = randomInitialCapital();
        
        db.run('INSERT INTO users (username, password, initial_capital) VALUES (?, ?, ?)', 
            [username, password, capital], function(err) {
            if (err) {
                res.json({ success: false, error: err.message });
                return;
            }
            
            const userId = this.lastID;
            
            // 赠送USDT
            db.run('INSERT INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)', 
                [userId, 'USDT', capital]);
            
            // 赠送SHA3
            db.run('INSERT INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)', 
                [userId, 'SHA3', Math.random() * 50 + 10]);
            
            // 随机赠送其他币
            randomCoins(userId, (symbols) => {
                updateLeaderboard(userId);
                
                res.json({ 
                    success: true, 
                    user_id: userId,
                    initial_capital: capital,
                    bonus_coins: symbols
                });
            });
        });
    });
});

// 用户登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT id, username, initial_capital FROM users WHERE username = ? AND password = ?', 
        [username, password], (err, row) => {
        if (err || !row) {
            res.json({ success: false, error: '用户名或密码错误' });
            return;
        }
        
        // 更新排行榜
        updateLeaderboard(row.id);
        
        res.json({
            success: true,
            user: row
        });
    });
});

// 获取用户钱包
app.get('/api/wallets/:userId', (req, res) => {
    const { userId } = req.params;
    
    db.all(`SELECT w.*, c.name, c.name_cn, c.color, c.price, c.change_24h
            FROM wallets w 
            LEFT JOIN coins c ON w.coin_symbol = c.symbol 
            WHERE w.user_id = ? AND w.balance > 0.001`, [userId], (err, rows) => {
        
        const wallets = rows.map(w => ({
            ...w,
            value: w.balance * (w.price || 0)
        }));
        
        const totalValue = wallets.reduce((sum, w) => sum + w.value, 0);
        
        res.json({ wallets, totalValue });
    });
});

// 获取用户资产概览
app.get('/api/portfolio/:userId', (req, res) => {
    const { userId } = req.params;
    
    db.get('SELECT initial_capital FROM users WHERE id = ?', [userId], (err, user) => {
        if (!user) {
            res.json({ error: 'User not found' });
            return;
        }
        
        db.all(`SELECT w.coin_symbol, w.balance, c.price, c.name_cn, c.color
                FROM wallets w 
                JOIN coins c ON w.coin_symbol = c.symbol 
                WHERE w.user_id = ?`, [userId], (err, wallets) => {
            
            const totalValue = wallets.reduce((sum, w) => sum + w.balance * w.price, 0);
            const profit = totalValue - user.initial_capital;
            const profitPercent = (profit / user.initial_capital * 100);
            
            res.json({
                initial_capital: user.initial_capital,
                total_value: totalValue,
                profit: profit,
                profit_percent: profitPercent
            });
        });
    });
});

// 下单交易
app.post('/api/order', (req, res) => {
    const { userId, symbol, side, price, amount } = req.body;
    
    if (!userId || !symbol || !side || !price || !amount) {
        res.json({ success: false, error: '参数不完整' });
        return;
    }
    
    const total = price * amount;
    
    // 检查余额
    const checkSymbol = side === 'buy' ? 'USDT' : symbol;
    const needBalance = side === 'buy' ? total : amount;
    
    db.get('SELECT balance FROM wallets WHERE user_id = ? AND coin_symbol = ?', 
        [userId, checkSymbol], (err, wallet) => {
        
        if (!wallet || wallet.balance < needBalance) {
            res.json({ success: false, error: '余额不足' });
            return;
        }
        
        // 执行交易
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // 扣除
            db.run('UPDATE wallets SET balance = balance - ? WHERE user_id = ? AND coin_symbol = ?',
                [needBalance, userId, checkSymbol]);
            
            // 增加
            const gainSymbol = side === 'buy' ? symbol : 'USDT';
            const gainAmount = side === 'buy' ? amount : total;
            
            db.run(`INSERT INTO wallets (user_id, coin_symbol, balance) VALUES (?, ?, ?)
                    ON CONFLICT(user_id, coin_symbol) DO UPDATE SET balance = balance + ?`,
                [userId, gainSymbol, gainAmount, gainAmount]);
            
            // 记录订单
            db.run(`INSERT INTO orders (user_id, coin_symbol, side, price, amount, total, filled, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'filled')`,
                [userId, symbol, side, price, amount, total, amount]);
            
            // 更新币种价格
            const priceChange = price * (Math.random() * 0.02 - 0.01);
            db.run('UPDATE coins SET price = ? WHERE symbol = ?', [price + priceChange, symbol]);
            
            db.run('COMMIT');
            
            // 更新排行榜
            updateLeaderboard(userId);
            
            res.json({ 
                success: true, 
                filled: amount,
                total: total,
                new_balance: side === 'buy' ? -needBalance : gainAmount
            });
        });
    });
});

// 获取订单历史
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    db.all(`SELECT o.*, c.name_cn, c.color FROM orders o 
            LEFT JOIN coins c ON o.coin_symbol = c.symbol 
            WHERE o.user_id = ? ORDER BY o.created_at DESC LIMIT ?`, 
        [userId, limit], (err, rows) => {
        res.json(rows);
    });
});

// 排行榜
app.get('/api/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    
    db.all(`SELECT l.*, u.username 
            FROM leaderboard l 
            JOIN users u ON l.user_id = u.id 
            ORDER BY l.profit_percent DESC LIMIT ?`, [limit], (err, rows) => {
        res.json(rows.map((r, i) => ({
            rank: i + 1,
            ...r
        })));
    });
});

// 统计
app.get('/api/stats', (req, res) => {
    db.get('SELECT COUNT(*) as total_users FROM users', (err, users) => {
        db.get('SELECT COUNT(*) as total_coins FROM coins', (err, coins) => {
            db.get('SELECT SUM(total) as total_volume FROM orders', (err, volume) => {
                res.json({
                    total_users: users?.total_users || 0,
                    total_coins: coins?.total_coins || 0,
                    total_volume: volume?.total_volume || 0
                });
            });
        });
    });
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// 启动服务器
initDB();

app.listen(PORT, () => {
    console.log(`🦐 虾币交易所运行在 http://localhost:${PORT}`);
});
