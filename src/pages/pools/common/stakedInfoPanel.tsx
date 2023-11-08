import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Stack, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import { tips, toLanguageFormat } from "utils/util";
import { useGlobalContext } from "provider";
import { apiNotification } from "utils/services";
import { ActionLoadingButton1 } from "components/buttons";
import { ValidateError } from "utils/customError";
const tempArray = new Array(10).fill(0)

const StakedInfoPanel = () => {
  const [state, { claimStakeReward }] = useGlobalContext();
  const [loading, setLoading] = useState<boolean>(false)

  const data: any = tempArray.map((i: number, index: number) => {
    const tempRate = 250 / (90 + 250 * index * 30 / 365) * 100
    return { "day": index * 30, "rate": tempRate }
  })

  const onClaimReward = async () => {
    try {
      if (state.walletStatus === 2) {
        if (state.stakeRewards.rewardETH > 0 || state.stakeRewards.rewardDFTL > 0) {
          throw new ValidateError("Don't have reward amount.");
        }

        setLoading(true);
        await claimStakeReward();

        setLoading(false);
        tips("success", `Claim reward successed`);
      }
    } catch (err: any) {
      setLoading(false);
      apiNotification(err, "Claim reward failed!");
    }
  }

  return (
    <Stack direction={{ xs: "column", xl: "row" }} gap={3} className="justify-between">
      <Box className="flex-1 text-center" sx={{ maxWidth: { xs: "100%", xl: "50%" } }}>
        <Typography style={{ transform: 'translateY(60px)' }}>
          APY ({Number(state.poolsInfo.apy).toFixed(3)}%)
        </Typography>

        <ResponsiveContainer height={300} debounce={30}>
          <LineChart data={data} margin={{ left: -10, right: 30, top: 0, bottom: 5 }}>
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

      <Stack direction="column" gap={2} className="flex-1 justify-center">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <InfoBox gap={1} className="items-center justify-center">
              <Typography variant="h6">Total Capacity</Typography>
              <Typography variant="body1">{toLanguageFormat(state.poolsInfo.totalCapacity)}</Typography>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoBox gap={1} className="items-center justify-center">
              <Typography variant="h6">Total Staked</Typography>
              <Typography variant="body1">{toLanguageFormat(state.poolsInfo.totalStaked)} DFTL</Typography>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoBox gap={1} className="items-center justify-center">
              <Typography variant="h6">Total Guilds</Typography>
              <Typography variant="body1">{toLanguageFormat(state.guildDatas.length)}</Typography>
            </InfoBox>
          </Grid>
        </Grid>

        <InfoBox gap={1} className="border-2 border-solid border-btnBg">
          <Typography variant="h5">Staked Reward</Typography>

          <Box gap={2} className="flex justify-between">
            <Stack direction="column">
              <Typography>{toLanguageFormat(state.stakeRewards.rewardETH)} ETH</Typography>
              <Typography>{toLanguageFormat(state.stakeRewards.rewardDFTL)} DFTL</Typography>
            </Stack>

            <div className="flex items-center">
              <ActionLoadingButton1 className="py-8" loading={loading} onClick={onClaimReward}
                disabled={!state.stakeRewards.rewardETH && !state.stakeRewards.rewardDFTL}
              >
                Claim Reward
              </ActionLoadingButton1>
            </div>
          </Box>
        </InfoBox>
      </Stack>
    </Stack >
  )
}

const InfoBox = styled(Stack)(({ theme }) => ({
  padding: "30px",
  borderRadius: "20px",
  backgroundColor: "#060200b5",
  // border: `3px solid ${theme.palette.primary.light}`,
  // justifyContent: 'space-evenly',
}))

export { StakedInfoPanel }