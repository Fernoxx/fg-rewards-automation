// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IGelatoOps {
    function createTask(
        address execAddress,
        bytes4 execSelector,
        address resolverAddress,
        bytes calldata resolverData,
        address feeToken,
        bool useTreasury
    ) external returns (bytes32 taskId);
    
    function depositFunds(bytes32 taskId, uint256 amount) external;
}

contract FGRewardsAutomation is Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable fgToken;
    IGelatoOps public immutable gelatoOps;
    
    struct HolderInfo {
        bool isActive;
        uint256 balance;
        uint256 lastClaim;
        uint256 totalClaimed;
        uint256 rewardRate;
        uint256 lastUpdate;
        bool isEligible;
    }
    
    mapping(address => HolderInfo) public holders;
    address[] public holderList;
    uint256 public totalHolders;
    uint256 public totalDistributed;
    uint256 public constant MIN_BALANCE = 1000000 * 10**18; // 1M tokens minimum
    
    event HolderAdded(address indexed holder, uint256 balance);
    event RewardsDistributed(address indexed holder, uint256 amount);
    event BatchHoldersAdded(address[] holders);
    
    constructor(
        address _fgToken,
        address _gelatoOps,
        address _owner
    ) {
        fgToken = IERC20(_fgToken);
        gelatoOps = IGelatoOps(_gelatoOps);
        _transferOwnership(_owner);
    }
    
    function addHolder(address holder) external onlyOwner {
        require(!holders[holder].isActive, "Holder already exists");
        
        uint256 balance = fgToken.balanceOf(holder);
        require(balance >= MIN_BALANCE, "Insufficient balance");
        
        holders[holder] = HolderInfo({
            isActive: true,
            balance: balance,
            lastClaim: block.timestamp,
            totalClaimed: 0,
            rewardRate: 0,
            lastUpdate: block.timestamp,
            isEligible: true
        });
        
        holderList.push(holder);
        totalHolders++;
        
        emit HolderAdded(holder, balance);
    }
    
    function batchAddHolders(address[] calldata newHolders) external onlyOwner {
        for (uint256 i = 0; i < newHolders.length; i++) {
            address holder = newHolders[i];
            if (!holders[holder].isActive) {
                uint256 balance = fgToken.balanceOf(holder);
                if (balance >= MIN_BALANCE) {
                    holders[holder] = HolderInfo({
                        isActive: true,
                        balance: balance,
                        lastClaim: block.timestamp,
                        totalClaimed: 0,
                        rewardRate: 0,
                        lastUpdate: block.timestamp,
                        isEligible: true
                    });
                    
                    holderList.push(holder);
                    totalHolders++;
                }
            }
        }
        
        emit BatchHoldersAdded(newHolders);
    }
    
    function distributeRewards() external {
        require(totalHolders > 0, "No holders to distribute to");
        
        uint256 contractBalance = fgToken.balanceOf(address(this));
        require(contractBalance > 0, "No tokens to distribute");
        
        uint256 rewardPerHolder = contractBalance / totalHolders;
        
        for (uint256 i = 0; i < holderList.length; i++) {
            address holder = holderList[i];
            if (holders[holder].isActive && holders[holder].isEligible) {
                fgToken.safeTransfer(holder, rewardPerHolder);
                
                holders[holder].totalClaimed += rewardPerHolder;
                holders[holder].lastClaim = block.timestamp;
                
                totalDistributed += rewardPerHolder;
                
                emit RewardsDistributed(holder, rewardPerHolder);
            }
        }
    }
    
    function getHolderCount() external view returns (uint256) {
        return totalHolders;
    }
    
    function getHolderInfo(address holder) external view returns (
        bool isActive,
        uint256 balance,
        uint256 lastClaim,
        uint256 totalClaimed,
        uint256 rewardRate,
        uint256 lastUpdate,
        bool isEligible
    ) {
        HolderInfo memory info = holders[holder];
        return (
            info.isActive,
            info.balance,
            info.lastClaim,
            info.totalClaimed,
            info.rewardRate,
            info.lastUpdate,
            info.isEligible
        );
    }
    
    function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory) {
        // Check if there are holders and tokens to distribute
        upkeepNeeded = totalHolders > 0 && fgToken.balanceOf(address(this)) > 0;
        return (upkeepNeeded, "");
    }
    
    function performUpkeep(bytes calldata) external {
        distributeRewards();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = fgToken.balanceOf(address(this));
        fgToken.safeTransfer(owner(), balance);
    }
}