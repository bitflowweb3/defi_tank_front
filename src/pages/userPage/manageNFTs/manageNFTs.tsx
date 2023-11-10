import React from "react";
import { Box, Tabs } from '@mui/material';
import { useState, useEffect } from "react";

import { useGlobalContext } from "provider";
import { ManageTanks } from "./manageTanks";
import { ManageGuilds } from "./manageGuilds";
import { ManageAssets } from "./manageAssets";
import { CustomTabPanel, TapHeader } from "components/customTap";

interface ProfilePanelProps {
  address: string
  userData: UserObject
  updateUserData: any
}

const ManageNFTs = ({ address, userData, updateUserData }: ProfilePanelProps) => {
  const [state] = useGlobalContext();
  const [value, setValue] = useState<string>('tank');

  useEffect(() => {
    if (state.walletStatus !== 2) {
      if (value === "assets") {
        setValue("guild");
      }
    }
  }, [state.walletStatus, value])

  const onChangeTap = (e: any, newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className="basetap-wrapper ">
      <Box className=''>
        <Tabs value={value} onChange={onChangeTap} aria-label="" TabIndicatorProps={{style: {display: 'none'}}}>
          <TapHeader value="tank" label="Manage Tanks" />
          <TapHeader value="guild" label="Manage Guilds" />

          {(state.walletStatus === 2 && state.account === address) && (
            <TapHeader value="assets" label="Manage Assets" />
          )}
        </Tabs>
      </Box>


      <CustomTabPanel value="tank" index={value} className="px-0">
        <ManageTanks address={address}/>
      </CustomTabPanel>

      <CustomTabPanel value="guild" index={value}>
        <ManageGuilds address={address} />
      </CustomTabPanel>

      {(state.walletStatus === 2 && state.account === address) && (
        <CustomTabPanel value="assets" index={value}>
          <ManageAssets userData={userData} updateUserData={updateUserData} />
        </CustomTabPanel>
      )}
    </div>
  )
}

export { ManageNFTs }