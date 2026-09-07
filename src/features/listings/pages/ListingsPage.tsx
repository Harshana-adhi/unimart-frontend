// src/features/listings/pages/ListingsPage.tsx
import { useState } from 'react';
import { Box, Grid, MenuItem, Pagination, TextField } from '@mui/material';
import { useGetCategoriesQuery, useGetListingsQuery } from '../listingsApi';
import { ListingCard } from '../components/ListingCard';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateMessage';
import { getErrorMessage } from '../../../utils/apiError';
import type { ListingStatus } from '../listingTypes';

function ListingsPage() {
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [status, setStatus] = useState<ListingStatus | ''>('');
  const [page, setPage] = useState(0);

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, isError, error, refetch } = useGetListingsQuery({
    q: q || undefined,
    categoryId: categoryId || undefined,
    status: status || undefined,
    page,
    size: 12,
  });

  return (
    <Box className="grid gap-6">
      <Box className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        <TextField
          select
          label="Category"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value ? Number(e.target.value) : '');
            setPage(0);
          }}
        >
          <MenuItem value="">All categories</MenuItem>
          {categories?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ListingStatus | '');
            setPage(0);
          }}
        >
          <MenuItem value="">Any status</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="RESERVED">Reserved</MenuItem>
          <MenuItem value="SOLD">Sold</MenuItem>
        </TextField>
      </Box>

      {isLoading && <LoadingState label="Loading listings…" />}

      {isError && <ErrorState description={getErrorMessage(error)} onRetry={refetch} />}

      {!isLoading && !isError && data && data.content.length === 0 && (
        <EmptyState title="No listings match your search" description="Try clearing filters or check back later." />
      )}

      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ opacity: isFetching ? 0.6 : 1 }}>
            {data.content.map((listing) => (
              <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
          {data.totalPages > 1 && (
            <Pagination
              count={data.totalPages}
              page={page + 1}
              onChange={(_e, value) => setPage(value - 1)}
              className="mx-auto"
            />
          )}
        </>
      )}
    </Box>
  );
}

export { ListingsPage as Component };
