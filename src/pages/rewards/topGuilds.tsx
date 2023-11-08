import React from "react";
import { useState, useEffect } from "react";
import { useMemo, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Grid, Stack, Typography, TextField } from "@mui/material";
import rewardIMG from "assets/image/reward.webp";
import baseGuild from "assets/image/baseguild.png";

import { useGlobalContext } from "provider";
import { convertHMS, toLanguageFormat } from "utils/util";

interface TopGuildsProps {
  rewardTime: number
  guilds: LeaderBoardObject[]
}

const columns: GridColDef[] = [
  {
    field: "image",
    headerName: "Image",
    headerAlign: "center",
    align: "center",
    sortable: false,
    minWidth: 130,
    renderCell: (params) => (
      <img alt="" src={params.value||baseGuild}
        className="w-50 h-50 object-cover rounded-full"
      />
    )
  }, {
    field: "name",
    headerName: "Name",
    headerAlign: "center",
    align: "center",
    minWidth: 150,
    flex: 1 / 2,
  }, {
    field: "owner",
    headerName: "Owner",
    headerAlign: "center",
    align: "center",
    minWidth: 150,
    flex: 2,
  }, {
    field: "merit",
    headerName: "Merit",
    headerAlign: "center",
    align: "center",
    type: "number",
    minWidth: 120,
    flex: 1,
  }, {
    field: "rank",
    headerName: "Ranking",
    headerAlign: "center",
    align: "center",
    type: "number",
    minWidth: 110,
    flex: 1,
  }, {
    field: "reward",
    headerName: "Reward",
    headerAlign: "center",
    align: "center",
    type: "number",
    minWidth: 110,
    flex: 1,
  }
]

const TopGuilds = ({ guilds, rewardTime }: TopGuildsProps) => {
  const [state] = useGlobalContext();
  const [filter, setFilter] = useState<string>("");
  const [rewardIn, setRewardIn] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(prevCount => prevCount + 1);
      const currentTime = + new Date();
      const tempRewardTime = + new Date(rewardTime);
      const duration = (tempRewardTime - currentTime) / 1000;

      if (rewardTime === 0 || duration <= 0) setRewardIn(0);
      else setRewardIn(Math.floor(duration || 0));
    }, 1000)

    return () => { clearTimeout(timeout) }
  }, [count])

  const RowsFilter = useCallback((guild: LeaderBoardObject) => {
    const searchParams = ["name", "owner"]

    return searchParams.some((fieldType) => {
      try {
        return guild[fieldType].toLowerCase().indexOf(filter.toLowerCase().trim()) > -1
      } catch (err) {
        return false
      }
    })
  }, [filter])

  const allGuilds = useMemo(() => (
    guilds.filter(RowsFilter)
  ), [guilds, filter])

  const topGuilds = useMemo(() => (
    guilds.filter((guild: LeaderBoardObject) => (guild.reward > 0))
  ), [guilds])

  const onChangeFilter = ({ target }: any) => {
    setFilter(target.value)
  }

  return (
    <Box className="flex flex-col gap-10">
      <Stack direction="row" className="rewardTime-wrapper">
        <img alt="" src={rewardIMG} className="w-100 text-center" />

        <Box className="rewardTime-container">
          <Typography style={{ fontWeight: 'bolder' }}>
            {"Rewards In "}{convertHMS(rewardIn)}
          </Typography>

          <Typography style={{ color: "goldenrod", fontWeight: 'bolder' }}>
            {toLanguageFormat(state.topGuildReward) + " DFTL"}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={1}>
        {topGuilds.map((guild: LeaderBoardObject, index: number) => (
          <Grid item xs={12} md={4} lg={3} key={index}>
            <RoundItem
              exp={guild.merit}
              image={guild.image||baseGuild}
              amount={guild.reward}
              tankOwner={guild.name}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <TextField label="Search" variant="outlined"
            value={filter} onChange={onChangeFilter}
            className="w-full bg-inputBg rounded-5"
          />
        </Grid>
      </Grid>

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          pageSize={10}
          rowHeight={70}
          rows={allGuilds}
          columns={columns}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.rank}
          style={{ borderRadius: '10px', backgroundColor: '#000000a1' }}
        />
      </Box>
    </Box>
  )
}

const RoundItem = (props: any) => {
  const { image, tankOwner, exp, amount } = props;

  return (
    <Stack direction="row" className="rewardItem-wrapper">
      <Stack direction="row" gap={2} className="items-center justify-start">
        <img alt="" src={image||baseGuild}
          className="w-70 h-70 text-center rounded-8"
        />

        <Box className="flex flex-col items-start justify-center">
          <Typography>{tankOwner}</Typography>
          <Typography>{toLanguageFormat(exp)}</Typography>
        </Box>
      </Stack>

      <Typography sx={{ color: "yellow", fontSize: "18px" }}>
        {toLanguageFormat(amount)} DFTL
      </Typography>
    </Stack>
  )
}

export { TopGuilds }