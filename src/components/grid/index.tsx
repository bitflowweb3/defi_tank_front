import React from "react";
import { Grid } from '@mui/material';
import { styled } from "@mui/material/styles";

const GridItem = styled((props: any) => (
  <Grid item xs={12} md={6} lg={4} xl={3} sx={{ display: "flex" }} {...props} />
))(({ theme }) => ({}))

export { GridItem }