import React from "react"
import TabsUnstyled from '@mui/base/TabsUnstyled';
import { useState, useMemo, useCallback } from "react";
import { Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Select, Modal } from "@mui/material";

import { CreateGuild } from "./createGuild";
import { useGlobalContext } from "provider";
import { Layouts } from "components/layouts/layouts";
import { GuildCard } from "./common/item";

const initGuildInfo: GuildObject[] = [
  {
    id: '1',
    name: 'TopGuild',
    image: 'https://ipfs.idealbridgex.com/ipfs/QmRXGuTQQhRxtiXCw8b3hWE63jhR98asJKxWQ3zfALG7MB',
    description: 'Best Team',
    owner: '0XEAA7CA20E5EC139B2EBD4D5973EC4A679EA000ED',
    maxMembers: 5,
    merit: 1500,
    level: 1,
    members: [],
    requests: [],
    followers: [],
    role: 'NFT',
  }
]

const GuildList = () => {
  return (
    <Layouts>
      <CreateGuild />

      <MyGuilds />
    </Layouts>
  )
}

const MyGuilds = () => {
  const [state] = useGlobalContext();
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  const sortBy = useCallback((a: GuildObject, b: GuildObject) => {
    let res: boolean = true;
    switch (sort) {
      case "levelLH":
        res = Number(a.level) > Number(b.level);
        break;
      case "levelHL":
        res = Number(a.level) < Number(b.level);
        break;
      case "membersLH":
        res = Number(a.members) > Number(b.members);
        break;
      case "membersHL":
        res = Number(a.members) < Number(b.members);
        break;
      case "maxMembersLH":
        res = Number(a.maxMembers) > Number(b.maxMembers);
        break;
      case "maxMembersHL":
        res = Number(a.maxMembers) < Number(b.maxMembers);
        break;
      case "followersLH":
        res = Number(a.followers) > Number(b.followers);
        break;
      case "followersHL":
        res = Number(a.followers) < Number(b.followers);
        break;
    }

    return res ? 1 : -1;
  }, [sort])

  const items = useMemo(() => {
    return state.guildDatas.filter((item: GuildObject) => {
      return item.owner === state.account;
    }).filter((item: GuildObject) => {
      return item.name.indexOf(filter.toLowerCase().trim()) > -1;
    }).sort(sortBy)
  }, [state.guildDatas, filter, sort]);

  return (
    <div className='flex flex-col mt-30'>
      <div className="text-20 font-semibold">
        My Guilds
      </div>

      <Stack spacing={2}
        marginTop="10px"
        alignItems="center"
        justifyContent="start"
        direction={{ xs: "column", sm: "row" }}
      >
        <TextField label="Search"
          variant="outlined" value={filter}
          onChange={(e: any) => setFilter(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: "300px",
            backgroundColor: '#00000075',
            borderRadius: '5px',
          }}
        />

        <FormControl size="medium"
          sx={{
            width: "100%",
            maxWidth: "200px",
            backgroundColor: '#00000075',
            borderRadius: '5px',
          }}
        >
          <InputLabel id="sort-select">Sort</InputLabel>
          <Select label="Sort"
            labelId="sort-select" value={sort}
            onChange={(e: any) => setSort(e.target.value)}
          >
            <MenuItem value="" style={menuStyle}><em>None</em></MenuItem>
            <MenuItem value="levelLH" style={menuStyle}>level(Low-High)</MenuItem>
            <MenuItem value="levelHL" style={menuStyle}>level(High-Low)</MenuItem>
            <MenuItem value="membersLH" style={menuStyle}>members(Low-High)</MenuItem>
            <MenuItem value="membersHL" style={menuStyle}>members(High-Low)</MenuItem>
            <MenuItem value="maxMembersLH" style={menuStyle}>maxMembers(Low-High)</MenuItem>
            <MenuItem value="maxMembersHL" style={menuStyle}>maxMembers(High-Low)</MenuItem>
            <MenuItem value="followersLH" style={menuStyle}>followers(Low-High)</MenuItem>
            <MenuItem value="followersHL" style={menuStyle}>followers(High-Low)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* {items.map((guildData: GuildObject, key: any) => (
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={2.4}>
            <GuildCard guild={guildData} />
          </Grid>
        ))} */}

        {initGuildInfo.map((guildData: GuildObject, key: any) => (
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={2.4}>
            <GuildCard guild={guildData} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

const menuStyle = {
  padding: '0.6rem 1rem',
  backgroundColor: '#000000a8',
  borderBottom: '1px solid #222'
}

export { GuildList }