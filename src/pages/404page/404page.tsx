import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from '@mui/material';

import { ActionButton2 } from "components/buttons";
import { Layouts } from "components/layouts/layouts";

const NotFoundPage = () => {
  return (
    <Layouts>
      <Box className="flex-1 flex flex-col justify-center items-center">
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

export { NotFoundPage }