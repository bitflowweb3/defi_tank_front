import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingButton } from "@mui/lab";
import { Stack, Box, CardMedia, CardContent } from "@mui/material";
import { CardActions, Modal, Typography, TextField } from "@mui/material";

import { CardContainer } from "../cards";
import { restApi } from 'provider/restApi';
import { ItemContainer } from 'components/styles';
import { useGlobalContext } from '../../provider';
import { textEllipsis, tips, toLanguageFormat } from '../../utils/util';
import { ActionButton1, ActionButton2 } from "../buttons";

import baseGuild from "assets/image/baseguild.png";

interface UserCardProps {
  type: string
  guildInfo: GuildObject
  userInfo: GuildMemberObject
}

const GuildUserCard = ({ type, guildInfo, userInfo }: UserCardProps) => {
  const [state, { updateBaseNfts }] = useGlobalContext();

  const [sendCount, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [modalFlag, setModalFlag] = useState<boolean>(false)

  const onOpenModal = () => {
    setModalFlag(true)
  }

  const onCloseModal = () => {
    setCount(0)
    setModalFlag(false)
  }

  const handleAccept = async () => {
    try {
      let guildID = guildInfo.id;
      let signature = await state.signer.signMessage(guildID);
      await restApi.memberAccept(guildID, userInfo.address, signature);
      await updateBaseNfts();
      tips("success", `Successed`);
    } catch (err) {
      console.log("handle accept", err.message);
      tips("error", err.message || 'Failed');
    }
  }

  const handleReject = async () => {
    try {
      let guildID = guildInfo.id;
      let signature = await state.signer.signMessage(guildID);
      await restApi.memberCancel(guildID, userInfo.address, signature);
      await updateBaseNfts();
      tips("success", `Successed`);
    } catch (err) {
      console.log("handle accept", err.message);
      tips("error", err.message || 'Failed');
    }
  }

  const handlePotionSend = async () => {
    try {
      if (sendCount <= 0) {
        throw new Error("Please Enter send amount.");
      }

      if (sendCount > guildInfo.potion) {
        throw new Error("Please check again potion amount.");
      }

      setLoading(true)
      let guildID = guildInfo.id
      let memberAddr = userInfo.address
      let signature = await state.signer.signMessage(guildID)
      await restApi.sendGuildPotion(guildID, memberAddr, sendCount, signature)
      await updateBaseNfts();

      onCloseModal()
      setLoading(false)
      tips("success", `Send potion successed`)
    } catch (err) {
      setLoading(false)
      console.log("handle potionsend", err.message);
      tips("error", err.message || 'Send potion failed')
    }
  }

  return (
    <CardContainer>
      <Link to={`/user/${userInfo.address}`}>
        <CardMedia alt="" component="img"
          className='h-194 rounded-8 cursor-pointer'
          image={userInfo.image || baseGuild}
        />
      </Link>

      <CardContent className='flex flex-col gap-5 mt-10'>
        <Stack direction="row" className='items-center justify-between'>
          <Typography>Exp: {toLanguageFormat(userInfo.experience)}</Typography>
          <Typography>Merit: {toLanguageFormat(userInfo.merit)}</Typography>
        </Stack>

        <Stack direction="row" className='items-center justify-between'>
          <Typography>{userInfo.name}</Typography>
          <Typography>{textEllipsis(userInfo.address)}</Typography>
        </Stack>
      </CardContent>

      {(guildInfo.owner === state.account && type === 'request') && (
        <CardActions className='flex justify-between'>
          <ActionButton2 onClick={handleReject}>Reject</ActionButton2>
          <ActionButton1 onClick={handleAccept}>Accept</ActionButton1>
        </CardActions>
      )}

      {(guildInfo.owner === state.account && type === 'member') && (
        <CardActions className='flex justify-between'>
          <ActionButton2 onClick={handleReject}>Cancel</ActionButton2>
          <ActionButton1 onClick={onOpenModal}>SendPotion</ActionButton1>
        </CardActions>
      )}

      <Modal open={modalFlag} onClose={onCloseModal}>
        <Box sx={styleWrapper} style={{ borderRadius: '12px' }}>
          <Box sx={styleContainer} className="flex flex-col gap-20">
            <Typography variant="h4" className="first-letter:uppercase">
              Potion Send
            </Typography>

            <ItemContainer>
              <TextField label="Amount" className='w-full' value={sendCount}
                onChange={({ target }: any) => setCount(Math.round(target.value) || 0)}
              />
            </ItemContainer>

            <LoadingButton color="success"
              variant="contained"
              className="hover:opacity-75"
              loading={loading}
              onClick={handlePotionSend}
              style={{ width: '100%', padding: '1rem', fontWeight: '700', backgroundColor: '#a14e22' }}
            >
              Submit
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </CardContainer>
  )
}

const styleWrapper = {
  top: "50%",
  left: "50%",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  border: "2px solid background.paper",
  bgcolor: "background.paper",
  boxShadow: "0 3px 10px #000",
}

const styleContainer = {
  p: 3,
  overflow: "auto",
  width: { xs: "90vw", sm: "80vw", md: "500px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
}

export { GuildUserCard }