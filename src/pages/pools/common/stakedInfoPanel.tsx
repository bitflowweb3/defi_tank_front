import React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Stack } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import { useGlobalContext } from "provider";

const UseDaysFromStart = () => {
  const [daysFromStart, setDaysFromStart] = useState(0);
  const tempRate = 250 / (90 + 250 * daysFromStart / 365) * 100

  useEffect(() => {
    const startDate: any = new Date("2023-2-13");
    const cDate: any = new Date();

    let oneDay = 1000 * 3600 * 24
    let daysFromStart: number = Math.floor((cDate - startDate) / oneDay)
    setDaysFromStart(daysFromStart)
  }, [])

  return { daysFromStart, rate: tempRate.toFixed(2) }
}

export const StakedInfoPanel = () => {
  const [state] = useGlobalContext();
  const { daysFromStart, rate } = UseDaysFromStart();

  const data: any = (new Array(10).fill(0)).map((i: number, index: number) => {
    const tempRate = 250 / (90 + 250 * index * 30 / 365) * 100
    return { "day": index * 30, "rate": tempRate }
  })

  return (
    <Stack spacing={2}
      direction={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
    >
      <Box textAlign="center"
        sx={{
          flex: "1",
          maxWidth: { xs: "100%", lg: "50%" }
        }}
      >
        <Typography style={{ transform: 'translateY(60px)' }}>
          APY ({rate}%)
        </Typography>

        <ResponsiveContainer height={250} debounce={30}>
          <LineChart data={data}
            margin={{
              top: 5,
              right: 20,
              left: 10,
              bottom: 5
            }}
          >
            <XAxis dataKey="day" stroke={"white"} />
            <YAxis dataKey="rate" stroke={"white"} />

            <Line dot={true}
              type="monotone"
              dataKey="rate"
              stroke={"#c14b05"}
              strokeWidth={2}
              activeDot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Stack spacing={2}
        sx={{ flex: "1" }}
        alignItems="center"
        direction={{ sm: "column", md: "row" }}
      >
        <InfoBox>
          <Typography>Total Tanks</Typography>
          <Typography>{state.tankItems.length}</Typography>
        </InfoBox>

        <InfoBox>
          <Typography>Total Staked</Typography>
          <Typography>
            {(state.poolsInfo.totalStakedAmount).toFixed(0)} DFTL
          </Typography>
        </InfoBox>

        <InfoBox>
          <Typography>Total Capacity</Typography>
          <Typography>{state.poolsInfo.totalCapacity} DFTL</Typography>
        </InfoBox>

        <InfoBox>
          <Typography>DFTL/SDFTL</Typography>
          <Typography>{state.stakeRate}</Typography>
        </InfoBox>
      </Stack>
    </Stack >
  )
}

const InfoBox = styled(Stack)(({ theme }) => ({
  flex: "1",
  paddingTop: "30px",
  paddingBottom: "30px",
  backgroundColor: "#060200b5",
  border: `3px solid ${theme.palette.primary.light}`,
  borderRadius: "30px",
  textAlign: "center",
  marginInline: "5px",
  minWidth: "120px"
}))