// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ItemNFT
 * @notice Game items as ERC-1155
 */
contract ItemNFT is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 public constant WEAPON_SMALL_CLAW = 1;
    uint256 public constant WEAPON_BIG_CLAW = 2;
    uint256 public constant WEAPON_GIANT_CLAW = 3;
    uint256 public constant WEAPON_GOD_CLAW = 4;
    
    uint256 public constant ARMOR_SHELL = 10;
    uint256 public constant ARMOR_IRON = 11;
    uint256 public constant ARMOR_DIAMOND = 12;
    
    uint256 public constant ACCESSORY_SPEED = 20;
    uint256 public constant ACCESSORY_SENSE = 21;
    uint256 public constant ACCESSORY_REGEN = 22;
    
    uint256 public constant CONSUMABLE_POTION = 30;
    uint256 public constant CONSUMABLE_REVIVE = 31;
    
    struct ItemStats {
        string name;
        uint8 attackBonus;
        uint8 defenseBonus;
        uint8 specialEffect;
        uint256 price;
        bool isConsumable;
    }
    
    mapping(uint256 => ItemStats) public itemStats;
    
    event ItemCrafted(address indexed player, uint256 itemId, uint256 amount);
    event ItemUsed(address indexed player, uint256 itemId, uint256 amount);
    
    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        _initializeItems();
    }
    
    function _initializeItems() internal {
        itemStats[WEAPON_SMALL_CLAW] = ItemStats("Small Claw", 1, 0, 0, 1 * 10**18, false);
        itemStats[WEAPON_BIG_CLAW] = ItemStats("Big Claw", 2, 0, 1, 2 * 10**18, false);
        itemStats[WEAPON_GIANT_CLAW] = ItemStats("Giant Claw", 3, 0, 2, 5 * 10**18, false);
        itemStats[WEAPON_GOD_CLAW] = ItemStats("God Claw", 5, 2, 3, 20 * 10**18, false);
        
        itemStats[ARMOR_SHELL] = ItemStats("Shell Armor", 0, 1, 0, 1 * 10**18, false);
        itemStats[ARMOR_IRON] = ItemStats("Iron Armor", 0, 2, 0, 3 * 10**18, false);
        itemStats[ARMOR_DIAMOND] = ItemStats("Diamond Armor", 0, 4, 4, 10 * 10**18, false);
        
        itemStats[ACCESSORY_SPEED] = ItemStats("Speed Accessory", 0, 0, 10, 2 * 10**18, false);
        itemStats[ACCESSORY_SENSE] = ItemStats("Sense Accessory", 0, 0, 11, 2 * 10**18, false);
        itemStats[ACCESSORY_REGEN] = ItemStats("Regen Accessory", 0, 0, 12, 5 * 10**18, false);
        
        itemStats[CONSUMABLE_POTION] = ItemStats("Potion", 0, 0, 20, 3 * 10**18, true);
        itemStats[CONSUMABLE_REVIVE] = ItemStats("Revive Seaweed", 0, 0, 21, 10 * 10**18, true);
    }
    
    function craftItem(address player, uint256 itemId, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(player, itemId, amount, "");
        emit ItemCrafted(player, itemId, amount);
    }
    
    function useItem(address player, uint256 itemId, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(itemStats[itemId].isConsumable, "Not consumable");
        _burn(player, itemId, amount);
        emit ItemUsed(player, itemId, amount);
    }
    
    function getItemStats(uint256 itemId) external view returns (ItemStats memory) {
        return itemStats[itemId];
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
