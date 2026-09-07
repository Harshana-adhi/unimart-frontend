// src/features/reviews/pages/ReviewFormPage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import { useCreateReviewMutation } from '../reviewsApi';
import { ReviewForm, type ReviewFormValues } from '../components/ReviewForm';
import { ErrorState } from '../../../components/feedback/StateMessage';
import { getErrorMessage } from '../../../utils/apiError';

function ReviewFormPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [createReview] = useCreateReviewMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (values: ReviewFormValues) => {
    setServerError(null);
    try {
      await createReview({
        orderId: Number(orderId),
        rating: values.rating,
        comment: values.comment,
      }).unwrap();
      setSnackbarOpen(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setServerError(getErrorMessage(err as never));
    }
  };

  return (
    <Box className="grid gap-4">
      <Typography variant="h4" component="h1">
        Review your order
      </Typography>
      <Typography color="text.secondary">Order #{orderId}</Typography>
      {serverError && <ErrorState description={serverError} />}
      <ReviewForm onSubmit={handleSubmit} />
      <Snackbar open={snackbarOpen} autoHideDuration={2000}>
        <Alert severity="success">Thanks for your review!</Alert>
      </Snackbar>
    </Box>
  );
}

export { ReviewFormPage as Component };
