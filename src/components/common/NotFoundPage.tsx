// src/components/common/NotFoundPage.tsx
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Box className="flex flex-col items-center gap-4 py-24 text-center">
      <Typography variant="h3">404</Typography>
      <Typography color="text.secondary">This page doesn't exist.</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back to listings
      </Button>
    </Box>
  );
}

export { NotFoundPage as Component };
