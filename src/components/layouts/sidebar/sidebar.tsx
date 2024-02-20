import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Box, Drawer, Toolbar } from '@mui/material';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ArticleIcon from '@mui/icons-material/Article';

import { useGlobalContext } from "provider";
import { MenuList, drawerWidth, SocialMenus } from "./menu.config";

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

  const {pathname} = useLocation()


  return (
    <div className="flex flex-col px-20 " style={{justifyContent: 'space-between', height: '95%', overflowY: 'auto'}}>
      {/* <Toolbar className="justify-center px-15">
        <Link to="/">
          <img alt="" src={imgConfig.logoImg}
            className="max-w-200 md:w-200 aspect-square text-center"
          />
        </Link>
      </Toolbar> */}

      <div className="flex flex-col gap-5 text-white/75">
        {MenuList.map((menuItem, index) => (
          <Link key={index} to={menuItem.href}
            className={`flex flex-row gap-10 items-center px-25 py-10 rounded-25 hover:bg-menuBg hover:text-white ${menuItem.href === pathname ? 'sidemenu-active' : ''}`}
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
      <div className="flex flex-col gap-5 text-white/75">
          <Link to={"https://docs.defitankland.com/"} target = "_blank" className={`flex flex-row gap-10 items-center px-25 py-10 rounded-25 hover:bg-menuBg hover:text-white opacity-70`}>
            <HandshakeIcon className="text-30" />
            <div className="text-15 ">
              Partnership
            </div>
          </Link>
          <Link to={"https://docs.defitankland.com/"} target = "_blank"  className={`flex flex-row gap-10 items-center px-25 py-10 rounded-25 hover:bg-menuBg hover:text-white opacity-70`}>
            <ArticleIcon className="text-30" />
            <div className="text-15 ">
              Documentation
            </div>
          </Link>
          {/* <div className={`flex flex-row gap-10 items-center px-25 py-10 text-15`}>
            Social Links:
          </div> */}
          <div className="flex flex-row gap-10 item-center px-25 py-10">
            {SocialMenus.map((menuItem, index) => (
              <Link key={index} to={menuItem.href} >
                {menuItem.icon}
              </Link>
            ))}
          </div>
          
          <div className={`flex flex-row gap-10 justify-center items-center px-25 py-10 text-15 opacity-70`}>
            DefiTankLand v1.0.0
          </div>
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
            width: drawerWidth,
            top: '64px',
            zIndex: 100,
            padding: '48px 0',
            border: 'none'
          }
        }}
      >
        <MenuContainer />
      </Drawer>
    </Box>
  )
}



export { Sidebar }