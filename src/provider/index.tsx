import React from "react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useWallet } from 'use-wallet';
import { useReducer, useMemo } from "react";
import { createContext, useContext } from "react";
import detectEthereumProvider from '@metamask/detect-provider'

import { restApi } from "./restApi";
import { config } from "../config/config";
import { getTokenBalance, switchNetwork } from "./service";
import { byte32code, fromBigNum, tips, toBigNum } from "../utils/util";
import { EnergyPool, EnergyPool_m, NFTTANK, RewardPool, TANKTOKEN, multicallHelper } from "../blockchain";

const metamaskStore = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'

const INIT_STATE: InitStateObject = {
  loading: false,
  mobileOpen: false,

  balance: 0,
  signer: null,
  account: null,
  walletStatus: 0, // 0: no metamask detect, 1: not connected, 2: connected

  itemDatas: [],
  guildDatas: [],
  tankItems: [],
  notifications: [],
  tankClasses: [],
  itemClasses: [],
  guildRules: {
    maxMembers: 0,
    price: 0,
  },

  stakes: {},
  stakeRate: 1,
  rewardPoolBalance: 1500,
  allowances: { toTank: 0, toPool: 0 },
  poolsInfo: { totalStakedAmount: 0, totalCapacity: 0 },
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

  // wallet section start
  useEffect(() => {
    (async () => {
      if (wallet.status === 'connected' && wallet.account) {
        const tempSigner = await getSigner()
        const tempAddr = wallet.account.toUpperCase()

        dispatch({ type: "account", payload: tempAddr })
        dispatch({ type: "signer", payload: tempSigner })
        dispatch({ type: "walletStatus", payload: 2 })
      } else {
        detect()
        dispatch({ type: "signer", payload: null })
        dispatch({ type: "account", payload: null })
      }
    })()
  }, [wallet.status, wallet.account, wallet.chainId])

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

  // interact with smart contract
  const approveToken = async (to: string, value: string | number) => {
    if (!state.signer) throw new Error("Wallet isn't connected!")
    let tx = await TANKTOKEN.connect(state.signer).approve(to, toBigNum(value, 18))
    await tx.wait()

    updateBalanceAndAlloance()
    return tx
  }

  const mintTank = async (id: number, price: number) => {
    if (!state.signer) {
      throw new Error("Wallet isn't connected!")
    }

    if (state.allowances.toTank < price) {
      await approveToken(NFTTANK.address, price * 100);
    }

    let refCode = window.localStorage.getItem("tank.refcode") || "";
    if (!byte32code(refCode)) {
      refCode = "0x32583431564b59484830444d43424e454a4f414f474250545547554d4c575400"
    }

    let tx = await NFTTANK.connect(state.signer).mint(String(id), refCode);
    return tx;
  }

  const upgradeNFT = async (id: string) => {
    const resData = await restApi.getUpgradeSignature(id)
    const { availableLevel, signature } = resData

    if (!state.signer) {
      throw new Error("Wallet isn't connected!")
    }

    console.log(String(id), String(availableLevel), signature);
    let tx = await NFTTANK.connect(state.signer).upgrade(
      String(id), String(availableLevel), signature
    )

    return tx
  }

  const stake = async (id: string, amount: number) => {
    if (state.allowances.toPool < amount) {
      await approveToken(EnergyPool.address, amount * 100)
    }

    let tx = await EnergyPool.connect(state.signer).stake(id, toBigNum(amount))
    await tx.wait()

    updatePoolStatus()
  }

  const unstake = async (id: string, amount: number) => {
    let tx = await EnergyPool.connect(state.signer).unstake(id, toBigNum(amount))
    await tx.wait()

    updatePoolStatus()
  }

  // data caching functions
  const updateBaseClasses = async () => {
    try {
      const tempDatas = await restApi.getBaseClasses()

      if (tempDatas.status) {
        dispatch({ type: "tankClasses", payload: tempDatas.data })
        // dispatch({ type: "itemClasses", payload: tempDatas.itemClasses })
        // dispatch({ type: "guildRules", payload: tempDatas.guildRules })
      }
    } catch (err: any) {
      console.log("provider/tankClasses", err.message)
    }
  }

  const updateBaseNfts = async () => {
    try {
      const resData = await restApi.getAllNfts()

      if (resData.status) {
        let tempItem: ItemObject[] = resData.nftItem
        let tempGuild: GuildObject[] = resData.nftGuild
        let tempTanks: NftTankObject[] = resData.nftTank

        dispatch({ type: "itemDatas", payload: tempItem });
        dispatch({ type: "guildDatas", payload: tempGuild });
        dispatch({ type: "tankItems", payload: tempTanks });

        // let totalStakedAmount = 0, totalCapacity = 0

        // tempTanks.forEach((tempTank: NftTankObject) => {
        //   totalStakedAmount += Number(tempTank.energyPool)
        //   totalCapacity += Number(tempTank.maxEnergyPool)
        // })

        // dispatch({ type: "poolsInfo", payload: { totalStakedAmount, totalCapacity } })
      }
    } catch (err: any) {
      console.log("provider/tankClasses", err.message);
    }
  }

  const updateBalanceAndAlloance = async () => {
    try {
      const tankAllowance = await TANKTOKEN.connect(state.signer).allowance(wallet.account, NFTTANK.address);
      const poolAllowance = await TANKTOKEN.connect(state.signer).allowance(wallet.account, EnergyPool.address);

      const tempAllow = state.allowances
      const allowTank = fromBigNum(tankAllowance, 18)
      const allowPool = fromBigNum(poolAllowance, 18)
      const balance = await getTokenBalance(wallet.account, state.signer)

      const flagBalance = state.balance !== balance
      const flagAllowTank = tempAllow.toTank !== allowTank
      const flagAllowPool = tempAllow.toPool !== allowPool

      if (flagBalance || flagAllowTank || flagAllowPool) {
        const tempPayload = {
          toTank: allowTank,
          toPool: allowPool
        }

        dispatch({ type: "balance", payload: balance })
        dispatch({ type: "allowances", payload: tempPayload })
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const updatePoolStatus = async () => {
    try {
      const poolRate = await EnergyPool.getRate()
      const tempRate = fromBigNum(poolRate, 6)
      dispatch({ type: "stakeRate", payload: tempRate })

      if (!!state.account) {
        const calls: any = state.tankItems.map((tankItem: NftTankObject) => {
          return EnergyPool_m.balanceOf(wallet.account, tankItem.id);
        })

        let tempStakes: any = {}
        let res = await multicallHelper(calls);

        state.tankItems.forEach((tankItem: NftTankObject, key: number) => {
          tempStakes[tankItem.id] = fromBigNum(res[key], 18)
        })

        dispatch({ type: "stakes", payload: tempStakes })
      } else {
        dispatch({ type: "stakes", payload: {} })
      }
    } catch (err: any) {
      console.log("updatePoolStatus :: ", err.message);
      dispatch({ type: "stakes", payload: {} })
    }
  }

  const updateRewardPoolBalance = async () => {
    try {
      const totalPool = await RewardPool.rewardPoolAmount()
      let rewardPool = Number(fromBigNum(totalPool) / 30)
      let maxReward = 1500;

      if (rewardPool > maxReward) rewardPool = maxReward
      dispatch({ type: "rewardPoolBalance", payload: rewardPool })
    } catch (err) {
      console.log('updateReward :: ', err.message)
    }
  }

  const updateNofitication = async () => {
    try {
      if (state.walletStatus !== 2) {
        throw new Error("please wallet connect")
      }

      let tempResult = await restApi.getAlert(state.account)
      dispatch({ type: "notifications", payload: tempResult })

      return true
    } catch (err) {
      if (state.notifications.length > 0) {
        dispatch({ type: "notifications", payload: [] })
      }

      return false
    }
  }

  useEffect(() => {
    updatePoolStatus()
    updateNofitication()

    if (state.walletStatus === 2) {
      updateBalanceAndAlloance()
    } else {
      const tempAllow = state.allowances

      if (state.balance !== 0 || tempAllow.toTank !== 0 || tempAllow.toPool !== 0) {
        dispatch({ type: "balance", payload: 0 })
        dispatch({
          type: "allowances",
          payload: { toTank: 0, toPool: 0 }
        })
      }
    }
  }, [state.walletStatus, state.tankItems])

  useEffect(() => {
    updateBaseNfts()
    updateBaseClasses()
    updateRewardPoolBalance()
    setInterval(updateBaseNfts, 5000)
  }, [])

  return (
    // @ts-ignore
    <GlobalContext.Provider
      value={useMemo(() => [
        state, {
          account: wallet.account,
          dispatch,
          connectToMetamask,
          disconnectMetamask,

          updateNofitication,
          approveToken,
          mintTank,
          upgradeNFT,
          stake,
          unstake,
        }
      ], [state])}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }