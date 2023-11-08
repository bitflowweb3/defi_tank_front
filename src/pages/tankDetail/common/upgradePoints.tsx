import React, { useEffect, useState } from "react";
import { ButtonGroup, Button } from "@mui/material";
import { Box, Typography, Stack, Divider } from "@mui/material";
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

import speedIcon from 'assets/image/speedicon.png';
import healthIcon from 'assets/image/healthicon.png';
import firePowerIcon from 'assets/image/powericon.png';
import fireRateIcon from 'assets/image/firerateicon.png';
import { ActionButton1, ActionButton2 } from "components/buttons";
import { tips } from "utils/util";
import { useGlobalContext } from "provider";
import { restApi } from "provider/restApi";

interface upgradepointsProps {
  onClose: any
  tankData: NftTankObject
  classInfo: TankClassObject
}

const initPoints: UpgradablePointsObject = {
  speed: 0, health: 0, firePower: 0, fireRate: 0
}

const UpgradePoints = ({ tankData, classInfo, onClose }: upgradepointsProps) => {
  const [state, { updateBaseNfts }] = useGlobalContext()
  const [btndisabled, setBtnDisabled] = useState<boolean>(false)
  const [upgradablePoint, setupgradablePoint] = useState<number>(0)
  const [upgradePoints, setUpgradePoints] = useState<UpgradablePointsObject>(initPoints)
  const initTempPoints = tankData.upgradedPoints

  useEffect(() => {
    setInitPointsInfo()
  }, [])

  const getTotalPoints = (tempPoints: UpgradablePointsObject) => {
    let tempTotalPoint = tempPoints.speed;
    tempTotalPoint += tempPoints.firePower;
    tempTotalPoint += tempPoints.fireRate;
    tempTotalPoint += tempPoints.health;

    return tempTotalPoint;
  }

  const setInitPointsInfo = () => {
    let tempUsedPoint = getTotalPoints(initTempPoints)
    setupgradablePoint(tankData.upgradablePoint - tempUsedPoint)
    setUpgradePoints(tankData.upgradedPoints)
    setBtnDisabled(true)
  }

  const onChangePoints = (type: string, changeNum: number) => {
    if (!upgradePoints[type] && upgradePoints[type] !== 0) {
      return
    }

    if (changeNum > 0 && !upgradablePoint) {
      return
    }

    if (changeNum < 0 && upgradePoints[type] <= initTempPoints[type]) {
      return
    }


    let tempPoints = upgradePoints;
    let newPoint = tempPoints[type] + changeNum;
    setUpgradePoints({ ...tempPoints, [type]: newPoint });
    setupgradablePoint(upgradablePoint + changeNum * -1);
    setBtnDisabled(false)
  }

  const onUpgradePoints = async () => {
    try {
      if (!state.signer) {
        throw new Error("Please connect wallet!")
      }

      let tempUsedPoint = getTotalPoints(upgradePoints)
      if (tempUsedPoint > tankData.upgradablePoint) {
        throw new Error("Please check again your setting");
      }

      if (upgradePoints.firePower < initTempPoints.firePower) {
        throw new Error("Firepower upgrade points setting error");
      } else if (upgradePoints.fireRate < initTempPoints.fireRate) {
        throw new Error("Firepower upgrade points setting error");
      } else if (upgradePoints.speed < initTempPoints.speed) {
        throw new Error("Firepower upgrade points setting error");
      } else if (upgradePoints.health < initTempPoints.health) {
        throw new Error("Firepower upgrade points setting error");
      }

      let notchangedFlag1 = upgradePoints.speed === initTempPoints.speed;
      let notchangedFlag2 = upgradePoints.health === initTempPoints.health;
      let notchangedFlag3 = upgradePoints.fireRate === initTempPoints.fireRate;
      let notchangedFlag4 = upgradePoints.firePower === initTempPoints.firePower;

      if (notchangedFlag1 && notchangedFlag2 && notchangedFlag3 && notchangedFlag4) {
        throw new Error("Not changed points settings.");
      }

      let signature: string = await state.signer.signMessage(tankData.id);
      await restApi.upgradedPoints(tankData.id, upgradePoints, signature);
      await updateBaseNfts();
      onClose();

      tips('success', "Upgrade points successed")
    } catch (err) {
      await updateBaseNfts();
      onClose();

      console.log(err.message);
      tips('warning', err.message);
    }
  }

  return (
    <Box sx={styleWrapper}>
      <Box sx={styleContainer} className="pt-30 relative">
        <div onClick={onClose}
          className="absolute right-20 top-20 hover:opacity-75"
        >
          <CloseIcon className="cursor-pointer" />
        </div>

        <Stack direction="row" gap={3}>
          <Typography variant="h5">Upgradable Points</Typography>
        </Stack>

        <Stack direction="column" gap={3}>
          <Stack direction="column" gap={2} className="">
            <Divider />

            <PropertiesItem
              id="firePower"
              title="Fire Power"
              icon={firePowerIcon}
              baseAmount={classInfo.firePower}
              addAmount={classInfo.firePowerAdd}
              pointsCount={upgradePoints.firePower}
              removeDisabled={upgradePoints.firePower <= initTempPoints.firePower}
              addDisabled={!upgradablePoint}
              onChange={onChangePoints}
            />

            <PropertiesItem
              id="fireRate"
              title="Fire Rate"
              icon={fireRateIcon}
              baseAmount={classInfo.fireRate}
              pointsCount={upgradePoints.fireRate}
              addAmount={classInfo.fireRateAdd}
              removeDisabled={upgradePoints.fireRate <= initTempPoints.fireRate}
              addDisabled={!upgradablePoint}
              onChange={onChangePoints}
            />

            <PropertiesItem
              id="speed"
              title="Speed"
              icon={speedIcon}
              baseAmount={classInfo.speed}
              addAmount={classInfo.speedAdd}
              pointsCount={upgradePoints.speed}
              removeDisabled={upgradePoints.speed <= initTempPoints.speed}
              addDisabled={!upgradablePoint}
              onChange={onChangePoints}
            />

            <PropertiesItem
              id="health"
              title="Health"
              icon={healthIcon}
              baseAmount={classInfo.health}
              addAmount={classInfo.healthAdd}
              pointsCount={upgradePoints.health}
              removeDisabled={upgradePoints.health <= initTempPoints.health}
              addDisabled={!upgradablePoint}
              onChange={onChangePoints}
            />
          </Stack>

          <Stack direction="row" gap={2} className="justify-between items-center">
            <Box className="min-w-80 flex md:gap-10 justify-between items-center px-10 md:px-15 py-8 rounded-md bg-menuBg">
              <StarBorderPurple500Icon fontSize="medium" sx={{ color: '#f1ff23' }} />
              <Typography variant="h6">{upgradablePoint}</Typography>
            </Box>

            <Box className="flex gap-10">
              <ActionButton2 disabled={btndisabled} onClick={setInitPointsInfo}>Clear</ActionButton2>
              <ActionButton1 disabled={btndisabled} onClick={onUpgradePoints}>Upgrade</ActionButton1>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

const PropertiesItem = (props: any) => {
  const { id, title, icon, baseAmount, addAmount, pointsCount } = props;
  const { onChange, removeDisabled, addDisabled } = props;

  return (
    <>
      <Stack direction="row" gap={2} className="items-center justify-between">
        <Stack direction="row" gap={1} className="items-center justify-start">
          <img alt="" src={icon} className="w-30 text-center" />

          <Typography className="flex" gap={0.5}>
            <span className="hidden md:flex">{title}</span> ({addAmount > 0 && '+'}{addAmount})
          </Typography>
        </Stack>

        <Stack direction="row" gap={2}>
          <Box>{baseAmount + addAmount * pointsCount}</Box>

          <ButtonGroup>
            <Button aria-label="reduce"
              onClick={() => { onChange(id, -1) }}
              disabled={removeDisabled}
            >
              <RemoveIcon fontSize="small" />
            </Button>

            <Button aria-label="increase"
              onClick={() => { onChange(id, 1) }}
              disabled={addDisabled}
            >
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>

      <Divider />
    </>
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
  borderRadius: 3,
}

const styleContainer = {
  gap: 2,
  display: "flex",
  flexDirection: "column",
  p: 3,
  overflow: "auto",
  width: { xs: "90vw", sm: "80vw", md: "500px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
}

export { UpgradePoints }