import React from "react";
import { useState, useMemo } from "react";
import { Stack } from "@mui/system";
import { styled } from "@mui/material/styles";
import { Box, Accordion as MuiAccordion, AccordionProps } from '@mui/material';
import { TextField as MuiTextField, CircularProgress, Slider } from '@mui/material';
import { AccordionDetails as MuiAccordionDetails, Typography, Grid } from '@mui/material';
import { AccordionSummary as MuiAccordionSummary, AccordionSummaryProps } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useGlobalContext } from "provider";
import { GridItem } from "components/grid";
import { ellipsis, tips } from "utils/util";
import { ActionButton1 } from "components/buttons";

interface NumberInputProps {
  label: string
  actionLabel: string
  balance: number
  max: number
  onAction: CallableFunction
}

export const PoolItem = (props: any) => {
  const { item, index, expanded, handleExpand } = props;
  const [state, { stake, unstake }] = useGlobalContext();

  const handleStake = async (value: number) => {
    if (!state.signer) {
      throw new Error("Please connect wallet!")
    }

    await stake(item.id, value)
  }

  const handleUnstake = async (value: number) => {
    if (!state.signer) {
      throw new Error("Please connect wallet!")
    }

    await unstake(item.id, value)
  }

  return (
    <Accordion key={index}
      expanded={expanded === `expand${index}`}
      onChange={handleExpand(`expand${index}`)}
    >
      <AccordionSummary sx={{ minHeight: "60px" }}>
        <Grid container spacing={2} style={{ alignItems: 'center' }}>
          <GridItem style={{ alignItems: 'center' }}>
            <Box alt=""
              component="img"
              src={item.image}
              sx={{
                textAlign: "center",
                width: "40px",
                borderRadius: '5px',
              }}
            />

            <Typography style={{ paddingLeft: '1rem' }}>
              {item.name}
            </Typography>
          </GridItem>

          <GridItem>
            <Typography>
              {ellipsis(item.owner, 15)}
            </Typography>
          </GridItem>

          <GridItem>
            <Typography>
              {state.stakes[item.id] ? state.stakes[item.id] : "0"}
            </Typography>
          </GridItem>

          <GridItem>
            <Typography>
              {item.energyPool}/{item.maxEnergyPool}
            </Typography>
          </GridItem>
        </Grid >
      </AccordionSummary >

      <AccordionDetails>
        <Grid container spacing={2} sx={{ padding: "20px" }}>
          <Grid item xs={12} md={6} textAlign="center">
            <NumberInputPanel label={"DFTL"} actionLabel={"Stake"} max={(Number(state.balance)) < (item.maxEnergyPool - item.energyPool) ? (state.balance) : (item.maxEnergyPool - item.energyPool)} balance={state.balance} onAction={handleStake} />
          </Grid>

          <Grid item xs={12} md={6} textAlign="center" >
            <NumberInputPanel label={"SDFTL"} actionLabel={"Withdraw"} max={state.stakes[item.id] ? state.stakes[item.id] : 0} balance={state.stakes[item.id] ? state.stakes[item.id] : 0} onAction={handleUnstake} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion >
  )
}

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
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}))

const NumberInputPanel = ({ label, actionLabel, balance, max, onAction }: NumberInputProps) => {
  const [value, setValue] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    if (e.target.value < 0) return setValue(0);
    if (e.target.value > max) return setValue(max);
    setValue(e.target.value)
  }

  const handleAction = async () => {
    setLoading(true);

    try {
      await onAction(value);
      tips("success", `${actionLabel} Success`)
    } catch (err: any) {
      tips("error", `${actionLabel} failed`)
    }

    setLoading(false)
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

  return (
    <Stack alignItems="center" spacing={2}>
      <Box width="100%" display="flex">
        <TextField type="number"
          value={value}
          onChange={handleInput}
          label={`${label} : ${balance}`}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, maxWidth: "500px", marginInline: "auto" }}
        />
      </Box>

      <Box width="100%" display="flex">
        <Slider min={0} max={100}
          marks={marks}
          aria-label="Small"
          disabled={Number(max) === 0}
          value={value * 100 / max}
          onChange={(e: any) => { setValue(e.target.value * max / 100) }}
          sx={{
            flex: 1,
            maxWidth: "500px",
            marginInline: "auto"
          }}
        />
      </Box>

      <Box sx={{ position: 'relative' }}>
        <ActionButton1 disabled={isLoading}
          onClick={handleAction}
        >
          {actionLabel}
        </ActionButton1>

        {isLoading && (
          <CircularProgress size={24}
            sx={{
              color: "primary.main",
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Stack>
  )
}