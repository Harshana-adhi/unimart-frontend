// src/layouts/RootLayout.tsx
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loggedOut } from '../features/auth/authSlice';

function RootLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(loggedOut());
    navigate('/login');
  };

  return (
    <Box className="flex min-h-screen flex-col">
      <AppBar position="static" color="primary">
        <Toolbar className="gap-4">
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            className="!text-inherit !no-underline"
            sx={{ flexGrow: 1 }}
          >
            UniMart
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Listings
          </Button>
          {user && (
            <Button color="inherit" component={RouterLink} to="/my/listings">
              My Listings
            </Button>
          )}
          {user && (
            <Button color="inherit" component={RouterLink} to="/listings/new">
              New Listing
            </Button>
          )}
          {user ? (
            <>
              <Typography variant="body2">{user.fullName}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Log in
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" className="flex-grow py-8">
        <Outlet />
      </Container>
    </Box>
  );
}

export { RootLayout as Component };
