import React from 'react';
import { useNavigate } from "react-router-dom";
import { Stack, CardMedia, CardContent, CardActions, Typography } from "@mui/material";

import { tips } from '../../../utils/util';
import { ItemCard } from "../../../components/cards";
import { ActionButton1, ActionButton2 } from "../../../components/buttons";

interface ParamObject {
  item: ClassesObject
  setBuyItem: any
}

export const Item = ({ item, setBuyItem }: ParamObject) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/class-detail/" + item.id)
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
    <ItemCard>
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
    </ItemCard>
  );
};
