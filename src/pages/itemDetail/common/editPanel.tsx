import React from "react";
import { useState } from "react";
import { Box, TextField, Stack } from "@mui/material";

import { tips } from "utils/util";
import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { ActionButton1 } from "components/buttons";

export const EditPanel = ({ item, onClose }: { item: TankObject, onClose: CallableFunction }) => {
  const [state] = useGlobalContext()
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description)

  const submit = async () => {
    try {
      let signature: string = await state.signer.signMessage(item.id)
      await restApi.updateName(item.id, name, description, signature)
      tips("success", `Tank${item.id} name set to ${name}`);
      onClose()
    } catch (err: any) {
      console.log("handle lend", err.message);
      tips("error", err.message);
    }
  }

  return (
    <Box sx={style}>
      <Stack spacing={2}>
        <TextField label="name" value={name} onChange={(e) => { setName(e.target.value) }} />
        <TextField label="description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
        <Stack direction="row" spacing={2} justifyContent="center">
          <ActionButton1 onClick={submit}>Submit</ActionButton1>
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
  width: { xs: "230px", sm: "300px", md: "600px" },
  flex: 1,
  bgcolor: "background.paper",
  border: "2px solid background.paper",
  boxShadow: "0 3px 10px #000",
  p: 4,
  borderRadius: "5px",
  overflow: "auto"
};