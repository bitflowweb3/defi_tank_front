import axios from "axios";
import { config } from '../config/config';
axios.defaults.baseURL = config.BACKEND_URL;

export const restApi = {
  // user notification apis
  getAlert: async (address: string) => {
    const params = { user: address }
    const result = await axios.post("/api/user/get-alert", params)
    return result.data
  },

  readAlert: async (id: string, address: string) => {
    const params = { id, address }
    const result = await axios.post("/api/user/read-alert", params)
    return result.data
  },

  // user apis
  getProfile: async (address: string) => {
    let result = await axios.post("/api/user/get-userdata", {
      address: address,
    })
    return result.data;
  },

  checkProfile: async (data: any) => {
    let result = await axios.post("/api/user/check-userdata", data);
    return result.data;
  },

  setProfile: async (data: any) => {
    let result = await axios.post("/api/user/update-userdata", data);
    return result.data;
  },

  getReferralData: async (address: string) => {
    const result = await axios.post("/api/user/get-referrals", { address })
    return result.data
  },

  getReferrerInfo: async (referrers: string[] | null) => {
    const params = { referrers }
    const result = await axios.post("/api/user/get-referrerdata", params)
    return result.data
  },

  claimReward: async (address: any) => {
    const result = await axios.post("/api/user/claim-reward", { address })
    return result.data
  },

  getAllProfiles: async () => {
    let result = await axios.post("/api/user/get-alldata");
    return result.data;
  },

  followUser: async (to: string, signature: string) => {
    const params = { to, signature }
    const result = await axios.post("/api/user/like", params)
    return result.data;
  },

  transferGold: async (to: string, amount: number, signature: string) => {
    const params = { to, amount, signature }
    const result = await axios.post("/api/user/transfer-gold", params)
    return result.data;
  },

  transferPotion: async (to: string, amount: number, signature: string) => {
    const params = { to, amount, signature }
    const result = await axios.post("/api/user/transfer-potion", params)
    return result.data;
  },

  sellPotion: async (amount: number, signature: string) => {
    const params = { amount, signature }
    const result = await axios.post("/api/user/sell-potion", params)
    return result.data;
  },

  buyPotion: async (amount: number, signature: string) => {
    const params = { amount, signature }
    const result = await axios.post("/api/user/buy-potion", params)
    return result.data;
  },

  // base info
  getGlobalConfig: async () => {
    const result = await axios.post("/api/platform/getGlobalConfig")
    return result.data
  },

  getBaseClasses: async () => {
    const result = await axios.post("/api/platform/baseClasses")
    return result.data
  },

  getAllNfts: async () => {
    const result = await axios.post("/api/platform/allNfts")
    return result.data
  },

  getLeaderBoard: async () => {
    const result = await axios.post("/api/platform/getLeaderBoard")
    return result.data
  },

  // tank apis
  updateTankName: async (id: string, newName: string, newDescription: string, signature: string) => {
    try {
      const params = { id, newName, newDescription, signature }
      const result = await axios.post("/api/tanks/update-name", params)

      return result.data
    } catch (err: any) {
      console.log(err.message)
      throw new Error(err.message)
    }
  },

  lend: async (id: string, signature: string) => {
    const result = await axios.post("/api/tanks/lend", { id, signature })
    return result.data;
  },

  borrow: async (id: string, signature: string) => {
    const params = { id, signature }
    const result = await axios.post("/api/tanks/borrow", params)
    return result.data
  },

  followTank: async (id: string, signature: string) => {
    const params = { id, signature }
    const result = await axios.post("/api/tanks/like", params)
    return result.data;
  },

  energyRecover: async (id: string, signature: string) => {
    const params = { id, signature }
    const result = await axios.post("/api/tanks/energyRecover", params)
    return result.data;
  },

  tankLevelUp: async (id: string, signature: string) => {
    const params = { id, signature }
    const result = await axios.post("/api/tanks/tankLevelUp", params)
    return result.data;
  },

  upgradedPoints: async (id: string, points: UpgradablePointsObject, signature: string) => {
    const params = { id, points: points, signature }
    const result = await axios.post("/api/tanks/upgradePoints", params)
    return result.data;
  },

  // guild apis
  checkGuildName: async (id: string, name: string) => {
    const result = await axios.post("/api/guilds/check-name", { id, name })
    return result.data;
  },

  updateGuild: async (data: any) => {
    const result = await axios.post("/api/guilds/update-guild", data)
    return result.data;
  },

  joinGuild: async (guildID: string, signature: string) => {
    const params = { guildID, signature }
    const result = await axios.post("/api/guilds/member-request", params)
    return result.data;
  },

  memberAccept: async (guildID: string, memberAddr: string, signature: string) => {
    const params = { guildID, memberAddr, signature }
    const result = await axios.post("/api/guilds/member-accept", params)
    return result.data;
  },

  memberCancel: async (guildID: string, memberAddr: string, signature: string) => {
    const params = { guildID, memberAddr, signature }
    const result = await axios.post("/api/guilds/member-cancel", params)
    return result.data;
  },

  followGuild: async (guildID: string, signature: string) => {
    const params = { guildID, signature }
    const result = await axios.post("/api/guilds/guild-like", params)
    return result.data;
  },

  sendGuildPotion: async (guildID: string, memberAddr: string, amount: number, signature: string) => {
    const params = { guildID, memberAddr, amount, signature }
    const result = await axios.post("/api/guilds/sendpotion", params)
    return result.data;
  },

  getUpgradeSignature: async (id: string) => {
    const result = await axios.post("/api/guilds/get-upgradesign", { id })
    return result.data
  },
}