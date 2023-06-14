import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from '@mui/material';

import { ActionButton2 } from "components/buttons";
import { Layouts } from "components/layouts/layouts";


export const NotFoundPage = () => {
  return (
    <Layouts>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 160px)'
      }}>
        <Typography variant="h1" style={{ color: 'white' }}>
          404
        </Typography>

        <Typography variant="h6" sx={{ color: 'white', mb: "20px" }}>
          The page you're looking for doesn't exist.
        </Typography>

        <Link to="/" style={{ textDecoration: "none" }}>
          <ActionButton2 variant="contained">
            Back Home
          </ActionButton2>
        </Link>
      </Box>
    </Layouts>
  )
}