// src/features/listings/components/ListingForm.tsx
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import SellOutlined from '@mui/icons-material/SellOutlined';
import TitleOutlined from '@mui/icons-material/TitleOutlined';
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
    control,
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
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-5" noValidate>
      <TextField
        label="Title"
        placeholder="e.g. Calculus textbook, 3rd edition"
        error={!!errors.title}
        helperText={errors.title?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <TitleOutlined fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
        {...register('title')}
      />
      <TextField
        label="Description"
        placeholder="Condition, pickup location, anything a buyer should know"
        multiline
        minRows={5}
        error={!!errors.description}
        helperText={errors.description?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <DescriptionOutlined fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
        {...register('description')}
      />
      <Box className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Price (LKR)"
          type="number"
          slotProps={{
            htmlInput: { min: 0, step: '0.01' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SellOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
          error={!!errors.price}
          helperText={errors.price?.message}
          {...register('price')}
        />
        {/* MUI's Select is not a native <select> — it needs a real controlled
            value/onChange (via Controller) rather than register(), both so
            the value stays a string (matching the schema; register()'s
            uncontrolled wiring would hand back whatever type the selected
            MenuItem's `value` prop is, i.e. a number, which zod then
            rejects) and so it visually re-syncs when reset() runs (edit
            mode, once the existing listing loads). */}
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Category"
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
              disabled={categoriesLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryOutlined fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        startIcon={<SaveOutlined />}
        className="justify-self-start"
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
