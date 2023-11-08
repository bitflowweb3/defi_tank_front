import React from "react";
import Select from "@mui/material/Select";
import { useState, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Typography } from "@mui/material";

import { useGlobalContext } from "provider";
import { TankItemCard } from "components/tankCard";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { ScrollWrapper } from "components/scrollbar";
import { menuStyle } from "components/styles";

export const LendingPage = () => {
  const [state] = useGlobalContext();
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [renderCount, setRendCount] = useState(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const sortBy = useCallback((a: NftTankObject, b: NftTankObject) => {
    let res: boolean = true;

    switch (sort) {
      case "energyLH":
        res = Number(a.energy) > Number(b.energy);
        break;
      case "energyHL":
        res = Number(a.energy) < Number(b.energy);
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

  const myTanks = useMemo(() => {
    let items = state.tankItems.filter((tankItem: NftTankObject) => (
      tankItem.borrower === ""
    )).filter((item: NftTankObject) => (
      item.name?.toLowerCase().indexOf(filter.toLowerCase().trim()) > -1
    )).sort(sortBy)

    let renderItems = items.slice(0, renderCount);
    if (renderItems.length === items.length) {
      setHasMore(false)
    } else setHasMore(true)

    return renderItems
  }, [state.account, state.tankItems, filter, sort, renderCount])

  const fetchMore = () => {
    setRendCount(renderCount + 10);
  }

  const onChangeFilter = ({ target }: any) => {
    setFilter(target.value)
  }

  const onChangeSort = ({ target }: any) => {
    setSort(target.value)
  }

  return (
    <Layouts>
      <GlobalSpacing className="flex-1 flex flex-col gap-20">
        <Stack spacing={2}
          direction={{ xs: "column", sm: "row" }}
          className="items-center justify-between"
        >
          <TextField label="Search" variant="outlined"
            value={filter} onChange={onChangeFilter}
            className="flex-1 max-w-600 w-ful bg-inputBg rounded-5"
          />

          <FormControl size="medium" className="flex-1 max-w-400 w-ful bg-inputBg rounded-5">
            <InputLabel id="sort-select">Sort</InputLabel>
            <Select label="Sort" labelId="sort-select" value={sort} onChange={onChangeSort}>
              <MenuItem style={menuStyle} value=""><em>None</em></MenuItem>
              <MenuItem style={menuStyle} value="energyHL">Energy(High-Low)</MenuItem>
              <MenuItem style={menuStyle} value="energyLH">Energy(Low-High)</MenuItem>
              <MenuItem style={menuStyle} value="speedHL">Speed(High-Low)</MenuItem>
              <MenuItem style={menuStyle} value="speedLH">Speed(Low-High)</MenuItem>
              <MenuItem style={menuStyle} value="healthHL">Health(High-Low)</MenuItem>
              <MenuItem style={menuStyle} value="healthLH">Health(Low-High)</MenuItem>
              <MenuItem style={menuStyle} value="fireRateHL">FireRate(High-Low)</MenuItem>
              <MenuItem style={menuStyle} value="fireRateLH">FireRate(Low-High)</MenuItem>
              <MenuItem style={menuStyle} value="firePowerHL">FirePower(High-Low)</MenuItem>
              <MenuItem style={menuStyle} value="firePowerLH">FirePower(Low-High)</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <ScrollWrapper id="tanklending-container">
          <InfiniteScroll next={fetchMore}
            scrollableTarget="tanklending-container"
            hasMore={hasMore} dataLength={myTanks.length}
            loader={<Typography>Loading...</Typography>}
          >
            <Grid container spacing={2}>
              {myTanks.map((tankClass: NftTankObject, key: any) => (
                <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
                  <TankItemCard item={tankClass} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </ScrollWrapper>
      </GlobalSpacing>
    </Layouts>
  )
}