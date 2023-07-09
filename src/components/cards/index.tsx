import { Card } from "@mui/material"
import { styled } from '@mui/material/styles';

export const CardContainer = styled(Card)(({
  maxWidth: "250px",
  margin: "auto",
  padding: "1.5rem 1rem 1rem",
  borderRadius: '5px',
  backgroundColor: '#0a0300fc',
  borderWidth: '3px',
  borderStyle: 'solid',
  borderImage: 'linear-gradient(to top, #6c3200, #ff570000) 1',

  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}))