import React from "react";
import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Typography, Modal } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import speedIcon from 'assets/image/speedicon.png';
import healthIcon from 'assets/image/healthicon.png';
import firePowerIcon from 'assets/image/powericon.png';
import fireRateIcon from 'assets/image/firerateicon.png';

import { useGlobalContext } from "provider";
import { BuyPanel } from "pages/createNFTs/common/buyPanel";
import { ActionButton1, ActionButton2 } from "components/buttons";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { SpellItemCard } from "components/spellCard";

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
        add: tankClass.fireRateAdd
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
        <Stack direction="row" key={key}
          sx={{ borderRadius: 2, m: 0, mb: 1, p: 1.5 }}
          className="justify-between border border-borderColor"
        >
          <Stack direction="row" gap={1} className="items-center justify-start">
            <img alt="" src={property.icon} className="w-30 text-center" />
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
  const tankClass: TankClassObject = state.tankClasses.find((tankClass: TankClassObject) => (
    tankClass.id === Number(id)
  ))

  useEffect(() => {
    console.log(tankClass)
  }, [tankClass])

  /* ----- actions ----- */
  const handleBuy = async () => {
    setBuyItem(tankClass)
  }

  // return to 404 page if item is not exist
  if (!tankClass) {
    if (state.tankClasses.length !== 0) {
      // navigate('/404')
    }

    return (<></>)
  }

  return (
    <Layouts>
      <GlobalSpacing className="flex flex-col gap-10">
        <div className="flex flex-row">
          <ActionButton2 onClick={() => { navigate(-1) }}>
            <ArrowBackIcon /> back
          </ActionButton2>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 lg:gap-50 flex-wrap p-30 lg:p-50 bg-boxBg rounded-12">
          <div className="flex-1 flex flex-col items-center justify-center">
            <img alt="" src={tankClass.image}
              className="max-w-450 w-full rounded-20 text-center"
            />
          </div>

          <div className="flex-1 flex flex-col gap-20 justify-between">
            <Typography variant="h4">{tankClass.name}</Typography>
            <Typography>{tankClass.description}</Typography>

            <div className="flex flex-col-reverse md:flex-row gap-20 justify-between">
              <Stack spacing={2} direction="column">
                <Typography>Price : {tankClass.price} DFTL</Typography>

                {state.walletStatus === 2 && (
                  <ActionButton1 onClick={handleBuy}>Buy</ActionButton1>
                )}
              </Stack>

              <Stack direction="row" gap={2} className="md:items-center md:justify-center">
                {tankClass.spells.map((spell: SpellObject, key: number) => (
                  <SpellItemCard spell={spell} key={key} />
                ))}
              </Stack>
            </div>

            {/* Property */}
            <div className="flex flex-row mt-20">
              <Typography variant="h5">Properties</Typography>
            </div>

            <PropertyPanel id={id} />
          </div>
        </div>
      </GlobalSpacing>

      <Modal open={buyItem != null} onClose={() => setBuyItem(null)}>
        <div>
          <BuyPanel item={buyItem} onClose={() => { setBuyItem(null) }} />
        </div>
      </Modal>
    </Layouts>
  )
}

export { TankClassDetail }