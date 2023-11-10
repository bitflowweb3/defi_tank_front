import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import HomeIcon from '@mui/icons-material/Home';

import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';

const Stakingicon = ({ className }) => {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.398 5.25h7.204c1.163-1.57-.404-3.768-2.349-3.14l-.928.3a1.06 1.06 0 0 1-.65 0l-.928-.3c-1.945-.628-3.511 1.57-2.349 3.14Zm7.096 1.5H8.506a5.996 5.996 0 0 0-2.822 3.46l-1.25 4C3.227 18.074 6.114 22 10.161 22h.966a3.484 3.484 0 0 1-.627-2c0-.744.232-1.433.627-2A3.5 3.5 0 0 1 14 12.5h5.031l-.715-2.29a5.997 5.997 0 0 0-2.822-3.46ZM14 14a2 2 0 1 0 0 4 2 2 0 1 0 0 4h6a2 2 0 0 0 0-4 2 2 0 0 0 0-4h-6Z" fill="currentColor" />
    </svg>
  )
}

const drawerWidth = 300

const MenuList = [
  {
    href: "/",
    title: "Home",
    icon: <HomeIcon className="text-30" />,
  }, 
  {
    href: "/play-game",
    title: "Play Game",
    icon: <SportsEsportsOutlinedIcon className="text-30" />,
  }, 
  {
    href: "/create-nfts",
    title: "Shop",
    icon: <ShoppingCartIcon className="text-30" />,
  }, 
  {
    href: "/lending",
    title: "Lending",
    icon: <CurrencyExchangeOutlinedIcon className="text-25 mr-5" />,
  }, {
    href: "/guilds",
    title: "Guilds",
    icon: <Diversity3OutlinedIcon className="text-25 mr-5" />,
  }, {
    href: "/pools",
    title: "Staking",
    icon: <Stakingicon className="w-30 h-30" />,
  }, {
    href: "/ranking",
    title: "Ranking",
    icon: <EmojiEventsOutlinedIcon className="text-30" />,
  },
]

const SocialMenus = [
  {
    href: "https://twitter.com",
    icon: <TwitterIcon className="text-30" />
  }, 
  {
    href: "https://discord.com",
    icon:  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="auto" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"></path></svg>
  }, 
  {
    href: "https://t.me/",
    icon: <TelegramIcon className="text-30" />
  }, 
  {
    href: "https://medium.com",
    icon: <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M834.7 279.8l61.3-58.9V208H683.7L532.4 586.4 360.3 208H137.7v12.9l71.6 86.6c7 6.4 10.6 15.8 9.7 25.2V673c2.2 12.3-1.7 24.8-10.3 33.7L128 805v12.7h228.6v-12.9l-80.6-98a39.99 39.99 0 0 1-11.1-33.7V378.7l200.7 439.2h23.3l172.6-439.2v349.9c0 9.2 0 11.1-6 17.2l-62.1 60.3V819h301.2v-12.9l-59.9-58.9c-5.2-4-7.9-10.7-6.8-17.2V297a18.1 18.1 0 0 1 6.8-17.2z"></path></svg>
  }, {
    href: "https://github.com",
    icon: <GitHubIcon className="text-30" />
  }
]

export { MenuList, drawerWidth, SocialMenus } 