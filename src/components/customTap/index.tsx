import React from "react";
import { Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GlobalSpacing } from "components/layouts/layouts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <GlobalSpacing className={`flex-1 ${value === index ? 'flex' : 'hidden'} flex-col`} {...other}>
      {children}
    </GlobalSpacing>
  )
}

const TapHeader = styled(Tab)({
  '&.Mui-selected': {
    backgroundColor: "#00000075",
  }
})

export { CustomTabPanel, TapHeader }