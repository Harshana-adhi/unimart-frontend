// src/components/common/NotFoundPage.tsx
import { Box, Button, Typography } from '@mui/material';
import ExploreOffOutlined from '@mui/icons-material/ExploreOffOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import { Link as RouterLink } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Box className="flex flex-col items-center gap-4 py-24 text-center">
      <Box
        className="flex h-20 w-20 items-center justify-center rounded-full"
        sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}
      >
        <ExploreOffOutlined fontSize="large" />
      </Box>
      <Typography variant="h3" className="!font-bold">
        404
      </Typography>
      <Typography color="text.secondary">This page doesn't exist.</Typography>
      <Button component={RouterLink} to="/" variant="contained" startIcon={<HomeOutlined />}>
        Back to listings
      </Button>
    </Box>
  );
}

export { NotFoundPage as Component };
