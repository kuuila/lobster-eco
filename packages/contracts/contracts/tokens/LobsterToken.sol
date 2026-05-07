// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title LobsterToken
 * @notice Governance token for Lobster Battle DAO
 */
contract LobsterToken is ERC20, ERC20Votes, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    address public stakingContract;
    
    event StakingContractUpdated(address indexed oldAddress, address indexed newAddress);
    
    constructor(
        address _treasury,
        address _communityAirdrop,
        address _team,
        address _partners
    ) ERC20("Lobster Battle", "LOBSTER") ERC20Permit("Lobster Battle") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        uint256 total = MAX_SUPPLY;
        
        _mint(_treasury, total * 25 / 100);
        _mint(_communityAirdrop, total * 30 / 100);
        _mint(_team, total * 15 / 100);
        _mint(_partners, total * 15 / 100);
        _mint(msg.sender, total * 15 / 100);
    }
    
    function setStakingContract(address _stakingContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit StakingContractUpdated(stakingContract, _stakingContract);
        stakingContract = _stakingContract;
    }
    
    function mintStakingReward(address to, uint256 amount) external {
        require(msg.sender == stakingContract, "Only staking contract");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }
    
    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }
    
    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
