import React,{ useState } from "react";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Toolbar, IconButton, Stack, Divider, Menu } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Logout from '@mui/icons-material/Logout';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { config } from "config/config";
import { TANKTOKEN } from "../../blockchain";
import { useGlobalContext } from "../../provider";
import { HeaderButton, HeaderLink } from "../buttons";
import { Notification } from "../notification/notification";
import { toLanguageFormat } from "utils/util";

const Header = () => {
  const [state, { dispatch, connectToMetamask, disconnectMetamask }] = useGlobalContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = ({ currentTarget }: any) => {
    setAnchorEl(currentTarget);
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const openMobileSidebar = () => {
    dispatch({ type: "mobileOpen", payload: true, })
  }

  return (
    <Toolbar className="">
      <div className="flex-1 flex flex-row items-center px-10 sm:px-30">
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
            <HeaderLink href={`${config.tokenBaseUrl}/${TANKTOKEN.address}`} target="_blank">
              {toLanguageFormat(state.balance) + " DFTL"}
            </HeaderLink>
          )}

          {state.walletStatus !== 2 && (
            <HeaderButton onClick={connectToMetamask}>
              {state.walletStatus === 0 && (
                <span>Install Metamask</span>
              )}

              {state.walletStatus === 1 && (
                <span>Connect Wallet</span>
              )}
            </HeaderButton>
          )}

          {state.walletStatus === 2 && (
            <UserAvatar onClick={openMenu}>
              <ManageAccountsIcon />
            </UserAvatar>
          )}

          <Menu anchorEl={anchorEl} className="profile-menu-wrapper"
            open={Boolean(anchorEl)} onClose={closeMenu} onClick={closeMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                mt: 1,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <div className="w-auto md:w-200 flex flex-col">
              <Link to="/profile" className="flex flex-row gap-10 items-center px-10 py-5 hover:bg-menuBg hover:text-white">
                <Person2OutlinedIcon fontSize="medium" />
                <div className="text-15 font-semibold">Profile</div>
              </Link>

              <Link to="/referral" className="flex flex-row gap-10 items-center px-10 py-5 hover:bg-menuBg hover:text-white">
                <OnlinePredictionIcon fontSize="medium" />
                <div className="text-15 font-semibold">Referral</div>
              </Link>

              <Divider />

              <Link to="/create-nfts" className="flex flex-row gap-10 items-center px-10 py-5 hover:bg-menuBg hover:text-white">
                <PhotoOutlinedIcon fontSize="small" />
                <div className="text-15 font-semibold">Shop</div>
              </Link>

              <div onClick={disconnectMetamask} className="flex flex-row gap-10 items-center px-10 py-5 hover:bg-menuBg hover:text-white cursor-pointer">
                <Logout fontSize="small" />
                <div className="text-15 font-semibold">Disconnect</div>
              </div>
            </div>
          </Menu>
        </Stack>
      </div>
    </Toolbar>
  )
}

const UserAvatar = styled(HeaderButton)({
  minWidth: 'unset',
  padding: '5px 15px',
})

export { Header }