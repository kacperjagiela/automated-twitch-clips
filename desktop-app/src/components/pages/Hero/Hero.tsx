import { Box, Stack, Typography } from "@mui/material";
import * as React from "react";
import { Link } from "react-router-dom";

import { Urls } from "../../../enums";

export const Hero: React.FC = () => (
  <Box>
    <Typography variant="h2" color="text.main">
      Automated clips bot
    </Typography>
    <Stack spacing={1}>
      <Link to={Urls.Twitch}>Go to Twitch Panel</Link>
      <Link to={Urls.Youtube}>Go to Youtube Panel</Link>
    </Stack>
  </Box>
);
