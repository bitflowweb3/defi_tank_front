import React from "react";
import { useState, useCallback, useMemo } from "react";
import { MenuItem, Grid, Select, Modal } from "@mui/material";
import { Stack, TextField, FormControl, InputLabel } from "@mui/material";

import { useGlobalContext } from "provider";
import { TankItem } from "./common/item";
import { BuyPanel } from "./common/buyPanel";
import { ScrollWrapper } from "components/scrollbar";
import { menuStyle } from "components/styles";

const CreateTanks = () => {
  const [state] = useGlobalContext();
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [buyItem, setBuyItem] = useState(null);

  const sortBy = useCallback((a: TankClassObject, b: TankClassObject) => {
    let res: boolean = true;
    switch (sort) {
      case "priceLH":
        res = Number(a.price) > Number(b.price);
        break;
      case "priceHL":
        res = Number(a.price) < Number(b.price);
        break;
      case "speedLH":
        res = Number(a.speed) > Number(b.speed);
        break;
      case "speedHL":
        res = Number(a.speed) < Number(b.speed);
        break;
      case "healthLH":
        res = Number(a.health) > Number(b.health);
        break;
      case "healthHL":
        res = Number(a.health) < Number(b.health);
        break;
      case "fireRateLH":
        res = Number(a.fireRate) > Number(b.fireRate);
        break;
      case "fireRateHL":
        res = Number(a.fireRate) < Number(b.fireRate);
        break;
      case "firePowerLH":
        res = Number(a.firePower) > Number(b.firePower);
        break;
      case "firePowerHL":
        res = Number(a.firePower) < Number(b.firePower);
        break;
    }

    return res ? 1 : -1;
  }, [sort])

  const tankClassList = useMemo(() => {
    return state.tankClasses.filter(({ name }: TankClassObject) => (
      name.indexOf(filter.toLowerCase().trim()) > -1
    )).sort(sortBy)
  }, [state.tankClasses, filter, sort])

  const onChangeFilter = ({ target }: any) => {
    setFilter(target.value)
  }

  const onChangeSort = ({ target }: any) => {
    setSort(target.value)
  }

  return (
    <div className="flex-1 flex flex-col gap-10">
      <Stack gap={2} direction={{ xs: "column", sm: "row" }} className="items-center justify-between">
        <TextField label="Search" variant="outlined"
          value={filter} onChange={onChangeFilter}
          className="w-full sm:max-w-600 bg-inputBg rounded-5"
        />

        <FormControl size="medium" className="w-full sm:max-w-400 bg-inputBg rounded-5">
          <InputLabel id="sort-select">Sort</InputLabel>
          <Select label="Sort" labelId="sort-select" value={sort} onChange={onChangeSort}>
            <MenuItem value="" style={menuStyle}><em>None</em></MenuItem>
            <MenuItem value="speedLH" style={menuStyle}>Speed(Low-High)</MenuItem>
            <MenuItem value="speedHL" style={menuStyle}>Speed(High-Low)</MenuItem>
            <MenuItem value="priceLH" style={menuStyle}>Price(Low-High)</MenuItem>
            <MenuItem value="priceHL" style={menuStyle}>Price(High-Low)</MenuItem>
            <MenuItem value="healthLH" style={menuStyle}>Health(Low-High)</MenuItem>
            <MenuItem value="healthHL" style={menuStyle}>Health(High-Low)</MenuItem>
            <MenuItem value="fireRateLH" style={menuStyle}>FireRate(Low-High)</MenuItem>
            <MenuItem value="fireRateHL" style={menuStyle}>FireRate(High-Low)</MenuItem>
            <MenuItem value="firePowerLH" style={menuStyle}>FirePower(Low-High)</MenuItem>
            <MenuItem value="firePowerHL" style={menuStyle}>FirePower(High-Low)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <ScrollWrapper>
        <Grid container spacing={2}>
          {tankClassList.map((tankClass: TankClassObject, key: any) => (
            <Grid key={key} item xs={12} sm={12} md={6} lg={4} xl={3}>
              <TankItem item={tankClass} setBuyItem={setBuyItem} />
            </Grid>
          ))}
        </Grid>
      </ScrollWrapper>

      <Modal open={buyItem != null} onClose={() => setBuyItem(null)}>
        <div className="">
          <BuyPanel item={buyItem} onClose={() => setBuyItem(null)} />
        </div>
      </Modal>
    </div>
  )
}

export { CreateTanks }