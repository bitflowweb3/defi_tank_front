import React from "react";
import { useMemo } from "react";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, CardMedia, CardContent, CardActions } from "@mui/material"
import { IconButton, Typography, LinearProgress, linearProgressClasses } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useGlobalContext } from "provider";
import { CardContainer } from "components/cards";
import { ActionButton1, ActionButton2 } from "components/buttons";
import { getSubString } from "utils/util";

interface GuildParamObject {
  guild: GuildObject
}

export const GuildCard = ({ guild }: GuildParamObject) => {
  const navigate = useNavigate();
  const [state] = useGlobalContext();

  let currentExp = guild.merit - (guild.level) * (guild.level) * 1000;
  let nextLevelExp = (guild.level + 1) * (guild.level + 1) * 1000 - (guild.level) * (guild.level) * 1000;

  const handleDetail = () => {
    navigate("/guild-detail/" + guild.id)
  }

  const handleLike = () => {

  }

  return (
    <CardContainer>
      <CardMedia alt=""
        component="img"
        image={guild.image}
        onClick={handleDetail}
        style={{
          height: '194px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      />

      <Stack direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: '16px' }}
      >
        <Box sx={{ flex: 1, paddingLeft: "10px" }}>
          <BorderLinearProgress variant="determinate"
            value={currentExp * 100 / nextLevelExp}
          />
        </Box>
      </Stack>

      <CardContent>
        <Stack direction="column">
          <Typography>
            <span className="opacity-90">level: </span>
            <span className="opacity-75">{guild.level}</span>
          </Typography>

          <Typography>
            <span className="opacity-90">name: </span>
            <span className="opacity-75">{guild.name}</span>
          </Typography>

          <Typography>
            <span className="opacity-90">owner: </span>
            <span className="opacity-75">{getSubString(guild.owner)}</span>
          </Typography>

          <Typography>
            <span className="opacity-90">members: </span>
            <span className="opacity-75">{guild.members.length}</span>
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <FavoriteIcon style={{ marginRight: '5px' }} /> {guild.followers.length}
        </IconButton>

        {guild.owner === state.account && (
          <Stack spacing={2} direction="row">
            <ActionButton2>Manage</ActionButton2>
          </Stack>
        )}

        {guild.owner !== state.account && (
          <Stack spacing={2} direction="row">
            <ActionButton1>Request Join</ActionButton1>
          </Stack>
        )}
      </CardActions>
    </CardContainer>
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
  },
}))