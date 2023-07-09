import React from "react"
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack, Typography, Modal } from "@mui/material";

import userTempImg from "../../assets/image/tanker-temp.png";
import userTempCoverImg from "../../assets/image/tank55.webp";

import { ActionButton2 } from "components/buttons";
import { useGlobalContext } from "provider";

export const CreateGuild = () => {
  const [state] = useGlobalContext()

  const mintGuildClick = () => {
    console.log("mint guild function")
  }

  return (
    <Stack direction="row"
      alignItems="center"
      sx={{
        width: "100%",
        minHeight: "300px",
        position: "relative"
      }}
    >
      <BackgroundTag>
        <BackgroundImageTag alt="Tanker" src={userTempCoverImg} />
        <BackgroundColorTag />
      </BackgroundTag>

      <Stack
        direction={{ sm: "column", lg: "row" }}
        sx={{ padding: "30px", flex: 1, gap: '20px' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <div className="flex flex-row justify-center lg:justify-start">
            <Box alt="Profile" component="img"
              src={userTempImg}
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
          </div>

          <Stack spacing={1.5}>
            <Typography variant="h4">
              Create New Guild
            </Typography>

            <Typography sx={{ maxWidth: '500px' }}>
              Collaboration: Teamwork is at the core of our guild. We coordinate our efforts, share knowledge, and support each other to achieve greatness.
            </Typography>

            <div className="flex flex-row">
              <ActionButton2 onClick={mintGuildClick}>
                Create New Guild
              </ActionButton2>
            </div>
          </Stack>
        </Stack>

        <div className="w-full lg:w-auto flex flex-row">
          <Stack sx={{ minWidth: "200px" }} spacing={2}>
            <Typography>
              MaxMembers: {state.guildRules.maxMembers}
            </Typography>

            <Typography>
              Price: {state.guildRules.price} DFTL
            </Typography>

            <Typography>
              TotalGuild: {state.guildDatas.length}
            </Typography>
          </Stack>
        </div>
      </Stack>
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