import React from 'react';
import Typography from '@mui/material/Typography';
import { Container, Stack } from '@mui/system';

export default function SendMail() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Skicka Mail ✉️
        </Typography>
      </Stack>
    </Container>
  );
}
