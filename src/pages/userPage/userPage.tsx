import React from 'react';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGlobalContext } from '../../provider';
import { ManageNFTs } from './manageNFTs/manageNFTs';
import { ProfilePanel } from '../../components/profile/profile';
import { GlobalSpacing, Layouts } from '../../components/layouts/layouts';
import { restApi } from 'provider/restApi';

const initProfile: UserObject = {
  status: 'init',
  name: "Please enter display name",
  email: "player@gmail.com",
  address: "",
  description: "Player",

  image: "",
  coverImage: "",
  links: [],

  golds: 0,
  experience: 0,

  merit: 0,
  potion: 0,
  follows: 0,
  ranking: -1,
  borrowCount: 0,
}

const UserPage = () => {
  const { address } = useParams();
  const [state] = useGlobalContext();
  const [userData, setUserData] = useState<UserObject>(initProfile);
  const tempAddr = address || state.account;

  useEffect(() => {
    if (state.walletStatus === 2) {
      updateUserData()
    } else if (userData.status !== 'init') {
      setUserData(initProfile)
    }
  }, [state.walletStatus])

  const updateUserData = async () => {
    try {
      const tempData = await restApi.getProfile(tempAddr)
      setUserData(tempData)
    } catch (err) {
      if (userData.status !== 'init') {
        setUserData(initProfile)
      }
    }
  }

  return (
    <Layouts>
      <GlobalSpacing className="flex flex-col gap-30">
        <ProfilePanel address={tempAddr}
          updateUserData={updateUserData}
          userData={userData}
        />
        <ManageNFTs address={tempAddr}
          updateUserData={updateUserData}
          userData={userData}
        />
      </GlobalSpacing>
    </Layouts>
  )
}

export { UserPage, initProfile }