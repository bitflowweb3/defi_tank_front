import React from "react";
import { useState } from "react";
import Jazzicon from 'react-jazzicon';
import { styled } from "@mui/material/styles";
import { Box, Stack, IconButton, Typography, Modal } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import userTempCoverImg from "../../assets/image/bg (7).webp";
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
    <Stack direction="row" className="relative min-h-300 w-full items-center">
      <BackgroundTag>
        <CoverBGTag />
        {/* <BackgroundImageTag alt="Tanker" src={userTempCoverImg} />
        <BackgroundColorTag /> */}
      </BackgroundTag>

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
              className="w-150 h-150 border-5 object-cover rounded-20"
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
          <Stack gap={1} className="min-w-200">
            <Typography>
              Potion: {toLanguageFormat(userData.potion)}
            </Typography>

            <Typography>
              Golds: {toLanguageFormat(userData.golds)}
            </Typography>

            <Typography>
              Exp: {toLanguageFormat(userData.experience)}
            </Typography>
          </Stack>

          <Stack gap={1} className="min-w-200">
            <Typography>
              Ranking: {userData.ranking === -1 ? "-" : userData.ranking + 1}
            </Typography>

            <Typography>
              Merit: {toLanguageFormat(userData.merit)}
            </Typography>

            <Typography>
              Borrow: {userData.borrowCount}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

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
    </Stack>
  )
}

const BackgroundTag = styled("div")(({ theme }) => ({
  backgroundColor: "#6e120066",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
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
  backgroundColor: "#060200e3",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.7"
}))

const BackgroundColorTag = styled("div")(({ theme }) => ({
  backgroundColor: "#6e120066",
  position: "absolute",
  left: 0,
  top: 0,
  opacity: "0.4",
  width: "100%",
  height: "100%",
}))

export { ProfilePanel }