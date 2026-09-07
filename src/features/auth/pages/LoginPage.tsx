// src/features/auth/pages/LoginPage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, InputAdornment, Link as MuiLink, Paper, TextField, Typography } from '@mui/material';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import Storefront from '@mui/icons-material/Storefront';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../authApi';
import { useAppDispatch } from '../../../app/hooks';
import { credentialsSet } from '../authSlice';
import { ErrorState } from '../../../components/feedback/StateMessage';
import { getErrorMessage } from '../../../utils/apiError';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const result = await login(values).unwrap();
      dispatch(credentialsSet(result));
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err as never));
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
          Welcome back
        </Typography>
        <Typography color="text.secondary">Log in to buy and sell on UniMart</Typography>
      </Box>

      <Paper elevation={1} className="w-full p-6 sm:p-8">
        {serverError && (
          <Box className="mb-4">
            <ErrorState description={serverError} />
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <TextField
            label="University email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('email')}
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
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={<LoginOutlined />}
          >
            Log in
          </Button>
        </Box>
      </Paper>
      <Typography variant="body2">
        No account? <MuiLink component={RouterLink} to="/register" className="!font-semibold">Register</MuiLink>
      </Typography>
    </Box>
  );
}

export { LoginPage as Component };
