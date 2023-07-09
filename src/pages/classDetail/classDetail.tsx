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
import { Layouts } from "components/layouts/layouts";
import { ActionButton1, ActionButton2 } from "components/buttons";

const PropertyPanel = ({ id }: { id: string | undefined }) => {
  const [state] = useGlobalContext();
  const tankClass: TankClassObject = state.tankClasses.find((tankClass: TankClassObject) => (
    tankClass.id === Number(id)
  ))

  const properties = useMemo(() => {
    let properties = [
      {
        // fire power
        icon: firePowerIcon,
        name: "Fire Power",
        value: tankClass.firePower,
        add: tankClass.firePowerAdd
      }, {
        //fire rate
        icon: fireRateIcon,
        name: "Fire Rate",
        value: tankClass.fireRate,
        add: -1 * tankClass.fireRateAdd
      }, {
        //speed
        icon: speedIcon,
        name: "Speed",
        value: tankClass.speed,
        add: tankClass.speedAdd
      }, {
        //health
        icon: healthIcon,
        name: "Health",
        value: tankClass.health,
        add: tankClass.healthAdd
      }
    ]

    return properties
  }, [tankClass])

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

const TankClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyItem, setBuyItem] = useState(null);

  const [state] = useGlobalContext();
  const tankClass = state.tankClasses.find((tankClass: TankClassObject) => (
    tankClass.id === Number(id)
  ))

  /* ----- actions ----- */
  const handleBuy = async () => {
    setBuyItem(tankClass)
  }

  // return to 404 page if item is not exist
  if (!tankClass) {
    if (state.tankClasses.length !== 0) {
      navigate('/404')
    }

    return (<></>)
  }

  return (
    <Layouts>
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
                {tankClass.name}
              </Typography>
            </Row>

            <Box sx={{
              mt: 3,
              marginInline: "auto",
              height: { lg: "500px" }
            }}>
              <Box alt=""
                component="img"
                src={tankClass.image}
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
              <Typography>{tankClass.description}</Typography>
            </Stack>

            <Row sx={{ mt: "30px" }} justifyContent="start" spacing={4}>
              <Typography>ID:</Typography>
              <Typography>{tankClass.id}</Typography>
            </Row>

            <Row sx={{ pb: "20px" }} alignItems="end">
              <Stack spacing={2} direction="column">
                <Typography>Price : {tankClass.price} DFTL</Typography>
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
          <BuyPanel item={buyItem} type="tank"
            onClose={() => { setBuyItem(null) }}
          />
        </div>
      </Modal>
    </Layouts>
  )
}

const ItemClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyItem, setBuyItem] = useState(null);

  const [state] = useGlobalContext();
  const itemClass = state.itemClasses.find((itemClass: ItemClassObject) => (
    itemClass.id === Number(id)
  ))

  /* ----- actions ----- */
  const handleBuy = async () => {
    setBuyItem(itemClass)
  }

  // return to 404 page if item is not exist
  if (!itemClass) {
    if (state.itemClasses.length !== 0) {
      navigate('/404')
    }

    return (<></>)
  }

  return (
    <Layouts>
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
                {itemClass.name}
              </Typography>
            </Row>

            <Box sx={{
              mt: 3,
              marginInline: "auto",
              height: { lg: "500px" }
            }}>
              <Box alt=""
                component="img"
                src={itemClass.image}
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
              <Typography>{itemClass.description}</Typography>
            </Stack>

            <Row sx={{ mt: "30px" }} justifyContent="start" spacing={4}>
              <Typography>ID:</Typography>
              <Typography>{itemClass.id}</Typography>
            </Row>

            <Row sx={{ pb: "20px" }} alignItems="end">
              <Stack spacing={2} direction="column">
                <Typography>Price : {itemClass.price} DFTL</Typography>
                <ActionButton1 onClick={handleBuy}>Buy</ActionButton1>
              </Stack>
            </Row>
          </Stack>
        </SubPanel>
      </StyledPanel>

      <Modal open={buyItem != null}
        onClose={() => setBuyItem(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <BuyPanel item={buyItem} type="item"
            onClose={() => { setBuyItem(null) }}
          />
        </div>
      </Modal>
    </Layouts>
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

export { TankClassDetail, ItemClassDetail }