// src/features/listings/pages/ListingDetailsPage.tsx
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Chip, Divider, List, ListItem, ListItemText, Rating, Typography } from '@mui/material';
import { useGetListingQuery } from '../listingsApi';
import { useGetListingReviewsQuery } from '../../reviews/reviewsApi';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateMessage';
import { getErrorMessage, getErrorStatus } from '../../../utils/apiError';
import { useAppSelector } from '../../../app/hooks';

function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = Number(id);
  const user = useAppSelector((s) => s.auth.user);

  const { data: listing, isLoading, isError, error, refetch } = useGetListingQuery(listingId);
  const { data: reviews } = useGetListingReviewsQuery({ listingId }, { skip: !listing });

  if (isLoading) return <LoadingState label="Loading listing…" />;

  if (isError) {
    if (getErrorStatus(error) === 404) {
      return <EmptyState title="Listing not found" description="It may have been archived or never existed." />;
    }
    return <ErrorState description={getErrorMessage(error)} onRetry={refetch} />;
  }

  if (!listing) return null;

  const isOwner = user?.id === listing.sellerId;

  return (
    <Box className="grid gap-6">
      <Box className="flex items-start justify-between gap-4">
        <Box>
          <Typography variant="h4" component="h1">
            {listing.title}
          </Typography>
          <Typography color="text.secondary">
            {listing.categoryName} · sold by {listing.sellerName}
          </Typography>
        </Box>
        <Chip label={listing.status} />
      </Box>

      <Typography variant="h5">
        LKR {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
      </Typography>

      <Typography>{listing.description}</Typography>

      {isOwner && (
        <Box className="flex gap-2">
          <Button component={RouterLink} to={`/listings/${listing.id}/edit`} variant="outlined">
            Edit listing
          </Button>
        </Box>
      )}

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Reviews
        </Typography>
        {reviews && reviews.content.length === 0 && (
          <EmptyState title="No reviews yet" description="Reviews appear here after a completed order." />
        )}
        {reviews && reviews.content.length > 0 && (
          <List>
            {reviews.content.map((review) => (
              <ListItem key={review.id} alignItems="flex-start" divider>
                <ListItemText
                  primary={<Rating value={review.rating} readOnly size="small" />}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {review.reviewerName}
                      </Typography>
                      {review.comment && <Typography variant="body2">{review.comment}</Typography>}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}

export { ListingDetailsPage as Component };
