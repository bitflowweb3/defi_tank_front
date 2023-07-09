import React from 'react';
import { useNavigate } from "react-router-dom";
import { Stack, CardMedia, CardContent, CardActions, Typography } from "@mui/material";

import { tips } from '../../../utils/util';
import { CardContainer } from "../../../components/cards";
import { ActionButton1, ActionButton2 } from "../../../components/buttons";

interface ParamObject {
  item: TankClassObject | ItemClassObject
  setBuyItem: any
}

const TankItem = ({ item, setBuyItem }: ParamObject) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/tanknft-detail/" + item.id)
  }

  const handleBuy = async () => {
    try {
      setBuyItem(item)
    } catch (err: any) {
      console.log("error", err.code);
      if (err.code === "ACTION_REJECTED") {
        tips("error", "User Denied ACTION");
      } else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        tips("error", "Please check DFTL Balance");
      } else {
        tips("error", err.message);
      }
    }
  }

  return (
    <CardContainer>
      <CardMedia alt=""
        component="img"
        image={item.image}
        onClick={handleDetail}
        style={{
          height: '194px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{item.name}</Typography>
          <Typography>{item.price + " DFTL"}</Typography>
        </Stack>
      </CardContent>

      <CardActions
        sx={{ display: "flex", justifyContent: "space-around" }}
      >
        <ActionButton1 variant="outlined" onClick={handleBuy}>
          BUY
        </ActionButton1>
        <ActionButton2 variant="outlined" onClick={handleDetail}>
          Detail
        </ActionButton2>
      </CardActions>
    </CardContainer>
  );
}

const EquipmentItem = ({ item, setBuyItem }: ParamObject) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/itemnft-detail/" + item.id)
  }

  const handleBuy = async () => {
    try {
      setBuyItem(item)
    } catch (err: any) {
      console.log("error", err.code);
      if (err.code === "ACTION_REJECTED") {
        tips("error", "User Denied ACTION");
      } else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        tips("error", "Please check DFTL Balance");
      } else {
        tips("error", err.message);
      }
    }
  }

  return (
    <CardContainer>
      <CardMedia alt=""
        component="img"
        image={item.image}
        onClick={handleDetail}
        style={{
          height: '194px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{item.name}</Typography>
          <Typography>{item.price + " DFTL"}</Typography>
        </Stack>
      </CardContent>

      <CardActions
        sx={{ display: "flex", justifyContent: "space-around" }}
      >
        <ActionButton1 variant="outlined" onClick={handleBuy}>
          BUY
        </ActionButton1>
        <ActionButton2 variant="outlined" onClick={handleDetail}>
          Detail
        </ActionButton2>
      </CardActions>
    </CardContainer>
  );
}

export { TankItem, EquipmentItem }
