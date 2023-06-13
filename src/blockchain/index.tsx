import React from 'react';
import { ethers } from 'ethers';
import abis from './abi/abis.json'

export const getProvider = (rpcUrl: string) => {
  return new ethers.providers.JsonRpcProvider(rpcUrl)
}

export const getERC20Contract = (chain: ChainObject, token: TokenObject) => {
  const provider = getProvider(chain.rpcUrl)

  return new ethers.Contract(
    token.token,
    abis.ERC20,
    provider
  )
}

export const getBridgeContract = (chain: ChainObject) => {
  const provider = getProvider(chain.rpcUrl)

  return new ethers.Contract(
    chain.poolAddr,
    abis.bridge,
    provider
  )
}