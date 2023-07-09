import React from 'react'
import { useMemo } from "react";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// import Resizer from "react-image-file-resizer";
import { Stack, Box, CardMedia, CardContent, CardActions } from "@mui/material"
import { IconButton, Typography, LinearProgress, linearProgressClasses } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';

import { CardContainer } from "../cards";
import { restApi } from '../../provider/restApi';
import { useGlobalContext } from '../../provider';
import { tips, getSubString } from '../../utils/util';
import { ActionButton1, ActionButton2 } from "../buttons";


enum ItemType {
  "onUser",
  "onUserMine"
}

interface TankCardProps {
  item: NftTankObject
}

// const resizeFile: any = (file: any) => (
//   new Promise((resolve) => {
//     Resizer.imageFileResizer(
//       file, 300, 300, "JPEG", 100, 0,
//       (uri: any) => { resolve(uri) },
//       "base64"
//     )
//   })
// )

export const TankItemCard = ({ item }: TankCardProps) => {
  const navigate = useNavigate();
  const [state] = useGlobalContext();

  const tankInfo = useMemo(() => {
    let tankLevel = item.tankLevel;
    let levelXp = tankLevel * tankLevel * 1000
    let nextLevelXp = (tankLevel + 1) * (tankLevel + 1) * 1000

    let itemType = 0;
    let nextLevelExp = nextLevelXp - levelXp;
    let currentExp = item.experience - levelXp;
    let energyRecoverPerHour = (item.maxEnergy / 24).toFixed(2);

    if (item.owner === state.account) {
      itemType = ItemType.onUserMine
    } else itemType = ItemType.onUser;

    return { ...item, itemType, currentExp, nextLevelExp, energyRecoverPerHour }
  }, [item])

  const handleLend = async () => {
    try {
      let signature = await state.signer.signMessage(item.id)
      await restApi.lend(item.id, "", signature)
      tips("success", `Lend ${item.id} success`)
    } catch (err) {
      console.log("handle lend", err.message);
      tips("error", `Lend ${item.id} Failed`);
    }
  }

  const handleBorrow = async () => {
    try {
      if (!state.signer) {
        throw new Error("Please connect wallet!")
      }

      let signature: string = await state.signer.signMessage(item.id);
      await restApi.borrow(item.id, signature);
      tips("success", `borrow ${item.id} success`);
    } catch (err: any) {
      console.log("handle lend", err.message);
      tips("error", `Borrow ${item.id} Failed`);
    }
  }

  const handleLike = async () => {
    try {
      if (!state.signer) {
        throw new Error("Please connect wallet!")
      }

      let signature: string = await state.signer.signMessage(item.id)
      await restApi.reactNFT(item.id, signature)
      tips("success", `React ${item.id} success`)
    } catch (err: any) {
      console.log("handle lend", err.message)
      tips("error", `React ${item.id} Failed`)
    }
  }

  const handleDetail = () => {
    navigate("/tank-detail/" + item.id)
  }

  return (
    <CardContainer>
      <Stack direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: "10px"
        }}
      >
        <Box sx={{ maxWidth: "40px" }}>
          {tankInfo.level}/{tankInfo.tankLevel}
        </Box>

        <Box sx={{ flex: 1, paddingLeft: "10px" }}>
          <BorderLinearProgress variant="determinate"
            value={tankInfo.currentExp * 100 / tankInfo.nextLevelExp}
          />
        </Box>
      </Stack>

      <CardMedia alt=""
        component="img"
        image={tankInfo.image}
        onClick={handleDetail}
        style={{
          height: '194px',
          marginTop: '16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      />

      <CardContent>
        <Stack>
          <Typography style={{ textAlign: 'center' }}>
            Energy
          </Typography>
        </Stack>

        <Stack sx={{ mt: "5px" }}>
          <Typography sx={{ flex: 1 }}>
            <BorderLinearProgress variant="determinate"
              value={tankInfo.energy * 100 / tankInfo.maxEnergy}
            />
          </Typography>
        </Stack>

        <Stack direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mt: "10px"
          }}
        >
          <Typography>{tankInfo.name}</Typography>
          <Typography>{getSubString(tankInfo.owner)}</Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <FavoriteIcon style={{ marginRight: '5px' }} /> {tankInfo.followers.length}
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
            {tankInfo.borrower === "" && (
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