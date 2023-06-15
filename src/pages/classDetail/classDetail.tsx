import React from "react";
import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Box, Typography, Modal } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import speedIcon from 'assets/image/speedicon.png';
import healthIcon from 'assets/image/healthicon.png';
import firePowerIcon from 'assets/image/powericon.png';
import fireRateIcon from 'assets/image/firerateicon.png';

import { useGlobalContext } from "provider";
import { BuyPanel } from "../mint/common/buyPanel";
import { ActionButton1, ActionButton2 } from "components/buttons";

export const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyItem, setBuyItem] = useState(null);

  const [state] = useGlobalContext();
  const classInfo = state.tankClasses.find((tankClass: ClassesObject) => (
    tankClass.id === Number(id)
  ))

  /* ----- actions ----- */
  const handleBuy = async () => {
    setBuyItem(classInfo)
  }

  // return to 404 page if item is not exist
  if (!classInfo) {
    if (state.tankClasses.length !== 0) {
      navigate('/404')
    }

    return (<></>)
  }

  return (
    <Box>
      <ActionButton2 sx={{ m: "5px", mb: '10px' }}
        onClick={() => { navigate(-1) }}
      >
        <ArrowBackIcon /> back
      </ActionButton2>

      <StyledPanel>
        <SubPanel>
          <Stack direction="column">
            <Row>
              <Typography variant="h4">
                {classInfo.name}
              </Typography>
            </Row>

            <Box sx={{
              mt: 3,
              marginInline: "auto",
              height: { lg: "500px" }
            }}>
              <Box alt=""
                component="img"
                src={classInfo.image}
                sx={{
                  m: { md: "30px" },
                  maxHeight: "450px",
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
              <Typography variant="h5">Description</Typography>
              <Typography>{classInfo.description}</Typography>
            </Stack>

            <Row sx={{ mt: "30px" }} justifyContent="start" spacing={4}>
              <Typography>ID:</Typography>
              <Typography>{classInfo.id}</Typography>
            </Row>

            <Row sx={{ pb: "20px" }} alignItems="end">
              <Stack spacing={2} direction="column">
                <Typography>Price : {classInfo.price} DFTL</Typography>
                <ActionButton1 onClick={handleBuy}>Buy</ActionButton1>
              </Stack>
            </Row>

            {/* Property */}
            <Row sx={{ mt: "30px" }}>
              <Typography variant="h5">Properties</Typography>
            </Row>

            <PropertyPanel id={id} />
          </Stack>
        </SubPanel>
      </StyledPanel>

      <Modal open={buyItem != null}
        onClose={() => setBuyItem(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <BuyPanel item={buyItem}
            onClose={() => { setBuyItem(null) }}
          />
        </div>
      </Modal>
    </Box>
  )
}

const PropertyPanel = ({ id }: { id: string | undefined }) => {
  const [state] = useGlobalContext();
  const classInfo: ClassesObject = state.tankClasses.find((tankClass: ClassesObject) => (
    tankClass.id === Number(id)
  ))

  const properties = useMemo(() => {
    let properties = [
      {
        // fire power
        icon: firePowerIcon,
        name: "Fire Power",
        value: classInfo.firePower,
        add: classInfo.firePowerAdd
      }, {
        //fire rate
        icon: fireRateIcon,
        name: "Fire Rate",
        value: classInfo.fireRate,
        add: -1 * classInfo.fireRateAdd
      }, {
        //speed
        icon: speedIcon,
        name: "Speed",
        value: classInfo.speed,
        add: classInfo.speedAdd
      }, {
        //health
        icon: healthIcon,
        name: "Health",
        value: classInfo.health,
        add: classInfo.healthAdd
      }
    ]

    return properties
  }, [classInfo])

  return (
    <Stack>
      {properties.map((property: any, key: number) => (
        <Stack key={key}
          alignItems=""
          direction="row"
          justifyContent="space-between"
          sx={{
            borderRadius: 2,
            m: 0, mb: 1, p: 1.5,
            border: "1px solid",
            borderColor: "#555",
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
                textAlign: "center",
                width: "40px",
                pr: 2
              }}
            />

            <Typography>{property.name}</Typography>
          </Stack>

          <Typography>
            {property.value}{property.add > 0 ? "(+" : "("}{property.add + ")"}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

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