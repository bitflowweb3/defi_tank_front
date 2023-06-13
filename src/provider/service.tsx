import React from 'react';

import networks from "../blockchain/networks.json"
import { fromBigNum, tips } from '../utils/util';
import { TANKTOKEN } from 'blockchain';

const addNetwork = async (chainId: number) => {
  try {
    const network = networks.find((data) => (
      data.chainId === chainId
    ))

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${Number(chainId).toString(16)}`,
          chainName: network.name,
          nativeCurrency: {
            name: network.name,
            symbol: network.symbol,
            decimals: network.decimals,
          },
          rpcUrls: [network.rpc],
          blockExplorerUrls: [network.explorer],
        }
      ]
    })
  } catch (err) {
    tips('warning', "Error add network")
  }
}

const switchNetwork = async (chainID: number) => {
  const tempID = '0x' + chainID.toString(16)

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: tempID }],
    })

    return true
  } catch (err) {
    // if user didn't reject
    if (err.code !== 4001) {
      addNetwork(chainID)
    } else {
      console.log(err.message)
      // tips('warning', err.message)
    }

    return false
  }
}

const getTokenBalance = async (address: string, signer: any) => {
  try {
    const balance = await TANKTOKEN.connect(signer).balanceOf(address)
    return fromBigNum(balance, 18)
  } catch (err) {
    console.log("getTank Token error :: ", err.message)
    return 0
  }
}

export { switchNetwork, getTokenBalance }