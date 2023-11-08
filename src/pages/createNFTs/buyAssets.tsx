import React from "react";
import { useState, useEffect } from "react";
import { Stack, Grid, Modal } from "@mui/material";

import { AssetCard } from "./common/assetCard";
import potionAssets from "assets/image/potion.png";
import { BuyAssetsModal } from "./common/buyAssetsModal";
import { initProfile } from "pages/userPage/userPage";
import { useGlobalContext } from "provider";
import { restApi } from "provider/restApi";

const BuyAssets = () => {
  const [state] = useGlobalContext();
  const [userData, setUserData] = useState<UserObject>(initProfile)
  const [modalFlag, setModalFlag] = useState<boolean>(false)

  useEffect(() => {
    if (state.walletStatus === 2) {
      updateUserData()
    } else if (userData.status !== 'init') {
      setUserData(initProfile)
    }
  }, [state.walletStatus])

  const updateUserData = async () => {
    try {
      const tempData = await restApi.getProfile(state.account)
      setUserData(tempData)
    } catch (err) {
      if (userData.status !== 'init') {
        setUserData(initProfile)
      }
    }
  }

  const onOpenModal = () => {
    setModalFlag(true)
  }

  const onCloseModal = () => {
    setModalFlag(false)
  }

  return (
    <Stack direction="column" className="mt-50">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <AssetCard name="Potion"
            rate={state.potionInfo.price}
            onClick={onOpenModal}
            image={potionAssets}
          />
        </Grid>
      </Grid>

      <Modal open={modalFlag} onClose={onCloseModal}>
        <div className="">
          <BuyAssetsModal golds={userData.golds}
            rate={state.potionInfo.price}
            updateProfile={updateUserData}
            onClose={onCloseModal}
          />
        </div>
      </Modal>
    </Stack>
  )
}

export { BuyAssets }