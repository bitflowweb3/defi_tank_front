import React from "react";
import { styled } from "@mui/material/styles";
import { useState, useEffect, useMemo } from "react";
import { Box, Stack, Accordion as MuiAccordion, AccordionProps } from '@mui/material';
import { TextField as MuiTextField, CircularProgress, Slider } from '@mui/material';
import { AccordionDetails as MuiAccordionDetails, Typography, Grid } from '@mui/material';
import { AccordionSummary as MuiAccordionSummary, AccordionSummaryProps } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useGlobalContext } from "provider";
import { GridItem } from "components/grid";
import { textEllipsis, tips, toLanguageFormat } from "utils/util";
import { ActionButton1, ActionButton2 } from "components/buttons";
import { apiNotification } from "utils/services";

import baseGuild from "assets/image/baseguild.png";

interface NumberInputProps {
  label: string
  actionLabel: string
  balance: number
  max: number
  onAction: CallableFunction
}

interface PoolitemProps {
  index: number
  expanded: any
  handleExpand: any
  guildData: GuildObject
}

const PoolItem = (props: PoolitemProps) => {
  const { guildData, index, expanded, handleExpand } = props;
  const [state, { stake, unstake }] = useGlobalContext();
  const [maxAmount, setMaxAmount] = useState<number>(0);

  useEffect(() => {
    const tempBalance = state.balance;
    const tempAvailable = guildData.maxStakingPool - guildData.stakingPool;

    if (tempBalance < tempAvailable) {
      setMaxAmount(tempBalance);
    } else {
      setMaxAmount(tempAvailable);
    }
  }, [state.balance, guildData])

  const handleStake = async (value: number) => {
    await stake(guildData.id, value)
  }

  const handleUnstake = async (value: number) => {
    await unstake(guildData.id, value)
  }

  return (
    <StyledPoolItem>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} className="text-center" style={{borderRadius: '16px', borderRight: '1px solid rgba(255, 255, 255, 0.25)'}}>
          <img alt=""
              src={guildData.image || baseGuild}
              className="aspect-square"
              style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}
          />
          <Typography className="pt-10" style={{fontSize: '24px', fontWeight: 700}}>
            {guildData.name}
          </Typography>
           {/* <Typography>
             {textEllipsis(guildData.owner, 15)}
           </Typography> */}
          <Typography className="py-10">
           Id: {state.stakes[guildData.id] ? state.stakes[guildData.id] : "0"}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9} className="px-30">
          <Typography className="pt-30" style={{fontSize: '12px',fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)'}}>
            GUILD STAKED
          </Typography>
          <Typography>
            {toLanguageFormat(guildData.stakingPool)}/{toLanguageFormat(guildData.maxStakingPool)}
          </Typography>
            {/* {state.walletStatus === 2 && ( */}
              <div className="pt-30">
                    <NumberInputPanel label="DFTL"
                      balance={state.balance}
                      onAction={handleStake}
                      actionLabel="Stake"
                      max={maxAmount}
                    />
                    <div className="pt-30">
                      <NumberInputPanel label="SDFTL"
                        balance={state.stakes[guildData.id] || 0}
                        max={state.stakes[guildData.id] || 0}
                        onAction={handleUnstake}
                        actionLabel="Withdraw"
                      />
                    </div>
              </div>
            {/* )} */}

        </Grid>
      </Grid> 
    </StyledPoolItem>
    // <Accordion className="m-5"
    //   expanded={expanded === `expand${index}`}
    //   onChange={handleExpand(`expand${index}`)}
    // >
    //   <AccordionSummary className="min-h-60">
    //     <Grid container spacing={2} className="items-center">
    //       <GridItem className="items-center">
    //         <img alt=""
    //           src={guildData.image || baseGuild}
    //           className="w-40 aspect-square text-center rounded-5"
    //         />

    //         <Typography className="pl-1r">
    //           {guildData.name}
    //         </Typography>
    //       </GridItem>
    //       <GridItem>
    //         <Typography>
    //           {textEllipsis(guildData.owner, 15)}
    //         </Typography>
    //       </GridItem>

    //       <GridItem>
    //         <Typography>
    //           {state.stakes[guildData.id] ? state.stakes[guildData.id] : "0"}
    //         </Typography>
    //       </GridItem>

    //       <GridItem>
    //         <Typography>
    //           {toLanguageFormat(guildData.stakingPool)}/{toLanguageFormat(guildData.maxStakingPool)}
    //         </Typography>
    //       </GridItem>
    //     </Grid >
    //   </AccordionSummary >

    //   {state.walletStatus === 2 && (
    //     <AccordionDetails>
    //       <Grid container spacing={2} sx={{ padding: "20px" }}>
    //         <Grid item xs={12} md={6} textAlign="center">
    //           <NumberInputPanel label="DFTL"
    //             balance={state.balance}
    //             onAction={handleStake}
    //             actionLabel="Stake"
    //             max={maxAmount}
    //           />
    //         </Grid>

    //         <Grid item xs={12} md={6} textAlign="center" >
    //           <NumberInputPanel label="DFTL"
    //             balance={state.stakes[guildData.id] || 0}
    //             max={state.stakes[guildData.id] || 0}
    //             onAction={handleUnstake}
    //             actionLabel="Withdraw"
    //           />
    //         </Grid>
    //       </Grid>
    //     </AccordionDetails>
    //   )}
    // </Accordion >
  )
}

const StyledPoolItem = styled("div")(({ theme }) => ({
  margin: "16px 0",
  borderRadius: "16px",
  overflow: 'hidden',
  border: `1px solid rgba(255, 255, 255, 0.25)`,
}))

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  margin: "5px",
  borderRadius: "5px",
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ fontSize: '1.8rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row',
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

const TextField = styled(MuiTextField)(({ theme }) => ({
  "MuiOutlinedInput-root": {
    borderRadius: '16px'
  },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}))

const NumberInputPanel = ({ label, actionLabel, balance, max, onAction }: NumberInputProps) => {
  const [state] = useGlobalContext();
  const [value, setValue] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    if (e.target.value < 0) return setValue(0);
    if (e.target.value > max) return setValue(max);
    setValue(e.target.value)
  }

  const handleAction = async () => {
    try {
      if (state.walletStatus === 2) {
        setLoading(true);
        await onAction(value);

        setLoading(false);
        tips("success", `${actionLabel} Success`);
      }
    } catch (err: any) {
      setLoading(false);
      apiNotification(err, `${actionLabel} failed`);
    }

  }

  const marks = useMemo(() => {
    let data = [];

    for (let i = 0; i <= 4; i++) {
      data.push({
        value: i * 25,
        label: `${i * 25}%`
      })
    }

    return data
  }, [])

  const onChangeSlider = ({ target }: any) => {
    setValue(target.value * max / 100)
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Grid container spacing={2} alignItems={"center"} className="relative">
        <div className="w-full">
          <TextField type="number"
            value={value}
            onChange={handleInput}
            label={`${label} : ${balance}`}
            InputLabelProps={{ shrink: true }}
            className="w-full"
          />
        </div>
        <div style={{position: 'absolute', right: '8px', top: '8px'}}>
          <ActionButton2 disabled={isLoading} onClick={handleAction}>
            {actionLabel}
          </ActionButton2>
          {isLoading && (
            <CircularProgress size={24}
              sx={{
                top: '50%',
                left: '50%',
                position: 'absolute',
                marginTop: '-12px',
                marginLeft: '-12px',
                color: "primary.main",
              }}
            />
          )}
        </div>
      </Grid>
      {/* <Box className="w-full flex">
        <Slider min={0} max={100}
          marks={marks}
          aria-label="Small"
          disabled={Number(max) === 0}
          value={Number(value * 100 / max) || 0}
          onChange={onChangeSlider}
          className="flex-1 max-w-500"
        />
      </Box> */}

    </Stack>
  )
}

export { PoolItem }