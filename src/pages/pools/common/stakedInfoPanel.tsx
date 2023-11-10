import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Stack, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import { tips, toLanguageFormat } from "utils/util";
import { useGlobalContext } from "provider";
import { apiNotification } from "utils/services";
import { ActionButton1, ActionButton2, ActionLoadingButton1 } from "components/buttons";
import { ValidateError } from "utils/customError";
import { Link } from "react-router-dom";
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
    <InfoBox>
      <StyledApyBox>
        <div>
          <Typography style={{fontSize: '22px', color: 'rgba(255, 255, 255, 0.5)'}}>
              TOTAL APY
          </Typography>
          <Typography style={{fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,1)'}}>
            ({Number(state.poolsInfo.apy).toFixed(3)}%)
          </Typography>
          <Link to = "/create-nfts" >
            <ActionButton2 className="mt-10">Buy DFTL</ActionButton2>
          </Link>
        </div>
      </StyledApyBox>
      <StyledInfoBox>
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <InfoBox gap={1} className="items-center justify-center">
                <Typography style={{fontSize: '12px', color: 'rgba(255,255,255, 0.5)'}}>Total Capacity</Typography>
                <Typography variant="body1">{toLanguageFormat(state.poolsInfo.totalCapacity)}</Typography>
              </InfoBox>
            </Grid>

            <Grid item xs={12} md={4}>
              <InfoBox gap={1} className="items-center justify-center">
                <Typography style={{fontSize: '12px', color: 'rgba(255,255,255, 0.5)'}}>Total Staked</Typography>
                <Typography variant="body1">{toLanguageFormat(state.poolsInfo.totalStaked)} DFTL</Typography>
              </InfoBox>
            </Grid>

            <Grid item xs={12} md={4}>
              <InfoBox gap={1} className="items-center justify-center">
                <Typography style={{fontSize: '12px', color: 'rgba(255,255,255, 0.5)'}}>Total Guilds</Typography>
                <Typography variant="body1">{toLanguageFormat(state.guildDatas.length)}</Typography>
              </InfoBox>
            </Grid>
          </Grid>
      </StyledInfoBox>
      <StyledApyBox>
        <div>
          <Typography style={{fontSize: '22px', color: 'rgba(255, 255, 255, 1)'}}>
            Your staking rewards
          </Typography>
          <Grid container spacing={2} className="mt-10">
            <Grid item xs={12} md={6}>
              <Typography style={{fontSize: '22px', color: 'rgba(255, 255, 255, 0.5)'}}>
                ETH
              </Typography>
              <Typography style={{fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,1)'}}>
                {toLanguageFormat(state.stakeRewards.rewardETH)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography style={{fontSize: '22px', color: 'rgba(255, 255, 255, 0.5)'}}>
                DFTL
              </Typography>
              <Typography style={{fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,1)'}}>
                {toLanguageFormat(state.stakeRewards.rewardDFTL)}
              </Typography>
            </Grid>
          </Grid>
          <ActionLoadingButton1 className="py-8 mt-10" loading={loading} onClick={onClaimReward}
            disabled={!state.stakeRewards.rewardETH && !state.stakeRewards.rewardDFTL}
          >
            Claim Reward
          </ActionLoadingButton1>
        </div>
      </StyledApyBox>
    </InfoBox >
  )
}



const StyledApyBox = styled(Stack)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(250, 105, 0, 0.85)',
  padding: '32px 16px',
  width: '100%',
  textAlign: 'center',
  display: 'flex'
}))

const StyledInfoBox = styled(Stack)(({ theme }) => ({
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 1)',
    padding: '20px 16px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: '32px 0'
}))


const InfoBox = styled(Stack)(({ theme }) => ({
  width: '100%',
}))

export { StakedInfoPanel }