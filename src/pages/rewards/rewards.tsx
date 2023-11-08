import React from "react";
import { useState, useEffect } from "react";
import { Box, Tabs } from '@mui/material';

import "./rewards.scss"
import { TopGuilds } from "./topGuilds";
import { TopPlayers } from "./topPlayers";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { CustomTabPanel, TapHeader } from "components/customTap";
import { restApi } from "provider/restApi";

const RewardsPage = () => {
  const [value, setValue] = useState<string>('topPlayers');
  const [rewardTime, setRewardTime] = useState<number>(0);
  const [topGuilds, setTopGuilds] = useState<LeaderBoardObject[]>([]);
  const [topPlayers, setTopPlayers] = useState<LeaderBoardObject[]>([]);

  useEffect(() => {
    setLeaderBoard();
  }, [])

  const setLeaderBoard = async () => {
    try {
      let leaderBoard = await restApi.getLeaderBoard();
      setRewardTime(leaderBoard.rewardTime);
      setTopGuilds(leaderBoard.guilds);
      setTopPlayers(leaderBoard.users);
    } catch (err) {
      console.log('setLeaderBoard::', err.message);
    }
  }

  const onChangeTap = (e: any, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Layouts>
      <div className="basetap-wrapper">
        <GlobalSpacing className="sm:py-0 py-0">
          <Box className='border-b border-white/50'>
            <Tabs value={value} onChange={onChangeTap} aria-label="">
              <TapHeader value="topPlayers" label="Top Players" />
              <TapHeader value="topGuilds" label="Top Guilds" />
            </Tabs>
          </Box>
        </GlobalSpacing>

        <CustomTabPanel value="topGuilds" index={value}>
          <TopGuilds guilds={topGuilds} rewardTime={rewardTime} />
        </CustomTabPanel>

        <CustomTabPanel value="topPlayers" index={value}>
          <TopPlayers users={topPlayers} rewardTime={rewardTime} />
        </CustomTabPanel>
      </div>
    </Layouts>
  )
}

export { RewardsPage }