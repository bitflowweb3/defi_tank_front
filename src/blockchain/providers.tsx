import { ethers } from "ethers";
import { config } from "../config/config";

const supportChainId = config.CHAINID;

const RPCS = {
  250: "https://rpc.ftm.tools/",
  4002: "https://rpc.testnet.fantom.network",
  9000: "https://eth.bd.evmos.dev:8545",
  9001: "https://eth.bd.evmos.org:8545",
  421613: "https://arbitrum-goerli.publicnode.com",
  421614: "https://sepolia-rollup.arbitrum.io/rpc",
  42161: "https://arb1.arbitrum.io/rpc",
  5: "https://goerli.blockpi.network/v1/rpc/public",
  534352: "https://scroll.blockpi.network/v1/rpc/public",
  534351: "https://sepolia-rpc.scroll.io",
};

const providers = (chainId) => {
  return new ethers.providers.JsonRpcProvider(RPCS[chainId])
};

const provider = providers(supportChainId);

export { provider, supportChainId }
