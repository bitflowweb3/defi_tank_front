import React from "react";
import { styled } from '@mui/material/styles';
import { Stack, Typography } from "@mui/material";
import { CustomTooltip } from "components/tooltip";

interface SellitemProps {
  spell: SpellObject
}

const SpellItemCard = ({ spell }: SellitemProps) => {
  return (
    <CustomTooltip title={<ToolTipContent spell={spell} />}>
      <SpellItemWrapper gap={0.5}>
        <img alt="" src={spell.image} />
        <Typography variant="body2">{spell.name}</Typography>
      </SpellItemWrapper>
    </CustomTooltip>
  )
}

const ToolTipContent = ({ spell }: SellitemProps) => {
  return (
    <Stack className="w-200 flex flex-col gap-5">
      <Stack direction="row" className="justify-between items-center">
        <Typography variant="body1">
          {spell.name}
        </Typography>

        <Typography variant="body2">
          {`${spell.params} ${spell.stat}`}
        </Typography>
      </Stack>

      <Typography color="inherit" variant="caption">
       {spell.discription}
      </Typography>
    </Stack>
  )
}

const SpellItemWrapper = styled(Stack)({
  display: "flex",
  flexDirection: "column",
  justifyContent: 'center',
  alignItems: "center",
  textAlign: "center",

  'img': {
    maxWidth: 90,
    borderRadius: 10,
    aspectRatio: 5 / 4,
  }
})

export { SpellItemCard };