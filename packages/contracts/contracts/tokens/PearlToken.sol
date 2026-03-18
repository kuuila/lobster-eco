// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PearlToken
 * @notice Game token for Lobster Battle
 */
contract PearlToken is ERC20, AccessControl {
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    
    uint256 public dailyMintCap;
    uint256 public dailyMinted;
    uint256 public lastResetTime;
    uint256 public totalBurned;
    
    mapping(address => bool) public gameContracts;
    
    event GameContractAdded(address indexed gameContract);
    event GameContractRemoved(address indexed gameContract);
    event TokensBurned(address indexed from, uint256 amount);
    event DailyMintCapUpdated(uint256 newCap);
    
    constructor(
        address _admin,
        uint256 _initialSupply,
        uint256 _dailyMintCap
    ) ERC20("Pearl", "PEARL") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(GAME_ROLE, _admin);
        
        dailyMintCap = _dailyMintCap;
        lastResetTime = block.timestamp;
        
        _mint(_admin, _initialSupply);
    }
    
    function addGameContract(address _gameContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        gameContracts[_gameContract] = true;
        emit GameContractAdded(_gameContract);
    }
    
    function removeGameContract(address _gameContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        gameContracts[_gameContract] = false;
        emit GameContractRemoved(_gameContract);
    }
    
    function gameMint(address to, uint256 amount) external {
        require(gameContracts[msg.sender], "Only game contracts");
        
        if (block.timestamp >= lastResetTime + 1 days) {
            dailyMinted = 0;
            lastResetTime = block.timestamp;
        }
        
        require(dailyMinted + amount <= dailyMintCap, "Exceeds daily cap");
        
        dailyMinted += amount;
        _mint(to, amount);
    }
    
    function gameBurn(address from, uint256 amount) external {
        require(gameContracts[msg.sender], "Only game contracts");
        
        _burn(from, amount);
        totalBurned += amount;
        emit TokensBurned(from, amount);
    }
    
    function updateDailyMintCap(uint256 _newCap) external onlyRole(DEFAULT_ADMIN_ROLE) {
        dailyMintCap = _newCap;
        emit DailyMintCapUpdated(_newCap);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        totalBurned += amount;
        emit TokensBurned(msg.sender, amount);
    }
}
