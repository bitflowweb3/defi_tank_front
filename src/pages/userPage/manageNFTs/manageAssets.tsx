import React from "react";
import { useCallback } from "react";
import { useState, useEffect } from "react";
import { Stack, Grid, Modal } from "@mui/material";

import goldAssets from "assets/image/gold.png";
import potionAssets from "assets/image/potion.png";

import { tips } from "utils/util";
import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { AssetCard } from "./component/assetCard";
import { TransferAsset } from "./component/transferAsset";
import { SellAsset } from "./component/sellAsset";

interface ManageAssetsProps {
  userData: UserObject
  updateUserData: any
}

const ManageAssets = ({ userData, updateUserData }: ManageAssetsProps) => {
  const [state] = useGlobalContext();
  const [allUsers, setAllUsers] = useState<UserObject[]>([]);
  const [openSellModal, setOpenSellModal] = useState<boolean>(false);
  const [openGoldModal, setOpenGoldModal] = useState<boolean>(false);
  const [openPotionModal, setOpenPotionModal] = useState<boolean>(false);

  const updateAllUserData = useCallback(async () => {
    try {
      const tempAllData = await restApi.getAllProfiles()
      const tempUsers = tempAllData.reduce((users: UserObject[], user: UserObject) => {
        if (user.address !== state.account) {
          return [...users, user];
        } else return users;
      }, [])

      setAllUsers(tempUsers);
    } catch (err) {
      setAllUsers([]);
    }
  }, [state.account])

  useEffect(() => {
    if (state.walletStatus === 2) {
      updateAllUserData();
    } else {
      setAllUsers([])
    }
  }, [state.walletStatus, updateAllUserData])

  const onOpenSellModal = () => { setOpenSellModal(true) }
  const onCloseSellModal = () => { setOpenSellModal(false) }
  const onOpenGoldTransfer = () => { setOpenGoldModal(true) }
  const onCloseGoldTransfer = () => { setOpenGoldModal(false) }
  const onOpenPotionTransfer = () => { setOpenPotionModal(true) }
  const onClosePotionTransfer = () => { setOpenPotionModal(false) }

  const onTransferGold = async (amount: number, userAddr: string) => {
    let signature: string = await state.signer.signMessage(userAddr);
    await restApi.transferGold(userAddr, amount, signature);
    await updateUserData();

    tips("success", "Successed gold transfer");
  }

  const onTransferPotion = async (amount: number, userAddr: string) => {
    let signature: string = await state.signer.signMessage(userAddr);
    await restApi.transferPotion(userAddr, amount, signature);
    await updateUserData();

    tips("success", "Successed potion transfer");
  }

  const onSellPotion = async (amount: number) => {
    let signature: string = await state.signer.signMessage(String(amount));
    await restApi.sellPotion(amount, signature);
    await updateUserData();

    tips("success", "Successed sell potion!");
  }

  return (
    <Stack direction="column">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <AssetCard name="Gold"
            onTransfer={onOpenGoldTransfer}
            amount={userData.golds}
            image={goldAssets}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <AssetCard name="Potion"
            onSell={onOpenSellModal}
            onTransfer={onOpenPotionTransfer}
            price={state.potionInfo.sellPrice}
            amount={userData.potion}
            image={potionAssets}
          />
        </Grid>
      </Grid>

      <Modal open={openGoldModal} onClose={onCloseGoldTransfer}>
        <div className="">
          <TransferAsset label="Gold"
            onSubmit={onTransferGold}
            onClose={onCloseGoldTransfer}
            maxAmount={userData.golds}
            users={allUsers}
          />
        </div>
      </Modal>

      <Modal open={openPotionModal} onClose={onClosePotionTransfer}>
        <div className="">
          <TransferAsset label="Potion"
            onSubmit={onTransferPotion}
            onClose={onClosePotionTransfer}
            maxAmount={userData.potion}
            users={allUsers}
          />
        </div>
      </Modal>

      <Modal open={openSellModal} onClose={onCloseSellModal}>
        <div className="">
          <SellAsset label="Potions"
            onSubmit={onSellPotion}
            onClose={onCloseSellModal}
            maxAmount={userData.potion}
            price={state.potionInfo.sellPrice}
          />
        </div>
      </Modal>
    </Stack>
  )
}

export { ManageAssets }