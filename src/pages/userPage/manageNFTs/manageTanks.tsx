import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Grid, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { useGlobalContext } from "provider";
import { menuStyle } from "components/styles";
import { TankItemCard } from "components/tankCard";
import { useState, useCallback, useMemo } from "react";

import SearchIcon from '@mui/icons-material/Search';

const ManageTanks = ({ address }) => {
  const [state] = useGlobalContext();

  const [filter, setFilter] = useState("");
  const [type, setType] = useState("All");
  const [renderCount, setRendCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = () => {
    setRendCount(renderCount + 10);
  }

  const typeFilter = useCallback((item: NftTankObject) => {
    switch (type) {
      case "All":
        return true
      case "Lended":
        return item.owner !== address
      case "OnMine":
        return item.owner === address
    }

    return item
  }, [type, address])

  const myTanks = useMemo(() => {
    let items = state.tankItems.filter((tankItem: NftTankObject) => {
      const ownerFlag = tankItem.owner === address
      const borrowerFlag = tankItem.borrower === address

      return ownerFlag || borrowerFlag
    }).filter((item: NftTankObject) => {
      return item.name.indexOf(filter.toLowerCase().trim()) > -1
    }).filter(typeFilter)

    let renderItems = items.slice(0, renderCount)
    if (renderItems.length === items.length) setHasMore(false);
    else setHasMore(true)

    return renderItems
  }, [state.tankItems, filter, renderCount, typeFilter])

  const onChangeFilter = ({ target }: any) => {
    setFilter(target.value)
  }

  const onChangeType = ({ target }: any) => {
    setType(target.value)
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="card flex justify-between gap-20 mt-10 mb-10">
        <div className="search-input">
          <div className="icon">
            <SearchIcon className="text-20" />
          </div>
          <input type="text" placeholder="Search" value={filter} onChange={onChangeFilter} className="search" />
        </div>

        <FormControl size="medium" className="w-full sm:max-w-400 rounded-15">
          <InputLabel id="sort-select">Type</InputLabel>
          <Select label="Sort" labelId="sort-select" value={type} onChange={onChangeType}>
            <MenuItem style={menuStyle} value={"All"}>All</MenuItem>
            <MenuItem style={menuStyle} value={"Lended"}>Lended</MenuItem>
            <MenuItem style={menuStyle} value={"OnMine"}>OnMine</MenuItem>
          </Select>
        </FormControl>
      </div>

      <InfiniteScroll next={fetchMore}

        scrollableTarget="fullscreen-container"
        hasMore={hasMore} dataLength={myTanks.length}
        loader={<Typography>Loading...</Typography>}
      >
        <Grid container spacing={2}>
          {myTanks.map((tankItem: NftTankObject, key: number) => (
            <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
              <TankItemCard item={tankItem} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </div>
  )
}

export { ManageTanks }