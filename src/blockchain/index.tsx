import { ethers } from "ethers";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";

import Abis from "./abi/abis.json"
import Addresses from "./abi/addresses.json"
import { provider, supportChainId } from "./providers";

// setMulticallAddress(421613, "0x6B3a27944A73cB7a8a12aA6C45d196732e1E3543");
setMulticallAddress(421614, "0xcA0583b6E26Cc37300879ED9A03385dd91ddd5c5");
setMulticallAddress(42161, "0xc7702Db776C3242Af6d54722742C07de4bE78cA2");
const multicallProvider = new Provider(provider, supportChainId);

// make contract objects
const TANKTOKEN = new ethers.Contract(Addresses.mainToken, Abis.ERC20, provider)
const NFTTANK = new ethers.Contract(Addresses.tankNFT, Abis.tankNFT, provider)
const NFTGUILD = new ethers.Contract(Addresses.factoryNFT, Abis.factoryNFT, provider)
const EnergyPool = new ethers.Contract(Addresses.factoryStaking, Abis.factoryStaking, provider)
const getERC20Token = (address: string) => { return new ethers.Contract(address, Abis.ERC20, provider) }
const EnergyPool_m = new Contract(Addresses.factoryStaking, Abis.factoryStaking);

const multicallHelper = async (calls: any) => {
  let results: any = [];
  for (let i = 0; i < calls.length; i += 100) {
    const sCalls = calls.slice(i, i + 100);
    const res = await multicallProvider.all(sCalls);
    results = [...results, ...res];
  }

  return results;
}

export {
  provider, multicallProvider,
  multicallHelper,
  NFTTANK,
  NFTGUILD,
  EnergyPool,
  TANKTOKEN,
  getERC20Token,

  EnergyPool_m,
}