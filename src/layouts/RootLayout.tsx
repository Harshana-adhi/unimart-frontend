// src/layouts/RootLayout.tsx
import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import Logout from '@mui/icons-material/Logout';
import Storefront from '@mui/icons-material/Storefront';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loggedOut } from '../features/auth/authSlice';

function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

function RootLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleLogout = () => {
    closeMenu();
    dispatch(loggedOut());
    navigate('/login');
  };

  return (
    <Box className="flex min-h-screen flex-col">
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          backgroundColor: 'rgba(245, 247, 251, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar className="gap-2 px-4">
            <Box
              component={RouterLink}
              to="/"
              className="flex flex-grow items-center gap-2 !text-inherit !no-underline"
            >
              <Box
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                sx={{ background: 'linear-gradient(135deg, #2451b5 0%, #0ea5a3 100%)' }}
              >
                <Storefront fontSize="small" />
              </Box>
              <Typography variant="h6" component="span" className="!font-bold" color="text.primary">
                UniMart
              </Typography>
            </Box>

            <Button component={RouterLink} to="/" color="inherit" sx={{ color: 'text.secondary' }}>
              Browse
            </Button>

            {user && (
              <Button
                component={RouterLink}
                to="/listings/new"
                variant="contained"
                startIcon={<AddCircleOutlined />}
                className="ml-2"
              >
                New listing
              </Button>
            )}

            {user ? (
              <>
                <IconButton onClick={openMenu} className="ml-2" aria-label="Account menu" aria-controls={menuAnchor ? 'account-menu' : undefined}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 700 }}>
                    {initialsOf(user.fullName)}
                  </Avatar>
                </IconButton>
                <Menu id="account-menu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                  <Box className="px-4 pb-2 pt-1">
                    <Typography variant="subtitle2" noWrap>
                      {user.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user.universityEmail}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={RouterLink} to="/my/listings" onClick={closeMenu}>
                    <ListItemIcon>
                      <Inventory2Outlined fontSize="small" />
                    </ListItemIcon>
                    My listings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Log out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={RouterLink} to="/login" variant="contained" className="ml-2">
                Log in
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" maxWidth="lg" className="flex-grow py-8">
        <Outlet />
      </Container>
      <Box component="footer" className="border-t py-6 text-center" sx={{ borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          UniMart · a campus marketplace built for the Software Architecture &amp; Process Modelling lab
        </Typography>
      </Box>
    </Box>
  );
}

export { RootLayout as Component };
