// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title LobsterNFT
 * @notice Lobster character NFT with stats and breeding
 */
contract LobsterNFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    enum Rarity { Common, Rare, Epic, Legendary, Mythic }
    
    struct LobsterStats {
        Rarity rarity;
        uint8 attackBonus;
        uint8 defenseBonus;
        uint8 stealBonus;
        uint8 bubbleBonus;
        uint256 bornAt;
        uint256 experience;
        uint256 level;
    }
    
    mapping(uint256 => LobsterStats) public lobsterStats;
    mapping(Rarity => uint256) public raritySupply;
    mapping(Rarity => uint256) public rarityMinted;
    mapping(uint256 => uint256) public lastBreedTime;
    
    uint256 public constant BREED_COOLDOWN = 7 days;
    
    event LobsterMinted(uint256 indexed tokenId, Rarity rarity, address owner);
    event LobsterBred(uint256 indexed parent1, uint256 indexed parent2, uint256 child);
    event LevelUp(uint256 indexed tokenId, uint256 newLevel);
    
    constructor() ERC721("Lobster Battle NFT", "LBNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        raritySupply[Rarity.Common] = type(uint256).max;
        raritySupply[Rarity.Rare] = 10000;
        raritySupply[Rarity.Epic] = 1000;
        raritySupply[Rarity.Legendary] = 100;
        raritySupply[Rarity.Mythic] = 10;
    }
    
    function mint(address to, Rarity rarity, string memory uri) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(rarityMinted[rarity] < raritySupply[rarity], "Rarity sold out");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        rarityMinted[rarity]++;
        
        LobsterStats memory stats = _generateStats(rarity);
        stats.bornAt = block.timestamp;
        lobsterStats[tokenId] = stats;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit LobsterMinted(tokenId, rarity, to);
        
        return tokenId;
    }
    
    function breed(uint256 parent1Id, uint256 parent2Id, string memory childUri) external returns (uint256) {
        require(ownerOf(parent1Id) == msg.sender && ownerOf(parent2Id) == msg.sender, "Not owner");
        require(block.timestamp >= lastBreedTime[parent1Id] + BREED_COOLDOWN && block.timestamp >= lastBreedTime[parent2Id] + BREED_COOLDOWN, "Breeding on cooldown");
        
        lastBreedTime[parent1Id] = block.timestamp;
        lastBreedTime[parent2Id] = block.timestamp;
        
        Rarity childRarity = _calculateChildRarity(lobsterStats[parent1Id].rarity, lobsterStats[parent2Id].rarity);
        
        uint256 childId = mint(msg.sender, childRarity, childUri);
        
        emit LobsterBred(parent1Id, parent2Id, childId);
        
        return childId;
    }
    
    function levelUp(uint256 tokenId, uint256 expGain) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        
        LobsterStats storage stats = lobsterStats[tokenId];
        stats.experience += expGain;
        
        uint256 newLevel = stats.experience / 1000;
        if (newLevel > stats.level) {
            stats.level = newLevel;
            stats.attackBonus += 1;
            stats.defenseBonus += 1;
            emit LevelUp(tokenId, newLevel);
        }
    }
    
    function getStats(uint256 tokenId) external view returns (LobsterStats memory) {
        return lobsterStats[tokenId];
    }
    
    function _generateStats(Rarity rarity) internal pure returns (LobsterStats memory) {
        LobsterStats memory stats;
        stats.rarity = rarity;
        
        if (rarity == Rarity.Rare) {
            stats.attackBonus = 10;
            stats.defenseBonus = 5;
            stats.stealBonus = 5;
            stats.bubbleBonus = 5;
        } else if (rarity == Rarity.Epic) {
            stats.attackBonus = 20;
            stats.defenseBonus = 15;
            stats.stealBonus = 15;
            stats.bubbleBonus = 10;
        } else if (rarity == Rarity.Legendary) {
            stats.attackBonus = 30;
            stats.defenseBonus = 25;
            stats.stealBonus = 25;
            stats.bubbleBonus = 20;
        } else if (rarity == Rarity.Mythic) {
            stats.attackBonus = 50;
            stats.defenseBonus = 40;
            stats.stealBonus = 40;
            stats.bubbleBonus = 30;
        }
        
        return stats;
    }
    
    function _calculateChildRarity(Rarity r1, Rarity r2) internal view returns (Rarity) {
        uint8 avgRarity = (uint8(r1) + uint8(r2)) / 2;
        
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)));
        
        if (random % 100 < 5) {
            return Rarity(_min(uint8(Rarity.Mythic), avgRarity + 1));
        } else if (random % 100 < 15) {
            return Rarity(_max(0, avgRarity - 1));
        } else {
            return Rarity(avgRarity);
        }
    }
    
    function _min(uint8 a, uint8 b) internal pure returns (uint8) {
        return a < b ? a : b;
    }
    
    function _max(uint8 a, uint8 b) internal pure returns (uint8) {
        return a > b ? a : b;
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
