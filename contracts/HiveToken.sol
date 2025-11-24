// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract HiveToken is ERC20, Ownable, ERC20Burnable, ERC20Permit {
    // Constructor - Runs once during contract deployment
    constructor(
        uint256 initialSupply // Total initial token supply
    )
        // Initialize parent contracts:
        ERC20("HiveToken", "HIVE") //Sets token name & symbol (ERC20 standart)
        Ownable(msg.sender) // Makes deployer the contract owner
        ERC20Permit("HiveToken") // Enables gasless approvals (EIP-2612)
    {
        _mint(msg.sender, initialSupply);
    }
    // Mint initial supply to contract deployer
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
