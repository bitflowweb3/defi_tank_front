import React from "react";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography, TextField } from "@mui/material";

import { apiNotification } from "utils/services";
import { ValidateError } from "utils/customError";
import goldAssets from "assets/image/gold.png";

interface SellAssetsProps {
  onClose: any
  onSubmit: any
  label: string
  price: number
  maxAmount: number
}

const SellAsset = (props: SellAssetsProps) => {
  const { price, maxAmount, label, onSubmit, onClose } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);

  const onChangeAmount = ({ target }: any) => {
    setAmount(Math.round(target.value) || 0);
  }

  const onTransfer = async () => {
    try {
      let tempAmount = Math.round(amount);

      if (!tempAmount) {
        throw new ValidateError("Please Enter send amount!");
      }

      if (tempAmount > maxAmount) {
        throw new ValidateError(`You don't have enough ${label}!`);
      }

      setLoading(true);
      await onSubmit(amount);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      apiNotification(err, "Sell failed!");
    }
  }

  return (
    <Stack sx={styleWrapper} className="rounded-12">
      <Box sx={styleContainer} gap={2} className="flex flex-col">
        <Typography variant="h4" className="first-letter:uppercase">
          Sell {label}
        </Typography>

        <Stack direction="column" gap={1} className="px-10 py-30">
          <TextField label="Amount"
            onChange={onChangeAmount}
            className='w-full'
            value={amount}
          />

          <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={0.5} alignItems="end">
              <Typography variant="caption" color="InactiveCaptionText">
                You will receive {amount * price}
              </Typography>

              <img alt="" src={goldAssets} className="w-20 h-20" />
            </Stack>

            <Stack direction="row">
              <Typography variant="caption" color="InactiveCaptionText">
                Max: {maxAmount}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <LoadingButton color="success" variant="contained"
          loading={loading} onClick={onTransfer}
          className="hover:opacity-75"
          style={lodingBtnStyle}
        >
          Transfer
        </LoadingButton>
      </Box>
    </Stack>
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
  width: { xs: "90vw", sm: "80vw", md: "600px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
}

const lodingBtnStyle = {
  width: '100%',
  padding: '1rem',
  fontWeight: '700',
  backgroundColor: '#a14e22'
}

export { SellAsset }