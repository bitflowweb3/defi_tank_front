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
  getTankClasses: async () => {
    const result = await axios.post("/api/tanks/classes")
    return result.data
  },

  getTankItems: async () => {
    const result = await axios.post("/api/tanks/all-tanks")
    return result.data
  },

  getUpgradeSignature: async (id: string) => {
    const params = { id: id }
    const result = await axios.post("/api/tanks/get-upgradesign", params)
    return result.data
  },
}