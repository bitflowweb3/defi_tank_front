import React from "react"
import { Link } from "react-router-dom";
import { Box, Drawer, Toolbar, List, ListItem, ListItemButton } from '@mui/material';

import { imgConfig } from "assets/img.config";
import { MenuList, drawerWidth } from "./menu.config";
import { useGlobalContext } from "provider";

const ReferralMenu = () => {
  return (
    <ListItem disablePadding>
      <ListItemButton color="primary"
        to={"/referrals"}
        component={Link}
        sx={{
          paddingTop: "20px",
          paddingLeft: "50px",
          paddingBottom: "20px",
          fontSize: "20px",
          fontWeight: "600"
        }}
      >
        Referral
      </ListItemButton>
    </ListItem>
  )
}

export const Sidebar = () => {
  const [state, { dispatch }] = useGlobalContext();

  const handleDrawerToggle = () => {
    dispatch({ type: "mobileOpen", payload: !state.mobileOpen })
  }

  return (
    <Box aria-label="mailbox folders"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer open={state.mobileOpen}
        onClose={handleDrawerToggle}
        onClick={handleDrawerToggle}
        variant="temporary"
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          }
        }}
      >
        <div>
          <Toolbar >
            <Link to="/">
              <Box component="img"
                src={imgConfig.logoImg}
                alt="DeFiTankLand"
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  maxWidth: 160,
                  mt: 3
                }}
              />
            </Link>
          </Toolbar>

          <List>
            {MenuList.map((menuItem, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  color="primary"
                  component={Link}
                  to={menuItem.href}
                  sx={{ paddingTop: "20px", paddingLeft: "50px", paddingBottom: "20px", fontSize: "20px", fontWeight: "600" }}>
                  {menuItem.title}
                </ListItemButton>
              </ListItem>
            ))}

            {state.walletStatus === 2 && (
              <ReferralMenu />
            )}
          </List>
        </div>
      </Drawer>

      <Drawer open
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          }
        }}
      >
        <div>
          <Toolbar >
            <Link to="/">
              <Box
                component="img"
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  maxWidth: 160,
                  mt: 3
                }}
                alt="DeFiTankLand"
                src={imgConfig.logoImg}
              />
            </Link>
          </Toolbar>

          <List>
            {MenuList.map((menuItem, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  color="primary"
                  component={Link}
                  to={menuItem.href}
                  sx={{ paddingTop: "20px", paddingLeft: "50px", paddingBottom: "20px", fontSize: "20px", fontWeight: "600" }}>
                  {menuItem.title}
                </ListItemButton>
              </ListItem>
            ))}

            {state.walletStatus === 2 && (
              <ReferralMenu />
            )}
          </List>
        </div>
      </Drawer>
    </Box>
  )
}