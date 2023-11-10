import React from "react";
import { useMemo, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Box, Typography, Tabs, IconButton, Grid, Modal } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { apiNotification } from "utils/services";
import { textEllipsis, tips, toLanguageFormat } from "utils/util";
import { NotFoundPage } from "pages/404page/404page";
import { BorderLinearProgress } from "components/styles";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { ActionButton1, ActionButton2 } from "components/buttons";
import { GuildUserCard } from "components/guildUserCard";
import { CustomTabPanel, TapHeader } from "components/customTap";
import { GuildEditPanel } from "./guildEditPanel";

import baseGuild from "assets/image/baseguild.png";
import { ValidateError } from "utils/customError";

enum ItemType {
  "onUser",
  "onUserMine"
}

interface GuildDetailObject extends GuildObject {
  itemType: ItemType
  memberState: boolean
}

const GuildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, { dispatch, upgradeNFT, updateBaseNfts }] = useGlobalContext();
  const [value, setValue] = useState<string>('members');
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const onChangeTap = (e: any, newValue: string) => {
    setValue(newValue)
  }

  const guildInfo: GuildDetailObject | null = useMemo(() => {
    const tempGuild: GuildObject = state.guildDatas.find((guild: GuildObject) => (
      Number(guild.id) === Number(id)
    ))

    if (!!tempGuild) {
      let itemType = tempGuild.owner === state.account ? ItemType.onUserMine : ItemType.onUser;
      let memberState = tempGuild.members.findIndex((member: GuildMemberObject) => member.address === state.account);
      let requestState = tempGuild.requests.findIndex((member: GuildMemberObject) => member.address === state.account);

      return {
        ...tempGuild, itemType,
        memberState: memberState !== -1 || requestState !== -1,
      }
    } else {
      return null
    }
  }, [state.guildDatas, state.walletStatus])

  // return to 404 page if item is not exist
  if (!guildInfo) {
    return (<NotFoundPage />)
  }

  const handleEdit = () => {
    setModalFlag(true)
  }

  const handleJoin = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(guildInfo.id);
        await restApi.joinGuild(guildInfo.id, signature);
        await updateBaseNfts();
        tips("success", `Request successed`);
      }
    } catch (err: any) {
      apiNotification(err, "Request failed!");
    }
  }

  const handleLike = async () => {
    try {
      if (state.walletStatus === 2) {
        let signature: string = await state.signer.signMessage(guildInfo.id);
        await restApi.followGuild(guildInfo.id, signature);
        await updateBaseNfts();
        tips("success", `React ${guildInfo.id} success`);
      }
    } catch (err: any) {
      apiNotification(err, `React ${guildInfo.id} Failed`);
    }
  }

  const onUpgrade = async () => {
    try {
      if (guildInfo.owner !== state.account) {
        throw new ValidateError("Permission error.");
      }

      dispatch({ type: "loading", payload: true });
      await upgradeNFT(guildInfo.id);


      tips("success", "Level upgrade successed");
      dispatch({ type: "loading", payload: false });
    } catch (err) {
      console.log("levelUpgrade", err.message);
      dispatch({ type: "loading", payload: false });
      apiNotification(err, `Level upgrade failed`);
    }
  }

  return (
    <Layouts>
      <GlobalSpacing className="flex-1 flex flex-col gap-10 md:gap-20 lg:gap-30">
        <div className="flex flex-row">
          <ActionButton2 onClick={() => { navigate(-1) }}>
            <ArrowBackIcon /> back
          </ActionButton2>
        </div>

        <div className="flex-1 flex flex-col  gap-20 lg:gap-50 p-30 lg:p-50 bg-boxBg rounded-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-50">
            <div className="flex-1 flex flex-col items-center py-20">
              <img alt=""
                src={guildInfo.image || baseGuild}
                style={{objectFit: 'cover'}}
                className="max-h-400 w-full rounded-20"
              />
            </div>
            <div className="flex-1 flex flex-col gap-15 justify-around">
              <div className="flex flex-col gap-5">
                <Typography variant="h4" className="first-letter:uppercase">
                  {guildInfo.name}
                </Typography>
                <Typography>{guildInfo.description}</Typography>
              </div>

              <div className="flex flex-row gap-10 justify-between items-center">
                <Typography>ID: {guildInfo.id}</Typography>
                <IconButton aria-label="add to favorites" onClick={handleLike}>
                  <FavoriteIcon className="mr-5" /> {guildInfo.followers.length}
                </IconButton>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-10 justify-between md:items-center py-10">
                <Typography>
                  Owner : {textEllipsis(guildInfo.owner)}
                </Typography>

                <Stack spacing={2} direction="row">
                  {(guildInfo.owner === state.account && guildInfo.level < guildInfo.guildLevel) && (
                    <ActionButton1 onClick={onUpgrade}>Upgrade</ActionButton1>
                  )}

                  {guildInfo.itemType === ItemType.onUserMine ? (
                    <>
                      <ActionButton1 onClick={handleEdit}>
                        Edit
                      </ActionButton1>

                      {!guildInfo.memberState && (
                        <ActionButton1 onClick={handleJoin}>
                          Use
                        </ActionButton1>
                      )}
                    </>
                  ) : (
                    <>
                      {(!guildInfo.memberState && state.walletStatus === 2) && (
                        <ActionButton1 onClick={handleJoin}>Join</ActionButton1>
                      )}

                      {(guildInfo.memberState && state.walletStatus === 2) && (
                        <ActionButton1 onClick={handleJoin}>cancellation</ActionButton1>
                      )}
                    </>
                  )}
                </Stack>
              </div>

              <div className="flex flex-row gap-10 justify-between items-center">
                <Typography>Energy produce: {guildInfo.potion}</Typography>
                <Typography>{1 / 0.0001} EXP</Typography>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-10 justify-between items-center">
                  <Typography>Level (<span>{guildInfo.level}/{guildInfo.guildLevel}</span>)</Typography>
                  <Typography>{toLanguageFormat(guildInfo.experience)}/{toLanguageFormat(guildInfo.targetExp)} {"(EXP)"}</Typography>
                </div>

                <BorderLinearProgress variant="determinate"
                  value={guildInfo.experience * 100 / guildInfo.targetExp}
                />
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-10 justify-between items-center">
                  <Typography>StakingPool</Typography>
                  <Typography>{`${toLanguageFormat(guildInfo.stakingPool)}/${toLanguageFormat(guildInfo.maxStakingPool)}`}</Typography>
                </div>

                <BorderLinearProgress variant="determinate"
                  value={guildInfo.stakingPool * 100 / guildInfo.maxStakingPool}
                />
              </div>
            </div>
          </div>

          <div className="basetap-wrapper gap-20">
            <Box className=''>
              <Tabs value={value} onChange={onChangeTap} aria-label="" TabIndicatorProps={{style: {display: 'none'}}} >
                <TapHeader value="members" label="Members" />
                <TapHeader value="requests" label="Requests" />
              </Tabs>
            </Box>

            <CustomTabPanel value="members" index={value}>
              <Grid container spacing={2}>
                {guildInfo.members.map((user: GuildMemberObject, key: number) => (
                  <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
                    <GuildUserCard type='member'
                      guildInfo={guildInfo}
                      userInfo={user}
                    />
                  </Grid>
                ))}
              </Grid>
            </CustomTabPanel>

            <CustomTabPanel value="requests" index={value}>
              <Grid container spacing={2}>
                {guildInfo.requests.map((user: GuildMemberObject, key: number) => (
                  <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
                    <GuildUserCard type='request'
                      guildInfo={guildInfo}
                      userInfo={user}
                    />
                  </Grid>
                ))}
              </Grid>
            </CustomTabPanel>
          </div>
        </div>
      </GlobalSpacing>

      <Modal open={modalFlag} onClose={() => setModalFlag(false)}>
        <div className="">
          {modalFlag && (
            <GuildEditPanel guildInfo={guildInfo} onClose={() => setModalFlag(false)} />
          )}
        </div>
      </Modal>
    </Layouts >
  )
}

export { GuildDetail }