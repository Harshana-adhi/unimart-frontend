// src/features/listings/components/ListingForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useGetCategoriesQuery } from '../listingsApi';
import type { ListingInput } from '../listingTypes';

// price/categoryId are kept as strings here (matching the raw <input> value)
// rather than using z.coerce.number(), which — with the zod/react-hook-form
// versions this project has installed — produces an "unknown" input type
// that the resolver's generics can't reconcile with an explicit numeric
// useForm<T>(). Converting to number happens once, in handleFormSubmit below.
const listingSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Max 160 characters'),
  description: z.string().trim().min(1, 'Description is required').max(5000, 'Max 5000 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Enter a valid non-negative price'),
  categoryId: z.string().min(1, 'Choose a category'),
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface InitialValues {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: number;
}

interface Props {
  initial?: InitialValues;
  submitLabel?: string;
  onSubmit: (values: ListingInput) => Promise<void> | void;
}

export function ListingForm({ initial, submitLabel = 'Save listing', onSubmit }: Props) {
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      price: initial?.price !== undefined ? String(initial.price) : '',
      categoryId: initial?.categoryId !== undefined ? String(initial.categoryId) : '',
    },
  });

  // Re-populate the form once the listing being edited actually arrives.
  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title ?? '',
        description: initial.description ?? '',
        price: initial.price !== undefined ? String(initial.price) : '',
        categoryId: initial.categoryId !== undefined ? String(initial.categoryId) : '',
      });
    }
  }, [initial, reset]);

  const handleFormSubmit = (values: ListingFormValues) =>
    onSubmit({
      title: values.title,
      description: values.description,
      price: Number(values.price),
      categoryId: Number(values.categoryId),
    });

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="mx-auto grid max-w-2xl gap-4" noValidate>
      <TextField
        label="Title"
        error={!!errors.title}
        helperText={errors.title?.message}
        {...register('title')}
      />
      <TextField
        label="Description"
        multiline
        minRows={5}
        error={!!errors.description}
        helperText={errors.description?.message}
        {...register('description')}
      />
      <TextField
        label="Price (LKR)"
        type="number"
        slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
        error={!!errors.price}
        helperText={errors.price?.message}
        {...register('price')}
      />
      <TextField
        select
        label="Category"
        defaultValue={initial?.categoryId ?? ''}
        error={!!errors.categoryId}
        helperText={errors.categoryId?.message}
        disabled={categoriesLoading}
        {...register('categoryId')}
      >
        {categories?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </Box>
  );
}
