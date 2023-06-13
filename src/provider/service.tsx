import React from 'react';

import { fromBigNum, tips } from '../utils/util';
import { getERC20Contract, getProvider } from 'blockchain';
import networks from '../blockchain/networks.json'

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

export const switchNetwork = async (chainID: number) => {
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

export const addTokenToMetamask = async (token: TokenObject) => {
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.token,
          symbol: token.symbol,
          decimals: token.decimal,
          image: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${token.chainID}/assets/${token.token}/logo.png`,
        }
      }
    })

    tips('success', 'Add token successed')
  } catch (err) {
    tips('warning', "Add token Failed")
  }
}

export const getTokenBalance = async (chain: ChainObject, token: TokenObject, address: string) => {
  try {
    let result = null

    if (!token.isNative) {
      const erc20Contract = getERC20Contract(chain, token)
      result = await erc20Contract.balanceOf(address)
    } else {
      const provider = getProvider(chain.rpcUrl)
      result = await provider.getBalance(address);
      console.log(result)
    }

    return fromBigNum(result, token.decimal) || 0
  } catch (error) {
    return 0
  }
}