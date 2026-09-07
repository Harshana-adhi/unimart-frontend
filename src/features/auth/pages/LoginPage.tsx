// src/features/auth/pages/LoginPage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Link as MuiLink, TextField, Typography } from '@mui/material';
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
    <Box className="mx-auto grid max-w-sm gap-4">
      <Typography variant="h4" component="h1">
        Log in
      </Typography>
      {serverError && <ErrorState description={serverError} />}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <TextField
          label="University email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Log in
        </Button>
      </Box>
      <Typography variant="body2">
        No account? <MuiLink component={RouterLink} to="/register">Register</MuiLink>
      </Typography>
    </Box>
  );
}

export { LoginPage as Component };
