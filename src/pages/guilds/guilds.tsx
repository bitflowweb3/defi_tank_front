import React from "react";
import Select from "@mui/material/Select";
import { useState, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import { useGlobalContext } from "provider";
import { menuStyle } from "components/styles";
import { ScrollWrapper } from "components/scrollbar";
import { GuildItemCard } from "components/guildCard";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { CustomTabPanel } from "components/customTap";

export const GuildsPage = () => {
  const [state] = useGlobalContext();
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [renderCount, setRendCount] = useState(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const sortBy = useCallback((a: GuildObject, b: GuildObject) => {
    let res: boolean = true;

    switch (sort) {
      case "levelLH":
        res = Number(a.guildLevel) > Number(b.guildLevel);
        break;
      case "levelHL":
        res = Number(a.guildLevel) < Number(b.guildLevel);
        break;

      case "membersLH":
        res = Number(a.members.length) > Number(b.members.length);
        break;
      case "membersHL":
        res = Number(a.members.length) < Number(b.members.length);
        break;

      // case "meritLH":
      //   res = Number(a.merit) > Number(b.merit);
      //   break;
      // case "meritHL":
      //   res = Number(a.merit) < Number(b.merit);
      //   break;

      case "stakedLH":
        res = Number(a.stakingPool) > Number(b.stakingPool);
        break;
      case "stakedHL":
        res = Number(a.stakingPool) < Number(b.stakingPool);
        break;

      case "followsLH":
        res = Number(a.followers.length) > Number(b.followers.length);
        break;
      case "followsHL":
        res = Number(a.followers.length) < Number(b.followers.length);
        break;
    }

    return res ? 1 : -1;
  }, [sort])

  const userGuilds = useMemo(() => {
    let tempGuilds = state.guildDatas.filter((guild: GuildObject) => (
      guild.name?.toLowerCase().indexOf(filter.toLowerCase().trim()) > -1
    )).sort(sortBy)

    let renderItems = tempGuilds.slice(0, renderCount);
    if (renderItems.length === tempGuilds.length) {
      setHasMore(false)
    } else setHasMore(true)

    return renderItems
  }, [state.account, state.guildDatas, filter, sort, renderCount])

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
      <div className="px-30">
        <div className="card flex justify-between gap-20 ">
          <div className="search-input">
            <div className="icon">
              <SearchIcon className="text-20"/>
            </div>
            <input type = "text" placeholder="Search" value={filter} onChange={onChangeFilter} className="search"/>
          </div>

          <FormControl size="medium" className="w-full sm:max-w-400 rounded-15">
            <InputLabel id="sort-select">Sort</InputLabel>
            <Select label="Sort" labelId="sort-select" value={sort} onChange={onChangeSort}>
                <MenuItem style={menuStyle} value=""><em>None</em></MenuItem>
                <MenuItem style={menuStyle} value="levelHL">Level(High-Low)</MenuItem>
                <MenuItem style={menuStyle} value="levelLH">Level(Low-High)</MenuItem>
                <MenuItem style={menuStyle} value="membersHL">Members(High-Low)</MenuItem>
                <MenuItem style={menuStyle} value="membersLH">Members(Low-High)</MenuItem>
                <MenuItem style={menuStyle} value="meritHL">Merit(High-Low)</MenuItem>
                <MenuItem style={menuStyle} value="meritLH">Merit(Low-High)</MenuItem>
                <MenuItem style={menuStyle} value="stakedHL">Staked(High-Low)</MenuItem>
                <MenuItem style={menuStyle} value="stakedLH">Staked(Low-High)</MenuItem>
                <MenuItem style={menuStyle} value="followsHL">Follows(High-Low)</MenuItem>
                <MenuItem style={menuStyle} value="followsLH">Follows(Low-High)</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="flex-1 flex flex-col gap-1 px-0 py-20">
          <div id='guilds-container'>
            <InfiniteScroll next={fetchMore}
              scrollableTarget="guilds-container"
              hasMore={hasMore} dataLength={userGuilds.length}
              loader={<Typography>Loading...</Typography>}
            >
              <Grid container spacing={4}>
                {userGuilds.map((guildItem: GuildObject, key: any) => (
                  <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={2.4}>
                    <GuildItemCard item={guildItem} />  
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Layouts>
  )
}