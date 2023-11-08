import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';

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
    href: "/play-game",
    title: "Play Game",
    icon: <SportsEsportsOutlinedIcon className="text-30" />,
  }, {
    href: "/create-nfts",
    title: "Shop",
    icon: <PhotoOutlinedIcon className="text-30" />,
  }, {
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

export { MenuList, drawerWidth } 