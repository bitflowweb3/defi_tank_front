import React from "react";
import Jazzicon from 'react-jazzicon';
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, TextField, Stack, Paper, IconButton, Typography } from "@mui/material";

import userTempCoverImg from "../../assets/image/tank55.webp";
import { useGlobalContext } from "../../provider";
import { restApi } from "../../provider/restApi";
import { getSeed, tips } from "../../utils/util";

interface PropsObject {
  profile: UserObject
  updateProfile: any
  address: string
  setModal: any
}

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

export const EditProfile = (props: PropsObject) => {
  const { address, profile, updateProfile, setModal } = props
  const image1 = "https://ipfs.babylonswap.finance/ipfs/QmZK72v6JWkWX153AEasaVGA5qxyt6pV9KTLwxnGMUqddK";

  const [state] = useGlobalContext();
  const [links, setLinks]: any = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile.name);
  const [password, setPassword] = useState("qwe");
  const [image, _setImage] = useState(profile.image);
  const [desc, setDesc] = useState(profile.description);
  const [coverImage, _setCoverImage] = useState(profile.coverImage);
  const [email, setEmail] = useState(profile.email || "player@gmail.com");
  const [selectedFile1, setSeletedFile1] = useState<any>(null);
  const [selectedFile, setSeletedFile] = useState<any>(null);

  useEffect(() => {
    const bump = profile.links.reduce((tempLinks: any, link: LinksObject) => (
      { ...tempLinks, [link.type]: link.href }
    ), {})

    setLinks(bump)
  }, [profile])

  const HandleSubmit = async () => {
    try {
      if (profile.email === "") {
        // check validation
        let checkForm = new FormData();
        checkForm.append("name", name);
        checkForm.append("email", email);
        checkForm.append("address", address);

        const validation = await restApi.checkProfile(checkForm);

        if (!validation.isValid) {
          throw new Error("Exist Username or Email");
        }
      }

      if (!profile.image && (!selectedFile || !selectedFile1)) {
        tips("warning", "Please select image")
      } else if (name.trim() === "") {
        tips("warning", "Please enter name")
      } else if (email.trim() === "") {
        tips("warning", "Please enter email")
      } else if (password.trim() === "") {
        tips("warning", "Please enter password")
      } else {

        const linkKeys = Object.keys(links)
        const newLinks = linkKeys.reduce((tempLinks: LinksObject[], key: string) => {
          const tempLink = { type: key, href: links[key] }
          return [...tempLinks, tempLink]
        }, [])

        setLoading(true)
        const signature = await state.signer.signMessage("welcome " + name)

        let form = new FormData()
        form.append("name", name)
        form.append("email", email)
        form.append("description", desc)
        form.append("password", password)
        form.append("image", selectedFile)
        form.append("coverImage", selectedFile1)
        form.append("links", JSON.stringify(newLinks))
        form.append("signature", signature)

        const tempUserData = await restApi.setProfile(form)
        tips("success", "Successfully Updated")
        updateProfile()
        setModal(false)
      }
    } catch (err: any) {
      setLoading(false)
      tips("error", err.message)
      console.log(err.message)
    }
  }

  const HandleImageChange = async (event: any) => {
    const newImage = event.target?.files?.[0]

    if (image) {
      _setImage("")
      setSeletedFile(null)
      URL.revokeObjectURL(image)
    }

    if (newImage) {
      try {
        _setImage(URL.createObjectURL(newImage));
        setSeletedFile(newImage);
      } catch (err) {
        console.log(err.message)
      }
    }
  }

  const HandleCoverImageChange = async (event: any) => {
    const newImage = event.target?.files?.[0]

    if (coverImage) {
      _setCoverImage("")
      setSeletedFile1(null)
      URL.revokeObjectURL(coverImage)
    }

    if (newImage) {
      try {
        _setCoverImage(URL.createObjectURL(newImage))
        setSeletedFile1(newImage)
      } catch (err) {
        console.log(err.message)
      }
    }
  }

  return (
    <Box sx={style} style={{ borderRadius: '12px' }}>
      <Stack spacing={2}>
        <ItemContainer>
          <Stack alignItems="center" direction="column">
            <Box sx={{ position: "relative" }}>
              {image ? (
                <Box
                  component="img"
                  src={image || image1}
                  alt=""
                  sx={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                // @ts-ignore
                <Jazzicon diameter={100} seed={getSeed(address)} />
              )}

              <IconButton color="primary"
                aria-label="upload picture"
                component="label"
                sx={iconstyle}
              >
                <input hidden
                  type="file"
                  accept="image/*"
                  onChange={HandleImageChange}
                />

                <Paper />
              </IconButton>
            </Box>

            {!image && (
              <Typography>Please Set Image</Typography>
            )}
          </Stack>
        </ItemContainer>

        <ItemContainer>
          <Stack alignItems="center" direction="column" sx={{ flex: 1 }}>
            <Box sx={{ position: "relative", width: "100%" }}>
              <Box alt="" component="img"
                src={coverImage || userTempCoverImg}
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

            {!coverImage && (
              <Typography>Please Set CoverImage</Typography>
            )}
          </Stack>
        </ItemContainer>

        <ItemContainer>
          <TextField label="Name" required
            onChange={(e) => setName((e.target.value).trim())}
            sx={inputstyle}
            value={name}
          />

          <TextField label="Email" required
            onChange={(e) => setEmail((e.target.value).trim())}
            sx={inputstyle}
            type={"email"}
            value={email}
          />
        </ItemContainer>

        <ItemContainer>
          <TextField label="Password" required
            onChange={(e) => setPassword((e.target.value).trim())}
            type={"password"}
            value={password}
            sx={inputstyle}
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
          <TextField label="discord"
            onChange={(e) => setLinks({ ...links, discord: e.target.value })}
            value={links.discord}
            sx={inputstyle}
          />

          <TextField label="telegram"
            onChange={(e) => setLinks({ ...links, telegram: e.target.value })}
            value={links.telegram}
            sx={inputstyle}
          />

          <TextField label="linkedin"
            onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
            value={links.linkedin}
            sx={inputstyle}
          />

          <TextField label="default"
            onChange={(e) => setLinks({ ...links, default: e.target.value })}
            value={links.default}
            sx={inputstyle}
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