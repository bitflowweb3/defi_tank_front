import React from "react";
import { ethers } from "ethers";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";

import Abis from "./abi/abis.json"
import Addresses from "./abi/addresses.json"
import { provider, supportChainId } from "./providers";

setMulticallAddress(250, "0x95060284EB5D2C335D2B9BF173e35aAB99719dAa");
setMulticallAddress(421613, "0x6B3a27944A73cB7a8a12aA6C45d196732e1E3543");
const multicallProvider = new Provider(provider, supportChainId);

// make contract objects
const NFTTANK = new ethers.Contract(Addresses.NFTTank, Abis.NFTTank, provider)
const EnergyPool = new ethers.Contract(Addresses.EnergyPool, Abis.EnergyPool, provider)
const TANKTOKEN = new ethers.Contract(Addresses.TankToken, Abis.TankToken, provider)
const getERC20Token = (address: string) => { return new ethers.Contract(address, Abis.TankToken, provider) }

const RewardPool = new ethers.Contract(Addresses.RewardPool, Abis.RewardPool, provider);

const NFTTANK_m = new Contract(Addresses.NFTTank, Abis.NFTTank);
const EnergyPool_m = new Contract(Addresses.EnergyPool, Abis.EnergyPool);
const TANKTOKEN_m = new Contract(Addresses.TankToken, Abis.TankToken);

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
  EnergyPool,
  TANKTOKEN,
  RewardPool,
  getERC20Token,

  NFTTANK_m,
  EnergyPool_m,
  TANKTOKEN_m
}