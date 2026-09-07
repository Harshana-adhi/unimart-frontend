// src/features/auth/pages/RegisterPage.tsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../authApi';
import { ErrorState } from '../../../components/feedback/StateMessage';
import { getErrorMessage, getFieldErrors } from '../../../utils/apiError';

const registerSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(120),
  universityEmail: z.string().trim().email('Enter a valid university email'),
  password: z.string().min(8, 'At least 8 characters'),
  role: z.enum(['BUYER', 'SELLER']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER' },
  });
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser(values).unwrap();
      navigate('/login');
    } catch (err) {
      const fieldErrors = getFieldErrors(err as never);
      setServerError(
        Object.keys(fieldErrors).length > 0
          ? Object.values(fieldErrors).join(' · ')
          : getErrorMessage(err as never),
      );
    }
  };

  return (
    <Box className="mx-auto grid max-w-sm gap-4">
      <Typography variant="h4" component="h1">
        Create an account
      </Typography>
      {serverError && <ErrorState description={serverError} />}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <TextField
          label="Full name"
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          {...register('fullName')}
        />
        <TextField
          label="University email"
          type="email"
          error={!!errors.universityEmail}
          helperText={errors.universityEmail?.message}
          {...register('universityEmail')}
        />
        <TextField
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <TextField select label="I am a…" {...field}>
              <MenuItem value="BUYER">Buyer</MenuItem>
              <MenuItem value="SELLER">Seller</MenuItem>
            </TextField>
          )}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Register
        </Button>
      </Box>
    </Box>
  );
}

export { RegisterPage as Component };
