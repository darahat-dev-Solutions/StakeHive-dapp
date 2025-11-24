// Importing chai's expect for writing assertions
const { expect } = require("chai");

// Import Hardhat's ethers.js package to interact with the blockchain

const { ethers } = require("hardhat");

describe("HiveToken", function () {
    let HiveToken, hiveToken, owner, addr1, addr2;
    // This function runs before each test in this suite
    beforeEach(async function () {
        // Get a list of available accounts from the blockchain environment
        [owner, addr1, addr2] = await ethers.getSigners();
        // Load the HiveToken contract factory (blueprint for deployment)
        HiveToken = await ethers.getContractFactory("HiveToken");

        //
    })
})