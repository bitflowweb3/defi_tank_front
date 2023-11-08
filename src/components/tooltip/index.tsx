import React from "react";
import { useState } from "react";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

interface CustomTooltipProps {
  title: any
  children: any
  [key: string]: any
}

const CustomTooltip = ({ title, children, ...props }: CustomTooltipProps) => {
  const [open, setOpen] = useState(false);
  const onTooltipOpen = () => { setOpen(true) };
  const onTooltipClose = () => { setOpen(false) };

  return (
    <HtmlTooltip arrow placement="top-start"
      title={title} open={open}
      onClose={onTooltipClose}
      onOpen={onTooltipOpen}
    >
      <Stack onClick={onTooltipOpen} {...props}>
        {children}
      </Stack>
    </HtmlTooltip>
  )
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& :first-letter": {
    textTransform: "uppercase",
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: "#060200e3",
  },

  [`& .${tooltipClasses.tooltip}`]: {
    color: "#ccad45",
    backgroundColor: "#060200e3",
    padding: "15px 20px",
  }
})

export { CustomTooltip };