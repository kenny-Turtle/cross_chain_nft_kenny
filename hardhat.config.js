require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("hardhat-deploy")

const RPC_URL = process.env.RPC_URL
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const ACCOUNT_PRIVATE_KEY_1 = process.env.ACCOUNT_PRIVATE_KEY_1

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url: RPC_URL,
      accounts:[ACCOUNT_PRIVATE_KEY, ACCOUNT_PRIVATE_KEY_1],
      chainId: 11155111,
    }
  },
  etherscan:{
    apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts:{
    firstAccount:{
      default:0
    },
    secondAccount:{
      default:1
    }
  }
};
