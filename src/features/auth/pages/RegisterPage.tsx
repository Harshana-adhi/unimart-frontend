// src/features/auth/pages/RegisterPage.tsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Storefront from '@mui/icons-material/Storefront';
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
    <Box className="mx-auto flex max-w-sm flex-col items-center gap-4 py-6">
      <Box
        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
        sx={{ background: 'linear-gradient(135deg, #2451b5 0%, #0ea5a3 100%)' }}
      >
        <Storefront fontSize="medium" />
      </Box>
      <Box className="text-center">
        <Typography variant="h4" component="h1" className="!font-bold">
          Create an account
        </Typography>
        <Typography color="text.secondary">Join UniMart with your university email</Typography>
      </Box>

      <Paper elevation={1} className="w-full p-6 sm:p-8">
        {serverError && (
          <Box className="mb-4">
            <ErrorState description={serverError} />
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <TextField
            label="Full name"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('fullName')}
          />
          <TextField
            label="University email"
            type="email"
            error={!!errors.universityEmail}
            helperText={errors.universityEmail?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('universityEmail')}
          />
          <TextField
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
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
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={<HowToRegOutlined />}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export { RegisterPage as Component };
