import React from "react";
import Jazzicon from 'react-jazzicon';
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, TextField, Stack, Paper, IconButton, Typography } from "@mui/material";


import userTempImg from "../../assets/image/tanker-temp.png";
import userTempCoverImg from "../../assets/image/tank55.webp";
import discordIcon from "../../assets/image/discordicon.png";
import linkedinIcon from "../../assets/image/linkedinicon.png";
import telegramIcon from "../../assets/image/telegramicon.png";
import defaultlinkIcon from "../../assets/image/defaultlinkicon.png";

import { useGlobalContext } from "provider";

const ItemContainer = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: "column",
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: "row",
  },
  background: "transparent",
  padding: theme.spacing(1),
  textAlign: "center",
  boxShadow: "none",
  display: "flex",
  gap: "10px",
}))

export const EditGuild = () => {
  const [state] = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [guildImage, setGuildImage] = useState('');
  const [selectedFile, setSeletedFile] = useState<any>(null);

  const HandleCoverImageChange = async (event: any) => {
    try {
      const newImage = event.target?.files?.[0]

      if (guildImage) {
        setGuildImage("")
        setSeletedFile(null)
        URL.revokeObjectURL(guildImage)
      }

      if (newImage) {
        setGuildImage(URL.createObjectURL(newImage))
        setSeletedFile(newImage)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const HandleSubmit = async () => {
    try {
      console.log('**********')
    } catch (err: any) {

    }
  }

  return (
    <Box sx={style} style={{ borderRadius: '12px' }}>
      <Stack spacing={2}>
        <ItemContainer>
          <Stack alignItems="center" direction="column" sx={{ flex: 1 }}>
            <Box sx={{ position: "relative", width: "100%" }}>
              <Box alt="" component="img"
                src={userTempCoverImg}
                sx={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <IconButton color="primary"
                aria-label="upload picture"
                component="label"
                sx={imageStyle}
              >
                <input hidden
                  type="file"
                  accept="image/*"
                  onChange={HandleCoverImageChange}
                />
              </IconButton>
            </Box>

            {!guildImage && (
              <Typography>Please Set Guild Image</Typography>
            )}
          </Stack>
        </ItemContainer>

        <ItemContainer>
          <TextField label="Name" required
            onChange={(e) => setName((e.target.value).trim())}
            sx={inputstyle}
            value={name}
          />
        </ItemContainer>

        <ItemContainer>
          <TextField label="Description"
            onChange={(e) => setDesc(e.target.value)}
            sx={inputstyle}
            value={desc}
          />
        </ItemContainer>

        <ItemContainer>
          <LoadingButton color="success"
            onClick={HandleSubmit}
            loading={loading}
            variant="contained"
            sx={{ width: "100%" }}
            style={{
              backgroundColor: '#a14e22',
              padding: '1rem'
            }}
          >
            Submit
          </LoadingButton>
        </ItemContainer>
      </Stack>
    </Box>
  )
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "230px", sm: "300px", md: "800px" },
  bgcolor: "background.paper",
  border: "2px solid background.paper",
  boxShadow: "0 3px 10px #000",
  p: 4,
  borderRadius: "5px",
  height: "80%",
  overflow: "auto",
  bordreRadius: '10px'
}

const inputstyle = {
  width: "100%",
}

const iconstyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100px",
  height: "100px",
  color: "#be5c22",
}

const imageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "220px",
  color: "#be5c22",
  borderRadius: "unset",
}