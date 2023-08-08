import React from 'react';
import axios from "axios";

import { config } from '../config/config';

axios.defaults.baseURL = config.BACKEND_URL;

export const restApi = {
  // user apis
  checkProfile: async (data: any) => {
    let result = await axios.post("/api/user/check-userdata", data);
    return result.data;
  },

  setProfile: async (data: any) => {
    let result = await axios.post("/api/user/update-userdata", data);
    return result.data;
  },

  getProfile: async (address: string) => {
    let result = await axios.post("/api/user/get-userdata", {
      address: address,
    })
    return result.data;
  },

  updateName: async (id: string, newName: string, newDescription: string, signature: string) => {
    try {
      const params = { id, newName, newDescription, signature }
      const result = await axios.post("/api/tanks/update-name", params)

      return result.data
    } catch (err: any) {
      console.log(err.message)
      throw new Error(err.message)
    }
  },

  getAllProfiles: async () => {
    let result = await axios.post("/api/user/get-alldata");
    return result.data;
  },

  getReferralData: async (address: string) => {
    const params = { to: address }
    const result = await axios.post("/api/user/get-referrals", params)
    return result.data
  },

  getReferrerInfo: async (referrers: string[] | null) => {
    const params = { referrers }
    const result = await axios.post("/api/user/get-referrerdata", params)
    return result.data
  },

  claimReward: async (user: any) => {
    const params = { user: user }
    const result = await axios.post("/api/user/claim-reward", params)
    return result.data
  },

  // base info
  getBaseClasses: async () => {
    const result = await axios.post("/api/tanks/classes")
    return result.data
  },

  getAllNfts: async () => {
    const result = await axios.post("/api/platform/allNfts")
    return result.data
  },

  // tank apis
  lend: async (id: string, to: string, signature: string) => {
    const params = { id, to, signature }
    const result = await axios.post("/api/tanks/lend", params)
    return result.data;
  },

  borrow: async (id: string, signature: string) => {
    const params = { id, signature }
    const result = await axios.post("/api/tanks/borrow", params)
    return result.data
  },

  reactNFT: async (id: string, signature: string) => {
    const params = { id, signature }
    const result = await axios.post("/api/tanks/like", params)
    return result.data;
  },

  // data caching apis
  getUpgradeSignature: async (id: string) => {
    const params = { id: id }
    const result = await axios.post("/api/tanks/get-upgradesign", params)
    return result.data
  },

  // user notification apis
  getAlert: async (address: string) => {
    const params = { user: address }
    const result = await axios.post("/api/user/get-alert", params)
    return result.data
  },

  readAlert: async (id: string) => {
    const params = { id }
    const result = await axios.post("/api/user/read-alert", params)
    return result.data
  }
}