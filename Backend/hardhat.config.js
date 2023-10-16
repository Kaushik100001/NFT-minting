require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: 'goerli',
  networks:{
  hardhat: {},
  goerli: {
    url: 'https://goerli.infura.io/v3/a459e45c813c477589e5efd7b97ed4ca',
    accounts: ['b79dc3a198525a267fabfe7283b0054e4306c7b32a76d55af273c915d6c3c106']
  }
},
}

