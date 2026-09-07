// src/components/feedback/StateMessage.tsx
import type { ReactNode } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import SentimentDissatisfiedOutlined from '@mui/icons-material/SentimentDissatisfiedOutlined';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <Box className="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
      <CircularProgress size={36} thickness={4} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Box className="flex flex-col items-center gap-3 py-16 text-center">
      <Box
        className="flex h-16 w-16 items-center justify-center rounded-full"
        sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}
      >
        {icon ?? <SentimentDissatisfiedOutlined fontSize="large" />}
      </Box>
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography color="text.secondary" className="max-w-sm">
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Box className="flex flex-col items-center gap-3 py-16 text-center" role="alert">
      <Box
        className="flex h-16 w-16 items-center justify-center rounded-full"
        sx={{ bgcolor: 'error.main', color: 'error.contrastText', opacity: 0.9 }}
      >
        <ErrorOutlineOutlined fontSize="large" />
      </Box>
      <Typography variant="h6" color="error.main">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" className="max-w-sm">
          {description}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" onClick={onRetry} startIcon={<RefreshOutlined />}>
          Retry
        </Button>
      )}
    </Box>
  );
}
