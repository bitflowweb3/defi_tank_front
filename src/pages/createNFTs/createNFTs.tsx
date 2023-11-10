import React from "react";
import { useState } from "react";
import { Box, Tabs } from '@mui/material';

import { BuyAssets } from "./buyAssets";
import { CreateTanks } from "./createTanks";
import { CreateGuild } from "./createGuild";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { CustomTabPanel, TapHeader } from "components/customTap";

const CreateNFTs = () => {
  const [value, setValue] = useState<string>('tank');
  const onChangeTap = (e: any, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Layouts>
      <div className="basetap-wrapper">
        <GlobalSpacing className="sm:py-0 py-0">
          <Box>
            <Tabs value={value} onChange={onChangeTap} aria-label="" TabIndicatorProps={{style: {display: 'none'}}} >
              <TapHeader value="tank" label="Create Tank" />
              <TapHeader value="guild" label="Create Guild" />
              <TapHeader value="assets" label="Buy Assets" />
            </Tabs>
          </Box>
        </GlobalSpacing>

        <CustomTabPanel value="tank" index={value}>
          <CreateTanks />
        </CustomTabPanel>

        <CustomTabPanel value="guild" index={value}>
          <CreateGuild />
        </CustomTabPanel>
        <CustomTabPanel value="assets" index={value}>
          <BuyAssets />
        </CustomTabPanel>
      </div>
    </Layouts>
  )
}

export { CreateNFTs }