import React from 'react';
import { useNavigate } from "react-router-dom";
import { Stack, CardMedia, CardContent, CardActions, Typography } from "@mui/material";

import { tips } from '../../../utils/util';
import { CardContainer } from "../../../components/cards";
import { ActionButton1, ActionButton2 } from "../../../components/buttons";
import { useGlobalContext } from 'provider';

interface ParamObject {
  item: TankClassObject
  setBuyItem: any
}

const TankItem = ({ item, setBuyItem }: ParamObject) => {
  const navigate = useNavigate();
  const [state] = useGlobalContext();

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
        tips("error", "Buy tank failed!");
      }
    }
  }

  return (
    <CardContainer style={{paddingBottom: '0.8rem'}}>
      <CardMedia alt="" component="img"
        image={item.image} onClick={handleDetail}
        className='h-194 cursor-pointer'
      />
      <CardContent>
        <Stack direction="row" className='items-center justify-between'>
          <Typography>{item.name}</Typography>
          <Typography>{item.price + " DFTL"}</Typography>
        </Stack>
      </CardContent>

      <CardActions className='flex justify-between'>
        {state.walletStatus === 2 && (
          <ActionButton1 variant="outlined" onClick={handleBuy}>
            BUY
          </ActionButton1>
        )}

        <ActionButton2 variant="outlined" onClick={handleDetail}>
          Detail
        </ActionButton2>
      </CardActions>
    </CardContainer >
  )
}

export { TankItem }
