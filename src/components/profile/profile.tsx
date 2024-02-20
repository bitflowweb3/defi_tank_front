import React from "react";
import { useState } from "react";
import Jazzicon from 'react-jazzicon';
import { styled } from "@mui/material/styles";
import { Box, Stack, IconButton, Typography, Modal } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import userTempCoverImg from "../../assets/image/banner1.webp";
import discordIcon from "../../assets/image/discordicon.png";
import linkedinIcon from "../../assets/image/linkedinicon.png";
import telegramIcon from "../../assets/image/telegramicon.png";
import defaultlinkIcon from "../../assets/image/defaultlinkicon.png";

import { EditProfile } from "./editpanel";
import { ActionButton2 } from "../buttons";
import { getSeed, tips, toLanguageFormat } from "utils/util";
import { restApi } from "../../provider/restApi";
import { apiNotification } from "utils/services";
import { useGlobalContext } from "../../provider";

const linkIcons: any = {
  discord: discordIcon,
  telegram: telegramIcon,
  linkedin: linkedinIcon,
  defaultlink: defaultlinkIcon,
}

interface ProfilePanelProps {
  address: string
  userData: UserObject
  updateUserData: any
}

const ProfilePanel = ({ address, userData, updateUserData }: ProfilePanelProps) => {
  const [state] = useGlobalContext();
  const [openModal, setOpenModal] = useState(false);

  const handleLike = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(address);
        await restApi.followUser(address, signature);
        tips("success", `Follow successed!`);
        updateUserData();
      }
    } catch (err: any) {
      apiNotification(err, "User follow failed!");
    }
  }

  return (
    <>
      {/* <Stack direction="row" className="relative min-h-300 w-full items-center">
        <BackgroundTag>
          <CoverBGTag />
          <BackgroundImageTag alt="Tanker" src={userTempCoverImg} />
          <BackgroundColorTag />
        </BackgroundTag>
        <Stack gap={2} flex={1} className="px-30">
          <h1 style={{fontSize: '56px', fontWeight: '700'}}>DefiTankLand</h1>
          <h2 style={{fontSize: '24px', fontWeight: 500}}>Unique economic model based MMO Tank game</h2>
        </Stack>
      </Stack> */}
      {(state.account && state.account === address) && (
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className="">
              <EditProfile profile={userData}
                updateProfile={updateUserData}
                setModal={setOpenModal}
                address={address}
              />
            </div>
          </Modal>
        )}
      <StyledAccountPanel>
        <Stack flex={1} gap={2}
          direction={{ sm: "column", md: "row" }}
          className="justify-between items-center p-5 sm:p-30"
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
            {userData.image ? (
              <Box alt=""
                component="img"
                src={userData.image}
                borderColor="primary.light"
                className="w-150 h-150 object-cover rounded-20"
              />
            ) : (
              <Jazzicon diameter={100} seed={getSeed(address)} />
            )}

            <Stack spacing={1.5}>
              <Typography variant="h4">
                {userData.name}
              </Typography>

              <Stack direction="row" spacing={2}>
                {userData.links.map((link: any, key: number) => (
                  <Box key={key} component="a" href={link.href || "/"}>
                    <Box alt="" component="img"
                      className="w-30 h-30 object-cover text-center"
                      src={linkIcons[link.type] || linkIcons["defaultlink"]}
                    />
                  </Box>
                ))}
              </Stack>

              <Typography>
                {userData.description}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton aria-label="" onClick={handleLike}>
                  <FavoriteIcon />
                </IconButton>

                <Typography>
                  Follows {userData.follows}
                </Typography>
              </Stack>

              {(state.account && state.account === address) && (
                <ActionButton2 onClick={() => setOpenModal(true)}>
                  {state.account && userData.email === "" ? "Create Profile To Play Game" : "Edit Profile"}
                </ActionButton2>
              )}
            </Stack>
          </Stack>

          <Stack gap={1} direction={{ xs: "column", lg: "row" }}>
            <Stack gap={1} className="">
              <div  style={{borderBottom: '1px solid rgba(255, 255, 255, 0.03)', margin: '12px 20px', paddingBottom: '6px'}}>
                <div className="flex middle" style={{alignItems: 'center'}}>
                  <StyledCircle style={{background: 'rgba(255, 141, 141, 1)'}}/>
                  <Typography>
                    Potion
                  </Typography>
                </div>
                <Typography style={{marginLeft: '16px'}}>
                  {toLanguageFormat(userData.potion)}
                </Typography>
              </div>
              <div  style={{borderBottom: '1px solid rgba(255, 255, 255, 0.03)', margin: '12px 20px', paddingBottom: '6px'}}>
                <div className="flex middle" style={{alignItems: 'center'}}>
                  <StyledCircle style={{background: 'rgba(107, 137, 44, 1)'}}/>
                  <Typography>
                  Golds
                  </Typography>
                </div>
                <Typography style={{marginLeft: '16px'}}>
                  {toLanguageFormat(userData.golds)}
                </Typography>
              </div>
            </Stack>
            <Stack gap={1}>

            <div  style={{borderBottom: '1px solid rgba(255, 255, 255, 0.03)', margin: '12px 20px', paddingBottom: '6px'}}>
                <div className="flex middle" style={{alignItems: 'center'}}>
                  <StyledCircle style={{background: 'rgba(34, 203, 240, 1)'}}/>
                  <Typography>
                  Exp
                  </Typography>
                </div>
                <Typography style={{marginLeft: '16px'}}>
                  {toLanguageFormat(userData.experience)}
                </Typography>
              </div>
              <div  style={{borderBottom: '1px solid rgba(255, 255, 255, 0.03)', margin: '12px 20px', paddingBottom: '6px'}}>
                <div className="flex middle" style={{alignItems: 'center'}}>
                  <StyledCircle style={{background: 'rgba(141, 173, 255, 1)'}}/>
                  <Typography>
                  Ranking
                  </Typography>
                </div>
                <Typography style={{marginLeft: '16px'}}>
                {userData.ranking === -1 ? "-" : userData.ranking + 1}
                </Typography>
              </div>
            </Stack>
            <Stack gap={1}>
             <div  style={{borderBottom: '1px solid rgba(255, 255, 255, 0.03)', margin: '12px 20px', paddingBottom: '6px'}}>
                <div className="flex middle" style={{alignItems: 'center'}}>
                  <StyledCircle style={{background: 'rgba(244, 201, 49, 1)'}}/>
                  <Typography>
                  Merit
                  </Typography>
                </div>
                <Typography style={{marginLeft: '16px'}}>
                  {toLanguageFormat(userData.merit)}
                </Typography>
              </div>

              <div  style={{borderBottom: '1px solid rgba(255, 255, 255, 0.03)', margin: '12px 20px', paddingBottom: '6px'}}>         
                <div className="flex middle" style={{alignItems: 'center'}}>
                  <StyledCircle style={{background: 'rgba(255, 112, 112, 1)'}}/>
                  <Typography>
                  Borrow
                  </Typography>
                </div>
                <Typography style={{marginLeft: '16px'}}>
                  {userData.borrowCount}
                </Typography>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </StyledAccountPanel>
    </>
  )
}

const StyledAccountPanel = styled("div")(({ theme }) => ({
  background: 'rgba(36, 36, 36, 1)',
  borderRadius: '16px',
  padding: '24px',
}))
const StyledCircle = styled("div")(({ theme }) => ({
  width: '9px',
  height: '9px',
  borderRadius: '50%',
  marginRight: '7px'
}))

const BackgroundTag = styled("div")(({ theme }) => ({
  // backgroundColor: "#6e120066",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
  borderRadius: '16px',
  overflow: 'hidden'
}))

const BackgroundImageTag = styled("img")(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.7",
}))

const CoverBGTag = styled("div")(({ theme }) => ({
  backgroundColor: "rgba(36, 36, 36, 1)",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.7"
}))

const BackgroundColorTag = styled("div")(({ theme }) => ({
  backgroundColor: "linear-gradient(180deg, rgba(0, 0, 0, 0), #000000 105.04%)",
  background: "linear-gradient(180deg, rgba(0, 0, 0, 0), #000000 105.04%)",
  boxShadow: '0px 4px 32px 0px rgba(0, 0, 0, 0.08)',
  position: "absolute",
  left: 0,
  top: 0,
  opacity: "0.4",
  width: "100%",
  height: "100%",
}))

export { ProfilePanel }