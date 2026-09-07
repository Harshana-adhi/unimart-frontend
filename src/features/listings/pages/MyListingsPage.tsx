// src/features/listings/pages/MyListingsPage.tsx
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useArchiveListingMutation, useGetListingsQuery } from '../listingsApi';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateMessage';
import { getErrorMessage } from '../../../utils/apiError';
import { useAppSelector } from '../../../app/hooks';

function MyListingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading, isError, error, refetch } = useGetListingsQuery(
    { sellerId: user?.id, page: 0, size: 50 },
    { skip: !user },
  );
  const [archiveListing] = useArchiveListingMutation();

  if (isLoading) return <LoadingState label="Loading your listings…" />;
  if (isError) return <ErrorState description={getErrorMessage(error)} onRetry={refetch} />;
  if (!data || data.content.length === 0) {
    return <EmptyState title="You haven't posted any listings yet" description="Create one to get started." />;
  }

  return (
    <Box className="grid gap-4">
      <Typography variant="h4" component="h1">
        My listings
      </Typography>
      {data.content.map((listing) => (
        <Box
          key={listing.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
        >
          <Box>
            <Typography variant="subtitle1">{listing.title}</Typography>
            <Chip size="small" label={listing.status} className="mt-1" />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to={`/listings/${listing.id}`} size="small">
              View
            </Button>
            {listing.status !== 'ARCHIVED' && (
              <>
                <Button component={RouterLink} to={`/listings/${listing.id}/edit`} size="small">
                  Edit
                </Button>
                <Button
                  color="error"
                  size="small"
                  disabled={listing.status === 'SOLD'}
                  onClick={() => archiveListing(listing.id)}
                >
                  Archive
                </Button>
              </>
            )}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

export { MyListingsPage as Component };
