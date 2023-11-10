import React from "react";
import Jazzicon from 'react-jazzicon';
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Box, TextField, Stack, Paper, IconButton, Typography } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useGlobalContext } from "../../provider";
import { restApi } from "../../provider/restApi";
import { getSeed, tips } from "../../utils/util";
import { ItemContainer } from "components/styles";
import { apiNotification } from "utils/services";

interface PropsObject {
  profile: UserObject
  updateProfile: any
  address: string
  setModal: any
}

const EditProfile = (props: PropsObject) => {
  const { address, profile, updateProfile, setModal } = props

  const [state] = useGlobalContext();
  const [links, setLinks]: any = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile.name);
  const [password, setPassword] = useState("qwe");
  const [image, _setImage] = useState(profile.image);
  const [desc, setDesc] = useState(profile.description);
  // const [coverImage, _setCoverImage] = useState(profile.coverImage);
  const [email, setEmail] = useState(profile.email);
  // const [selectedFile1, setSeletedFile1] = useState<any>(null);
  const [selectedFile, setSeletedFile] = useState<any>(null);

  useEffect(() => {
    const bump = profile.links.reduce((tempLinks: any, link: LinksObject) => (
      { ...tempLinks, [link.type]: link.href }
    ), {})

    setLinks(bump)
  }, [profile])

  const HandleSubmit = async () => {
    try {
      // check validation
      let checkForm = new FormData();
      checkForm.append("name", name);
      checkForm.append("email", email);
      checkForm.append("address", address);

      const validation = await restApi.checkProfile(checkForm);
      if (!validation.isValid) {
        tips("warning", "Exist Username or Email")
      } else if (!profile.image && (!selectedFile)) {
        tips("warning", "Please select image")
      } else if (name.trim() === "" || name == 'Please enter display name') {
        tips("warning", "Please enter name")
      } else if (email.trim() === "" || email == "player@gmail.com") {
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
        form.append("userAddress", address)
        form.append("description", desc)
        form.append("password", password)
        form.append("image", selectedFile)
        // form.append("coverImage", selectedFile1)
        form.append("links", JSON.stringify(newLinks))
        form.append("signature", signature)

        await restApi.setProfile(form)
        tips("success", "Successfully Updated")
        updateProfile()
        setModal(false)
      }
    } catch (err: any) {
      setLoading(false);
      apiNotification(err, "Profile update failed!");
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

  // const HandleCoverImageChange = async (event: any) => {
  // const newImage = event.target?.files?.[0]

  // // if (coverImage) {
  // //   _setCoverImage("")
  // //   setSeletedFile1(null)
  // //   URL.revokeObjectURL(coverImage)
  // // }

  // if (newImage) {
  //   try {
  //     // _setCoverImage(URL.createObjectURL(newImage))
  //     setSeletedFile1(newImage)
  //   } catch (err) {
  //     console.log(err.message)
  //   }
  // }
  // }

  return (
    <Box sx={styleWrapper} style={{ borderRadius: '12px' }}>
      <Box sx={styleContainer}>
        <Stack className="relative" direction="column" gap="10px">
          <ItemContainer className="gap-30 middle">
            <Stack alignItems="center" direction="column">
              <Box sx={{ position: "relative" }}>
                {image ? (
                  <Box alt=""
                    src={image}
                    component="img"
                    sx={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "18px",
                    }}
                  />
                ) : (
                  // @ts-ignore
                  <Jazzicon diameter={180} seed={getSeed(address)} />
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
            <div style={{flex: 1}}>
              <TextField required label="Name" className="mt-20 rounded-20"
                onChange={({ target }) => setName((target.value).trim())}
                sx={inputstyle} value={name}
              />

              <TextField required label="Email" type="email" className="mt-20"
                onChange={({ target }) => setEmail((target.value).trim())}
                sx={inputstyle} value={email}
              />
            </div>
          </ItemContainer>

          {/* <ItemContainer>
            <Stack alignItems="center" direction="column" sx={{ flex: 1 }}>
              <Box sx={{ position: "relative", width: "100%" }}> */}
          {/* <Box alt="" component="img"
                  src={coverImage || userTempCoverImg}
                  sx={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                /> */}

          {/* <IconButton color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={imageStyle}
                >
                  <input hidden
                    type="file"
                    accept="image/*"
                    onChange={HandleCoverImageChange}
                  />
                </IconButton> */}
          {/* </Box> */}

          {/* {!coverImage && (
                <Typography>Please Set CoverImage</Typography>
              )} */}
          {/* </Stack> */}
          {/* </ItemContainer> */}

          <ItemContainer>
            <TextField required label="Password" type="password"
              onChange={(e) => setPassword((e.target.value).trim())}
              sx={inputstyle} value={password}
            />
          </ItemContainer>

          <ItemContainer>
            <TextField label="Description"
              onChange={(e) => setDesc(e.target.value)}
              sx={inputstyle} value={desc}
            />
          </ItemContainer>

          <ItemContainer>
            <TextField label="discord"
              onChange={(e) => setLinks({ ...links, discord: e.target.value })}
              sx={inputstyle} value={links.discord}
            />

            <TextField label="telegram"
              onChange={(e) => setLinks({ ...links, telegram: e.target.value })}
              sx={inputstyle} value={links.telegram}
            />

            <TextField label="linkedin"
              onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
              sx={inputstyle} value={links.linkedin}
            />

            <TextField label="default"
              onChange={(e) => setLinks({ ...links, default: e.target.value })}
              sx={inputstyle} value={links.default}
            />
          </ItemContainer>

          <ItemContainer>
            <LoadingButton color="success" variant="contained"
              onClick={HandleSubmit} loading={loading}
              className="hover:opacity-75"
              style={{
                width: '70%',
                padding: '1rem',
                margin: '0 auto',
                fontWeight: '700',
                borderRadius: '16px',
                backgroundColor: 'rgba(250, 105, 0, 0.85)',
                color: 'white'
              }}
            >
              Submit
            </LoadingButton>
          </ItemContainer>
        </Stack>
      </Box>
      <div onClick={() => {setModal(false)}} style={{
        position:'absolute',
        top: '-15px',
        right: '-15px',
        boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.1)',
        background: 'rgb(66,66,66)',
        color: 'white',
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <CloseOutlinedIcon className="text-30" />
      </div>
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
  width: { xs: "90vw", sm: "80vw", md: "900px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
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

export { EditProfile }