// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../tokens/PearlToken.sol";
import "../nfts/ItemNFT.sol";

/**
 * @title BattleArena
 * @notice PvP battle arena with betting
 */
contract BattleArena is AccessControl, ReentrancyGuard {
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    
    PearlToken public pearl;
    ItemNFT public items;
    
    enum ArenaLevel { Bronze, Silver, Gold, Diamond }
    
    struct ArenaConfig {
        uint256 entryFee;
        uint256 winReward;
        uint256 platformFee;
        bool requiresNFT;
    }
    
    mapping(ArenaLevel => ArenaConfig) public arenaConfigs;
    
    struct Battle {
        address player1;
        address player2;
        ArenaLevel level;
        uint256 betAmount;
        uint256 timestamp;
        address winner;
        bytes32 battleHash;
    }
    
    mapping(uint256 => Battle) public battles;
    uint256 public battleCount;
    
    struct PlayerStats {
        uint256 wins;
        uint256 losses;
        uint256 totalEarnings;
        uint256 totalSpent;
    }
    
    mapping(address => PlayerStats) public playerStats;
    
    event BattleStarted(uint256 indexed battleId, address player1, address player2, ArenaLevel level);
    event BattleEnded(uint256 indexed battleId, address winner, uint256 reward);
    event EntryFeePaid(address indexed player, ArenaLevel level, uint256 amount);
    
    constructor(address _pearl, address _items) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_ROLE, msg.sender);
        
        pearl = PearlToken(_pearl);
        items = ItemNFT(_items);
        
        arenaConfigs[ArenaLevel.Bronze] = ArenaConfig(0, 5 * 10**18, 0, false);
        arenaConfigs[ArenaLevel.Silver] = ArenaConfig(10 * 10**18, 16 * 10**18, 2 * 10**18, false);
        arenaConfigs[ArenaLevel.Gold] = ArenaConfig(50 * 10**18, 85 * 10**18, 7 * 10**18, false);
        arenaConfigs[ArenaLevel.Diamond] = ArenaConfig(100 * 10**18, 180 * 10**18, 10 * 10**18, true);
    }
    
    function payEntryFee(ArenaLevel level) external nonReentrant {
        ArenaConfig memory config = arenaConfigs[level];
        
        if (config.entryFee > 0) {
            pearl.transferFrom(msg.sender, address(this), config.entryFee);
        }
        
        playerStats[msg.sender].totalSpent += config.entryFee;
        
        emit EntryFeePaid(msg.sender, level, config.entryFee);
    }
    
    function createBattle(address player1, address player2, ArenaLevel level) external onlyRole(GAME_ROLE) returns (uint256) {
        ArenaConfig memory config = arenaConfigs[level];
        
        uint256 battleId = battleCount++;
        
        battles[battleId] = Battle({
            player1: player1,
            player2: player2,
            level: level,
            betAmount: config.entryFee * 2,
            timestamp: block.timestamp,
            winner: address(0),
            battleHash: bytes32(0)
        });
        
        emit BattleStarted(battleId, player1, player2, level);
        
        return battleId;
    }
    
    function endBattle(uint256 battleId, address winner, bytes32 battleHash) external onlyRole(GAME_ROLE) nonReentrant {
        Battle storage battle = battles[battleId];
        require(battle.winner == address(0), "Battle already ended");
        require(winner == battle.player1 || winner == battle.player2, "Invalid winner");
        
        battle.winner = winner;
        battle.battleHash = battleHash;
        
        ArenaConfig memory config = arenaConfigs[battle.level];
        
        if (config.winReward > 0) {
            pearl.gameMint(winner, config.winReward);
        }
        
        playerStats[winner].wins++;
        playerStats[winner].totalEarnings += config.winReward;
        
        address loser = winner == battle.player1 ? battle.player2 : battle.player1;
        playerStats[loser].losses++;
        
        emit BattleEnded(battleId, winner, config.winReward);
    }
    
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    function withdrawPlatformFees(address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = pearl.balanceOf(address(this));
        pearl.transfer(to, balance);
    }
}
