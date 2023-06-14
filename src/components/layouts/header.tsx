import React from "react";
import { Toolbar, IconButton, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { TANKTOKEN } from "../../blockchain";
import { getSubString } from "../../utils/util";
import { useGlobalContext } from "../../provider";
import { HeaderButton, HeaderLink } from "../buttons";
import { Notification } from "../notification/notification";

export const Header = () => {
  const [state, { dispatch, connectToMetamask, disconnectMetamask }] = useGlobalContext();

  const openMobileSidebar = () => {
    dispatch({ type: "mobileOpen", payload: true, })
  }

  const connectOrDisconnect = () => {
    if (state.walletStatus === 2) {
      disconnectMetamask()
    } else {
      connectToMetamask()
    }
  }

  return (
    <Toolbar>
      <div className="flex-1 flex flex-row items-center">
        <IconButton edge="start" color="primary"
          sx={{ display: { sm: "none" } }}
          onClick={openMobileSidebar}
        >
          <MenuIcon />
        </IconButton>

        <div className="flex-1" />
        <Notification />

        <Stack spacing={2} direction="row">
          {state.walletStatus === 2 && (
            <HeaderLink href={`https://arbiscan.io/token/${TANKTOKEN.address}`} target="_blank">
              {Number(state.balance).toFixed(0) + " DFTL"}
            </HeaderLink>
          )}

          <HeaderButton onClick={connectOrDisconnect}>
            {state.walletStatus === 0 && (
              <span>Install Metamask</span>
            )}

            {state.walletStatus === 1 && (
              <span>Connect Wallet</span>
            )}

            {state.walletStatus === 2 && (
              <span>{getSubString(state.account || "")}</span>
            )}
          </HeaderButton>
        </Stack>
      </div>
    </Toolbar>
  )
}