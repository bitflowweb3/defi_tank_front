import React from 'react';
import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, Box, Typography, LinearProgress, linearProgressClasses, IconButton } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { getSubString } from 'utils/util';
import { useGlobalContext } from 'provider';
import { Layouts } from 'components/layouts/layouts';
import { ActionButton1, ActionButton2 } from 'components/buttons';

const initGuildInfo: GuildObject = {
  id: '1',
  name: 'TopGuild',
  image: 'https://ipfs.idealbridgex.com/ipfs/QmRXGuTQQhRxtiXCw8b3hWE63jhR98asJKxWQ3zfALG7MB',
  description: 'Best Team',
  owner: '0XEAA7CA20E5EC139B2EBD4D5973EC4A679EA000ED',
  maxMembers: 5,
  merit: 1500,
  level: 1,
  members: [
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
  ],
  requests: [
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
    '0xEAA7Ca20e5ec139B2EBd4D5973eC4A679eA000ED',
  ],
  followers: [],
  role: 'NFT',
}

export const GuildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state] = useGlobalContext()

  let guild = initGuildInfo
  let currentExp = guild.merit - (guild.level) * (guild.level) * 1000;
  let nextLevelExp = (guild.level + 1) * (guild.level + 1) * 1000 - (guild.level) * (guild.level) * 1000;


  return (
    <Layouts>
      <ActionButton2 sx={{ m: "5px", mb: '10px' }}
        onClick={() => { navigate(-1) }}
      >
        <ArrowBackIcon /> back
      </ActionButton2>

      <StyledPanel>
        <SubPanel>
          <Stack direction="column">
            <div className='flex flex-row justify-between'>
              <Typography>Name : {guild.name}</Typography>
              <Typography>ID: {guild.id}</Typography>
            </div>

            <Stack spacing={2} className='flex flex-col md:flex-row justify-between'>
              <Typography>Owner : {getSubString(guild.owner)}</Typography>
            </Stack>

            <div className='flex flex-col gap-10 mt-20'>
              <div className='flex flex-row justify-between'>
                <Typography>Level : {guild.level}</Typography>
                <Typography>{currentExp}/{nextLevelExp} {"(EXP)"}</Typography>
              </div>

              <div className=''>
                <BorderLinearProgress variant="determinate"
                  value={currentExp * 100 / nextLevelExp}
                />
              </div>
            </div>

            <div className='flex flex-col gap-5 mt-20'>
              <div className='flex flex-row justify-between'>
                <Typography>Staking Pool</Typography>
                <Typography>200</Typography>
              </div>

              <div className='flex flex-row justify-between'>
                <Typography sx={{ flex: 1 }}>
                  <BorderLinearProgress variant="determinate" value={30} />
                </Typography>
              </div>
            </div>

            <Box className='mt-20 max-h-500'>
              <Box alt="" component="img" src={guild.image}
                className='max-h-400 md:m-50 rounded-2xl text-center'
                sx={{
                  //   width: { md: "calc(100% - 100px)", xs: "100%" },
                  maxWidth: { md: "calc(100% - 100px)", xs: "100%" },
                }}
              />
            </Box>
          </Stack>
        </SubPanel>

        <SubPanel>
          <Stack direction="column" className='gap-20'>
            <Stack direction="column">
              <Typography variant="h5">Description</Typography>
              <Typography flex={1}>{guild.description}</Typography>
            </Stack>

            <div className='flex flex-row justify-between items-start'>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon sx={{ mr: '5px' }} />
                <span className='text-16'> {guild.followers.length}</span>
              </IconButton>

              {guild.owner === state.account && (
                <ActionButton2>Edit</ActionButton2>
              )}

              {guild.owner !== state.account && (
                <ActionButton1>Join</ActionButton1>
              )}
            </div>
          </Stack>

          <div className='flex flex-col gap-5 mt-20'>
            <span className='text-20'>Guild Members</span>

            <div className='max-w-200 flex flex-col'>
              {guild.members.map((member: string, key: number) => (
                <div key={key}
                  className='flex flex-row justify-between items-center text-15'
                >
                  <span>{getSubString(member)}</span>
                  <DeleteOutlineIcon className='text-red-400 hover:text-red-400/50 cursor-pointer' />
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-5 mt-20'>
            <span className='text-20'>Join Request</span>

            <div className='max-w-300 flex flex-col'>
              {guild.requests.map((member: string, key: number) => (
                <div key={key}
                  className='flex flex-row justify-between items-center text-15'
                >
                  <span>{getSubString(member)}</span>

                  <div className='flex flex-row gap-5'>
                    <CheckIcon className='text-green-400 hover:text-green-400/50 cursor-pointer' />
                    <DeleteOutlineIcon className='text-red-400 hover:text-red-400/50 cursor-pointer' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SubPanel>
      </StyledPanel>
    </Layouts >
  )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 10,
  border: '1px solid #777',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "transparent",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#973800"
  }
}))

const StyledPanel = styled("div")(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: "#0000008f",
  display: "flex",
  flexWrap: "wrap"
}))

const SubPanel = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    minWidth: "200px",
    padding: "20px",
  },
  [theme.breakpoints.up('sm')]: {
    padding: "50px",
    minWidth: "400px",
  },
  flex: 1
}))

const Row = styled((props: any) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    {...props}
  />
))(({ theme }) => ({
  paddingBottom: "7px"
}))