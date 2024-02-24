import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Grid, Stack, Typography, TextField } from "@mui/material";

import { convertHMS, textEllipsis, toLanguageFormat } from "utils/util";
import { useGlobalContext } from "provider";
import rewardIMG from "assets/image/reward.webp";

interface TopPlayersProps {
  rewardTime: number
  users: LeaderBoardObject[]
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
      <img alt="" src={params.value}
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
    field: "address",
    headerName: "Address",
    headerAlign: "center",
    align: "center",
    minWidth: 150,
    flex: 2,
    renderCell: (params) => (
      <a href={`/user/${params.value}`}>{textEllipsis(params.value)}</a>
    )
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

const TopPlayers = ({ users, rewardTime }: TopPlayersProps) => {
  const [state] = useGlobalContext();
  const [filter, setFilter] = useState<string>("");
  const [rewardIn, setRewardIn] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(prevCount => prevCount + 1);
      const duration = rewardTime / 1000 - count;
      if (rewardTime === 0 || duration <= 0) setRewardIn(0);
      else setRewardIn(Math.floor(duration || 0));
    }, 1000)

    return () => { clearTimeout(timeout) }
  }, [count])

  const RowsFilter = useCallback((user: LeaderBoardObject) => {
    const searchParams = ["name", "address"]

    return searchParams.some((fieldType) => {
      try {
        return user[fieldType].toLowerCase().indexOf(filter.toLowerCase().trim()) > -1
      } catch (err) {
        return false
      }
    })
  }, [filter])

  const allPlayers = useMemo(() => (
    users.filter(RowsFilter)
  ), [users, filter])

  const topPlayers = useMemo(() => (
    users.filter((user: LeaderBoardObject) => (
      user.reward > 0
    ))
  ), [allPlayers])

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
            {toLanguageFormat(state.topPlayReward) + " DFTL"}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={1} className="mt-10">
        {topPlayers.map((player: any, index: number) => (
          <Grid item xs={12} md={4} lg={3} key={index}>
            <RoundItem
              exp={player.merit}
              image={player.image}
              amount={player.reward}
              tankOwner={player.name + "'s tank"}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} className="mt-10">
        <Grid item xs={12}>
          <TextField label="Search" variant="outlined"
            value={filter} onChange={onChangeFilter}
            className="w-full rounded-5"
            style={{ background: 'rgba(31,31,31,0.9)' }}
          />
        </Grid>
      </Grid>

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          pageSize={10}
          rowHeight={70}
          rows={allPlayers}
          columns={columns}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.rank}
          style={{ borderRadius: '10px', backgroundColor: 'rgba(31,31,31,0.9)' }}
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
        <img alt="" src={image}
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

export { TopPlayers }