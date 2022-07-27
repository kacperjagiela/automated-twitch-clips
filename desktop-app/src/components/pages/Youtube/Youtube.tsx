import { Box, Stack, Typography } from "@mui/material";
import * as React from "react";
import { Link } from "react-router-dom";

import { Urls } from "../../../enums";

export const Youtube: React.FC = () => (
  <Box>
    <Typography variant="h2" color="text.primary">
      Grettings from Youtube
    </Typography>
    <Stack spacing={1}>
      <Link to={Urls.Twitch}>Go to Twitch Panel</Link>
      <Link to={Urls.Index}>Go back</Link>
    </Stack>
  </Box>
);
