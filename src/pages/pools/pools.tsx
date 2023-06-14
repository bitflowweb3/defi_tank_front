import React from "react";
import Select from "@mui/material/Select";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useMemo, SyntheticEvent, useCallback } from "react";
import { Box, Stack, TextField, FormControl, InputLabel, MenuItem, Grid, Typography } from "@mui/material";

import { PoolItem } from "./common";
import { GridItem } from "components/grid";
import { useGlobalContext } from "provider";
import { Layouts } from "components/layouts/layouts";
import { StakedInfoPanel } from "./common/stakedInfoPanel";

export const PoolsPage = () => {
  const [state] = useGlobalContext();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("capacityHL");
  const [renderCount, setRendCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = () => {
    setRendCount(renderCount + 15)
  }

  const sortBy = useCallback((a: TankObject, b: TankObject) => {
    var res: boolean = true

    switch (sort) {
      case "poolSizeHL":
        res = Number(a.maxEnergyPool) < Number(b.maxEnergyPool);
        break;
      case "poolSizeLH":
        res = Number(a.maxEnergyPool) > Number(b.maxEnergyPool);
        break;
      case "capacityHL":
        res = Number(a.maxEnergyPool - a.energyPool) < Number(b.maxEnergyPool - b.energyPool);
        break;
      case "capacityLH":
        res = Number(a.maxEnergyPool - a.energyPool) > Number(b.maxEnergyPool - b.energyPool);
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

  const tankItems = useMemo(() => {
    let items = state.tankItems.filter((item: TankObject) => (
      item.name?.toLowerCase().indexOf(filter.toLowerCase().trim()) > -1
    )).sort(sortBy)

    let renderingItems = items.slice(0, renderCount)
    if (renderingItems.length === items.length) {
      setHasMore(false)
    } else setHasMore(true)

    return renderingItems
  }, [state.tankItems, filter, sort, renderCount]);

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleExpand = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Layouts>
      <StakedInfoPanel />

      <Stack p={1}
        spacing={2}
        marginTop={"60px"}
        alignItems="center"
        justifyContent="space-between"
        direction={{ xs: "column", sm: "row" }}
      >
        <TextField label="Search"
          variant="outlined" value={filter}
          onChange={(e: any) => { setFilter(e.target.value); setRendCount(20) }}
          sx={{
            flex: 1,
            maxWidth: "600px",
            width: { xs: "100%" },
            borderRadius: '5px',
            backgroundColor: '#00000075',
          }}
        />

        <FormControl size="medium"
          sx={{
            flex: 1,
            maxWidth: "400px",
            width: { xs: "100%" },
            borderRadius: '5px',
            backgroundColor: '#00000075',
          }}
        >
          <InputLabel id="sort-select">
            Sort
          </InputLabel>

          <Select label="Sort"
            labelId="sort-select" value={sort}
            onChange={(e: any) => setSort(e.target.value)}
          >
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
        {tankItems && (
          <Stack direction="row">
            <Grid container spacing={2}
              sx={{ paddingInline: "30px", mt: "10px" }}
            >
              <GridItem>
                <Typography>Tank</Typography>
              </GridItem>

              <GridItem>
                <Typography>Owner</Typography>
              </GridItem>

              <GridItem>
                <Typography>SDFTL</Typography>
              </GridItem>

              <GridItem>
                <Typography>Staked/Capacity</Typography>
              </GridItem>
            </Grid>

            <Box sx={{ width: "20px" }} />
          </Stack>
        )}

        <InfiniteScroll
          next={fetchMore}
          hasMore={hasMore}
          dataLength={tankItems.length}
          loader={<Typography>Loading...</Typography>}
        >
          {tankItems.map((tankItem: TankObject, key: number) => (
            <PoolItem key={key}
              handleExpand={handleExpand}
              expanded={expanded}
              item={tankItem}
              index={key}
            />
          ))}
        </InfiniteScroll>
      </Stack>
    </Layouts>
  )
}

const MenuStyle = {
  padding: '0.6rem 1rem',
  backgroundColor: '#000000a8',
  borderBottom: '1px solid #222'
}