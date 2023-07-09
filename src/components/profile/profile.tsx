import React from "react";
import Jazzicon from 'react-jazzicon';
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack, IconButton, Typography, Modal } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import userTempImg from "../../assets/image/tanker-temp.png";
import userTempCoverImg from "../../assets/image/tank55.webp";
import discordIcon from "../../assets/image/discordicon.png";
import linkedinIcon from "../../assets/image/linkedinicon.png";
import telegramIcon from "../../assets/image/telegramicon.png";
import defaultlinkIcon from "../../assets/image/defaultlinkicon.png";

import { EditProfile } from "./editpanel";
import { ActionButton2 } from "../buttons";
import { restApi } from "../../provider/restApi";
import { useGlobalContext } from "../../provider";
import { getSeed } from "utils/util";

const linkIcons: any = {
  discord: discordIcon,
  telegram: telegramIcon,
  linkedin: linkedinIcon,
  defaultlink: defaultlinkIcon,
}

const initProfile: UserObject = {
  status: 'init',
  name: "player",
  address: "",
  email: "",
  description: "Player",
  follows: 0,
  image: "",
  coverImage: "",
  links: [],
  ranking: -1,
  merit: 0,
}

export const ProfilePanel = ({ address }) => {
  const [state] = useGlobalContext();
  const [openModal, setOpenModal] = useState(false);
  const [profile, setProfile] = useState<UserObject>(initProfile);

  useEffect(() => {
    if (state.walletStatus === 2) {
      updateProfile()
    } else if (profile.status !== 'init') {
      setProfile(initProfile)
    }
  }, [state.walletStatus])

  const updateProfile = async () => {
    try {
      const tempData = await restApi.getProfile(address)
      setProfile(tempData)
    } catch (err) {
      if (profile.status !== 'init') {
        setProfile(initProfile)
      }
    }
  }

  return (
    <Stack direction="row"
      alignItems="center"
      sx={{
        minHeight: "300px",
        width: "100%",
        position: "relative"
      }}
    >
      <BackgroundTag>
        <BackgroundImageTag alt="Tanker" src={profile.coverImage || userTempCoverImg} />
        <BackgroundColorTag />
      </BackgroundTag>

      <Stack
        direction={{ sm: "column", md: "row" }}
        sx={{ padding: { xs: "5px", sm: "30px" }, flex: 1 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
          {profile.image ? (
            <Box alt="Profile" component="img"
              src={profile.image || userTempImg}
              sx={{
                textAlign: "center",
                width: "150px",
                height: "150px",
                border: "5px solid",
                borderColor: "primary.light",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
          ) : (
            // @ts-ignore
            <Jazzicon diameter={100} seed={getSeed(address)} />
          )}

          {/* profile info */}
          <Stack spacing={1.5}>
            <Typography variant="h4">
              {profile.name}
            </Typography>

            <Stack direction="row" spacing={2}>
              {profile.links.map((link: any, key: number) => (
                <Box key={key}
                  component="a"
                  href={link.href || "/"}
                >
                  <Box alt="Profile" component="img"
                    src={linkIcons[link.type] || linkIcons["defaultlink"]}
                    sx={{
                      textAlign: "center",
                      width: "30px",
                      height: "30px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Stack>

            <Typography>
              {profile.description}
            </Typography>

            {/* follow */}
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>

              <Typography>
                Follows {profile.follows}
              </Typography>
            </Stack>

            {/* Edit profile */}
            {(address && address === state.account) && (
              <ActionButton2 onClick={() => setOpenModal(true)}>
                {state.account && profile.email === "" ? "Create Profile To Play Game" : "Edit Profile"}
              </ActionButton2>
            )}
          </Stack>
        </Stack>

        {/* Ranking info */}
        <Stack sx={{ minWidth: "200px" }} spacing={2}>
          <Typography>
            Ranking: {profile.ranking == -1 ? "-" : profile.ranking + 1}
          </Typography>

          <Typography>
            Merit: {profile.merit}
          </Typography>

          <Typography>
            Borrow: {profile.borrowCount}
          </Typography>
        </Stack>
      </Stack>

      <Modal open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <EditProfile profile={profile}
            updateProfile={updateProfile}
            setModal={setOpenModal}
            address={address}
          />
        </div>
      </Modal>
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

const BackgroundColorTag = styled("div")(({ theme }) => ({
  backgroundColor: "#6e120066",
  position: "absolute",
  left: 0,
  top: 0,
  opacity: "0.4",
  width: "100%",
  height: "100%",
}))