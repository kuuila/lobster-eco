// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CoralToken
 * @notice Non-transferable impact token for charity contributions
 */
contract CoralToken is ERC20, AccessControl {
    bytes32 public constant CHARITY_ROLE = keccak256("CHARITY_ROLE");
    
    mapping(address => bool) public charities;
    
    struct Contribution {
        uint256 amount;
        uint256 timestamp;
        string charity;
        string cause;
    }
    
    mapping(address => Contribution[]) public contributions;
    
    event ContributionRecorded(
        address indexed user, 
        uint256 amount, 
        string charity,
        uint256 coralMinted
    );
    
    constructor(address _admin) ERC20("Coral Impact", "CORAL") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(CHARITY_ROLE, _admin);
    }
    
    function addCharity(address _charity) external onlyRole(DEFAULT_ADMIN_ROLE) {
        charities[_charity] = true;
    }
    
    function recordContribution(
        address user,
        uint256 amount,
        string calldata charity,
        string calldata cause
    ) external onlyRole(CHARITY_ROLE) {
        uint256 coralAmount = amount;
        
        contributions[user].push(Contribution({
            amount: amount,
            timestamp: block.timestamp,
            charity: charity,
            cause: cause
        }));
        
        _mint(user, coralAmount);
        
        emit ContributionRecorded(user, amount, charity, coralAmount);
    }
    
    function getContributions(address user) external view returns (Contribution[] memory) {
        return contributions[user];
    }
    
    function transfer(address, uint256) public pure override returns (bool) {
        revert("CORAL is non-transferable");
    }
    
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("CORAL is non-transferable");
    }
}
