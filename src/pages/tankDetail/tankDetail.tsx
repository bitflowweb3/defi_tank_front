import React from "react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, Typography, Modal } from "@mui/material";

import goldAssets from "assets/image/gold.png";
import speedIcon from 'assets/image/speedicon.png';
import healthIcon from 'assets/image/healthicon.png';
import firePowerIcon from 'assets/image/powericon.png';
import fireRateIcon from 'assets/image/firerateicon.png';
import championBadge from 'assets/image/champion-badge.png';

import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { EditPanel } from "./common/editPanel";
import { textEllipsis, tips, toLanguageFormat } from "utils/util";
import { BorderLinearProgress, ChampionBadgeContainer } from "components/styles";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { ActionButton1, ActionButton2 } from "components/buttons";
import { UpgradePoints } from "./common/upgradePoints";
import { initProfile } from "pages/userPage/userPage";
import { apiNotification } from "utils/services";
import { SpellItemCard } from "components/spellCard";
import { CustomTooltip } from "components/tooltip";
import { ValidateError } from "utils/customError";

enum ItemType {
  "onUser",
  "onUserMine"
}

interface TankDetailObject extends NftTankObject {
  itemType: ItemType
  energyRecoverPerHour: string
}

const PropertyPanel = ({ item, classInfo }: { item: NftTankObject, classInfo: TankClassObject }) => {
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
        add: classInfo.fireRateAdd
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
    <Stack gap={1}>
      {properties.map((property: any, key: number) => (
        <Stack direction="row" key={key}
          className="items-center justify-between p-10"
          sx={{ borderRadius: 2,  border: "1px solid #333" }}
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

const TankDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, { dispatch, updateBaseNfts }] = useGlobalContext();

  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [openNameModal, setOpenaNameModal] = useState(false);
  const [userData, setUserData] = useState<UserObject>(initProfile);

  const updateProfile = useCallback(async () => {
    try {
      const tempData = await restApi.getProfile(state.account)
      setUserData(tempData)
      return true
    } catch (err) {
      setUserData(initProfile)
      console.log(err.message)
      return false
    }
  }, [state.account])

  useEffect(() => {
    if (state.walletStatus === 2) {
      updateProfile();
    } else {
      setUserData(initProfile);
    }
  }, [state.walletStatus, updateProfile])

  const [item, setItem] = useState(null)
  const [classInfo, setClassInfo] = useState(null)

  useEffect(() => {
    const tempitem = state.tankItems.find((tankItem: NftTankObject) => (
      Number(tankItem.id) === Number(id)
    ))

    const tempClass = state.tankClasses.find((tankClass: TankClassObject) => (
      tankClass.id === tempitem?.classType
    ))

    if (tempitem && tempClass) {
      setItem(tempitem)
      setClassInfo(tempClass)
    } else {
      setItem(null)
      setClassInfo(null)
    }
  }, [state.tankItems, state.tankClasses, id])

  const tankInfo: TankDetailObject | null = useMemo(() => {
    if (!item) return null;

    let energyRecoverPerHour = (item.maxEnergy / 24).toFixed(2);
    let itemType = item.owner === state.account ? ItemType.onUserMine : ItemType.onUser;

    return { ...item, itemType, energyRecoverPerHour };
  }, [item, state.account])

  const handleLend = async () => {
    try {
      let signature: string = await state.signer.signMessage(item.id);
      await restApi.lend(item.id, signature);
      await updateBaseNfts();
      tips("success", `Lend ${item.id} success`);
    } catch (err: any) {
      apiNotification(err, `Lend ${item.id} Failed`);
    }
  }

  const handleBorrow = async () => {
    try {
      let signature: string = await state.signer.signMessage(item.id);
      await restApi.borrow(item.id, signature);
      await updateBaseNfts();
      tips("success", `borrow ${item.id} success`);
    } catch (err: any) {
      apiNotification(err, `Borrow ${item.id} Failed`);
    }
  }

  const handleRecover = async () => {
    try {
      let signature: string = await state.signer.signMessage(item.id);
      await restApi.energyRecover(item.id, signature);
      await updateBaseNfts();
      tips("success", `Recover successed`);
      updateProfile();
    } catch (err: any) {
      apiNotification(err, "Recover failed");
    }
  }

  const hadleLevelUp = async () => {
    try {
      if (tankInfo.goldForLevel > 0 && tankInfo.goldForLevel !== -1) {
        if (userData.golds < tankInfo.goldForLevel) {
          throw new ValidateError(`Need ${tankInfo.goldForLevel} Golds for Level ${tankInfo.tankLevel + 1}!`);
        }

        dispatch({ type: "loading", payload: true });
        let signature: string = await state.signer.signMessage(item.id);
        await restApi.tankLevelUp(item.id, signature);
        await updateBaseNfts();

        tips("success", `Tank level up successed!`);
        dispatch({ type: "loading", payload: false });
        updateProfile();
      }
    } catch (err: any) {
      apiNotification(err, "Tank level up failed!");
      dispatch({ type: "loading", payload: false });
    }
  }

  // return to 404 page if item is not exist
  if (!item) {
    // if (state.tankItems.length !== 0) {
    //   navigate('/404')
    // }

    return (<></>)
  }

  const recoverFlag = tankInfo.energy < tankInfo.maxEnergy
  const recoverFlag1 = tankInfo.owner === state.account || tankInfo.borrower === state.account

  return (
    <Layouts>
      <GlobalSpacing className="flex-1 flex flex-col gap-10 md:gap-20 lg:gap-30">
        <div className="flex flex-row">
          <ActionButton1 onClick={() => { navigate(-1) }}>
            <ArrowBackIcon /> back
          </ActionButton1>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-20 lg:gap-50 justify-evenly p-30 lg:p-50 bg-boxBg rounded-12">
          <div className="lg:h-full flex flex-col gap-15 justify-evenly">
            <div className="lg:max-w-400 flex flex-col gap-5">
              <Typography variant="h4">{tankInfo.name}</Typography>
              <Typography className="text-justify">{tankInfo.description}</Typography>
            </div>

            <Stack direction="column"
              className="relative max-w-400 md:w-auto items-center justify-center mx-auto"
            >
              <img alt="" src={tankInfo.image}
                className="w-full rounded-20"
              />

              {tankInfo.chaptionBadge > 0 && (
                <ChampionBadgeContainer>
                  <img alt="" src={championBadge} />

                  {tankInfo.chaptionBadge > 1 && (
                    <Typography variant='h5'>x{tankInfo.chaptionBadge}</Typography>
                  )}
                </ChampionBadgeContainer>
              )}
            </Stack>

            <div className="flex flex-col md:px-50">
              <Stack direction="row" gap={2} className="max-w-400">
                {tankInfo.spells.map((spell: SpellObject, key: number) => (
                  <SpellItemCard spell={spell} key={key} />
                ))}
              </Stack>
            </div>
          </div>

          <div className="md:min-w-400 max-w-800 flex-1 flex flex-col gap-20 justify-evenly">
            <div className="flex flex-col gap-10">
              <div className="flex flex-row gap-10 justify-between items-center">
                <Typography>Type: {classInfo.name}</Typography>
                <Typography>ID: {tankInfo.id}</Typography>
              </div>

              <div className="flex flex-col md:flex-row gap-10 justify-between md:items-center py-10">
                <Typography>
                  Owner : {textEllipsis(tankInfo.owner)}
                </Typography>

                {tankInfo.itemType === ItemType.onUserMine ? (
                  <div className="flex flex-col md:flex-row gap-10">
                    <ActionButton2 onClick={() => setOpenaNameModal(true)}>
                      Edit
                    </ActionButton2>

                    {tankInfo.borrower === tankInfo.owner ? (
                      <ActionButton1 onClick={handleLend}>Lend</ActionButton1>
                    ) : (
                      <ActionButton1 onClick={handleBorrow}>retrieve</ActionButton1>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-10">
                    {(state.walletStatus === 2 && tankInfo.borrower === "") && (
                      <ActionButton1 onClick={handleBorrow}>Borrow</ActionButton1>
                    )}

                    {tankInfo.borrower === state.account && (
                      <ActionButton1 onClick={handleLend}>Return</ActionButton1>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-20">
              <div className="flex gap-20 items-end">
                <Stack flex={1} direction="column" className="gap-5">
                  <Stack direction="row" className="gap-10 justify-between items-center">
                    <Typography>Level (<span>{tankInfo.tankLevel}</span>)</Typography>
                    <Typography>{toLanguageFormat(tankInfo.experience)}/{toLanguageFormat(tankInfo.targetExp)} {"(EXP)"}</Typography>
                  </Stack>

                  <BorderLinearProgress variant="determinate"
                    value={tankInfo.experience * 100 / tankInfo.targetExp}
                  />
                </Stack>

                {(tankInfo.owner === state.account && tankInfo.goldForLevel !== -1) && (
                  <CustomTooltip title={<ToolTipContent golds={toLanguageFormat(tankInfo.goldForLevel)} />}>
                    <ActionButton1 onClick={hadleLevelUp}>LevelUp</ActionButton1>
                  </CustomTooltip>
                )}
              </div>

              <div className="flex gap-20 items-end">
                <Stack flex={1} direction="column" className="gap-5">
                  <Stack direction="row" className="gap-10 justify-between items-center">
                    <Typography>Energy</Typography>
                    <Typography>{tankInfo.energy}/{tankInfo.maxEnergy} {"(+" + tankInfo.energyRecoverPerHour + "/h)"}</Typography>
                  </Stack>

                  <BorderLinearProgress variant="determinate" value={tankInfo.energy * 100 / tankInfo.maxEnergy} />
                </Stack>

                {(!!userData.potion && recoverFlag && recoverFlag1) && (
                  <ActionButton1 onClick={handleRecover}>
                    Recover
                  </ActionButton1>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-10 mt-10">
              <div className="flex flex-row gap-10 justify-between items-center">
                <Typography variant="h5">Properties</Typography>

                {item.owner === state.account && (
                  <ActionButton1 onClick={() => { setOpenUpgrade(true) }}>
                    Upgrade
                  </ActionButton1>
                )}
              </div>

              <PropertyPanel item={item} classInfo={classInfo} />
            </div>
          </div>
        </div>
      </GlobalSpacing>

      <Modal open={openNameModal} onClose={() => setOpenaNameModal(false)}>
        <div className="">
          <EditPanel item={item}
            onClose={() => setOpenaNameModal(false)}
          />
        </div>
      </Modal>

      {item.owner === state.account && (
        <Modal open={openUpgrade} onClose={() => setOpenUpgrade(false)}>
          <div className="">
            <UpgradePoints
              tankData={tankInfo}
              classInfo={classInfo}
              onClose={() => setOpenUpgrade(false)}
            />
          </div>
        </Modal>
      )}
    </Layouts >
  )
}

const ToolTipContent = ({ golds }: { golds: string }) => {
  return (
    <Stack direction="row" gap={1}>
      <Typography variant="body2">{golds}</Typography>
      <img alt="" src={goldAssets} className="w-20" />
    </Stack>
  )
}

export { TankDetail }