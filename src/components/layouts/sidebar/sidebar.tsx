import React from "react";
import { Link } from "react-router-dom";
import { Box, Drawer, Toolbar } from '@mui/material';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';

import { useGlobalContext } from "provider";
import { imgConfig } from "assets/img.config";
import { MenuList, drawerWidth } from "./menu.config";

const ReferralMenu = () => {
  return (
    <Link to="/referral"
      className="flex flex-row gap-10 items-center px-25 py-8 rounded-8 hover:bg-menuBg hover:text-white"
    >
      <OnlinePredictionIcon className="text-30" />
      <div className="text-15 font-semibold">
        Referral
      </div>
    </Link>
  )
}

const MenuContainer = () => {
  const [state] = useGlobalContext();

  return (
    <div className="flex flex-col px-10">
      <Toolbar className="justify-center px-15">
        <Link to="/">
          <img alt="" src={imgConfig.logoImg}
            className="max-w-200 md:w-200 aspect-square text-center"
          />
        </Link>
      </Toolbar>

      <div className="flex flex-col gap-5 text-white/75">
        {MenuList.map((menuItem, index) => (
          <Link key={index} to={menuItem.href}
            className="flex flex-row gap-10 items-center px-25 py-8 rounded-5 hover:bg-menuBg hover:text-white"
          >
            {menuItem.icon}
            <div className="text-15 font-semibold">
              {menuItem.title}
            </div>
          </Link>
        ))}

        {state.walletStatus === 2 && (
          <ReferralMenu />
        )}
      </div>
    </div>
  )
}

const Sidebar = () => {
  const [state, { dispatch }] = useGlobalContext();

  const handleDrawerToggle = () => {
    dispatch({ type: "mobileOpen", payload: !state.mobileOpen })
  }

  return (
    <Box aria-label="mailbox folders" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer variant="temporary"
        open={state.mobileOpen}
        onClose={handleDrawerToggle}
        onClick={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth - 20
          }
        }}
      >
        <MenuContainer />
      </Drawer>

      <Drawer open variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          }
        }}
      >
        <MenuContainer />
      </Drawer>
    </Box>
  )
}



export { Sidebar }