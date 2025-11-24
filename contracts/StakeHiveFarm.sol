//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//Main staking contract
contract StakeHiveFarm is Ownable {
    // the HIVE token users will stake and earn rewards in
    IERC20 public hiveToken;
    // Structure to store each stakers information
    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakedTime;
    }
    // Mapping of user address to their staking information
    mapping(address => StakeInfo) public stakers;
    // Reward rate: how many HIVE tokens per second per token staked
    uint256 public rewardRatePerSecond = 5e15; //0.01 HIVE per second
    // Total amount of tokens staked in by all users
    uint256 public totalStaked;
    //
    // uint256 public lastUpdateTime;
    // Counstructor runs once on deployment. Takes the HIVE token contract address.
    constructor(address _hiveToken) Ownable(msg.sender) {
        hiveToken = IERC20(_hiveToken);
    }
    /**
 @notice Stake Hive tokens into the farm
 @param _amount number of tokens to stake
 */

    // this function will only be called from outside the contract
    function stake(uint256 _amount) external {
        //  revert transactions if user tries  to stake 0 tokens
        //  it saves gas by failing early before state changes
        require(_amount > 0, "Amount must be greater than 0");
        // update any existing rewards before changing stake
        updateRewards(msg.sender);
        // transfer tokens from user to this contract
        hiveToken.transferFrom(msg.sender, address(this), _amount);
        // if user is staking for the first time, set their lastStakedTime
        if (stakers[msg.sender].lastStakedTime == 0) {
            stakers[msg.sender].lastStakedTime = block.timestamp;
        }
        // Update user's stake information

        stakers[msg.sender].amount += _amount;
        // Update total pool
        totalStaked += _amount;
    }
    /**
@notice internal function to update a user's rewards
@param user address of the staker
 */

    function updateRewards(address user) internal {
        StakeInfo storage info = stakers[user];

        if (info.amount > 0) {
            // Calculate how much time has passed since last update
            uint256 duration = block.timestamp - info.lastStakedTime;
            //calculate new rewards: stake * rate * time
            uint256 reward = (info.amount * rewardRatePerSecond * duration) /
                1e18;
            // Add to accumulated rewards
            info.rewardDebt += reward;

            //Reset last stake time
            info.lastStakedTime = block.timestamp;
        }
    }
    /**
 @notice widthdraw previously staked tokens
 @param _amount number of tokens to withdraw
 */
    function withdraw(uint256 _amount) external {
        require(stakers[msg.sender].amount >= _amount, "Insufficient stake");

        // Calculate & update rewards first
        updateRewards(msg.sender);

        // Decrease staked amount
        stakers[msg.sender].amount -= _amount;

        // Transfer tokens back to user
        hiveToken.transfer(msg.sender, _amount);
        // Decrease total staked pool
        totalStaked -= _amount;
    }
    /**
  @notice claim only the reward tokens (keep staked tokens untouched)
   */
    function claimRewards() external {
        // Calculate & update rewards first
        updateRewards(msg.sender);

        uint256 reward = stakers[msg.sender].rewardDebt;
        require(reward > 0, "No rewards");

        //  Reset rewardDebt before transfer (to prevent reentrancy issues)
        stakers[msg.sender].rewardDebt = 0;

        // Transfer rewards
        hiveToken.transfer(msg.sender, reward);
    }
    /**
   @notice Admin function to adjust reward rate
   @param _newRate New reward rate per second per token 
    */
    function setRewardRate(uint256 _newRate) external onlyOwner {
        rewardRatePerSecond = _newRate;
    }

    /**
     @notice Get pending (unclaimed) rewards for a user
     @param user Address to check
     @return Total unclaimed rewards
     */

    function getPendingRewards(address user) external view returns (uint256) {
        StakeInfo memory info = stakers[user];
        // If user has no staked tokens, return allready accumulated rewards
        if (info.amount == 0) return info.rewardDebt;

        // Calculate how much time has passed since last update
        uint256 duration = block.timestamp - info.lastStakedTime;

        // Calculate additional rewards since last stake/reward update
        uint256 reward = (info.amount * rewardRatePerSecond * duration) / 1e18;

        //return total unclaimed rewards (previously earned + newly calculated)
        return info.rewardDebt + reward;
    }
}
