import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useLayoutEffect, useMemo, useCallback } from "react";
import { Box, Grid, Stack, Typography, TextField } from "@mui/material";

import rewardIMG from "assets/image/reward.webp";

import { useGlobalContext } from "provider";
import { restApi } from "provider/restApi";
import { convertHMS, ellipsis } from "utils/util";
import { Layouts } from "components/layouts/layouts";

const columns: GridColDef[] = [
  {
    field: "image",
    headerName: "Image",
    headerAlign: "center",
    align: "center",
    sortable: false,
    minWidth: 130,
    renderCell: (params) => (
      <Box
        component="img"
        src={params.value}
        alt=""
        sx={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: '50%'
        }}
      ></Box>
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

const rewardRate = [5, 4, 3, 2, 1]

export default function RewardsPage() {
  const [state] = useGlobalContext();
  const [filter, setFilter] = useState("");
  const [allData, setAllData] = useState([]);
  const [rewardTime, setRewardTime] = useState(0);


  useLayoutEffect(() => {
    let d = new Date();
    let now_utc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0);
    let rewardTime: Date = new Date(now_utc);

    let interval = setInterval(() => {
      let duration = (Number(rewardTime) - Number(new Date())) / 1000;
      setRewardTime(duration);
    }, 1000)

    return () => { clearInterval(interval) }
  }, [])

  useLayoutEffect(() => {
    (async () => {
      const result = await restApi.getAllProfiles()
      setAllData(result)
    })()
  }, [])

  const RowsFilter = useCallback((item: any) => {
    const searchParams = ["name", "address"]

    return searchParams.some((newItem) => {
      try {
        const flag = item[newItem].toLowerCase().indexOf(filter.toLowerCase().trim())
        return flag > -1
      } catch (err) {
        return false
      }
    })
  }, [filter])

  const rows = useMemo(() => {
    return allData.sort((a: any, b: any) => {
      return a.merit < b.merit ? 1 : -1;
    }).map((item: any, index: number) => {
      console.log("state.rewardPoolBalance", state.rewardPoolBalance);
      let data = {
        ...item,
        address: ellipsis(item.address, 20),
        rank: index + 1,
        reward: 0
      }

      if (data.merit > 0 && index < 5) {
        data = {
          ...data,
          reward: state.rewardPoolBalance * rewardRate[index] / 15
        }
      }

      return data
    }).filter(RowsFilter)
  }, [allData, filter])

  const tenRows = useMemo(() => {
    const bump = allData.sort((a: any, b: any) => (
      a.merit < b.merit ? 1 : -1
    )).map((item: any, index: number) => ({
      ...item,
      rank: index + 1,
      address: ellipsis(item.address, 20),
      reward: state.rewardPoolBalance * rewardRate[index] / 15
    })).filter((item: any) => (
      item.merit > 0
    ))

    return bump.splice(0, 5)
  }, [rows])

  return (
    <Layouts>
      <Box sx={{ padding: "10px" }}>
        <Stack direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ p: 1, gap: 1 }}
        >
          <Box alt=""
            component="img"
            src={rewardIMG}
            sx={{
              textAlign: "center",
              width: "120px"
            }}
          />

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
            background: 'linear-gradient(to right, #00000015, #000000dd)',
            transform: 'translateX(-71px) translateY(15px)',
            padding: '1rem 2rem 1rem 5rem',
            borderRadius: '1rem'
          }}>
            <Typography style={{ fontWeight: 'bolder' }}>
              {"Rewards In "}{convertHMS(rewardTime)}
            </Typography>

            <Typography style={{ color: "goldenrod", fontWeight: 'bolder' }}>
              {Number(state.rewardPoolBalance).toFixed(0) + " DFTL"}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2} padding={2}>
          {tenRows.map((item: any, index: number) => (
            <Grid item xs={12} md={4} lg={3} key={index}>
              <RoundItem
                exp={item.merit}
                image={item.image}
                amount={item.reward}
                tankOwner={item.name + "'s tank"}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} >
          <Grid item xs={12}>
            <TextField label="Search"
              variant="outlined" value={filter}
              onChange={(e: any) => setFilter(e.target.value)}
              sx={{ width: "100%", background: "#00000075", borderRadius: '5px' }}
            />
          </Grid>
        </Grid>

        <br />

        <Box sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows}
            columns={columns}
            pageSize={1}
            rowHeight={70}
            getRowId={(row) => row.rank}
            rowsPerPageOptions={[10]}
            style={{
              borderRadius: '10px',
              backgroundColor: '#000000a1',
            }}
          />
        </Box>
      </Box>
    </Layouts>
  )
}

const RoundItem = (props: any) => {
  const { image, tankOwner, exp, amount } = props;

  return (
    <Stack direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1,
        borderRadius: 2,
        background: "linear-gradient(to right, #c76e36 30%,  #c76e3650)",
      }}
    >
      <Stack direction="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box alt=""
          src={image}
          component="img"
          sx={{
            textAlign: "center",
            width: "70px",
            height: "70px",
            pr: 2,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
          }}
        >
          <Typography>{tankOwner}</Typography>
          <Typography>{exp}</Typography>
        </Box>
      </Stack>

      <Typography sx={{ color: "yellow", fontSize: "18px" }}>
        {Number(amount).toFixed(0)} DFTL
      </Typography>
    </Stack>
  )
}
