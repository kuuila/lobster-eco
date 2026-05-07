// 更新币种数据 - 多维度命名
const cryptoCategories = [
    // 科技类
    { prefix: 'TECH', names: ['量子链', 'AI算力币', '神经网络币', '区块链云', '数据矿币', '云计算币', '智能合约币', '分布式存储', '边缘计算币', '物联网币'] },
    // 游戏类
    { prefix: 'GAME', names: ['游戏金', '元宇宙币', 'NFT碎片', '虚拟地产', '游戏道具币', '电竞积分', '角色代币', '皮肤币', '装备碎片', '成就币'] },
    // 动物类
    { prefix: 'PET', names: ['猫币', '狗币', '兔币', '龙币', '凤凰币', '麒麟币', '独角兽币', '熊猫币', '考拉币', '企鹅币'] },
    // 元素类
    { prefix: 'ELE', names: ['金元素', '银元素', '铜元素', '火元素', '水元素', '土元素', '风元素', '雷元素', '光元素', '暗元素'] },
    // 星球类
    { prefix: 'STAR', names: ['水星币', '金星币', '地球币', '火星币', '木星币', '土星币', '天王星币', '海王星币', '冥王星币', '太阳币'] },
    // 神话类
    { prefix: 'MYTH', names: ['宙斯币', '雅典娜币', '波塞冬币', '哈迪斯币', '阿波罗币', '阿瑞斯币', '赫拉币', '赫淮斯托斯币', '赫尔墨斯币', '阿佛洛狄忒币'] },
    // 东方神话
    { prefix: 'EAST', names: ['盘古币', '女娲币', '伏羲币', '神农币', '黄帝币', '炎帝币', '蚩尤币', '后羿币', '嫦娥币', '玉帝币'] },
    // 美食类
    { prefix: 'FOOD', names: ['奶茶币', '火锅币', '烧烤币', '寿司币', '披萨币', '汉堡币', '拉面币', '炸鸡币', '咖啡币', '甜点币'] },
    // 艺术类
    { prefix: 'ART', names: ['画币', '音乐币', '舞蹈币', '戏剧币', '雕塑币', '摄影币', '电影币', '诗歌币', '书法币', '建筑币'] },
    // 时间类
    { prefix: 'TIME', names: ['秒币', '分币', '时币', '日币', '周币', '月币', '年币', '世纪币', '纪元币', '永恒币'] }
];

function generateCoins() {
    const coins = [];
    let id = 1;
    
    // 主流币
    coins.push({
        symbol: 'SHA3',
        name: 'Xia Coin',
        name_cn: '虾币',
        price: 100,
        color: '#FF6B6B',
        category: '主流'
    });
    
    // 生成各类币种
    cryptoCategories.forEach(cat => {
        cat.names.forEach((name, idx) => {
            coins.push({
                symbol: `${cat.prefix}-${String(idx + 1).padStart(3, '0')}`,
                name: `${name} Token`,
                name_cn: name,
                price: (Math.random() * 50 + 0.1).toFixed(2) * 1,
                color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                category: cat.prefix
            });
        });
    });
    
    return coins;
}

module.exports = { generateCoins, cryptoCategories };
