// src/features/reviews/components/ReviewForm.tsx
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Rating, TextField, Typography } from '@mui/material';
import SendOutlined from '@mui/icons-material/SendOutlined';

// rating comes from MUI's Rating component via Controller, which already
// emits a real number — no z.coerce needed (and z.coerce.number() here
// would hit the same input/output generic mismatch noted in ListingForm).
const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Choose a rating').max(5),
  comment: z.string().trim().max(1000, 'Max 1000 characters').optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface Props {
  initial?: Partial<ReviewFormValues>;
  submitLabel?: string;
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
}

export function ReviewForm({ initial, submitLabel = 'Submit review', onSubmit }: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: initial?.rating ?? 0, comment: initial?.comment ?? '' },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <Box className="rounded-xl p-4" sx={{ bgcolor: 'action.hover' }}>
        <Typography component="label" htmlFor="review-rating" variant="subtitle2" gutterBottom sx={{ display: 'block' }}>
          How was your experience?
        </Typography>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <Rating
              id="review-rating"
              size="large"
              value={field.value}
              onChange={(_event, value) => field.onChange(value ?? 0)}
              aria-label="Review rating"
            />
          )}
        />
        {errors.rating && (
          <Typography color="error" variant="caption" sx={{ display: 'block' }}>
            {errors.rating.message}
          </Typography>
        )}
      </Box>
      <TextField
        label="Comment (optional)"
        placeholder="What went well, or what could be better?"
        multiline
        minRows={4}
        slotProps={{ htmlInput: { maxLength: 1000 } }}
        error={!!errors.comment}
        helperText={errors.comment?.message}
        {...register('comment')}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        startIcon={<SendOutlined />}
        className="justify-self-start"
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
