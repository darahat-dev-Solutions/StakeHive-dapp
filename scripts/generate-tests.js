const { generateTests } = require('@openzeppelin/test-helpers');

async function main() {
    await generateTests(
        {
    contract: 'HiveToken',
    artifactsPath: './artifacts/contracts/HiveToken.sol/HiveToken.json',
    outputFile: './test/HiveToken.test.js',
    mocha: true,
    web3: false
        },
        {
    contract: 'StakeHiveFarm',
    artifactsPath: './artifacts/contracts/StakeHiveFarm.sol/StakeHiveFarm.json',
    outputFile: './test/StakeHiveFarm.test.js',
    mocha: true,
    web3: false
        },    

    );
    
}
main().catch(console.error);
