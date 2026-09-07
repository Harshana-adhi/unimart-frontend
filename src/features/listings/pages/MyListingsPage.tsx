// src/features/listings/pages/MyListingsPage.tsx
import { Box, Button, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { useArchiveListingMutation, useGetListingsQuery } from '../listingsApi';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateMessage';
import { getErrorMessage } from '../../../utils/apiError';
import { useAppSelector } from '../../../app/hooks';
import { getCategoryGradient, getCategoryIcon, getStatusChipProps, STATUS_LABEL } from '../../../utils/listingDisplay';

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
    return (
      <EmptyState
        icon={<Inventory2Outlined fontSize="large" />}
        title="You haven't posted any listings yet"
        description="Create one to start selling to fellow students."
        action={
          <Button component={RouterLink} to="/listings/new" variant="contained" startIcon={<AddCircleOutlined />}>
            New listing
          </Button>
        }
      />
    );
  }

  return (
    <Box className="grid gap-6">
      <Box className="flex flex-wrap items-center justify-between gap-3">
        <Typography variant="h4" component="h1" className="!font-bold">
          My listings
        </Typography>
        <Button component={RouterLink} to="/listings/new" variant="contained" startIcon={<AddCircleOutlined />}>
          New listing
        </Button>
      </Box>

      <Box className="grid gap-3">
        {data.content.map((listing) => {
          const categoryIcon = getCategoryIcon(listing.categoryName, { fontSize: 'small' });
          const gradient = getCategoryGradient(listing.categoryName);
          const statusChip = getStatusChipProps(listing.status);
          return (
            <Paper
              key={listing.id}
              elevation={1}
              className="flex flex-wrap items-center gap-4 p-4 transition-shadow hover:shadow-md"
            >
              <Box
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white"
                sx={{ background: gradient }}
              >
                {categoryIcon}
              </Box>
              <Box className="min-w-[10rem] flex-1">
                <Typography variant="subtitle1" className="!font-semibold" noWrap>
                  {listing.title}
                </Typography>
                <Box className="mt-1 flex items-center gap-2">
                  <Chip size="small" label={STATUS_LABEL[listing.status]} color={statusChip.color} variant={statusChip.variant} />
                  <Typography variant="body2" color="text.secondary">
                    Rs. {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Box>
              <Box className="flex items-center gap-1">
                <Tooltip title="View">
                  <IconButton component={RouterLink} to={`/listings/${listing.id}`} size="small">
                    <VisibilityOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                {listing.status !== 'ARCHIVED' && (
                  <>
                    <Tooltip title="Edit">
                      <IconButton component={RouterLink} to={`/listings/${listing.id}/edit`} size="small">
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={listing.status === 'SOLD' ? 'Sold listings cannot be archived' : 'Archive'}>
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={listing.status === 'SOLD'}
                          onClick={() => archiveListing(listing.id)}
                        >
                          <ArchiveOutlined fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

export { MyListingsPage as Component };
