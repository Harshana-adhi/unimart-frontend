// src/features/listings/components/ListingCard.tsx
import { Box, Card, CardActionArea, Chip, Typography } from '@mui/material';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import { Link } from 'react-router-dom';
import type { Listing } from '../listingTypes';
import { getCategoryGradient, getCategoryIcon, getStatusChipProps, STATUS_LABEL } from '../../../utils/listingDisplay';

export function ListingCard({ listing }: { listing: Listing }) {
  const categoryIcon = getCategoryIcon(listing.categoryName, { sx: { fontSize: 44, opacity: 0.9 } });
  const gradient = getCategoryGradient(listing.categoryName);
  const statusChip = getStatusChipProps(listing.status);

  return (
    <Card className="group flex h-full flex-col overflow-hidden" elevation={1}>
      <CardActionArea
        component={Link}
        to={`/listings/${listing.id}`}
        className="flex h-full flex-col items-stretch"
        sx={{ '&:hover': { '& .listing-cta': { color: 'primary.main' } } }}
      >
        <Box
          className="relative flex h-28 items-center justify-center text-white"
          sx={{ background: gradient }}
        >
          {categoryIcon}
          <Chip
            size="small"
            label={STATUS_LABEL[listing.status]}
            color={statusChip.color}
            variant={statusChip.variant}
            className="!absolute right-2 top-2"
            sx={statusChip.variant === 'outlined' ? { bgcolor: 'rgba(255,255,255,0.9)' } : undefined}
          />
        </Box>

        <Box className="flex flex-grow flex-col gap-2 p-4">
          <Typography variant="subtitle1" component="h2" className="!font-semibold" noWrap>
            {listing.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {listing.categoryName}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="line-clamp-3 flex-grow">
            {listing.description}
          </Typography>
          <Box className="mt-1 flex items-center justify-between">
            <Typography variant="h6" color="primary.main" className="!font-bold">
              Rs. {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </Typography>
            <Box
              className="listing-cta flex items-center gap-1 text-sm font-semibold"
              sx={{ color: 'text.secondary' }}
            >
              View
              <ArrowForwardOutlined fontSize="small" />
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
