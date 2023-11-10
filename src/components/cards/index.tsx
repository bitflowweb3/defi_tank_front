import { Card } from "@mui/material"
import { styled } from '@mui/material/styles';

const CardContainer = styled(Card)(({
  maxWidth: "300px",
  margin: "0",
  padding: "0 0 ",
  borderRadius: '10px',
  backgroundColor: 'rgba(36, 36, 36, 1)',
  background: 'rgba(36, 36, 36, 1)',
  boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.1)',
  // borderWidth: '3px',
  // borderStyle: 'solid',
  // borderImage: 'linear-gradient(to top, #6c3200, #ff570000) 1',

  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}))

export { CardContainer }