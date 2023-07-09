import React from 'react';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import { useState, useMemo, useCallback } from "react";
import { Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Select, Modal } from "@mui/material";

import { BuyPanel } from "./common/buyPanel";
import { useGlobalContext } from "../../provider";
import { EquipmentItem, TankItem } from "./common/item";
import { Layouts } from "../../components/layouts/layouts";
import { Tab, TabPanel, TabsList } from 'components/tap/tapStyles';

export const MintPage = () => {
  return (
    <Layouts>
      <TabsUnstyled defaultValue={0} className='h-full flex flex-col overflow-hidden'>
        <TabsList>
          <Tab>Create Tank</Tab>
          <Tab>Create Item</Tab>
        </TabsList>

        <TabPanel value={0} className='flex-1 overflow-y-auto'>
          <CeateTank />
        </TabPanel>

        <TabPanel value={1} className='flex-1 overflow-y-auto'>
          <CreateItem />
        </TabPanel>
      </TabsUnstyled>
    </Layouts>
  )
}

const CeateTank = () => {
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

  const items = useMemo(() => {
    return state.tankClasses.filter((item: TankClassObject) => {
      return item.name.indexOf(filter.toLowerCase().trim()) > -1;
    }).sort(sortBy)
  }, [state.tankClasses, filter, sort]);

  return (
    <div className=''>
      <Stack spacing={2}
        marginTop={"30px"}
        alignItems="center"
        justifyContent="start"
        direction={{ xs: "column", sm: "row" }}
      >
        <TextField label="Search"
          variant="outlined" value={filter}
          onChange={(e: any) => setFilter(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: "300px",
            backgroundColor: '#00000075',
            borderRadius: '5px',
          }}
        />

        <FormControl size="medium"
          sx={{
            width: "100%",
            maxWidth: "200px",
            backgroundColor: '#00000075',
            borderRadius: '5px',
          }}
        >
          <InputLabel id="sort-select">Sort</InputLabel>
          <Select label="Sort"
            labelId="sort-select" value={sort}
            onChange={(e: any) => setSort(e.target.value)}
          >
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

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((tankClass: TankClassObject, key: any) => (
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={2.4}>
            <TankItem item={tankClass} setBuyItem={setBuyItem} />
          </Grid>
        ))}
      </Grid>

      <Modal open={buyItem != null}
        onClose={() => setBuyItem(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <BuyPanel item={buyItem} type='tank'
            onClose={() => setBuyItem(null)}
          />
        </div>
      </Modal>
    </div>
  )
}

const CreateItem = () => {
  const [state] = useGlobalContext();
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [buyItem, setBuyItem] = useState(null);

  const sortBy = useCallback((a: ItemClassObject, b: ItemClassObject) => {
    let res: boolean = true;
    switch (sort) {
      case "priceLH":
        res = Number(a.price) > Number(b.price);
        break;
      case "priceHL":
        res = Number(a.price) < Number(b.price);
        break;
      case "limitLH":
        res = Number(a.limitation) > Number(b.limitation);
        break;
      case "limitHL":
        res = Number(a.limitation) < Number(b.limitation);
        break;
    }

    return res ? 1 : -1;
  }, [sort])

  const items = useMemo(() => {
    return state.itemClasses.filter((item: ItemClassObject) => {
      return item.name.indexOf(filter.toLowerCase().trim()) > -1;
    }).sort(sortBy)
  }, [state.itemClasses, filter, sort]);

  return (
    <div className=''>
      <Stack spacing={2}
        marginTop={"30px"}
        alignItems="center"
        justifyContent="start"
        direction={{ xs: "column", sm: "row" }}
      >
        <TextField label="Search"
          variant="outlined" value={filter}
          onChange={(e: any) => setFilter(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: "300px",
            backgroundColor: '#00000075',
            borderRadius: '5px',
          }}
        />

        <FormControl size="medium"
          sx={{
            width: "100%",
            maxWidth: "200px",
            backgroundColor: '#00000075',
            borderRadius: '5px',
          }}
        >
          <InputLabel id="sort-select">Sort</InputLabel>
          <Select label="Sort"
            labelId="sort-select" value={sort}
            onChange={(e: any) => setSort(e.target.value)}
          >
            <MenuItem value="" style={menuStyle}><em>None</em></MenuItem>
            <MenuItem value="priceLH" style={menuStyle}>Price(Low-High)</MenuItem>
            <MenuItem value="priceHL" style={menuStyle}>Price(High-Low)</MenuItem>
            <MenuItem value="limitLH" style={menuStyle}>Limitation(Low-High)</MenuItem>
            <MenuItem value="limitHL" style={menuStyle}>Limitation(High-Low)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((itemClass: ItemClassObject, key: any) => (
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={2.4}>
            <EquipmentItem item={itemClass} setBuyItem={setBuyItem} />
          </Grid>
        ))}
      </Grid>

      <Modal open={buyItem != null}
        onClose={() => setBuyItem(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <BuyPanel item={buyItem} type='item'
            onClose={() => setBuyItem(null)}
          />
        </div>
      </Modal>
    </div>
  )
}

const menuStyle = {
  padding: '0.6rem 1rem',
  backgroundColor: '#000000a8',
  borderBottom: '1px solid #222'
}