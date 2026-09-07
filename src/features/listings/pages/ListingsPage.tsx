// src/features/listings/pages/ListingsPage.tsx
import { useState } from 'react';
import { Box, Grid, InputAdornment, MenuItem, Pagination, Paper, TextField, Typography } from '@mui/material';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
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

  const hasFilters = q !== '' || categoryId !== '' || status !== '';
  const clearFilters = () => {
    setQ('');
    setCategoryId('');
    setStatus('');
    setPage(0);
  };

  return (
    <Box className="grid gap-8">
      <Box
        className="rounded-2xl px-6 py-10 text-white sm:px-10 sm:py-14"
        sx={{ background: 'linear-gradient(135deg, #2451b5 0%, #173a8a 55%, #0ea5a3 130%)' }}
      >
        <Typography variant="h4" component="h1" className="!font-bold">
          Find what you need on campus
        </Typography>
        <Typography variant="body1" className="mt-2 max-w-xl opacity-90">
          Buy and sell textbooks, electronics, furniture and more with fellow students — quickly, safely,
          and without leaving your dorm.
        </Typography>
      </Box>

      <Paper elevation={1} className="grid gap-4 p-4 sm:grid-cols-[2fr_1fr_1fr] sm:p-5">
        <TextField
          label="Search listings"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
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
      </Paper>

      {isLoading && <LoadingState label="Loading listings…" />}

      {isError && <ErrorState description={getErrorMessage(error)} onRetry={refetch} />}

      {!isLoading && !isError && data && data.content.length === 0 && (
        <EmptyState
          icon={<SearchOffOutlined fontSize="large" />}
          title="No listings match your search"
          description={
            hasFilters ? 'Try clearing your filters or searching for something else.' : 'Check back soon — new listings are added often.'
          }
          action={
            hasFilters ? (
              <Box
                component="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm font-semibold"
                sx={{ color: 'primary.main', cursor: 'pointer' }}
              >
                <TuneOutlined fontSize="small" />
                Clear filters
              </Box>
            ) : undefined
          }
        />
      )}

      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 150ms ease' }}>
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
              shape="rounded"
              color="primary"
            />
          )}
        </>
      )}
    </Box>
  );
}

export { ListingsPage as Component };
