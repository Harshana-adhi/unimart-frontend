// src/features/reviews/pages/ReviewFormPage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Chip, Paper, Snackbar, Typography } from '@mui/material';
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined';
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
    <Box className="mx-auto grid max-w-xl gap-4">
      <Paper elevation={1} className="grid gap-5 p-6 sm:p-8">
        <Box className="flex items-center gap-3">
          <Box
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
            sx={{ background: 'linear-gradient(135deg, #2451b5 0%, #0ea5a3 100%)' }}
          >
            <RateReviewOutlined />
          </Box>
          <Box>
            <Typography variant="h5" component="h1" className="!font-bold">
              Review your order
            </Typography>
            <Chip label={`Order #${orderId}`} size="small" variant="outlined" />
          </Box>
        </Box>
        {serverError && <ErrorState description={serverError} />}
        <ReviewForm onSubmit={handleSubmit} />
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={2000}>
        <Alert severity="success" variant="filled">
          Thanks for your review!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export { ReviewFormPage as Component };
