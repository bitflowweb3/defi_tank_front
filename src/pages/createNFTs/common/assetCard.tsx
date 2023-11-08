import React from "react";
import { styled } from '@mui/material/styles';
import { Stack, Card, Typography, Box } from "@mui/material";
import { CardContent, CardActions } from "@mui/material";
import goldAssets from "assets/image/gold.png";

import { ActionButton1 } from "components/buttons";
import { useGlobalContext } from "provider";
import { toLanguageFormat } from "utils/util";

interface AssetCardProps {
  image: any
  name: string
  rate: number
  onClick: any
}

const AssetCard = (props: AssetCardProps) => {
  const { image, name, rate, onClick } = props;
  const [state] = useGlobalContext();

  return (
    <CardContainer>
      <CardContent>
        <Stack direction="row" gap={3} className="justify-between">
          <img alt="" src={image}
            className="w-100 rounded-8 bg-white p-20"
          />

          <Stack direction="column" gap={1}>
            <Stack direction="row" className="gap-5 items-center">
              <Typography variant="h6">{name}</Typography>
            </Stack>

            <Stack direction="row" className='gap-5 items-center'>
              <Typography variant="body1">Price:</Typography>
              <Typography variant="body2">{toLanguageFormat(rate)}</Typography>
              <img alt="" src={goldAssets} className="w-20" />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <CardContent>
        {name === "Gold" && (
          <Typography variant="body2" className="text-justify">
            Engage in battles, defeat enemies, and watch your tank's experience grow.
            As your tank gets stronger, so does your reputation, earning you precious Gold as a reward for your victories.
            Use this Gold to upgrade your profile, enhance your tank's level, boost your guild's prestige, and even purchase potent potions for battles. Plus, you can now transfer Gold to other players for an even more dynamic gaming experience.
          </Typography>
        )}

        {name === "Potion" && (
          <Typography variant="body2" className="text-justify">
            Your secret weapon for unstoppable tank action! These magical brews are your guild's gift to you, earned through shared victories in DefitankLand. When battles drain your tank's energy, sip from an Energy Potion to recharge and jump back into the action. And guess what? You can spread the energy love by sharing these potions with your guild members. Team up, recharge, and conquer together!
          </Typography>
        )}
      </CardContent>

      <Box flex={1} />

      {state.walletStatus === 2 && (
        <CardActions className='flex justify-end'>
          <ActionButton1 onClick={onClick}>
            Buy
          </ActionButton1>
        </CardActions>
      )}
    </CardContainer>
  )
}

const CardContainer = styled(Card)(({
  borderWidth: '3px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: "1.5rem 1rem 1rem",
  backgroundColor: '#0a0300fc',
  borderImage: 'linear-gradient(to top, #6c3200, #ff570000) 1',

  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}))

export { AssetCard }