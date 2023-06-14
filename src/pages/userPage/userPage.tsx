import React from 'react';
import { useParams } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Stack, TextField, Grid, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { useGlobalContext } from '../../provider';
import { TankItemCard } from '../../components/tankCard';
import { Layouts } from '../../components/layouts/layouts';
import { ProfilePanel } from '../../components/profile/profile';

export const UserPage = () => {
  const { address } = useParams();
  const [state] = useGlobalContext();
  const tempAddr = address || state.account

  const [filter, setFilter] = useState("");
  const [type, setType] = useState("All");
  const [renderCount, setRendCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = () => {
    setRendCount(renderCount + 10);
  }

  const typeFilter = useCallback((item: TankObject) => {
    switch (type) {
      case "All":
        return true
      case "Lended":
        return item.borrower !== tempAddr
      case "OnMine":
        return item.borrower === tempAddr
    }

    return item
  }, [type, tempAddr])

  const myTanks = useMemo(() => {
    let items = state.tankItems.filter((tankItem: TankObject) => {
      const ownerFlag = tankItem.owner === tempAddr
      const borrowerFlag = tankItem.borrower === tempAddr

      return ownerFlag || borrowerFlag
    }).filter((item: TankObject) => {
      return item.name.indexOf(filter.toLowerCase().trim()) > -1
    }).filter(typeFilter)

    let renderItems = items.slice(0, renderCount)
    if (renderItems.length === items.length) setHasMore(false);
    else setHasMore(true)

    return renderItems
  }, [tempAddr, state.tankItems, filter, renderCount])

  return (
    <Layouts>
      <ProfilePanel address={tempAddr} />

      <Stack spacing={2}
        marginTop={"30px"}
        alignItems="center"
        justifyContent="space-between"
        direction={{ xs: "column", sm: "row" }}
      >
        <TextField label="Search"
          variant="outlined" value={filter}
          onChange={(e: any) => setFilter(e.target.value)}
          sx={{
            flex: 1,
            maxWidth: "600px",
            borderRadius: '5px',
            width: { xs: "100%" },
            backgroundColor: '#00000075',
          }}
        />

        <FormControl
          size="medium"
          sx={{
            flex: 1,
            maxWidth: "400px",
            borderRadius: '5px',
            width: { xs: "100%" },
            backgroundColor: '#00000075',
          }}
        >
          <InputLabel id="sort-select">
            Type
          </InputLabel>

          <Select label="Type"
            labelId="sort-select" value={type}
            onChange={(e: any) => setType(e.target.value)}
          >
            <MenuItem style={{ backgroundColor: '#000000a8', padding: '0.6rem 1rem', borderBottom: '1px solid #222' }} value={"All"}>All</MenuItem>
            <MenuItem style={{ backgroundColor: '#000000a8', padding: '0.6rem 1rem', borderBottom: '1px solid #222' }} value={"Lended"}>Lended</MenuItem>
            <MenuItem style={{ backgroundColor: '#000000a8', padding: '0.6rem 1rem', borderBottom: '1px solid #222' }} value={"OnMine"}>OnMine</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <InfiniteScroll
        next={fetchMore}
        hasMore={hasMore}
        dataLength={myTanks.length}
        loader={<Typography>Loading...</Typography>}
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {myTanks.map((tankItem: TankObject, key: number) => (
            <Grid key={key} item
              xs={12} sm={6} md={6} lg={4} xl={2.4}
            >
              <TankItemCard item={tankItem} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Layouts>
  )
}