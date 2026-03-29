import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: [
        "0x81a57c28d560293b92bec187dcb23ee4f07bb0e2034473bc77d5030920a7a1e3"
      ]
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: [
        "0x81a57c28d560293b92bec187dcb23ee4f07bb0e2034473bc77d5030920a7a1e3"
      ]
    }
  }
};

export default config;