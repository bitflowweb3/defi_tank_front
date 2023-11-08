import React from "react";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, TextField, Stack } from "@mui/material";

import { tips, toLanguageFormat } from "utils/util";
import { useGlobalContext } from "provider";
import { ItemContainer } from "components/styles";

import { restApi } from "provider/restApi";
import potionAssets from "assets/image/potion.png";
import { apiNotification } from "utils/services";
import { ValidateError } from "utils/customError";

interface BuyAssetsProps {
  rate: number
  golds: number
  onClose: any
  updateProfile: any
}

const BuyAssetsModal = ({ rate, golds, onClose, updateProfile }: BuyAssetsProps) => {
  const [state] = useGlobalContext();
  const [buyAmount, setBuyAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const onPotionBuy = async () => {
    try {
      let maxAmount = Math.round(golds / rate) || 0;
      if (!buyAmount || buyAmount > maxAmount) {
        throw new ValidateError("Don't have enough golds!");
      }

      if (state.walletStatus !== 2) {
        throw new ValidateError("Please wallet connect");
      }

      setLoading(true)
      let signature: string = await state.signer.signMessage(String(buyAmount));
      await restApi.buyPotion(buyAmount, signature);
      await updateProfile();

      tips("success", "Buy Potion successed!");
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      apiNotification(err, "Buy potion failed!");
    }
  }

  return (
    <Box sx={styleWrapper} style={{ borderRadius: '12px' }}>
      <Box sx={styleContainer} className="flex flex-col gap-20">
        <Stack direction="row" className="justify-between items-end">
          <Typography variant="h4" className="first-letter:uppercase">
            Potion Send
          </Typography>

          <Stack direction="row" className="gap-10 justify-end items-center pr-30">
            {toLanguageFormat(Math.ceil(golds / rate))} <img alt="" src={potionAssets} className="w-25" />
          </Stack>
        </Stack>

        <ItemContainer>
          <TextField label="Amount" className='w-full' value={buyAmount}
            onChange={({ target }: any) => setBuyAmount(Math.ceil(target.value))}
          />
        </ItemContainer>

        <LoadingButton color="success"
          variant="contained"
          className="hover:opacity-75"
          loading={loading}
          onClick={onPotionBuy}
          style={{ width: '100%', padding: '1rem', fontWeight: '700', backgroundColor: '#f55b00' }}
        >
          Buy
        </LoadingButton>
      </Box>
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
  width: { xs: "90vw", sm: "80vw", md: "500px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
}

export { BuyAssetsModal }