import React from "react";
import { useState, useCallback, useMemo } from "react";
import { Stack, TextField, Grid, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { useGlobalContext } from "provider";
import { menuStyle } from "components/styles";
import { GuildItemCard } from "components/guildCard";

const ManageGuilds = ({ address }) => {
  const [state] = useGlobalContext();
  const [type, setType] = useState("All");
  const [filter, setFilter] = useState("");

  const typeFilter = useCallback((item: GuildObject) => {
    switch (type) {
      case "All":
        return true
      case "OnMine":
        return item.owner === address
      case "Member":
        const checkMember = item.members.find((item: GuildMemberObject) => (item.address === address));
        return item.owner !== address && checkMember;
    }

    return item
  }, [type, address])

  const userGuilds = useMemo(() => {
    let tempGuilds = state.guildDatas.filter((guildItem: GuildObject) => {
      const ownerFlag = guildItem.owner === address
      const tempMembers: GuildMemberObject[] = guildItem.members
      const memberFlag = tempMembers.find((member: GuildMemberObject) => (
        member.address === address
      ))

      return !!address && (ownerFlag || memberFlag)
    }).filter((item: GuildObject) => {
      return item.name.indexOf(filter.toLowerCase().trim()) > -1
    }).filter(typeFilter)

    return tempGuilds
  }, [address, state.guildDatas, filter, typeFilter])

  const onChangeFilter = async ({ target }: any) => {
    setFilter(target.value)
  }

  const onChangeType = async ({ target }: any) => {
    setType(target.value)
  }

  return (
    <div className="flex-1 flex flex-col gap-10">
      <Stack gap={2}
        direction={{ xs: "column", sm: "row" }}
        className="items-center justify-between"
      >
        <TextField label="Search" variant="outlined"
          value={filter} onChange={onChangeFilter}
          className="flex-1 max-w-600 w-full rounded-5 bg-inputBg"
        />

        <FormControl size="medium" className="flex-1 max-w-400 w-full rounded-5 bg-inputBg">
          <InputLabel id="sort-select">Type</InputLabel>

          <Select label="Type" labelId="sort-select" value={type} onChange={onChangeType}>
            <MenuItem style={menuStyle} value={"All"}>All</MenuItem>
            <MenuItem style={menuStyle} value={"Member"}>Member</MenuItem>
            <MenuItem style={menuStyle} value={"OnMine"}>OnMine</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={2}>
        {userGuilds.map((guildItem: GuildObject, key: number) => (
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
            <GuildItemCard item={guildItem} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export { ManageGuilds }