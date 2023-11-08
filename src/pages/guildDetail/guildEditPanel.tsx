import React from "react";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Stack, IconButton } from "@mui/material";

import { tips } from "utils/util";
import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import baseGuild from "assets/image/baseguild.png";
import { ItemContainer } from "components/styles";

interface EditProps {
  guildInfo: GuildObject
  onClose: any
}

const GuildEditPanel = ({ guildInfo, onClose }: EditProps) => {
  const [state] = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>('');
  const [guildImg, setGuildImg] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [imgFile, setImgFile] = useState<any>(null)

  useEffect(() => {
    setName(guildInfo.name)
    setGuildImg(guildInfo.image)
    setDescription(guildInfo.description)
  }, [])

  const handleImgChange = ({ target }: any) => {
    try {
      const newImage = target?.files?.[0]

      if (guildImg) {
        setGuildImg("")
        setImgFile(null)
        URL.revokeObjectURL(guildImg)
      }

      if (newImage) {
        setImgFile(newImage)
        setGuildImg(URL.createObjectURL(newImage))
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const HandleSubmit = async () => {
    try {
      if (!name) {
        throw new Error("Please Enter Name");
      }

      const validation = await restApi.checkGuildName(guildInfo.id, name);
      if (!validation.isValid) {
        throw new Error(`Exists ${name} guild`);
      }

      setLoading(true)
      const guildID = guildInfo.id
      const signature = await state.signer.signMessage(guildID)

      let form = new FormData()
      form.append("image", imgFile)
      form.append("guildID", guildID)
      form.append("name", name.trim())
      form.append("signature", signature)
      form.append("description", description.trim())

      const updateRes = await restApi.updateGuild(form)
      console.log(updateRes)

      onClose(false)
      tips("success", "Successfully Updated")
    } catch (err: any) {
      setLoading(false)
      tips("error", err.message)
    }
  }

  return (
    <Box sx={styleWrapper} style={{ borderRadius: '12px' }}>
      <Box sx={styleContainer}>
        <Stack direction="column" className="relative gap-10">
          <ItemContainer>
            <Stack direction="column" className="flex-1 items-center">
              <Box className="relative flex">
                <img alt="" src={guildImg || baseGuild}
                  className="w-full max-w-400 object-cover rounded-xl"
                />

                <IconButton color="primary" component="label" sx={imageStyle}>
                  <input hidden type="file" accept="image/*" onChange={handleImgChange} />
                </IconButton>
              </Box>
            </Stack>
          </ItemContainer>

          <ItemContainer>
            <TextField required label="Name"
              onChange={({ target }) => setName((target.value).trim())}
              sx={inputstyle} value={name}
            />
          </ItemContainer>

          <ItemContainer>
            <TextField label="Description"
              onChange={(e) => setDescription(e.target.value)}
              sx={inputstyle} value={description}
            />
          </ItemContainer>

          <ItemContainer>
            <LoadingButton color="success" variant="contained"
              className="hover:opacity-75" loading={loading} onClick={HandleSubmit}
              style={{ width: '100%', padding: '1rem', fontWeight: '700', backgroundColor: '#a14e22' }}
            >
              Submit
            </LoadingButton>
          </ItemContainer>
        </Stack>
      </Box>
    </Box>
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
  width: { xs: "90vw", sm: "80vw", md: "700px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
}

const inputstyle = {
  width: "100%",
}

const imageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  color: "#be5c22",
  borderRadius: "unset",
}

export { GuildEditPanel }