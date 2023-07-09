import { styled } from '@mui/material';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

const blue = {
  50: '#ffffffd1',
  100: '#ffffff9e',
  500: '#00000075',
};

const Tab = styled(TabUnstyled)`
  width: 100%;
  padding: 15px 10px;
  color: ${blue[100]};
  
  display: flex;
  justify-content: center;
  border-radius: 8px;
  border: none;

  font-size: 12px;
  font-weight: 600;
  font-family: Inter, sans-serif;
  
  &.${tabUnstyledClasses.selected} {
    background-color: ${blue[50]};
    color: #000000;
  }
  &.${buttonUnstyledClasses.disabled} {
    cursor: not-allowed;
  }
`

const TabPanel = styled(TabPanelUnstyled)`
  font-family: Inter, sans-serif;
`

const TabsList = styled(TabsListUnstyled)`
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;

  padding:5px;
  min-width: 320px;
  border-radius: 8px;
  // margin-bottom: 16px;
  background-color: ${blue[500]};
`

export { Tab, TabPanel, TabsList }