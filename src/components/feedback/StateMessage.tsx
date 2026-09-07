// src/components/feedback/StateMessage.tsx
import { Box, Button, CircularProgress, Typography } from '@mui/material';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <Box className="flex flex-col items-center gap-3 py-12" role="status" aria-live="polite">
      <CircularProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <Box className="flex flex-col items-center gap-2 py-12 text-center">
      <Typography variant="h6">{title}</Typography>
      {description && <Typography color="text.secondary">{description}</Typography>}
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
    <Box className="flex flex-col items-center gap-3 py-12 text-center" role="alert">
      <Typography variant="h6" color="error">
        {title}
      </Typography>
      {description && <Typography color="text.secondary">{description}</Typography>}
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
}
