import React from "react";
import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import Select from "@mui/material/Select";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Typography } from "@mui/material";


import SearchIcon from '@mui/icons-material/Search';

import { PoolItem } from "./common";
import { GridItem } from "components/grid";
import { useGlobalContext } from "provider";
import { StakedInfoPanel } from "./common/stakedInfoPanel";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";


import userTempCoverImg from "../../assets/image/banner1.webp";

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
      <GlobalSpacing className="flex flex-col gap-30">
        <Stack direction="row" className="relative min-h-300 w-full items-center">
          <BackgroundTag>
            <CoverBGTag />
            <BackgroundImageTag alt="Tanker" src={userTempCoverImg} />
            <BackgroundColorTag />
          </BackgroundTag>
          <Stack gap={2} flex={1} className="px-30">
            <h1 style={{fontSize: '56px', fontWeight: '700'}}>Staking</h1>
            <h2 style={{fontSize: '24px', fontWeight: 500}}>Unique economic model based MMO Tank game</h2>
          </Stack>
        </Stack>
      </GlobalSpacing>
      <Stack direction={{ xs: "column", xl: "row" }} gap={3} className="justify-between p-10">
        <div className="card " style={{flex: 8}}>  
            <div className="flex justify-between gap-20  ">
              <div className="search-input" style={{flex: 8}}>
                <div className="icon">
                  <SearchIcon className="text-20"/>
                </div>
                <input type = "text" placeholder="Search" value={filter} onChange={onChangeFilter} className="search"/>
              </div>
              <FormControl size="medium" className="w-full sm:max-w-400 rounded-15" style={{flex: 4}}>
                <InputLabel id="sort-select">Sort</InputLabel>
                <Select label="Sort" labelId="sort-select" value={sort} onChange={onChangeSort}>
                  <MenuItem value="" style={MenuStyle}><em>None</em></MenuItem>
                  <MenuItem value={"capacityHL"} style={MenuStyle}>Capacity(High-Low)</MenuItem>
                  <MenuItem value={"capacityLH"} style={MenuStyle}>Capacity(Low-High)</MenuItem>
                  <MenuItem value={"stakedHL"} style={MenuStyle}>Staked(High-Low)</MenuItem>
                  <MenuItem value={"stakedLH"} style={MenuStyle}>Staked(Low-High)</MenuItem>
                  <MenuItem value={"poolSizeHL"} style={MenuStyle}>Pool Size(High-Low)</MenuItem>
                  <MenuItem value={"poolSizeLH"} style={MenuStyle}>Pool Size(Low-High)</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Stack className="mt-20">
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
        </div>
        <div className="card flex justify-between gap-20 " style={{flex: 4}}>
          <StakedInfoPanel />
        </div>
      </Stack>
    </Layouts>
  )
}

const BackgroundTag = styled("div")(({ theme }) => ({
  // backgroundColor: "#6e120066",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
  borderRadius: '16px',
  overflow: 'hidden'
}))

const BackgroundImageTag = styled("img")(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.7",
}))

const CoverBGTag = styled("div")(({ theme }) => ({
  backgroundColor: "rgba(36, 36, 36, 1)",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0.7"
}))

const BackgroundColorTag = styled("div")(({ theme }) => ({
  backgroundColor: "linear-gradient(180deg, rgba(0, 0, 0, 0), #000000 105.04%)",
  background: "linear-gradient(180deg, rgba(0, 0, 0, 0), #000000 105.04%)",
  boxShadow: '0px 4px 32px 0px rgba(0, 0, 0, 0.08)',
  position: "absolute",
  left: 0,
  top: 0,
  opacity: "0.4",
  width: "100%",
  height: "100%",
}))



const MenuStyle = {
  padding: '0.6rem 1rem',
  backgroundColor: '#000000a8',
  borderBottom: '1px solid #222'
}

export { PoolsPage }