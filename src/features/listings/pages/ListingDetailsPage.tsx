// src/features/listings/pages/ListingDetailsPage.tsx
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined';
import { useGetListingQuery } from '../listingsApi';
import { useGetListingReviewsQuery } from '../../reviews/reviewsApi';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateMessage';
import { getErrorMessage, getErrorStatus } from '../../../utils/apiError';
import { useAppSelector } from '../../../app/hooks';
import { getCategoryGradient, getCategoryIcon, getStatusChipProps, STATUS_LABEL } from '../../../utils/listingDisplay';

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
  const categoryIcon = getCategoryIcon(listing.categoryName, { sx: { fontSize: 64, opacity: 0.9 } });
  const gradient = getCategoryGradient(listing.categoryName);
  const statusChip = getStatusChipProps(listing.status);

  return (
    <Box className="grid gap-4">
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackOutlined />}
        size="small"
        className="w-fit"
        sx={{ color: 'text.secondary' }}
      >
        Back to listings
      </Button>

      <Box className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <Box className="grid gap-6">
          <Card elevation={1} className="overflow-hidden">
            <Box
              className="flex h-40 items-center justify-center text-white sm:h-48"
              sx={{ background: gradient }}
            >
              {categoryIcon}
            </Box>
            <CardContent className="grid gap-3 p-6">
              <Box className="flex flex-wrap items-start justify-between gap-3">
                <Box>
                  <Typography variant="h4" component="h1" className="!font-bold">
                    {listing.title}
                  </Typography>
                  <Typography color="text.secondary">{listing.categoryName}</Typography>
                </Box>
                <Chip
                  label={STATUS_LABEL[listing.status]}
                  color={statusChip.color}
                  variant={statusChip.variant}
                />
              </Box>
              <Divider />
              <Typography className="whitespace-pre-wrap">{listing.description}</Typography>
            </CardContent>
          </Card>

          <Card elevation={1}>
            <CardContent className="p-6">
              <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                <RateReviewOutlined color="action" fontSize="small" />
                Reviews
              </Typography>
              {reviews && reviews.content.length === 0 && (
                <EmptyState title="No reviews yet" description="Reviews appear here after a completed order." />
              )}
              {reviews && reviews.content.length > 0 && (
                <List disablePadding>
                  {reviews.content.map((review) => (
                    <ListItem key={review.id} alignItems="flex-start" divider disableGutters>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main', fontSize: 14, fontWeight: 700 }}>
                          {review.reviewerName.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box className="flex items-center gap-2">
                            <Typography component="span" variant="subtitle2">
                              {review.reviewerName}
                            </Typography>
                            <Rating value={review.rating} readOnly size="small" />
                          </Box>
                        }
                        secondary={review.comment ?? undefined}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        <Paper elevation={1} className="grid gap-4 p-6 lg:sticky lg:top-24">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h4" color="primary.main" className="!font-bold">
              Rs. {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Divider />
          <Box className="flex items-center gap-3">
            <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
              {listing.sellerName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{listing.sellerName}</Typography>
              <Typography variant="caption" color="text.secondary">
                Seller
              </Typography>
            </Box>
          </Box>
          {isOwner && (
            <Button
              component={RouterLink}
              to={`/listings/${listing.id}/edit`}
              variant="outlined"
              startIcon={<EditOutlined />}
              fullWidth
            >
              Edit listing
            </Button>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export { ListingDetailsPage as Component };
