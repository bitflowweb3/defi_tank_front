import React from "react";
import { Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GlobalSpacing } from "components/layouts/layouts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
  style?: any;
  className?: string
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, className, ...other } = props

  return (
    <GlobalSpacing className={`flex-1 ${value === index ? 'flex' : 'hidden'} flex-col `} {...other}>
      {children}
    </GlobalSpacing>
  )
}

const TapHeader = styled(Tab)({
  borderRadius: '50px',
  margin: '0 2px',
  backgroundColor: 'rgba(36, 36, 36, 1)',  
  color: 'rgba(255, 255, 255, 0.35)',
  '&:hover': {
    backgroundColor: "rgba(66, 66, 66, 0.9)",
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '&.Mui-selected': {
    backgroundColor: "rgba(66, 66, 66, 1)",
    color: 'rgba(255, 255, 255, 1)',
  }
})

export { CustomTabPanel, TapHeader }