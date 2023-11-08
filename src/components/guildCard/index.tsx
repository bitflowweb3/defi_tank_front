import React from 'react'
import { useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Stack, Box, CardMedia, CardContent, CardActions } from "@mui/material"
import { IconButton, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';

import { CardContainer } from "../cards";
import { ActionButton1 } from "../buttons";
import { useGlobalContext } from '../../provider';
import { textEllipsis, tips } from '../../utils/util';
import { BorderLinearProgress } from 'components/styles';
import { apiNotification } from 'utils/services';

import baseGuild from "assets/image/baseguild.png";
import { restApi } from 'provider/restApi';

enum ItemType {
  "onUser",
  "onUserMine"
}

interface GuildCardProps {
  item: GuildObject
}

interface GuildItemObject extends GuildObject {
  itemType: ItemType,
  memberState: boolean,
}

const GuildItemCard = ({ item }: GuildCardProps) => {
  const navigate = useNavigate();
  const [state, { updateBaseNfts }] = useGlobalContext();

  const guildInfo: GuildItemObject = useMemo(() => {
    let itemType = item.owner === state.account ? ItemType.onUserMine : ItemType.onUser;
    let memberState = item.members.findIndex((member: GuildMemberObject) => member.address === state.account);
    let requestState = item.requests.findIndex((member: GuildMemberObject) => member.address === state.account);

    return {
      ...item, itemType,
      memberState: memberState !== -1 || requestState !== -1,
    }
  }, [item, state.walletStatus])

  const handleDetail = () => {
    navigate("/guild-detail/" + item.id)
  }

  const handleJoin = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(item.id);
        await restApi.joinGuild(item.id, signature);
        await updateBaseNfts();
        tips("success", `Request successed`);
      }
    } catch (err: any) {
      apiNotification(err, "Request failed!")
    }
  }

  const handleLike = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(item.id);
        await restApi.followGuild(item.id, signature);
        await updateBaseNfts();
        tips("success", `React ${item.id} success`);
      }
    } catch (err: any) {
      apiNotification(err, "Follow failed!")
    }
  }

  return (
    <CardContainer>
      <CardMedia alt="" component="img"
        className='h-194 rounded-8 cursor-pointer'
        image={guildInfo.image || baseGuild}
        onClick={handleDetail}
      />

      <CardContent>
        <Stack direction="row" className='justify-between items-center my-10'>
          <Box className="max-w-40">
            {guildInfo.level}/{guildInfo.guildLevel}
          </Box>

          <Box className="flex-1 pl-10">
            <BorderLinearProgress variant="determinate"
              value={guildInfo.experience * 100 / guildInfo.targetExp}
            />
          </Box>
        </Stack>

        <Stack direction="row" className='justify-between items-center'>
          <Typography>{guildInfo.name}</Typography>
          <Typography>{textEllipsis(guildInfo.owner)}</Typography>
        </Stack>
      </CardContent>

      <CardActions className='flex justify-between'>
        <IconButton aria-label="" onClick={handleLike}>
          <FavoriteIcon className='mr-5' /> {guildInfo.followers.length}
        </IconButton>

        {guildInfo.itemType === ItemType.onUserMine ? (
          <Stack spacing={2} direction="row">
            {guildInfo.memberState ? (
              <ActionButton1 onClick={handleDetail}>Manage</ActionButton1>
            ) : (
              <ActionButton1 onClick={handleJoin}>Use</ActionButton1>
            )}
          </Stack>
        ) : (
          <Stack spacing={2} direction="row">
            {(!guildInfo.memberState && state.walletStatus === 2) && (
              <ActionButton1 onClick={handleJoin}>Join</ActionButton1>
            )}

            {(guildInfo.memberState && state.walletStatus === 2) && (
              <ActionButton1 onClick={handleJoin}>cancellation</ActionButton1>
            )}
          </Stack>
        )}
      </CardActions>
    </CardContainer>
  )
}

export { GuildItemCard }