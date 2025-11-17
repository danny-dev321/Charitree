import { configVariable } from "hardhat/config";
import { default as hardhatEthers } from "@nomicfoundation/hardhat-ethers";
import { default as hardhatIgnitionEthers } from "@nomicfoundation/hardhat-ignition-ethers";
import { default as hardhatKeystore } from "@nomicfoundation/hardhat-keystore";


export default {
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    moonbase: {
      type: "http",
      chainType: "generic",
      chainId: 1287,
      url: configVariable("MOONBASE_RPC_URL"),
      accounts: [configVariable("MOONBASE_PRIVATE_KEY")],
    }
  },
};
