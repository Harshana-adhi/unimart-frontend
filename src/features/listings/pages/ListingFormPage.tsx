// src/features/listings/pages/ListingFormPage.tsx
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Paper, Snackbar, Typography } from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import { useCreateListingMutation, useGetListingQuery, useUpdateListingMutation } from '../listingsApi';
import { ListingForm } from '../components/ListingForm';
import { ErrorState, LoadingState } from '../../../components/feedback/StateMessage';
import { getErrorMessage, getFieldErrors } from '../../../utils/apiError';
import type { ListingInput } from '../listingTypes';

function ListingFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const listingId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { data: listing, isLoading: listingLoading } = useGetListingQuery(listingId ?? 0, { skip: !isEdit });
  const [createListing] = useCreateListingMutation();
  const [updateListing] = useUpdateListingMutation();

  if (isEdit && listingLoading) return <LoadingState label="Loading listing…" />;

  const handleSubmit = async (values: ListingInput) => {
    setServerError(null);
    try {
      if (isEdit && listingId) {
        await updateListing({ id: listingId, body: values }).unwrap();
        setSnackbarOpen(true);
        navigate(`/listings/${listingId}`);
      } else {
        const created = await createListing(values).unwrap();
        navigate(`/listings/${created.id}`);
      }
    } catch (err) {
      const fieldErrors = getFieldErrors(err as never);
      setServerError(
        Object.keys(fieldErrors).length > 0
          ? Object.entries(fieldErrors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(' · ')
          : getErrorMessage(err as never),
      );
    }
  };

  return (
    <Box className="mx-auto grid max-w-2xl gap-4">
      <Button
        component={RouterLink}
        to={isEdit && listingId ? `/listings/${listingId}` : '/'}
        startIcon={<ArrowBackOutlined />}
        size="small"
        className="w-fit"
        sx={{ color: 'text.secondary' }}
      >
        {isEdit ? 'Back to listing' : 'Back to listings'}
      </Button>
      <Paper elevation={1} className="grid gap-5 p-6 sm:p-8">
        <Box>
          <Typography variant="h4" component="h1" className="!font-bold">
            {isEdit ? 'Edit listing' : 'Create a listing'}
          </Typography>
          <Typography color="text.secondary">
            {isEdit ? 'Update the details buyers will see.' : 'Fill in the details and publish it to the marketplace.'}
          </Typography>
        </Box>
        {serverError && <ErrorState description={serverError} />}
        <ListingForm
          initial={
            listing
              ? {
                  title: listing.title,
                  description: listing.description,
                  price: listing.price,
                  categoryId: listing.categoryId,
                }
              : undefined
          }
          submitLabel={isEdit ? 'Save changes' : 'Publish listing'}
          onSubmit={handleSubmit}
        />
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" variant="filled">
          Listing saved.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export { ListingFormPage as Component };
