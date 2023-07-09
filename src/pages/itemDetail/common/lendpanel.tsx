import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import { Box, TextField, Stack, } from "@mui/material";

import { tips } from "utils/util";
import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { ActionButton1 } from "components/buttons";

export const LendPanel = ({ item }: { item: NftTankObject }) => {
  const [to, setTo] = useState("")
  const [state] = useGlobalContext();

  const handleLend = async () => {
    try {
      // if (!ethers.utils.isAddress(to)) {
      //   throw new Error("Invalid Address")
      // }

      let signature: string = await state.signer.signMessage(item.id);
      await restApi.lend(item.id, to, signature);
    } catch (err: any) {
      console.log("handle lend", err.message);
    }
  }

  const handleLendPool = async () => {
    try {
      let signature: string = await state.signer.signMessage(item.id)
      await restApi.lend(item.id, "", signature)
    } catch (err: any) {
      console.log("handle lend", err.message)
      tips("error", err.message)
    }
  }

  return (
    <Box sx={style}>
      <Stack spacing={2}>
        <TextField value={to} onChange={(e) => { setTo(e.target.value) }} />
        <Stack direction="row" spacing={2} justifyContent="center">
          <ActionButton1 onClick={handleLend}>Lend</ActionButton1>
          <ActionButton1 onClick={handleLendPool}>Lend To Pool</ActionButton1>
        </Stack>
      </Stack>
    </Box >
  )
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid background.paper",
  boxShadow: "0 3px 10px #000",
  p: 4,
  borderRadius: "5px",
};