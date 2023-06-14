import React from "react";
import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, Box, Typography, LinearProgress, linearProgressClasses, Modal } from "@mui/material"

import speedIcon from 'assets/image/speedicon.png';
import healthIcon from 'assets/image/healthicon.png';
import firePowerIcon from 'assets/image/powericon.png';
import fireRateIcon from 'assets/image/firerateicon.png';

import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { EditPanel } from "./common/editPanel";
import { getSubString, tips } from "utils/util";
import { Layouts } from "components/layouts/layouts";
import { ActionButton1, ActionButton2 } from "components/buttons";

enum ItemType {
  "onUser",
  "onUserMine"
}

export const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, { upgradeNFT }] = useGlobalContext();

  const [openNameModal, setOpenaNameModal] = useState(false);

  const item = state.tankItems.find((tankItem: TankObject) => (
    Number(tankItem.id) === Number(id)
  ))

  const classInfo = state.tankClasses.find((tankClass: ClassesObject) => (
    tankClass.id === item?.classType
  ))

  const tankInfo = useMemo(() => {
    if (!item) return null;
    let tankLevel = item.tankLevel;
    let currentExp = item.experience - (tankLevel) * (tankLevel) * 1000;
    let nextLevelExp = (tankLevel + 1) * (tankLevel + 1) * 1000 - (tankLevel) * (tankLevel) * 1000;

    // energy pool
    let energyRecoverPerHour = (item.maxEnergy / 24).toFixed(2);

    let itemType = 0;
    if (item.owner === state.account) itemType = ItemType.onUserMine;
    else itemType = ItemType.onUser;

    return { ...item, tankLevel, currentExp, nextLevelExp, itemType, energyRecoverPerHour };
  }, [item])

  /* ----- actions ----- */
  const handleUpgrade = async () => {
    try {
      var tx = await upgradeNFT(Number(item.id))
      await tx.wait()

      tips("success", `Upgrade ${item.id} success`)
    } catch (err: any) {
      console.log("handle Upgrade", err.message)
      tips("error", `Upgrade ${item.id} Failed`)
    }
  }

  const handleLend = async () => {
    try {
      let signature: string = await state.signer.signMessage(item.id)
      await restApi.lend(item.id, "", signature)
      tips("success", `Lend ${item.id} success`)
    } catch (err: any) {
      console.log("handle lend", err.message)
      tips("error", `Lend ${item.id} Failed`)
    }
  }

  const handleBorrow = async () => {
    try {
      if (!state.signer) throw new Error("Please connect wallet!")
      let signature: string = await state.signer.signMessage(item.id)
      await restApi.borrow(item.id, signature)
      tips("success", `borrow ${item.id} success`)
    } catch (err: any) {
      console.log("handle lend", err.message)
      tips("error", `Borrow ${item.id} Failed`)
    }
  }

  // return to 404 page if item is not exist
  if (!item) {
    console.log(item, "return")
    if (state.tankItems.length !== 0) {
      navigate('/404')
    }

    return (<></>)
  }

  return (
    <Layouts>
      <ActionButton2 onClick={() => { navigate(-1) }}
        sx={{ m: "5px", mb: '10px' }}
      >
        <ArrowBackIcon /> back
      </ActionButton2>

      <StyledPanel>
        <SubPanel>
          <Stack direction="column">
            <Row>
              <Typography variant="h4">{tankInfo.name}</Typography>
            </Row>

            <Row>
              <Typography>Type: {classInfo.name}</Typography>
              <Typography>ID: {tankInfo.id}</Typography>
            </Row>

            <Stack spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ pt: "30px", pb: "20px" }}
              direction={{ md: "row", xs: "column" }}
            >
              <Typography>
                Owner : {getSubString(item.owner)}
              </Typography>

              {tankInfo.itemType === ItemType.onUserMine ? (
                <Stack spacing={2} direction="row">
                  <ActionButton1 onClick={handleUpgrade}
                    disabled={tankInfo.level >= tankInfo.tankLevel}
                  >
                    Upgrade
                  </ActionButton1>

                  {tankInfo.borrower === tankInfo.owner ? (
                    <ActionButton1 onClick={handleLend}>Lend</ActionButton1>
                  ) : (
                    <ActionButton1 onClick={handleBorrow}>retrieve</ActionButton1>
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
            </Stack>

            {/* Level and experience */}
            <Row sx={{ mt: "10px" }}>
              <Typography>Level</Typography>
              <Typography>
                {tankInfo.currentExp}/{tankInfo.nextLevelExp} {"(EXP)"}
              </Typography>
            </Row>

            <Row>
              <Typography sx={{ maxWidth: "50px", flex: 1 }}>
                {tankInfo.level}/{tankInfo.tankLevel}
              </Typography>

              <Typography sx={{ flex: 1 }}>
                <BorderLinearProgress variant="determinate"
                  value={tankInfo.currentExp * 100 / tankInfo.nextLevelExp}
                />
              </Typography>
            </Row>

            <Box sx={{
              mt: 3,
              marginInline: "auto",
              height: { lg: "500px" }
            }}>
              <Box alt=""
                component="img"
                src={tankInfo.image}
                sx={{
                  m: { md: "50px" },
                  maxHeight: "400px",
                  textAlign: "center",
                  borderRadius: "20px",
                  //   width: { md: "calc(100% - 100px)", xs: "100%" },
                  maxWidth: { md: "calc(100% - 100px)", xs: "100%" },
                }}
              />
            </Box>
          </Stack>
        </SubPanel>

        <SubPanel>
          <Stack direction="column">
            <Stack direction="column">
              <Typography variant="h5">
                Description
              </Typography>

              <Stack spacing={4}
                direction="row"
                alignItems="center"
                justifyContent={"space-between"}
              >
                <Typography>{tankInfo.description}</Typography>
                <ActionButton2 onClick={() => setOpenaNameModal(true)}>Edit</ActionButton2>
              </Stack>
            </Stack>

            {/* Staking pool info */}
            <Row sx={{ mt: "15px" }}>
              <Typography>Staking Pool</Typography>
              <Typography>
                {tankInfo.energyPool}/{tankInfo.maxEnergyPool}
              </Typography>
            </Row>

            <Row>
              <Typography sx={{ flex: 1 }}>
                <BorderLinearProgress variant="determinate"
                  value={tankInfo.energyPool * 100 / tankInfo.maxEnergyPool}
                />
              </Typography>
            </Row>

            {/* Energy pool info */}
            <Row sx={{ mt: "10px" }}>
              <Typography>Energy</Typography>
              <Typography>
                {tankInfo.energy}/{tankInfo.maxEnergy} {"(+" + tankInfo.energyRecoverPerHour + "/h)"}
              </Typography>
            </Row>

            <Row>
              <Typography sx={{ flex: 1 }}>
                <BorderLinearProgress variant="determinate"
                  value={tankInfo.energy * 100 / tankInfo.maxEnergy}
                />
              </Typography>
            </Row>

            {/* Property */}
            <Row sx={{ mt: "30px" }}>
              <Typography variant="h5">Properties</Typography>
            </Row>

            <PropertyPanel id={id} />
          </Stack>
        </SubPanel>
      </StyledPanel>

      <Modal open={openNameModal}
        onClose={() => setOpenaNameModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <EditPanel item={item}
          onClose={() => setOpenaNameModal(false)}
        />
      </Modal>
    </Layouts>
  )
}

const PropertyPanel = ({ id }: { id: string | undefined }) => {
  const [state] = useGlobalContext();

  const item: TankObject = state.tankItems.find((tankItem: TankObject) => (
    Number(tankItem.id) === Number(id)
  ))

  const classInfo: ClassesObject = state.tankClasses.find((tankClass: ClassesObject) => (
    tankClass.id === item?.classType
  ))

  const properties = useMemo(() => {
    const properties = [
      {
        // fire power
        icon: firePowerIcon,
        name: "Fire Power",
        value: item.firePower,
        add: classInfo.firePowerAdd
      }, {
        //fire rate
        icon: fireRateIcon,
        name: "Fire Rate",
        value: item.fireRate,
        add: -1 * classInfo.fireRateAdd
      }, {
        //speed
        icon: speedIcon,
        name: "Speed",
        value: item.speed,
        add: classInfo.speedAdd
      }, {
        //health
        icon: healthIcon,
        name: "Health",
        value: item.health,
        add: classInfo.healthAdd
      }
    ]

    return properties
  }, [item, classInfo])

  return (
    <Stack>
      {properties.map((property: any, key: number) => (
        <Stack key={key}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            borderRadius: 2,
            m: 0, mb: 1, p: 1.5,
            borderColor: "#444",
            border: "1px solid",
          }}
        >
          <Stack direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box alt=""
              component="img"
              src={property.icon}
              sx={{
                pr: 2,
                width: "40px",
                textAlign: "center",
              }}
            />

            <Typography>
              {property.name}
            </Typography>
          </Stack>

          <Typography>
            {property.value}{property.add > 0 ? "(+" : "("}{property.add + ")"}
          </Typography>
        </Stack>
      ))}
    </Stack>
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
  }
}))

const StyledPanel = styled("div")(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: "#0000008f",
  display: "flex",
  flexWrap: "wrap"
}))

const SubPanel = styled("div")(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    minWidth: "200px",
    padding: "20px",
  },
  [theme.breakpoints.up('sm')]: {
    padding: "50px",
    minWidth: "400px",
  },
  flex: 1
}))

const Row = styled((props: any) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    {...props}
  />
))(({ theme }) => ({
  paddingBottom: "7px"
}))