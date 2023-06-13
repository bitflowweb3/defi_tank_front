import React from "react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useWallet } from 'use-wallet';
import { useReducer, useMemo } from "react";
import { createContext, useContext } from "react";
import detectEthereumProvider from '@metamask/detect-provider'

import { tips } from "../utils/util";
import { config } from "../config/config";
import { getTokenBalance, switchNetwork } from "./service";

const metamaskStore = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'

const INIT_STATE: InitStateObject = {
  loading: false,
  mobileOpen: false,

  balance: 0,
  signer: null,
  account: null,
  walletStatus: 0, // 0: no metamask detect, 1: not connected, 2: connected

  notifications: [],
}

// create context
const GlobalContext = createContext<any>({});
const reducer = (state: InitStateObject, { type, payload }: ReducerObject) => (
  { ...state, [type]: payload }
)

// use contexts
function useGlobalContext() {
  return useContext(GlobalContext);
}

const GlobalProvider = ({ children }: any) => {
  const wallet: any = useWallet()
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  useEffect(() => {
    if (state.walletStatus === 2) {
      getUserBalance()
    } else {
      if (state.balance !== 0) {
        dispatch({ type: "balance", payload: 0 })
      }
    }
  }, [state.walletStatus])

  const getUserBalance = async () => {
    const balance = await getTokenBalance(state.account, state.signer)

    if (state.balance !== balance) {
      dispatch({ type: "balance", payload: balance })
    }
  }

  // wallet section start
  useEffect(() => {
    (async () => {
      if (wallet.status === 'connected') {
        const tempSigner = await getSigner()

        dispatch({ type: "account", payload: wallet.account })
        dispatch({ type: "signer", payload: tempSigner })
        dispatch({ type: "walletStatus", payload: 2 })
      } else {
        detect()
        dispatch({ type: "signer", payload: null })
        dispatch({ type: "account", payload: null })
      }
    })()
  }, [wallet.status, wallet.chainId])

  const detect = async () => {
    let tempStatus = 0
    let provider = await detectEthereumProvider()
    if (provider) tempStatus = 1

    if (state.walletStatus !== tempStatus) {
      dispatch({ type: "walletStatus", payload: tempStatus })
    }
  }

  const metamakConnect = async () => {
    return new Promise<boolean>(async (resolve) => {
      try {
        await wallet.connect().then(async () => {
          if (wallet.chainId !== config.CHAINID) {
            await switchNetwork(config.CHAINID) // if chain error
          }

          resolve(true)
        })
      } catch (err: any) {
        console.log(err.message)
        tips('warning', err.message)

        resolve(false)
      }
    })
  }

  const connectToMetamask = async () => {
    let tempState = false

    if (state.walletStatus === 0) {
      window.open(metamaskStore, "_blank");
    } else if (state.walletStatus === 1) {
      metamakConnect()
    } else if (state.walletStatus === 2) {
      tempState = true
    }

    return tempState
  }

  const disconnectMetamask = async () => {
    wallet.reset()
  }
  // wallet sectio end

  // blockchain actions start
  const getSigner = async () => {
    const provider = new ethers.providers.Web3Provider(
      wallet.ethereum
    )

    return await provider.getSigner()
  }
  // blockchain actions end

  return (
    // @ts-ignore
    <GlobalContext.Provider
      value={useMemo(() => [
        state, {
          dispatch,
          connectToMetamask,
          disconnectMetamask,
        }
      ], [state])}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }