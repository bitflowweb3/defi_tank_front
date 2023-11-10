import React from 'react'
import { useMemo } from "react";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { IconButton, Typography } from "@mui/material";
import { Stack, Box, CardMedia, CardContent, CardActions } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

import { CardContainer } from "../cards";
import { restApi } from '../../provider/restApi';
import { useGlobalContext } from '../../provider';
import { tips, textEllipsis } from '../../utils/util';
import { ActionButton1, ActionButton2 } from "../buttons";
import { BorderLinearProgress, ChampionBadgeContainer } from 'components/styles';
import { apiNotification } from 'utils/services';

import championBadge from "assets/image/champion-badge.png"

enum ItemType {
  "onUser",
  "onUserMine"
}

interface TankCardProps {
  item: NftTankObject
}

interface TankItemObject extends NftTankObject {
  itemType: ItemType,
  energyRecoverPerHour: string
}

const TankItemCard = ({ item }: TankCardProps) => {
  const navigate = useNavigate();
  const [state, { updateBaseNfts }] = useGlobalContext();

  const tankInfo: TankItemObject = useMemo(() => {
    let energyRecoverPerHour = (item.maxEnergy / 24).toFixed(2);
    let itemType = item.owner === state.account ? ItemType.onUserMine : ItemType.onUser;

    return { ...item, itemType, energyRecoverPerHour }
  }, [item])

  const handleLend = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature = await state.signer.signMessage(item.id);
        await restApi.lend(item.id, signature);
        await updateBaseNfts();
        tips("success", `Lend tank ${item.id} success`);
      }
    } catch (err) {
      apiNotification(err, `Lend tank ${item.id} Failed`)
    }
  }

  const handleBorrow = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(item.id);
        await restApi.borrow(item.id, signature);
        await updateBaseNfts();
        tips("success", `borrow ${item.id} success`);
      }
    } catch (err: any) {
      apiNotification(err, `Borrow ${item.id} Failed`)
    }
  }

  const handleLike = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(item.id);
        await restApi.followTank(item.id, signature);
        await updateBaseNfts();
        tips("success", `React ${item.id} success`);
      }
    } catch (err: any) {
      apiNotification(err, `Follow ${item.id} Failed`)
    }
  }

  const handleDetail = () => {
    navigate("/tank-detail/" + item.id)
  }

  return (
    <CardContainer >
      <Stack direction="row" className='items-center justify-between mb-10 px-10 py-10' >
        <Box className="max-w-400">
          {tankInfo.tankLevel}
        </Box>

        <Box sx={{ flex: 1, paddingLeft: "10px" }}>
          <BorderLinearProgress variant="determinate"
            value={tankInfo.experience * 100 / tankInfo.targetExp}
          />
        </Box>
      </Stack>

      <Stack direction="column" className='relative' onClick={handleDetail}>
        <CardMedia alt="" component="img"
          className='h-194 cursor-pointer'
          image={tankInfo.image}
        />

        {tankInfo.chaptionBadge > 0 && (
          <ChampionBadgeContainer>
            <img alt="" src={championBadge} />

            {tankInfo.chaptionBadge > 1 && (
              <Typography variant='h6'>x{tankInfo.chaptionBadge}</Typography>
            )}
          </ChampionBadgeContainer>
        )}
      </Stack>

      <CardContent>
        <Stack>
          <Typography className='text-center'>
            Energy
          </Typography>
        </Stack>

        <Stack className='mt-5'>
          <Typography sx={{ flex: 1 }}>
            <BorderLinearProgress variant="determinate" value={tankInfo.energy * 100 / tankInfo.maxEnergy} />
          </Typography>
        </Stack>

        <Stack direction="row" className='items-center justify-between mt-10'>
          <Typography>{tankInfo.name}</Typography>
          <Typography>{textEllipsis(tankInfo.owner)}</Typography>
        </Stack>
      </CardContent>

      <CardActions className='flex justify-between'>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <FavoriteIcon className='mr-5' /> {tankInfo.followers.length}
        </IconButton>

        {tankInfo.itemType === ItemType.onUserMine ? (
          <Stack spacing={2} direction="row">
            {tankInfo.borrower === tankInfo.owner ? (
              <ActionButton2 onClick={handleLend}>Lend</ActionButton2>
            ) : (
              <ActionButton2 onClick={handleBorrow}>retrieve</ActionButton2>
            )}
          </Stack>
        ) : (
          <Stack spacing={2} direction="row">
            {(tankInfo.borrower === "" && state.walletStatus === 2) && (
              <ActionButton1 onClick={handleBorrow}>Borrow</ActionButton1>
            )}

            {tankInfo.borrower === state.account && (
              <ActionButton1 onClick={handleLend}>Return</ActionButton1>
            )}
          </Stack>
        )}
      </CardActions>
    </CardContainer>
  )
}

export { TankItemCard }