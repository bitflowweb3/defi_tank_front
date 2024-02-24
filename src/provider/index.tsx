import React from "react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useWallet } from 'use-wallet';
import { useReducer, useMemo } from "react";
import { createContext, useContext } from "react";
import detectEthereumProvider from '@metamask/detect-provider';

import { restApi } from "./restApi";
import { config } from "../config/config";
import { getTokenBalance, switchNetwork } from "./service";
import { EnergyPool_m, multicallHelper } from "../blockchain";
import { byte32code, fromBigNum, tips, toBigNum } from "../utils/util";
import { EnergyPool, NFTGUILD, NFTTANK, TANKTOKEN, } from "../blockchain";
const metamaskStore = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';

const INIT_STATE: InitStateObject = {
  loading: false,
  mobileOpen: false,

  balance: 0,
  signer: null,
  account: null,
  walletStatus: 0, // 0: no metamask detect, 1: not connected, 2: connected

  tankItems: [],
  guildDatas: [],
  tankClasses: [],
  guildRules: { maxMembers: 0, price: 0 },

  stakes: {},
  allowances: { toTank: 0, toGuild: 0, toPool: 0 },
  poolsInfo: { apy: 0, totalStaked: 0, totalCapacity: 0 },
  stakeRewards: { rewardDFTL: 0, rewardETH: 0 },

  potionInfo: { price: 0, sellPrice: 0, increase: 0 },
  topPlayReward: 0,
  topGuildReward: 0,
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

  // blockchain actions start
  const getSigner = async () => {
    const provider = new ethers.providers.Web3Provider(
      wallet.ethereum
    )

    return await provider.getSigner();
  }

  const walletStatusDetect = async () => {
    let tempStatus = 0;
    let provider = await detectEthereumProvider();
    if (provider) tempStatus = 1;

    if (state.walletStatus !== tempStatus) {
      dispatch({ type: "walletStatus", payload: tempStatus });
    }
  }
  // blockchain actions end

  // wallet section start
  useEffect(() => {
    (async () => {
      if (wallet.status === 'connected' && wallet.account) {
        const tempSigner = await getSigner();
        const tempAddr = wallet.account.toUpperCase();

        dispatch({ type: "account", payload: tempAddr });
        dispatch({ type: "signer", payload: tempSigner });
        dispatch({ type: "walletStatus", payload: 2 });
      } else {
        walletStatusDetect();
        dispatch({ type: "signer", payload: null });
        dispatch({ type: "account", payload: null });
      }
    })()
  }, [wallet.status, wallet.account, wallet.chainId])

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
        console.log("provider/metamakConnect::")
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
  // wallet section end

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
      refCode = "0x424730485042474b34415151485748454e4545434e50574c4830594642565600";
    }

    let tx = await NFTTANK.connect(state.signer).mint(String(id), refCode);

    return tx;
  }
  const mintGuild = async () => {
    const price = state.guildRules.price

    if (!state.signer) {
      throw new Error("Wallet isn't connected!")
    }

    if (state.allowances.toGuild < price) {
      await approveToken(NFTGUILD.address, price * 100);
    }

    let refCode = window.localStorage.getItem("tank.refcode") || "";
    if (!byte32code(refCode)) {
      refCode = "0x424730485042474b34415151485748454e4545434e50574c4830594642565600";
    }

    let tx = await NFTGUILD.connect(state.signer).mint(0, refCode);

    return tx;
  }

  const upgradeNFT = async (id: string) => {
    const resData = await restApi.getUpgradeSignature(id)
    const { availableLevel, signature } = resData;

    if (!state.signer) {
      throw new Error("Wallet isn't connected!");
    }

    let tx = await NFTGUILD.connect(state.signer).upgrade(
      String(id), String(availableLevel), signature
    )

    return tx
  }

  const stake = async (id: string, amount: number) => {
    if (state.allowances.toPool < amount) {
      await approveToken(EnergyPool.address, amount * 100);
    }

    let tx = await EnergyPool.connect(state.signer).stake(id, toBigNum(amount));
    await tx.wait();

    updatePoolStatus();
  }

  const unstake = async (id: string, amount: number) => {
    let tx = await EnergyPool.connect(state.signer).unStake(id, toBigNum(amount))
    await tx.wait();

    updatePoolStatus();
  }

  const claimStakeReward = async () => {
    if (!wallet.account) {
      throw new Error("Please wallet connect.");
    }

    await EnergyPool.connect(state.signer).claimReward(wallet.account);
  }

  // data caching functions
  const getPlatformConfigs = async () => {
    try {
      const tempDatas = await restApi.getBaseClasses();
      const tempConfig = await restApi.getGlobalConfig();

      dispatch({ type: "guildRules", payload: tempDatas.guildRule });
      dispatch({ type: "tankClasses", payload: tempDatas.tankClasses });

      // global_config_info
      dispatch({ type: "potionInfo", payload: tempConfig.potionInfo });
      dispatch({ type: "topPlayReward", payload: tempConfig.topPlayReward });
      dispatch({ type: "topGuildReward", payload: tempConfig.topGuildReward });
    } catch (err: any) {
      console.log("provider/getBaseInformation::", err.message);
    }
  }

  const updateBaseNfts = async () => {
    try {
      const resData = await restApi.getAllNfts();
      const tempGuild: GuildObject[] = resData.guilds;
      const tempTanks: NftTankObject[] = resData.tanks;

      dispatch({ type: "tankItems", payload: tempTanks });
      dispatch({ type: "guildDatas", payload: tempGuild });
      dispatch({ type: "poolsInfo", payload: resData.poolsInfo });
    } catch (err: any) {
      console.log("provider/updateBaseNfts::", err.message);
    }
  }

  const updateBalanceAndAlloance = async () => {
    try {
      if (state.walletStatus !== 2) {
        throw new Error("Please wallet connect!");
      }

      const tankAllowance = await TANKTOKEN.connect(state.signer).allowance(wallet.account, NFTTANK.address);
      const guildAllowance = await TANKTOKEN.connect(state.signer).allowance(wallet.account, NFTGUILD.address);
      const poolAllowance = await TANKTOKEN.connect(state.signer).allowance(wallet.account, EnergyPool.address);

      const allowTank = fromBigNum(tankAllowance, 18)
      const allowGuild = fromBigNum(guildAllowance, 18)
      const allowPool = fromBigNum(poolAllowance, 18)
      const balance = await getTokenBalance(wallet.account, state.signer)

      const flagBalance = state.balance !== balance;
      const flagAllowTank = state.allowances.toTank !== allowTank;
      const flagAllowGuild = state.allowances.toGuild !== allowPool;
      const flagAllowPool = state.allowances.toPool !== allowGuild;

      if (flagBalance || flagAllowTank || flagAllowGuild || flagAllowPool) {
        const tempPayload = {
          toTank: allowTank,
          toPool: allowPool,
          toGuild: allowGuild,
        }

        dispatch({ type: "balance", payload: balance })
        dispatch({ type: "allowances", payload: tempPayload })
      }
    } catch (err) {
      dispatch({ type: "balance", payload: 0 });
      dispatch({ type: "allowances", payload: { toTank: 0, toPool: 0 } });
    }
  }

  const updatePoolStatus = async () => {
    try {
      if (state.walletStatus === 2) {
        const calls: any = state.guildDatas.map((gruildData: GuildObject) => {
          return EnergyPool_m.balanceOf(wallet.account, gruildData.id);
        })

        let tempStakes: any = {}
        let res = await multicallHelper(calls);
        state.guildDatas.forEach((gruildData: GuildObject, key: number) => {
          tempStakes[gruildData.id] = fromBigNum(res[key], 18)
        })

        dispatch({ type: "stakes", payload: tempStakes })
      } else {
        dispatch({ type: "stakes", payload: {} })
      }
    } catch (err: any) {
      console.log("provider/updatePoolStatus::", err.message);
      dispatch({ type: "stakes", payload: {} })
    }
  }

  const updateStakeRewardAmount = async () => {
    try {
      if (state.walletStatus !== 2 && !state.signer) {
        throw new Error("please wallet connect")
      }

      const tempData = await EnergyPool.getClaimableAmounts(wallet.account)
      const tempRewardDFTL = fromBigNum(tempData[0])
      const tempRewardETH = fromBigNum(tempData[1])

      dispatch({
        type: "stakeRewards",
        payload: {
          rewardDFTL: tempRewardDFTL,
          rewardETH: tempRewardETH
        }
      })
    } catch (err) {
      dispatch({
        type: "stakeRewards",
        payload: { rewardDFTL: 0, rewardETH: 0 }
      })
    }
  }

  useEffect(() => {
    updatePoolStatus();
    updateStakeRewardAmount();
    updateBalanceAndAlloance();
  }, [state.walletStatus, state.guildDatas])

  useEffect(() => {
    updateBaseNfts();
    getPlatformConfigs();
    setInterval(updateBaseNfts, 5000);
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

          stake,
          unstake,
          mintTank,
          mintGuild,
          upgradeNFT,
          claimStakeReward,
          updateBaseNfts,
        }
      ], [state])}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalProvider, useGlobalContext }