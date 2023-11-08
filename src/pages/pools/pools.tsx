import React from "react";
import Select from "@mui/material/Select";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useMemo, useCallback } from "react";
import { Box, Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Typography } from "@mui/material";

import { PoolItem } from "./common";
import { GridItem } from "components/grid";
import { useGlobalContext } from "provider";
import { StakedInfoPanel } from "./common/stakedInfoPanel";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";

const PoolsPage = () => {
  const [state] = useGlobalContext();
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("capacityHL");
  const [renderCount, setRendCount] = useState<number>(20);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string | false>(false);

  const sortBy = useCallback((a: GuildObject, b: GuildObject) => {
    let res: boolean = true

    switch (sort) {
      case "poolSizeHL":
        res = Number(a.maxStakingPool) < Number(b.maxStakingPool);
        break;
      case "poolSizeLH":
        res = Number(a.maxStakingPool) > Number(b.maxStakingPool);
        break;
      case "capacityHL":
        res = Number(a.maxStakingPool - a.stakingPool) < Number(b.maxStakingPool - b.stakingPool);
        break;
      case "capacityLH":
        res = Number(a.maxStakingPool - a.stakingPool) > Number(b.maxStakingPool - b.stakingPool);
        break;
      case "stakedHL":
        res = Number(state.stakes[a.id]) < Number(state.stakes[b.id]);
        break;
      case "stakedLH":
        res = Number(state.stakes[a.id]) > Number(state.stakes[b.id]);
        break;
    }

    return res ? 1 : -1
  }, [sort])

  const guildDatas = useMemo(() => {
    let tempGuilds = state.guildDatas.filter((guildInfo: GuildObject) => (
      guildInfo.name?.toLowerCase().indexOf(filter.toLowerCase().trim()) > -1
    )).sort(sortBy)

    let renderingItems = tempGuilds.slice(0, renderCount)
    if (renderingItems.length === tempGuilds.length) {
      setHasMore(false)
    } else setHasMore(true)

    return renderingItems
  }, [state.guildDatas, filter, sort, renderCount])

  const fetchMore = () => {
    setRendCount(renderCount + 15)
  }

  const onChangeFilter = ({ target }: any) => {
    setFilter(target.value)
    setRendCount(20)
  }

  const onChangeSort = ({ target }: any) => {
    setSort(target.value)
  }

  const handleExpand = (panel: string) => (e: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Layouts>
      <GlobalSpacing className="flex flex-col gap-10">
        <StakedInfoPanel />

        <Stack gap={2}
          direction={{ xs: "column", sm: "row" }}
          className="items-center justify-between mt-60"
        >
          <TextField label="Search" variant="outlined"
            value={filter} onChange={onChangeFilter}
            className="flex-1 max-w-600 w-full rounded-5 bg-inputBg"
          />

          <FormControl size="medium" className="flex-1 max-w-400 w-full rounded-5 bg-inputBg">
            <InputLabel>Sort</InputLabel>

            <Select label="Sort" value={sort} onChange={onChangeSort}>
              <MenuItem value="" style={MenuStyle}><em>None</em></MenuItem>
              <MenuItem value={"capacityHL"} style={MenuStyle}>Capacity(High-Low)</MenuItem>
              <MenuItem value={"capacityLH"} style={MenuStyle}>Capacity(Low-High)</MenuItem>
              <MenuItem value={"stakedHL"} style={MenuStyle}>Staked(High-Low)</MenuItem>
              <MenuItem value={"stakedLH"} style={MenuStyle}>Staked(Low-High)</MenuItem>
              <MenuItem value={"poolSizeHL"} style={MenuStyle}>Pool Size(High-Low)</MenuItem>
              <MenuItem value={"poolSizeLH"} style={MenuStyle}>Pool Size(Low-High)</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack>
          {!!guildDatas && (
            <Stack direction="row">
              <Grid container spacing={2} className="px-30 mt-10">
                <GridItem>
                  <Typography>Guild</Typography>
                </GridItem>

                <GridItem>
                  <Typography>Owner</Typography>
                </GridItem>

                <GridItem>
                  <Typography>Staked</Typography>
                </GridItem>

                <GridItem>
                  <Typography>Staked/Capacity</Typography>
                </GridItem>
              </Grid>

              <Box sx={{ width: "20px" }} />
            </Stack>
          )}

          <InfiniteScroll next={fetchMore}
            scrollableTarget="fullscreen-container"
            hasMore={hasMore} dataLength={guildDatas.length}
            loader={<Typography>Loading...</Typography>}
          >
            {guildDatas.map((guildData: GuildObject, key: number) => (
              <PoolItem key={key}
                expanded={expanded}
                handleExpand={handleExpand}
                guildData={guildData}
                index={key}
              />
            ))}
          </InfiniteScroll>
        </Stack>
      </GlobalSpacing>
    </Layouts>
  )
}

const MenuStyle = {
  padding: '0.6rem 1rem',
  backgroundColor: '#000000a8',
  borderBottom: '1px solid #222'
}

export { PoolsPage }