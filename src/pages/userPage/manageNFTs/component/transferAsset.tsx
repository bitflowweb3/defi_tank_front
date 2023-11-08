import React from "react";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Stack, Typography, TextField } from "@mui/material";

import { apiNotification } from "utils/services";
import { ValidateError } from "utils/customError";

interface TransferAssetProps {
  onClose: any
  onSubmit: any
  users: UserObject[]
  maxAmount: number
  label: string
}

interface AutoSelectItemProps {
  props: any
  user: UserObject
}

const TransferAsset = (props: TransferAssetProps) => {
  const { users, maxAmount, label, onSubmit, onClose } = props;

  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [transferAddress, setTransferAddress] = useState<string>("");
  const selectedUser = users.find((user) => (user.address === transferAddress));

  const onChangeAmount = ({ target }: any) => {
    setAmount(Math.round(target.value) || 0)
  }

  const onChangetransferAddress = (e: any, value: UserObject) => {
    setTransferAddress(value.address)
  }

  const onTransfer = async () => {
    try {
      let tempAmount = Math.round(amount);
      let tempUser = users.find((user) => user.address === transferAddress);

      if (!tempAmount) {
        throw new ValidateError("Please Enter send amount");
      }

      if (!tempUser) {
        throw new ValidateError("Please Select user.");
      }

      if (tempAmount > maxAmount) {
        throw new ValidateError(`You don't have enough ${label}.`);
      }

      setLoading(true);
      await onSubmit(amount, transferAddress);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      apiNotification(err, "Transfer failed!");
    }
  }

  return (
    <Stack sx={styleWrapper} className="rounded-12">
      <Box sx={styleContainer} className="flex flex-col gap-20">
        <Typography variant="h4" className="first-letter:uppercase">
          {label} Transfer
        </Typography>

        <Stack direction="column" gap={2} className="px-10 py-30">
          <TextField label="Amount"
            onChange={onChangeAmount}
            className='w-full'
            value={amount}
          />

          <Autocomplete options={users}
            disableClearable={true}
            value={selectedUser || null}
            onChange={onChangetransferAddress}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Select User" />}
            renderOption={(props, option) => <AutoSelectItem props={props} user={option} key={option.name} />}
          />
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

const AutoSelectItem = ({ props, user }: AutoSelectItemProps) => {
  return (
    <Box component="li" {...props}>
      <Stack direction="row" className="gap-10 items-center px-5">
        <img alt="" src={user.image} className="w-30 h-30 rounded-full" />
        <Typography variant="body2">{user.name}</Typography>
      </Stack>
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
  width: { xs: "90vw", sm: "80vw", md: "600px" },
  maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
}

const lodingBtnStyle = {
  width: '100%',
  padding: '1rem',
  fontWeight: '700',
  backgroundColor: '#a14e22'
}

export { TransferAsset }